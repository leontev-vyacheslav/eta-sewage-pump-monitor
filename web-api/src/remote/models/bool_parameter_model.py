from dataclasses import dataclass

from remote.models.parameter_types import ParameterTypes
from remote.models.parameter_model import ParameterModel


@dataclass
class BoolParameterModel(ParameterModel):
    data_type: ParameterTypes = ParameterTypes.BOOL

    length: int = 1
