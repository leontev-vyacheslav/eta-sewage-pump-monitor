from datetime import datetime, timedelta, timezone
from hashlib import sha256
from http import HTTPStatus
from flask_pydantic import validate
import jwt

from app import app
from models.common.auth_user_model import AuthUserModel
from models.common.message_model import MessageModel
from models.common.signin_model import SignInModel
from utils.auth_helper import authorize


@app.route("/sign-in", methods=["POST"])
@validate(response_by_alias=True)
def signin(body: SignInModel):
    accounts_settings = app.get_accounts_settings()

    account = next((acc for acc in accounts_settings.accounts.items if acc.login == body.login), None)

    if account is None:
        return MessageModel(message="Не удалось войти в систему. Пользователь не найден."), HTTPStatus.UNAUTHORIZED

    hashed_signin_password = sha256(body.password.encode(encoding="utf-8")).hexdigest()

    if hashed_signin_password == account.password:
        token = jwt.encode(
            {
                "exp": datetime.now(timezone.utc) + timedelta(days=1),
            },
            account.password,
        )

        return (
            AuthUserModel(role=account.role, login=account.login, account_id=account.id, token=token),
            HTTPStatus.CREATED,
        )

    return MessageModel(message="Не удалось войти в систему. Пароль неправильный."), HTTPStatus.UNAUTHORIZED


@app.route("/sign-out", methods=["POST"])
@validate(response_by_alias=True)
@authorize()
def signout():

    return MessageModel(message="Токен авторизации для текущего пользователя отозван.")


@app.route("/auth-check", methods=["GET"])
@validate()
@authorize()
def auth_check():

    return MessageModel(message="The authorization token is valid.")
