import { createContext, useContext } from 'react';
import { AppBaseProviderProps } from '../../models/app-base-provider-props';
import { AppDataContextAuthCheckEndpointsModel, useAuthData } from './use-auth-data';
import { AppDataContextAccountsEndpointsModel, useAccountsData } from './use-accounts-data';
import { AppDataContextPumpingStationsEndpointsModel, usePumpingStationsData } from './use-pumping-stations-data';

export type AppDataContextModel =  AppDataContextAuthCheckEndpointsModel
    & AppDataContextAccountsEndpointsModel
    & AppDataContextPumpingStationsEndpointsModel;

const AppDataContext = createContext<AppDataContextModel>({} as AppDataContextModel);
const useAppData = () => useContext(AppDataContext);

function AppDataProvider (props: AppBaseProviderProps) {
    const authData = useAuthData();
    const accountsData = useAccountsData();
    const pumpingStationsData = usePumpingStationsData();

    return (
        <AppDataContext.Provider
            value={ {
                ...authData,
                ...accountsData,
                ...pumpingStationsData
            } }
            { ...props }
        />
    );
}

export { AppDataProvider, useAppData };
