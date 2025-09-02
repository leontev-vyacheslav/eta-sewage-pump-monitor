from typing import List, Literal, Optional, Callable

from remote.models.parameter_model import ParameterModel
from remote.models.bool_parameter_model import BoolParameterModel
from remote.models.uint16_parameter_model import Uint16ParameterModel


class PumpingStationModbusRegisters:
    COILS: List[ParameterModel] = [
        BoolParameterModel(name="start_stop"),
        BoolParameterModel(name="low_level", readonly=True),
        BoolParameterModel(name="mid_level", readonly=True),
        BoolParameterModel(name="hi_level", readonly=True),
        BoolParameterModel(name="emergency_level", readonly=True),
        BoolParameterModel(name="state_pump_1", readonly=True),
        BoolParameterModel(name="state_pump_2", readonly=True),

        BoolParameterModel(name="reset_fault_pump_1"),
        BoolParameterModel(name="reset_fault_pump_2"),
        BoolParameterModel(name="reset_operating_time_pump_1"),
        BoolParameterModel(name="reset_operating_time_pump_2"),

        BoolParameterModel(name="fault_pump_1", readonly=True),
        BoolParameterModel(name="fault_pump_2", readonly=True),
    ]

    HOLDING_REGISTERS: List[ParameterModel] = [
        Uint16ParameterModel(name="time_pump_1", readonly=True),
        Uint16ParameterModel(name="time_pump_2", readonly=True),
    ]

    @staticmethod
    def __do_look_over(predicate: Optional[Callable] = None, registers_type: Literal["COILS", "HOLDING_REGISTERS"] = "COILS"):
        total_address = 0
        is_found = predicate is None
        registers = getattr(PumpingStationModbusRegisters, registers_type)
        for param_info in registers:
            if predicate is not None and predicate(param_info.name, total_address):
                is_found = True
                break

            total_address += param_info.length

        if is_found:
            return total_address, param_info

        return None, None

    @staticmethod
    def get_max_address(registers_type: Literal["COILS", "HOLDING_REGISTERS"] = "COILS"):
        total_address, _ = PumpingStationModbusRegisters.__do_look_over(registers_type=registers_type)

        return total_address

    @staticmethod
    def get_param_info_by_name(param_name: str, registers_type: Literal["COILS", "HOLDING_REGISTERS"] = "COILS"):
        registers = getattr(PumpingStationModbusRegisters, registers_type)
        param_info = next(
            (p for p in registers if p.name == param_name), None
        )

        if param_info is None:
            raise ValueError(f"The parameter '{param_name}' was not found.")

        address, _ = PumpingStationModbusRegisters.__do_look_over(
            lambda name, _: name == param_name, registers_type=registers_type
        )

        return address, param_info

    @staticmethod
    def get_param_info_by_address(address: int, registers_type: Literal["COILS", "HOLDING_REGISTERS"] = "COILS"):
        base_address = address

        _, param_info = PumpingStationModbusRegisters.__do_look_over(
            lambda _, total_address: total_address == base_address, registers_type=registers_type
        )

        if param_info is None:
            raise ValueError(f"The parameter at the address {address} was not found.")

        return address, param_info

    @staticmethod
    def get_address_by_name(param_name: str, registers_type: Literal["COILS", "HOLDING_REGISTERS"] = "COILS"):
        total_address = 0
        registers = getattr(PumpingStationModbusRegisters, registers_type)
        for param in registers:
            if param.name == param_name:
                break
            total_address += param.length

        return total_address, param
