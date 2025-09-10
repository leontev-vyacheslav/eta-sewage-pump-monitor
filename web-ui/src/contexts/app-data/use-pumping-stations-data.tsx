import { useCallback } from 'react';
import { useAuthHttpRequest } from './use-auth-http-request';
import { Method } from 'axios';
import { HttpConstants } from '../../constants/app-http-constants';
import routes from '../../constants/app-api-routes';
import { useAuth } from '../auth';
import { PumpingStationObjectsModel } from '../../models/pumping/pumping-station-objects-model';
import { PumpingStationStateModel } from '../../models/pumping/pumping-station-state-model';
import { PumpingStationObjectModel } from '../../models/pumping/pumping-station-object-model';
import { PumpingStationStateValueModel } from '../../models/pumping/pumping-station-state-value-model';


export type AppDataContextPumpingStationsEndpointsModel = {
    getPumpingStationObjectsAsync: () => Promise<PumpingStationObjectsModel | null>;
    getPumpingStationObjectStateAsync: (pumpingStationId: string) => Promise<PumpingStationStateModel | null>;
    getPumpingStationObjectAsync: (pumpingStationId: string) => Promise<PumpingStationObjectModel | null>;
    postPumpingStationStateValue: (pumpingStationId: string, pumpingStationStateValue: PumpingStationStateValueModel) => Promise<PumpingStationStateValueModel | null>
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


    const getPumpingStationObjectAsync = useCallback( async (pumpingStationId: string) => {
        const response = await authHttpRequest({
            url: `${routes.host}${routes.pumpingStations}/${pumpingStationId}`,
            method: HttpConstants.Methods.Get as Method,
        }, true);

        if (response && response.status === HttpConstants.StatusCodes.Ok) {
            return response.data as PumpingStationObjectModel;
        }

        return null;
    }, [authHttpRequest]);

    const postPumpingStationStateValue = useCallback(async(pumpingStationId: string, pumpingStationStateValue: PumpingStationStateValueModel) => {
        const response = await authHttpRequest({
            url: `${routes.host}${routes.pumpingStations}/state/${pumpingStationId}`,
            method: HttpConstants.Methods.Post as Method,
            data: pumpingStationStateValue
        });

        if (response && response.status === HttpConstants.StatusCodes.Ok) {
            return response.data as PumpingStationStateValueModel;
        }

        return null;
    }, [authHttpRequest]);

    return {
        getPumpingStationObjectsAsync,
        getPumpingStationObjectStateAsync,
        getPumpingStationObjectAsync,
        postPumpingStationStateValue
    }
};