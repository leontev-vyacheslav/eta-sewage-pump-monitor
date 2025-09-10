import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { PumpingStationStateModel } from '../../models/pumping/pumping-station-state-model';
import { useSearchParams } from 'react-router-dom';
import { usePumpingStationsData } from '../../contexts/app-data/use-pumping-stations-data';
import { Form } from 'devextreme-react/form';
import { PumpingStationObjectModel } from '../../models/pumping/pumping-station-object-model';


export type PumpingStationPageContextModel = {
    pumpingStationObjectState: PumpingStationStateModel | null;
    pumpingStationObject: PumpingStationObjectModel | null;
    dxPumpingStationStateFormRef: React.RefObject<Form>;
};

const PumpingStationPageContext = createContext({} as PumpingStationPageContextModel);

function PumpingStationPageContextProvider(props: any) {
    const [searchParams] = useSearchParams();
    const { getPumpingStationObjectStateAsync, getPumpingStationObjectAsync } = usePumpingStationsData();
    const [pumpingStationObjectState, setPumpingStationObjectState] = useState<PumpingStationStateModel | null>(null);
    const [pumpingStationObject, setPumpingStationObject] = useState<PumpingStationObjectModel | null>(null);
    const dxPumpingStationStateFormRef = useRef<Form>(null);

    const updatePumpingStationObjectStateAsync = useCallback(async () => {
        const pumpingStationObjectId = searchParams.get('id');

        if (!pumpingStationObjectId) {
            return;
        }
        let scrollOffset = null;
        if (dxPumpingStationStateFormRef && dxPumpingStationStateFormRef.current) {
            scrollOffset = (dxPumpingStationStateFormRef.current.instance as any)._scrollable.scrollOffset();
        }

        const pumpingStationObjectState = await getPumpingStationObjectStateAsync(pumpingStationObjectId);
        if (pumpingStationObjectState) {
            setPumpingStationObjectState(pumpingStationObjectState);
        }
        setTimeout(() => {
            if (dxPumpingStationStateFormRef && dxPumpingStationStateFormRef.current) {
                (dxPumpingStationStateFormRef.current.instance as any)._scrollable.scrollTo(scrollOffset);
            }
        }, 0);

    }, [getPumpingStationObjectStateAsync, searchParams, dxPumpingStationStateFormRef]);

    useEffect(() => {
        (async () => {
            await updatePumpingStationObjectStateAsync();

            const pumpingStationObjectId = searchParams.get('id');
            if (!pumpingStationObjectId) {
                return;
            }
            const pumpingStationObject = await getPumpingStationObjectAsync(pumpingStationObjectId);
            if (!pumpingStationObject) {
                return;
            }
            setPumpingStationObject(pumpingStationObject);
        })()
    }, [updatePumpingStationObjectStateAsync, dxPumpingStationStateFormRef, searchParams, getPumpingStationObjectAsync]);

    useEffect(() => {
        const timer = setInterval(async () => {
            await updatePumpingStationObjectStateAsync();
        }, 10000);

        return () => {
            clearInterval(timer);
        };
    }, [updatePumpingStationObjectStateAsync, dxPumpingStationStateFormRef]);

    return (
        <PumpingStationPageContext.Provider value={ {
            pumpingStationObjectState,
            pumpingStationObject,
            dxPumpingStationStateFormRef
        } } { ...props } />
    );
}

const usePumpingStationPage = () => useContext(PumpingStationPageContext);

export { PumpingStationPageContextProvider, usePumpingStationPage };

