import './header.scss';
import Toolbar, { Item } from 'devextreme-react/toolbar';
import Button from 'devextreme-react/button';
import { ReactComponent as AppLogo } from '../../assets/app-logo.svg';
import { useAppSettings } from '../../contexts/app-settings';
import { MenuIcon } from '../../constants/app-icons';
import { HeaderProps } from '../../models/header-props';

import { WorkDateWidget } from '../work-date-widget/work-date-widget';
import { useScreenSize } from '../../utils/media-query';


const Header = ({ title, menuToggleEnabled, toggleMenu }: HeaderProps) => {
    const { isXSmall } = useScreenSize();

    const { appSettingsData } = useAppSettings();
    return (
        <header className={ 'header-component' }>
            <Toolbar className={ 'header-toolbar' }>
                <Item visible={ menuToggleEnabled } location={ 'before' } widget={ 'dxButton' } cssClass={ 'menu-button' }>
                    <Button icon={ 'none' } onClick={ toggleMenu }>
                        <MenuIcon size={ 30 } />
                    </Button>
                </Item>
                <Item
                    location={ 'before' }
                    cssClass={ 'header-title' }
                    text={ title }
                    visible={ !!title }
                    render={ () => {
                        return (
                            <div className={ 'header-title-logo-container' }>
                                { isXSmall ? null : <AppLogo width={ 60 } /> }
                                <div>{title}</div>
                            </div>
                        );
                    } }
                />
                {
                    appSettingsData.workDate ?
                        <Item location={ 'after' } locateInMenu={ 'auto' } >
                            <WorkDateWidget />
                        </Item>
                        : null
                }
            </Toolbar>
        </header>
    )
}

export default Header;
