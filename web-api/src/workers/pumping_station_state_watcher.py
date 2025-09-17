from threading import Lock
from time import sleep

from flask_ex import FlaskEx
from remote.pumping_station_remote_client import PumpingStationRemoteClient


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

        for pumping_station in pumping_station_objects:

            try:
                with PumpingStationRemoteClient(pumping_station.connector) as pumping_station_remote_client:
                    pumping_station_state = pumping_station_remote_client.get_state()
                    pumping_station_account_ids = [
                        l.account_id for l in account_links if pumping_station.id in l.pumping_station_objects
                    ]
                    pumping_station_telegram_ids = [
                        a.telegram_ids for a in accounts if a.id in pumping_station_account_ids
                    ]

                    telegram_ids = sum(pumping_station_telegram_ids, [])
                    telegram_bot = app.pumping_stations_telegram_bot_agent.updater.bot

                    for telegram_id in telegram_ids:
                        if pumping_station_state.emergency_level:
                            telegram_bot.send_message(
                                telegram_id,
                                f'⚠️ Достигнут аварийный уровень на насосной станции "{pumping_station.description}"',
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
