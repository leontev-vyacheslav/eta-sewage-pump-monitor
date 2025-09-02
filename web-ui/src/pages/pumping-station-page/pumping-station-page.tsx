import { useMemo } from 'react';
import PageHeader from '../../components/page-header/page-header';
import AppConstants from '../../constants/app-constants';
import { CircuitIcon, ParamsIcon, PumpingStationIcon  } from '../../constants/app-icons';
import { MenuItemModel } from '../../models/menu-item-model';
import { Item as TabPanelItem, TabPanel } from 'devextreme-react/tab-panel';
import { IconTab } from '../../components/tab-utils/icon-tab';
import { PumpingStationStateForm } from './tab-contents/pumping-station-state';
import './pumping-station-page.scss';
import { PumpingStationSchema } from './tab-contents/pumping-station-schema';
import { PumpingStationPageContextProvider } from './pumping-station-page-context';

const PumpingStationPageInternal = () => {
    const menuItems = useMemo(() => {
            return [] as MenuItemModel[];
    }, []);

    return (
        <>
            <PageHeader caption={ 'Насосные станции' } menuItems={ menuItems }>
                <PumpingStationIcon size={ AppConstants.headerIconSize } />
            </PageHeader>

            <div className={ 'content-block' }>
                <div className={ 'dx-card responsive-paddings pumping-station-page-content' }>
                    <TabPanel>
                        <TabPanelItem title='Параметры' tabRender={ (e) => <IconTab tab={ e } icon={ <ParamsIcon size={ 18 } /> } /> }>
                            <PumpingStationStateForm />
                        </TabPanelItem>
                        <TabPanelItem title='Мнемосхема' tabRender={ (e) => <IconTab tab={ e } icon={ <CircuitIcon size={ 18 } /> } /> }>
                            <PumpingStationSchema />
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