import { HomePageContextProvider } from './home-page-context';
import { useEffect } from 'react';
import { usePumpingStationsData } from '../../contexts/app-data/use-pumping-stations-data';
import { useNavigate } from 'react-router';

import './home-page.scss';

export const HomePageInternal = () => {
    const { getPumpingStationObjectsAsync } = usePumpingStationsData();
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            const pumpingStationObjects = await getPumpingStationObjectsAsync();
            if (pumpingStationObjects) {
                const pumpingStationObject = pumpingStationObjects.items.find(() => true);
                pumpingStationObject && navigate(`/pumping-stations?id=${pumpingStationObject.id}`, { replace: true });
            }
        })();
    }, [getPumpingStationObjectsAsync, navigate]);

    return null;
};

export const HomePage = () => {
    return (
        <HomePageContextProvider>
            <HomePageInternal />
        </HomePageContextProvider>
    )
}