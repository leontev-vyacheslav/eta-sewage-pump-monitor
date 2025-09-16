from typing import List
from models.abstracts.app_base_model import AppBaseModel
from models.pumping.pumping_station_object_model import PumpingStationObjectModel


class PumpingStationObjectsModel(AppBaseModel):
    items: List[PumpingStationObjectModel]
