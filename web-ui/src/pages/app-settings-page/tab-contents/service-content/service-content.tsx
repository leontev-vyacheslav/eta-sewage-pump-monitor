import Form, { SimpleItem } from 'devextreme-react/form';
import { useRef } from 'react';
import { useAppData } from '../../../../contexts/app-data/app-data';
import { FieldDataChangedEvent } from 'devextreme/ui/form';
import AppConstants from '../../../../constants/app-constants';

export const ServiceForm = () => {
    const dxServiceFormRef = useRef<Form>(null);
    const regulatorSettings  = null;
    // const { putRegulatorSettingsAsync } = useAppData();

    return (
        <Form
            className={ 'app-form setting-form' }
            height={ AppConstants.formHeight }
            scrollingEnabled={ true }
            colCount={ 1 }
            // formData={ regulatorSettings?.service }
            ref={ dxServiceFormRef }
            onFieldDataChanged={ async (e: FieldDataChangedEvent) => {
                // await putRegulatorSettingsAsync(regulatorSettings!);

                if (e.dataField === 'allowDebugMode') {
                    // setRegulatorSettings(previous => {
                    //     previous!.service = { ...previous!.service };

                    //     return { ...previous! };
                    // });
                }
            } }
        >
            <SimpleItem
                dataField={ 'allowDebugMode' }
                label={ { location: 'top', showColon: true, text: 'Режим отладки' } }
                editorType={ 'dxSwitch' }
            />
        </Form>
    );
}