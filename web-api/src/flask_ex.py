import os
import pathlib
from typing import Callable, List, Optional, Any, Union

from flask import Flask
from data_access.accounts_settings_repository import AccountsSettingsRepository
from data_access.pumping_stations_settings_repository import PumpingStationsSettingsRepository
from models.common.accounts_settings_model import AccountsSettingsModel
from models.common.app_background_thread_model import AppBackgroundThreadModel
from models.pumping.pumping_stations_settings_model import PumpingStationsSettingsModel

from models.common.internal_settings_model import InternalSettingsModel
from loggers.app_logger_builder import build as build_logger


class FlaskEx(Flask):

    def __init__(
        self,
        import_name: str,
        static_url_path: Optional[str] = None,
        static_folder: Optional[Union[str, os.PathLike]] = "static",
        static_host: Optional[str] = None,
        host_matching: bool = False,
        subdomain_matching: bool = False,
        template_folder: Optional[str] = "templates",
        instance_path: Optional[str] = None,
        instance_relative_config: bool = False,
        root_path: Optional[str] = None
    ):
        super().__init__(
            import_name,
            static_url_path,
            static_folder,
            static_host,
            host_matching,
            subdomain_matching,
            template_folder,
            instance_path,
            instance_relative_config,
            root_path
        )

        self.app_root_path = pathlib.Path(os.path.dirname(__file__)).parent

        log_path = self.app_root_path.joinpath('log')
        if not log_path.exists():
            log_path.mkdir()


        self.internal_settings = self._init_internal_settings()
        self.app_background_threads: List[AppBackgroundThreadModel] = []
        self.app_logger = build_logger('default_app_logger')

    def api_route(self, rule: str, **options: Any) -> Callable:
        return self.route(f'/api{rule}', **options)


    def _init_internal_settings(self) -> InternalSettingsModel:
        config_path = self.app_root_path.joinpath('data/settings', 'internal_settings.json')

        with open(config_path, mode='r', encoding='utf-8') as f:
            json_config = f.read()

        return InternalSettingsModel.model_validate_json(json_config)

    def get_accounts_settings_repository(self) -> AccountsSettingsRepository:
        accounts_settings_repository: AccountsSettingsRepository = self.extensions['accounts_settings_repository']

        return accounts_settings_repository

    def get_accounts_settings(self) -> AccountsSettingsModel:
        accounts_settings_repository: AccountsSettingsRepository = self.extensions['accounts_settings_repository']

        return accounts_settings_repository.settings

    def get_pumping_stations_settings_repository(self) -> PumpingStationsSettingsRepository:
        pumping_stations_settings_repository: PumpingStationsSettingsRepository = self.extensions['pumping_stations_settings_repository']

        return pumping_stations_settings_repository

    def get_pumping_stations_settings(self) -> PumpingStationsSettingsModel:
        pumping_stations_settings_repository: PumpingStationsSettingsRepository = self.extensions['pumping_stations_settings_repository']

        return pumping_stations_settings_repository.settings
