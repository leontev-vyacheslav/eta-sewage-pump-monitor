from abc import ABC
from datetime import datetime
from pydantic import BaseModel

from pydantic.alias_generators import to_camel


class AppBaseModel(ABC, BaseModel):
    """
    The most common abstract model inherited from the pydantic base model.
    It defines custom serialization rules throughout this project
    """

    class Config:
        alias_generator=to_camel
        populate_by_name=True
        from_attributes=True
        validate_by_name = True
        ensure_ascii = False
        json_encoders = {
            datetime: lambda v: v.strftime("%Y-%m-%dT%H:%M:%SZ"),
            float: lambda x: round(x, 2),
        }
