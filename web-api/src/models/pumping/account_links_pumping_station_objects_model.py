from typing import List
from models.abstracts.app_base_model import AppBaseModel
from models.pumping.account_link_pumping_station_objects_model import AccountLinkPumpingStationObjectsModel


class AccountLinksPumpingStationObjectsModel(AppBaseModel):
    items: List[AccountLinkPumpingStationObjectsModel]
