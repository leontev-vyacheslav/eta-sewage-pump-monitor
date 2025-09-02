from http import HTTPStatus
from flask_pydantic import validate

from app import app

from utils.auth_helper import authorize
from models.common.enums.user_role_model import UserRoleModel
from models.common.message_model import MessageModel
from remote.pumping_station_remote_client import PumpingStationRemoteClient


@app.api_route("/pumping-stations/state/<pumping_station_id>", methods=["GET"])
@authorize(roles=[UserRoleModel.ADMIN])
@validate(response_by_alias=True)
def get_state(pumping_station_id: str):
    pumping_stations_settings_repository = app.get_pumping_stations_settings_repository()
    pumping_station_object = pumping_stations_settings_repository.get_pumping_stations_by_id(pumping_station_id)

    if pumping_station_object:
        with PumpingStationRemoteClient(pumping_station_object.connector) as  pumping_station_remote_client:
            pumping_station_state = pumping_station_remote_client.get_state()

        return pumping_station_state

    return MessageModel(message=f"Объект насосной станции {pumping_station_id} не найден"), HTTPStatus.NOT_FOUND



@app.api_route("/pumping-stations/list-by-account-id/<account_id>", methods=["GET"])
@authorize(roles=[UserRoleModel.ADMIN])
@validate(response_by_alias=True)
def get_list_objects(account_id: str):
    pumping_stations_settings_repository = app.get_pumping_stations_settings_repository()
    pumping_station_list = pumping_stations_settings_repository.get_pumping_station_list_by_account(account_id)

    return pumping_station_list, HTTPStatus.OK
