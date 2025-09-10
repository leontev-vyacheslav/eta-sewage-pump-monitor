from models.abstracts.app_base_model import AppBaseModel


class PumpingStationStateValueModel(AppBaseModel):

    prop_name: str

    value: bool
