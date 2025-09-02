from models.abstracts.app_base_model import AppBaseModel


class PumpingStationStateModel(AppBaseModel):
    start_stop: bool = False

    low_level: bool = False

    mid_level: bool = False

    hi_level: bool = False

    emergency_level: bool = False

    state_pump_1: bool = False

    state_pump_2: bool = False

    reset_fault_pump_1: bool = False

    reset_fault_pump_2: bool = False

    reset_operating_time_pump_1: bool = False

    reset_operating_time_pump_2: bool = False

    fault_pump_1: bool = False

    fault_pump_2: bool = False

    time_pump_1: int = 0

    time_pump_2: int = 0
