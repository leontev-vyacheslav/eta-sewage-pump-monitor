# pylint: disable=unused-argument
from typing import Callable
from enum import IntEnum
import hashlib
from telegram import BotCommand, Update
from telegram.ext import Updater, CommandHandler, ConversationHandler, CallbackContext, MessageHandler, Filters

from flask_ex import FlaskEx
from models.common.account_model import AccountModel, TelegramAccountModel
from remote.pumping_station_remote_client import PumpingStationRemoteClient
from lockers import worker_thread_locks


class LoginConversationalStates(IntEnum):
    WAITING_FOR_LOGIN = 1
    WAITING_FOR_PASSWORD = 2


user_states = {}


class PumpingStationsTelegramBotAgent:

    def __init__(self, app: FlaskEx, token: str):
        self.app = app
        self.updater = None

        self.__token = token
        self.__commands = [
            BotCommand("start", "🚀 Запуск"),
            BotCommand("states", "🗂️ Состояние объектов"),
            BotCommand("login", "🔐 Вход в систему"),
            BotCommand("logout", "🚪 Выход из системы"),
            BotCommand("unmute", "🔔 Включить уведомления"),
            BotCommand("mute", "🔕 Отключить уведомления"),
        ]

    def __start_command(self, update: Update, context: CallbackContext):
        chat_id = update.effective_chat.id

        accounts = self.app.get_accounts_settings().accounts
        authorized_telegram_accounts = sum([a.telegram_accounts for a in accounts.items], [])

        if chat_id in [telegram_account.chat_id for telegram_account in authorized_telegram_accounts]:
            account = next((a for a in accounts.items if chat_id in [ta.chat_id for ta in a.telegram_accounts]), None)
            update.message.reply_text(f"✅ Вы уже были раннее авторизованы c учетной записью {account.login}!")
        else:
            update.message.reply_text("🔐 Выполните вход используя команду /login.")

    def __login_command(self, update: Update, context: CallbackContext):
        chat_id = str(update.effective_chat.id)
        accounts = self.app.get_accounts_settings().accounts

        authorized_telegram_accounts = sum([a.telegram_accounts for a in accounts.items], [])

        if chat_id in [telegram_account.chat_id for telegram_account in authorized_telegram_accounts]:
            account = next((a for a in accounts.items if chat_id in [ta.chat_id for ta in a.telegram_accounts]), None)
            update.message.reply_text(f"✅ Вы уже были раннее авторизованы c учетной записью {account.login}!")

            return ConversationHandler.END

        user_states[chat_id] = {"state": LoginConversationalStates.WAITING_FOR_LOGIN, "attempts": 0, "login": None}

        update.message.reply_text("🔒 Введите 👤 ЛОГИН вашей учетной записи:")

        return LoginConversationalStates.WAITING_FOR_LOGIN

    def __receive_login(self, update: Update, context: CallbackContext):
        chat_id = str(update.effective_chat.id)
        login = update.message.text.strip()
        accounts = self.app.get_accounts_settings().accounts

        if login not in [a.login for a in accounts.items]:
            update.message.reply_text("❌ Пользователь 👤 не найден среди зарегистрированных аккаунтов 👥. Повторите попытку снова.")

            return LoginConversationalStates.WAITING_FOR_LOGIN

        user_states[chat_id]["login"] = login
        user_states[chat_id]["state"] = LoginConversationalStates.WAITING_FOR_PASSWORD

        update.message.reply_text("🔒 Введите 🔑 ПАРОЛЬ вашей учетной записи:")

        return LoginConversationalStates.WAITING_FOR_PASSWORD

    def __receive_password(self, update: Update, context: CallbackContext):
        chat_id = str(update.effective_chat.id)
        password = update.message.text.strip()
        login = user_states[chat_id]["login"]

        password_hash = hashlib.sha256(password.encode()).hexdigest()
        accounts = self.app.get_accounts_settings().accounts

        account = next((a for a in accounts.items if a.login == login))

        if account.password == password_hash:
            account.telegram_accounts.append(TelegramAccountModel(chat_id=str(chat_id), mute=False))

            self.app.get_accounts_settings_repository().update(current_settings=None)

            del user_states[chat_id]

            update.message.reply_text(f"✅ Вход был успешно выполнен с учетной записью {login}!\n" f"Вы можете получать 💬 уведомления!")

            return ConversationHandler.END

        user_states[chat_id]["attempts"] += 1
        attempts_left = 3 - user_states[chat_id]["attempts"]

        if attempts_left > 0:
            update.message.reply_text(f"❌ Неверный 🔑 ПАРОЛЬ. Попыток осталось: {attempts_left}.\nВведите 🔑 ПАРОЛЬ снова:")

            return LoginConversationalStates.WAITING_FOR_PASSWORD

        del user_states[chat_id]
        update.message.reply_text("❌ Слишком много неудачных попыток входа.\nПопытайтесь снова использовать команду /login.")

        return ConversationHandler.END

    def __cancel_command(self, update: Update, context: CallbackContext):
        chat_id = str(update.effective_chat.id)

        if chat_id in user_states:
            del user_states[chat_id]

        update.message.reply_text("Процесс входа был отменен пользователем.")

        return ConversationHandler.END

    def __get_account_by_chat_id(self, chat_id: str):
        accounts = self.app.get_accounts_settings().accounts.items
        account = next((a for a in accounts if chat_id in [ta.chat_id for ta in a.telegram_accounts]), None)

        return account

    def __core_authorized_command(self, update: Update, callback: Callable[[AccountModel, TelegramAccountModel], None]):
        chat_id = str(update.effective_chat.id)
        accounts = self.app.get_accounts_settings().accounts
        authorized_telegram_accounts = sum([a.telegram_accounts for a in accounts.items], [])

        if chat_id in [telegram_account.chat_id for telegram_account in authorized_telegram_accounts]:
            account = next((a for a in accounts.items if chat_id in [ta.chat_id for ta in a.telegram_accounts]), None)
            if account is None:
                update.message.reply_text("❌ Учетная запись не найдена.")
            else:
                telegram_account = next((ta for ta in account.telegram_accounts if ta.chat_id == chat_id), None)
                if telegram_account is None:
                    update.message.reply_text("❌ Учетная запись не найдена.")
                    return

                callback(account=account, telegram_account=telegram_account)
        else:
            update.message.reply_text("❌ Вход еще не был ранее выполнен. Используйте сначала команду /login для входа.")

    def __states_command(self, update: Update, context: CallbackContext):

        def callback(account: AccountModel, telegram_account: TelegramAccountModel):
            account_link = next(
                (link for link in self.app.get_pumping_stations_settings().account_links_pumping_station_objects.items if link.account_id == account.id)
            )
            pumping_station_state_watcher_lock = worker_thread_locks.get("pumping_station_state_watcher_lock", None)
            if pumping_station_state_watcher_lock is None:
                update.message.reply_text("❌ Сервис проверки состояния насосных станций не доступен.")
                return

            with pumping_station_state_watcher_lock:
                pumping_station_objects = [
                    p for p in self.app.get_pumping_stations_settings().pumping_station_objects.items if p.id in account_link.pumping_station_objects
                ]
                update.message.reply_text(f"▶️ Начало опроса насосных станций ({len(pumping_station_objects)})...")

                for p in pumping_station_objects:
                    try:
                        with PumpingStationRemoteClient(p.connector) as pumping_station_remote_client:
                            s = pumping_station_remote_client.get_state()

                            level = "⚠️ Неизвестно"
                            level = "✅ Нижний" if s.low_level else level
                            level = "✅ Средний" if s.mid_level else level
                            level = "✋ Высокий" if s.hi_level else level
                            level = "❌ Аварийный" if s.emergency_level else level

                            if s.state_pump_1 and not s.fault_pump_1:
                                state_pump_1 = "✅ Работает"
                            elif not s.state_pump_1 and s.fault_pump_1:
                                state_pump_1 = "❌ Неисправен"
                            elif not s.state_pump_1 and not s.fault_pump_1:
                                state_pump_1 = "🛑 Не работает"
                            else:
                                state_pump_1 = "⚠️ Неизвестно"

                            if s.state_pump_2 and not s.fault_pump_2:
                                state_pump_2 = "✅ Работает"
                            elif not s.state_pump_2 and s.fault_pump_2:
                                state_pump_2 = "❌ Неисправен"
                            elif not s.state_pump_2 and not s.fault_pump_2:
                                state_pump_2 = "🛑 Не работает"
                            else:
                                state_pump_2 = "⚠️ Неизвестно"

                            update.message.reply_text(
                                "<pre>"
                                f"{p.description}\n"
                                "\n"
                                "Параметр               Значение\n"
                                "-------------------------------\n"
                                f"Уровень:              {level}\n"
                                f"Состояние насоса 1:   {state_pump_1}\n"
                                f"Состояние насоса 2:   {state_pump_2}\n"
                                f"Вр. нараб. насоса 1:  ⏳ {s.time_pump_1} ч.\n"
                                f"Вр. нараб. насоса 2:  ⏳ {s.time_pump_2} ч.\n"
                                "</pre>",
                                parse_mode="HTML",
                            )
                    except Exception as exc:
                        update.message.reply_text(text=f"❌ Ошибка получения состояния объекта {p.name}: {str(exc)}", reply_markup=None)
                        continue

                update.message.reply_text("⏹️ Окончание опроса насосных станций.")

        self.__core_authorized_command(update=update, callback=callback)

    def __logout_command(self, update: Update, context: CallbackContext):
        def callback(account: AccountModel, telegram_account: TelegramAccountModel):
            if telegram_account.chat_id in user_states:
                del user_states[telegram_account.chat_id]

            account = self.__get_account_by_chat_id(telegram_account.chat_id)
            account.telegram_accounts = [ta for ta in account.telegram_accounts if ta.chat_id != telegram_account.chat_id]
            self.app.get_accounts_settings_repository().update(current_settings=None)
            update.message.reply_text("🚪 Выход из системы был выполнен. Рассылка уведомлений ❌ остановлена.")

        self.__core_authorized_command(update=update, callback=callback)

    def __unmute_command(self, update: Update, context: CallbackContext):
        def callback(account: AccountModel, telegram_account: TelegramAccountModel):
            telegram_account.mute = False
            self.app.get_accounts_settings_repository().update(current_settings=None)

            update.message.reply_text("🔔 Рассылка уведомлений включена.")

        self.__core_authorized_command(update=update, callback=callback)

    def __mute_command(self, update: Update, context: CallbackContext):
        def callback(account: AccountModel, telegram_account: TelegramAccountModel):
            telegram_account.mute = True
            self.app.get_accounts_settings_repository().update(current_settings=None)
            update.message.reply_text("🔕 Рассылка уведомлений выключена.")

        self.__core_authorized_command(update=update, callback=callback)

    def __set_commands_menu(self):
        self.updater.bot.set_my_commands(self.__commands)

    def run(self):
        self.updater = Updater(self.__token, use_context=True)
        dispatcher = self.updater.dispatcher

        dispatcher.add_handler(CommandHandler("start", self.__start_command))
        dispatcher.add_handler(
            ConversationHandler(
                entry_points=[CommandHandler("login", self.__login_command)],
                states={
                    LoginConversationalStates.WAITING_FOR_LOGIN: [MessageHandler(Filters.text & ~Filters.command, self.__receive_login)],
                    LoginConversationalStates.WAITING_FOR_PASSWORD: [MessageHandler(Filters.text & ~Filters.command, self.__receive_password)],
                },
                fallbacks=[CommandHandler("cancel", self.__cancel_command)],
            )
        )
        dispatcher.add_handler(CommandHandler("logout", self.__logout_command))
        dispatcher.add_handler(CommandHandler("states", self.__states_command))

        dispatcher.add_handler(CommandHandler("unmute", self.__unmute_command))
        dispatcher.add_handler(CommandHandler("mute", self.__mute_command))

        self.__set_commands_menu()

        self.app.app_logger.info("Starting the pumping stations telegram bot polling...")

        self.updater.start_polling()
