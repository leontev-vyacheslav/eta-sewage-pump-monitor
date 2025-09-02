from typing import List
from models.abstracts.app_base_model import AppBaseModel

class AccountLinkPumpingStationObjectsModel(AppBaseModel):
    account_id: str

    pumping_station_objects: List[str]
