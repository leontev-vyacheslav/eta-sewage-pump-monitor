from http import HTTPStatus
import os

from flask_cors import CORS
from flask_ex import FlaskEx

from data_access.accounts_settings_repository import AccountsSettingsRepository
from data_access.pumping_stations_settings_repository import PumpingStationsSettingsRepository
from models.common.message_model import MessageModel
from responses.json_response import JsonResponse
from workers.worker_starter_extension import WorkerStarter

APP_VERSION = 'v.0.1.20250320-131031'
APP_NAME = 'Eta Sewage Pump Monitor Web API'


app = FlaskEx(__name__)
CORS(
    app,
    origins=['*'],
    methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allow_headers=['*'],
)
AccountsSettingsRepository(app)
PumpingStationsSettingsRepository(app)
WorkerStarter(app)


@app.errorhandler(Exception)
def handle_unhandled_exception(error):
    app.app_logger.error(f"Unhandled Exception: {str(error)}", exc_info=True)

    return JsonResponse(
        response=MessageModel(message="An unexpected error occurred"),
        status=HTTPStatus.INTERNAL_SERVER_ERROR
    )

# pylint: disable=wrong-import-position, disable=wildcard-import
from routers import *

app.app_logger.critical('The main app process was started with PID %d.', os.getpid())
