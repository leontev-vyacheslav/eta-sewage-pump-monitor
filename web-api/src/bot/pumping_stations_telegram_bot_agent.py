from enum import IntEnum
import hashlib
from telegram import BotCommand, Update
from telegram.ext import Updater, CommandHandler, ConversationHandler, CallbackContext, MessageHandler, Filters

from flask_ex import FlaskEx


class LoginConversationalStates(IntEnum):
    WAITING_FOR_LOGIN = 1
    WAITING_FOR_PASSWORD = 2


user_states = {}


class PumpingStationsTelegramBotAgent:

    def __init__(self, app: FlaskEx, token: str):
        self.app = app
        self.token = token
        self.updater = None

    def __start_command(self, update: Update, context: CallbackContext):
        chat_id = update.effective_chat.id

        accounts = self.app.get_accounts_settings().accounts
        authorized_users_ids = sum([a.telegram_ids for a in accounts.items], [])

        if chat_id in authorized_users_ids:
            account = next((a for a in accounts.items if chat_id in a.telegram_ids), None)
            update.message.reply_text(f"✅ Вы уже были раннее авторизованы c учетной записью {account.login}!")
        else:
            update.message.reply_text("🔐 Выполните вход используя команду /login.")

    def __login_command(self, update: Update, context: CallbackContext):
        chat_id = str(update.effective_chat.id)
        accounts = self.app.get_accounts_settings().accounts

        authorized_users_ids = sum([a.telegram_ids for a in accounts.items], [])

        if chat_id in authorized_users_ids:
            account = next((a for a in accounts.items if chat_id in a.telegram_ids), None)
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
            update.message.reply_text(
                "❌ Пользователь 👤 не найден среди зарегистрированных аккаунтов 👥. Повторите попытку снова."
            )

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
            account.telegram_ids.append(str(chat_id))
            self.app.get_accounts_settings_repository().update(current_settings=None)

            del user_states[chat_id]

            update.message.reply_text(
                f"✅ Вход был успешно выполнен с учетной записью {login}!\n" f"Вы можете получать 💬 уведомления!"
            )

            return ConversationHandler.END

        user_states[chat_id]["attempts"] += 1
        attempts_left = 3 - user_states[chat_id]["attempts"]

        if attempts_left > 0:
            update.message.reply_text(
                f"❌ Неверный 🔑 ПАРОЛЬ. Попыток осталось: {attempts_left}.\nВведите 🔑 ПАРОЛЬ снова:"
            )

            return LoginConversationalStates.WAITING_FOR_PASSWORD

        del user_states[chat_id]
        update.message.reply_text(
            "❌ Слишком много неудачных попыток входа.\nПопытайтесь снова использовать команду /login."
        )

        return ConversationHandler.END

    def __cancel_command(self, update: Update, context: CallbackContext):
        chat_id = str(update.effective_chat.id)

        if chat_id in user_states:
            del user_states[chat_id]

        update.message.reply_text("Процесс входа был отменен пользователем.")

        return ConversationHandler.END

    def __logout_command(self, update: Update, context: CallbackContext):
        chat_id = str(update.effective_chat.id)
        accounts = self.app.get_accounts_settings().accounts
        authorized_users_ids = sum([a.telegram_ids for a in accounts.items], [])

        if chat_id in user_states:
            del user_states[chat_id]

        if chat_id in authorized_users_ids:
            account = next((a for a in accounts.items if chat_id in a.telegram_ids), None)
            if account is None:
                update.message.reply_text("❌ Учетная запись не найдена.")
            else:
                account.telegram_ids.remove(chat_id)
                self.app.get_accounts_settings_repository().update(current_settings=None)
                update.message.reply_text("🔓 Выход из системы был выполнен. Рассылка уведомлений ✖ остановлена.")

        else:
            update.message.reply_text("❌ Вход не был ранее выполнен. Используйте команду /login для входа.")

    def __set_commands_menu(self):
        commands = [
            BotCommand("start", "🚀 Запуск "),
            BotCommand("login", "🔐 Вход в систему"),
            BotCommand("logout", "🚪 Выход из системы"),
        ]

        self.updater.bot.set_my_commands(commands)

    def run(self):
        self.updater = Updater(self.token, use_context=True)
        dispatcher = self.updater.dispatcher

        dispatcher.add_handler(CommandHandler("start", self.__start_command))
        dispatcher.add_handler(
            ConversationHandler(
                entry_points=[CommandHandler("login", self.__login_command)],
                states={
                    LoginConversationalStates.WAITING_FOR_LOGIN: [
                        MessageHandler(Filters.text & ~Filters.command, self.__receive_login)
                    ],
                    LoginConversationalStates.WAITING_FOR_PASSWORD: [
                        MessageHandler(Filters.text & ~Filters.command, self.__receive_password)
                    ],
                },
                fallbacks=[CommandHandler("cancel", self.__cancel_command)],
            )
        )
        dispatcher.add_handler(CommandHandler("logout", self.__logout_command))

        self.__set_commands_menu()

        self.app.app_logger.info("Starting the pumping stations telegram bot polling...")

        self.updater.start_polling()
        # self.updater.idle()
