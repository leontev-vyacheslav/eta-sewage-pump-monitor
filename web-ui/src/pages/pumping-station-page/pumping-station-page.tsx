import { useMemo } from 'react';
import PageHeader from '../../components/page-header/page-header';
import AppConstants from '../../constants/app-constants';
import { CircuitIcon, ParamsIcon, PumpingStationIcon } from '../../constants/app-icons';
import { MenuItemModel } from '../../models/menu-item-model';
import { Item as TabPanelItem, TabPanel } from 'devextreme-react/tab-panel';
import { IconTab } from '../../components/tab-utils/icon-tab';
import { PumpingStationStateForm } from './tab-contents/pumping-station-state-form';
import { PumpingStationSchema } from './tab-contents/pumping-station-schema';
import { PumpingStationPageContextProvider, usePumpingStationPage } from './pumping-station-page-context';

import './pumping-station-page.scss';

const PumpingStationPageInternal = () => {
    const { pumpingStationObject } = usePumpingStationPage();

    const menuItems = useMemo(() => {
        return [] as MenuItemModel[];
    }, []);

    return (
        <>
            <PageHeader caption={ `Насосные станции: ${pumpingStationObject ? pumpingStationObject.name : 'нет данных'}` } menuItems={ menuItems }>
                <PumpingStationIcon size={ AppConstants.headerIconSize } />
            </PageHeader>
            <div className={ 'content-block' }>
                <div className={ 'dx-card responsive-paddings pumping-station-page-content' }>

                    <TabPanel className='app-tab-panel'>
                        <TabPanelItem title='Мнемосхема' tabRender={ (e) => <IconTab tab={ e } icon={ <CircuitIcon size={ 18 } /> } /> }>
                            <PumpingStationSchema />
                        </TabPanelItem>
                        <TabPanelItem title='Управление' tabRender={ (e) => <IconTab tab={ e } icon={ <ParamsIcon size={ 18 } /> } /> }>
                            <PumpingStationStateForm />
                        </TabPanelItem>
                    </TabPanel>
                </div>
            </div>
        </>
    );
}

export const PumpingStationPage = () => {
    return (
        <PumpingStationPageContextProvider>
            <PumpingStationPageInternal />
        </PumpingStationPageContextProvider>
    );
}