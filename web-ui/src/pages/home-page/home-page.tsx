import './home-page.scss';
import AppConstants from '../../constants/app-constants';
import { HeatingCircuitCodeIcon, HeatingCircuitMnemoschemaIcon, HomeIcon } from '../../constants/app-icons';
import PageHeader from '../../components/page-header/page-header';
import { TabPanel, Item as TabPanelItem } from 'devextreme-react/tab-panel'
import { useMemo, useRef, useState } from 'react';
import { IconTab } from '../../components/tab-utils/icon-tab';
import { formatMessage } from 'devextreme/localization';
import { MenuItemModel } from '../../models/menu-item-model';
import { HomePageContextProvider, useHomePage } from './home-page-context';

export const HomePageInternal = () => {
    const { isShowMnemoschema, setIsShowMnemoschema } = useHomePage();
    // const { regulatorSettings, getHeatingCircuitName } = useRegulatorSettings();
    const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
    const tabPanelRef = useRef<TabPanel>(null);

    const menuItems = useMemo(() => {
        return [
            {
                icon: () => isShowMnemoschema ? <HeatingCircuitCodeIcon size={ 20 } color='black' /> : <HeatingCircuitMnemoschemaIcon size={ 20 } color='black' />,
                onClick: () => {
                    setIsShowMnemoschema(previous => !previous);
                    tabPanelRef.current?.instance.repaint()
                },
            }
        ] as MenuItemModel[];
    }, [isShowMnemoschema, setIsShowMnemoschema]);

    return (
        <>
            <PageHeader caption={ 'Главная' } menuItems={ menuItems }>
                <HomeIcon size={ AppConstants.headerIconSize } />
            </PageHeader>
            <div className={ 'content-block' }>
                <div className={ 'dx-card responsive-paddings home-page-content' }>

                        <TabPanel ref={ tabPanelRef }
                            swipeEnabled={ false }
                            animationEnabled
                            width={ '100%' }
                            height={ AppConstants.pageHeight }
                            loop
                            onSelectedIndexChange={ (value: number) => {
                                setActiveTabIndex(value);
                            } }>

                            <TabPanelItem
                                title={ 'Мнемосхема' }
                                tabRender={
                                    (e) => <IconTab tab={ e } icon />
                                }
                            >
                            </TabPanelItem>

                            <TabPanelItem
                                title={ 'Параметры' }
                                tabRender={
                                    (e) => <IconTab tab={ e } icon />
                                }
                            >
                            </TabPanelItem>

                        </TabPanel>
                </div>
            </div>
        </>
    );
};

export const HomePage = () => {
    return (
        <HomePageContextProvider>
            <HomePageInternal />
        </HomePageContextProvider>
    )
}