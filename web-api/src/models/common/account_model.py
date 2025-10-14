from typing import List
from models.abstracts.app_base_model import AppBaseModel
from models.common.enums.user_role_model import UserRoleModel


class TelegramAccountModel(AppBaseModel):
    chat_id: str

    mute: bool


class AccountModel(AppBaseModel):
    id: str

    role: UserRoleModel

    login: str

    password: str

    telegram_accounts: List[TelegramAccountModel]


class ExtendedAccountModel(AccountModel):
    confirmed_password: str
