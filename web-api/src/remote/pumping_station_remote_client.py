from pymodbus.client import ModbusTcpClient

from models.pumping.tcp_connector_model import TcpConnectorModel
from models.pumping.pumping_station_state_value_model import PumpingStationStateValueModel
from models.pumping.pumping_station_state_model import PumpingStationStateModel
from remote.pumping_station_modbus_registers import PumpingStationModbusRegisters


class PumpingStationRemoteClient:
    def __init__(self, connector: TcpConnectorModel):

        self._modbus_tcp_client = ModbusTcpClient(host=connector.host, port=connector.port)

    def __enter__(self):
        self._modbus_tcp_client.connect()

        return self

    def __exit__(self, type, value, traceback):
        self._modbus_tcp_client.close()

    def set_state_value(self, pumping_station_state_value: PumpingStationStateValueModel):
        coil = next(
            (r for r in PumpingStationModbusRegisters.COILS if r.name == pumping_station_state_value.prop_name), None
        )
        if not coil:
            raise Exception(f"Параметр с наименованием {pumping_station_state_value.prop_name} не найден")

        address, param_info = PumpingStationModbusRegisters.get_param_info_by_name(
            pumping_station_state_value.prop_name, registers_type="COILS"
        )
        if not param_info:
            raise Exception(f"Адрес параметра с наименованием {pumping_station_state_value.pa} не найден")

        if param_info.readonly:
            raise Exception(
                f"Параметр с наименованием {pumping_station_state_value.prop_name} доступен только для чтения"
            )

        pdu = self._modbus_tcp_client.write_coil(address, pumping_station_state_value.value)

        return pdu

    def get_state(self):
        coils_count = PumpingStationModbusRegisters.get_max_address(registers_type="COILS")
        holding_registers_count = PumpingStationModbusRegisters.get_max_address(registers_type="HOLDING_REGISTERS")

        try:
            pdu_coils = self._modbus_tcp_client.read_coils(address=0, count=coils_count)
            pdu_holding_registers = self._modbus_tcp_client.read_holding_registers(
                address=0, count=holding_registers_count
            )
        except Exception as exc:
            raise Exception(
                f"Ошибка связи с modbus-устройством по адресу {self._modbus_tcp_client.comm_params.host}: {self._modbus_tcp_client.comm_params.port}"
            ) from exc

        pumping_state = PumpingStationStateModel()

        coils_counter = 0
        for c in PumpingStationModbusRegisters.COILS:
            param_name = c.name
            setattr(pumping_state, param_name, pdu_coils.bits[coils_counter])
            coils_counter += 1

        holding_registers_counter = 0
        for c in PumpingStationModbusRegisters.HOLDING_REGISTERS:
            param_name = c.name
            setattr(
                pumping_state,
                param_name,
                pdu_holding_registers.registers[holding_registers_counter],
            )
            holding_registers_counter += 1

        return pumping_state
