import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { PumpingStationStateModel } from '../../models/pumping/pumping-station-state-model';
import { useSearchParams } from 'react-router-dom';
import { usePumpingStationsData } from '../../contexts/app-data/use-pumping-stations-data';


export type PumpingStationPageContextModel = {
    pumpingStationObjectState: PumpingStationStateModel | null;
};

const PumpingStationPageContext = createContext({} as PumpingStationPageContextModel);

function PumpingStationPageContextProvider(props: any) {
    const [searchParams] = useSearchParams();
    const { getPumpingStationObjectStateAsync } = usePumpingStationsData();
    const [pumpingStationObjectState, setPumpingStationObjectState] = useState<PumpingStationStateModel | null>(null);

    const updatePumpingStationObjectStateAsync = useCallback(async () => {
        const pumpingStationObjectId = searchParams.get('id');

        if (!pumpingStationObjectId) {
            return;
        }

        const pumpingStationObjectState = await getPumpingStationObjectStateAsync(pumpingStationObjectId);
        if (pumpingStationObjectState) {
            setPumpingStationObjectState(pumpingStationObjectState);
        }
    }, [getPumpingStationObjectStateAsync, searchParams]);

    useEffect(() => {
        (async () => {
            await updatePumpingStationObjectStateAsync();
        })()
    }, [updatePumpingStationObjectStateAsync]);

    useEffect(() => {
        const timer = setInterval(async () => {
            await updatePumpingStationObjectStateAsync();
        }, 10000);

        return () => {
            clearInterval(timer);
        };
    }, [updatePumpingStationObjectStateAsync]);

    return (
        <PumpingStationPageContext.Provider value={ {
            pumpingStationObjectState,
        } } { ...props } />
    );
}

const usePumpingStationPage = () => useContext(PumpingStationPageContext);

export { PumpingStationPageContextProvider, usePumpingStationPage };

