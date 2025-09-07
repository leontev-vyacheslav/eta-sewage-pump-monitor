import 'devextreme/dist/css/dx.common.css';
import './themes/generated/theme.base.css';
import './themes/generated/theme.additional.css';
import './dx-styles.scss';

import { HashRouter as BrowserRouter } from 'react-router-dom';
import { NavigationProvider } from './contexts/navigation';
import { AuthProvider, useAuth } from './contexts/auth';
import { useScreenSizeClass } from './utils/media-query';
import { AppSettingsProvider } from './contexts/app-settings';
import { AppDataProvider } from './contexts/app-data/app-data';
import { SharedAreaProvider } from './contexts/shared-area';
import ruMessages from 'devextreme/localization/messages/ru.json';
import { locale, loadMessages } from 'devextreme/localization';
import ContentAuth from './content-auth';
import ContentNonAuth from './content-non-auth';
import { WorkdatePickerProvider } from './contexts/workdate-context';
import Loader from './components/loader/loader';


function App() {
    const { user } = useAuth();

    if (user === undefined) {
        return null;
    }

    loadMessages(ruMessages);
    loadMessages({
        'ru': {
            'validation-compare-supply-temperature-return-temperature': 'Значение Тп всегда больше Тo',
            'validation-value-already-existed': 'Значение уже существует',
            'validation-range-formatted-with-values': 'Допустимые значения в диапазоне от {0} до {1}',
            'validation-range-overlapped': 'Перекрытие диапазонов',
            'confirm-title': 'Подтвердить',
            'noDataText': 'Нет данных для отображения',
        }
    });
    locale('ru-RU');

    return user === null ? <ContentNonAuth /> : <ContentAuth />
}

function Main() {
    const screenSizeClass = useScreenSizeClass();

    return (
        <BrowserRouter>
            <AuthProvider>
                <SharedAreaProvider>
                    <AppDataProvider>
                        <AppSettingsProvider>
                                <WorkdatePickerProvider>
                                    <NavigationProvider>
                                        <div className={ `app ${screenSizeClass}` }>
                                            <App />
                                            <Loader />
                                        </div>
                                    </NavigationProvider>
                                </WorkdatePickerProvider>
                        </AppSettingsProvider>
                    </AppDataProvider>
                </SharedAreaProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default Main;
