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

        with lock:
            pumping_station_objects = app.get_pumping_stations_settings().pumping_station_objects.items
            account_links = app.get_pumping_stations_settings().account_links_pumping_station_objects.items
            accounts = app.get_accounts_settings().accounts.items

            for pumping_station in pumping_station_objects:
                try:
                    with PumpingStationRemoteClient(pumping_station.connector) as pumping_station_remote_client:
                        pumping_station_state = pumping_station_remote_client.get_state()
                        pumping_station_account_ids = [l.account_id for l in account_links if pumping_station.id in l.pumping_station_objects]
                        pumping_station_telegram_ids = [a.telegram_ids for a in accounts if a.id in pumping_station_account_ids]

                        telegram_ids = [item for sub_list in pumping_station_telegram_ids for item in sub_list]

                        print(telegram_ids)

                        if pumping_station_state.emergency_level:

                            for telegram_id in telegram_ids:
                                app.app_logger.debug(telegram_id)
                                
                except Exception as exc:
                    app.app_logger.warning(exc)


            app.app_logger.info('The pumping station state watcher is done.')

        if immediately:
            sleep(interval)
