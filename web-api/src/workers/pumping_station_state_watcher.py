from threading import Lock
from time import sleep

from flask_ex import FlaskEx
from remote.pumping_station_remote_client import PumpingStationRemoteClient
from exceptions.pumping_station_connection_error import PumpingStationConnectionError

def pumping_station_state_watcher(app: FlaskEx, interval: float, immediately: bool, lock: Lock):
    if lock is None:
        raise Exception("The thread lock of the pumping station state watcher wasn't found.")

    while True:
        if not immediately:
            sleep(interval)

        pumping_stations_settings = app.get_pumping_stations_settings()
        accounts = app.get_accounts_settings().accounts.items

        pumping_station_objects = pumping_stations_settings.pumping_station_objects.items
        account_links = pumping_stations_settings.account_links_pumping_station_objects.items

        telegram_bot = app.pumping_stations_telegram_bot_agent.updater.bot if app.pumping_stations_telegram_bot_agent.updater else None
        if not telegram_bot:
            app.app_logger.warning("The telegram bot is not ready yet!")
            sleep(interval)
            continue

        for pumping_station in pumping_station_objects:
            try:
                with PumpingStationRemoteClient(pumping_station.connector) as pumping_station_remote_client:
                    connection_error = None
                    try:
                        pumping_station_state = pumping_station_remote_client.get_state()
                    except PumpingStationConnectionError as exc:
                        pumping_station_state = None
                        connection_error = exc

                    pumping_station_account_ids = [l.account_id for l in account_links if pumping_station.id in l.pumping_station_objects]
                    pumping_station_telegram_accounts = [a.telegram_accounts for a in accounts if a.id in pumping_station_account_ids]

                    telegram_accounts = sum(pumping_station_telegram_accounts, [])

                    for telegram_id in [ta.chat_id for ta in telegram_accounts if not ta.mute]:
                        if not pumping_station_state:
                            telegram_bot.send_message(telegram_id, f'❗Ошибка связи с насосной станцией "{pumping_station.description}" ({connection_error.host}:{connection_error.port}).')
                            continue

                        if pumping_station_state.emergency_level:
                            telegram_bot.send_message(
                                telegram_id,
                                f'⚠️ Превышен предельно допустимый уровень на насосной станции "{pumping_station.description}"',
                            )
                        sleep(2)

                        if pumping_station_state.fault_pump_1:
                            telegram_bot.send_message(
                                telegram_id,
                                f'❌ Ошибка насоса 1 на насосной станции "{pumping_station.description}"',
                            )
                        sleep(2)

                        if pumping_station_state.fault_pump_2:
                            telegram_bot.send_message(
                                telegram_id,
                                f'❌ Ошибка насоса 2 на насосной станции "{pumping_station.description}"',
                            )
                        sleep(2)

            except Exception as exc:
                app.app_logger.error(exc)

            sleep(2)

        app.app_logger.info("The pumping station state watcher has finished its notification cycle.")

        if immediately:
            sleep(interval)
