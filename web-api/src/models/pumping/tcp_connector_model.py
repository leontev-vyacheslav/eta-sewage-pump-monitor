from models.abstracts.app_base_model import AppBaseModel


class TcpConnectorModel(AppBaseModel):
    host: str

    port: int
