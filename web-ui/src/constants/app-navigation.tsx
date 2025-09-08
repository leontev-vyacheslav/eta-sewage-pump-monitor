import { useEffect, useMemo, useState } from 'react';
import {
    AboutIcon,
    ExitIcon,
    PumpingStationIcon,
    PumpingStationObjectsIcon,
} from './app-icons';
import { TreeViewItemModel } from '../models/tree-view-item';
import { IconBaseProps } from 'react-icons';
import { usePumpingStationsData } from '../contexts/app-data/use-pumping-stations-data';
import { PumpingStationObjectsModel } from '../models/pumping/pumping-station-objects-model';

export const useSideNavigationMenuItems = () => {
    // const { isAdmin, isOperator } = useAuth();
    const { getPumpingStationObjectsAsync } = usePumpingStationsData();
    const [pumpingStations, setPumpingStations] = useState<PumpingStationObjectsModel | null>(null);

    useEffect(()=> {
        (async () => {
            const pumpingStations = await getPumpingStationObjectsAsync();

            if (pumpingStations) {
                setPumpingStations(pumpingStations);
            }
        })();
    }, [getPumpingStationObjectsAsync]);


    return useMemo<TreeViewItemModel[]>(() => {

        return [
            {
                id: 'pumping-station-objects',
                text: 'Насосные станции',
                iconRender: (props: IconBaseProps) => <PumpingStationObjectsIcon size={ 22 } { ...props } />,
                items: pumpingStations ? pumpingStations.items.map((i) => {
                    return {
                        id: i.id,
                        text: i.name,
                        iconRender: (props: IconBaseProps) => <PumpingStationIcon size={ 22 } { ...props } />,
                        path: `/pumping-stations?id=${i.id}`
                    }
                }) : []
            },

            {
                id: 'about',
                text: 'О программе',
                iconRender: (props: IconBaseProps) => <AboutIcon size={ 22 } { ...props } />,
                path: '/about',
            },
            {
                id: 'exit',
                text: 'Выход',
                iconRender: (props: IconBaseProps) => <ExitIcon size={ 22 } { ...props } />,
                command: 'exit',
            },
        ] as TreeViewItemModel[];
    }, [pumpingStations]);
};
