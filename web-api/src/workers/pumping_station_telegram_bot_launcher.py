from threading import Lock
from time import sleep

from flask_ex import FlaskEx


def pumping_station_telegram_bot_launcher(app: FlaskEx, interval: float, immediately: bool, lock: Lock):
    sleep(interval)

    try:
        app.bot.run()
    except Exception as e:
        app.app_logger.error(f"Bot crashed: {e}")
