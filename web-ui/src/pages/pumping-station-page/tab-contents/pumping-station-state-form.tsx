import 'devextreme-react/switch';
import Form, { GroupItem, SimpleItem } from 'devextreme-react/form';
import { FieldDataChangedEvent } from 'devextreme/ui/form';
import AppConstants from '../../../constants/app-constants';
import { usePumpingStationPage } from '../pumping-station-page-context';
import { formatMessage } from 'devextreme/localization';
import { usePumpingStationsData } from '../../../contexts/app-data/use-pumping-stations-data';


export const PumpingStationStateForm = () => {

    const { pumpingStationObjectState, dxPumpingStationStateFormRef, pumpingStationObject } = usePumpingStationPage();
    const { postPumpingStationStateValue } = usePumpingStationsData();

    return (pumpingStationObjectState ?

        <Form
            className='app-form setting-form pumping-station-state-form'
            height={ AppConstants.formHeight }
            scrollingEnabled={ true }
            colCount={ 1 }
            formData={ pumpingStationObjectState }
            ref={ dxPumpingStationStateFormRef }

            onFieldDataChanged={ async (e: FieldDataChangedEvent) => {
                console.log(e);
                if (!e.dataField || !pumpingStationObject) {
                    return;
                }

                await postPumpingStationStateValue(pumpingStationObject.id, {
                    propName: e.dataField,
                    value: e.value
                })
            } }
        >
            <GroupItem caption={ 'Управление' }>
                <SimpleItem
                    dataField='startStop'
                    label={ { location: 'top', showColon: true, text: 'Включение/выключение работы станции' } }
                    editorType='dxSwitch'
                />
                <SimpleItem
                    dataField='resetFaultPump1'
                    label={ { location: 'top', showColon: true, text: 'Сброс ошибки насоса 1' } }
                    editorType='dxSwitch'
                />

                <SimpleItem
                    dataField='resetFaultPump2'
                    label={ { location: 'top', showColon: true, text: 'Сброс ошибки насоса 2' } }
                    editorType='dxSwitch'
                />

                <SimpleItem
                    dataField='resetOperatingTimePump1'
                    label={ { location: 'top', showColon: true, text: 'Сброс времени наработки насоса 1' } }
                    editorType='dxSwitch'
                />

                <SimpleItem
                    dataField='resetOperatingTimePump2'
                    label={ { location: 'top', showColon: true, text: 'Сброс времени наработки насоса 2' } }
                    editorType='dxSwitch'
                />
            </GroupItem>

            <GroupItem caption={ 'Состояния' }>
                <SimpleItem
                    dataField='lowLevel'
                    label={ { location: 'left', showColon: true, text: 'Нижний уровень' } }
                    editorType='dxCheckBox'
                    editorOptions={ { readOnly: true } }
                    cssClass='pumping-station-state-form-check-box'
                />

                <SimpleItem
                    dataField='midLevel'
                    label={ { location: 'left', showColon: true, text: 'Средний уровень' } }
                    editorType='dxCheckBox'
                    editorOptions={ { readOnly: true } }
                    cssClass='pumping-station-state-form-check-box'
                />

                <SimpleItem
                    dataField='hiLevel'
                    label={ { location: 'left', showColon: true, text: 'Верхний уровень' } }
                    editorType='dxCheckBox'
                    editorOptions={ { readOnly: true } }
                    cssClass='pumping-station-state-form-check-box'
                />

                <SimpleItem
                    dataField='emergencyLevel'
                    label={ { location: 'left', showColon: true, text: 'Аварийный уровень' } }
                    editorType='dxCheckBox'
                    editorOptions={ { readOnly: true } }
                    cssClass='pumping-station-state-form-check-box'
                />

                <SimpleItem
                    dataField='statePump1'
                    label={ { location: 'left', showColon: true, text: 'Состояние насоса 1' } }
                    editorType='dxCheckBox'
                    editorOptions={ { readOnly: true } }
                    cssClass='pumping-station-state-form-check-box'
                />

                <SimpleItem
                    dataField='statePump2'
                    label={ { location: 'left', showColon: true, text: 'Состояние насоса 2' } }
                    editorType='dxCheckBox'
                    editorOptions={ { readOnly: true } }
                    cssClass='pumping-station-state-form-check-box'
                />

                <SimpleItem
                    dataField='faultPump1'
                    label={ { location: 'left', showColon: true, text: 'Ошибка насоса 1' } }
                    editorType='dxCheckBox'
                    editorOptions={ { readOnly: true } }
                    cssClass='pumping-station-state-form-check-box'
                />

                <SimpleItem
                    dataField='faultPump2'
                    label={ { location: 'left', showColon: true, text: 'Ошибка насоса 2' } }
                    editorType='dxCheckBox'
                    editorOptions={ { readOnly: true } }
                    cssClass='pumping-station-state-form-check-box'
                />

                <SimpleItem
                    dataField='timePump1'
                    label={ { location: 'top', showColon: true, text: 'Время наработки насоса 1, час' } }
                    editorType='dxNumberBox'
                    editorOptions={ { readOnly: true } }
                />

                <SimpleItem
                    dataField='timePump2'
                    label={ { location: 'top', showColon: true, text: 'Время наработки насоса 2, час' } }
                    editorType='dxNumberBox'
                    editorOptions={ { readOnly: true } }
                />
            </GroupItem>
        </Form>
        : <div className='dx-nodata'><div>{formatMessage('noDataText')}</div></div>
    );
}