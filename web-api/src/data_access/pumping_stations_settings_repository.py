from data_access.settings_repository_base import SettingsRepositoryBase
from models.pumping.pumping_station_objects_model import PumpingStationObjectsModel
from models.pumping.pumping_station_object_model import PumpingStationObjectModel


class PumpingStationsSettingsRepository(SettingsRepositoryBase):

    def get_pumping_station_list_by_account(self, account_id: str) -> PumpingStationObjectsModel:
        pumping_stations_settings = self.settings

        account_link_pumping_station_objects = next(
            (
                link
                for link in pumping_stations_settings.account_links_pumping_station_objects.items
                if link.account_id == account_id
            ),
            None,
        )

        if not account_link_pumping_station_objects:
            return PumpingStationObjectsModel(items=[])

        pumping_station_objects = [
            pumping_station
            for pumping_station in pumping_stations_settings.pumping_station_objects.items
            if pumping_station.id in account_link_pumping_station_objects.pumping_station_objects
        ]

        return PumpingStationObjectsModel(items=pumping_station_objects)

    def get_pumping_stations_by_id(self, pumping_station_id: str) -> PumpingStationObjectModel:
        pumping_stations_settings = self.settings

        pumping_station_object = next(
            (i for i in pumping_stations_settings.pumping_station_objects.items if i.id == pumping_station_id), None
        )

        return pumping_station_object
