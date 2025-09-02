from models.abstracts.app_base_model import AppBaseModel
from models.common.enums.user_role_model import UserRoleModel


class AuthUserModel(AppBaseModel):
    role: UserRoleModel

    login: str

    account_id: str

    token: str
