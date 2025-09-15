from typing import List
from models.abstracts.app_base_model import AppBaseModel
from models.pumping.tcp_connector_model import TcpConnectorModel


class PumpingStationObjectModel(AppBaseModel):
    id: str

    name: str

    description: str

    connector: TcpConnectorModel


class PumpingStationObjectExModel(PumpingStationObjectModel):
    accounts: List[str]
