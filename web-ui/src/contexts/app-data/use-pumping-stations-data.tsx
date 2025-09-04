import { useCallback } from 'react';
import { useAuthHttpRequest } from './use-auth-http-request';
import { Method } from 'axios';
import { HttpConstants } from '../../constants/app-http-constants';
import routes from '../../constants/app-api-routes';
import { useAuth } from '../auth';
import { PumpingStationObjectsModel } from '../../models/pumping/pumping-station-objects-model';
import { PumpingStationStateModel } from '../../models/pumping/pumping-station-state-model';


export type AppDataContextPumpingStationsEndpointsModel = {
    getPumpingStationObjectsAsync: () => Promise<PumpingStationObjectsModel | null>;
    getPumpingStationObjectStateAsync: (pumpingStationId: string) => Promise<PumpingStationStateModel | null>;
}

export const usePumpingStationsData = () => {
    const authHttpRequest = useAuthHttpRequest();
    const { getUserAuthDataFromStorage } = useAuth();

    const getPumpingStationObjectsAsync = useCallback( async () => {
        const authUser = getUserAuthDataFromStorage();

        const response = await authHttpRequest({
            url: `${routes.host}${routes.pumpingStations}/list-by-account-id/${authUser?.accountId}`,
            method: HttpConstants.Methods.Get as Method,
        });

        if (response && response.status === HttpConstants.StatusCodes.Ok) {
            return response.data as PumpingStationObjectsModel;
        }

        return null;
    }, [authHttpRequest, getUserAuthDataFromStorage]);

    const getPumpingStationObjectStateAsync = useCallback( async (pumpingStationId: string) => {
        const response = await authHttpRequest({
            url: `${routes.host}${routes.pumpingStations}/state/${pumpingStationId}`,
            method: HttpConstants.Methods.Get as Method,
        }, true);

        if (response && response.status === HttpConstants.StatusCodes.Ok) {
            return response.data as PumpingStationStateModel;
        }

        return null;
    }, [authHttpRequest]);

    return {
        getPumpingStationObjectsAsync,
        getPumpingStationObjectStateAsync
    }
};