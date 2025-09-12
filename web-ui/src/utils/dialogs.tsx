import { alert, confirm } from 'devextreme/ui/dialog';
import dxPopup, { ToolbarItem } from 'devextreme/ui/popup';
import dxTextBox, { Properties } from 'devextreme/ui/text_box';
import devices from 'devextreme/core/devices';
import * as AppIcons from '../constants/app-icons';
import { PromptSimpleDialogModel, SimpleDialogContentModel, SimpleDialogModel } from '../models/simple-dialog';
import ReactDOMServer from 'react-dom/server';
import AppConstants from '../constants/app-constants';
import React from 'react';

const dialogContentRender = ({ iconName, iconSize, iconColor, textRender }: SimpleDialogContentModel) => {
    iconColor = iconColor ? iconColor : AppConstants.colors.themeBaseAccent;
    iconSize = iconSize ? iconSize : 24;

    const IconComponent = (AppIcons as any)[iconName];

    const InnerContent = () => (
        React.createElement('div', { style: { display: 'flex', alignItems: 'center' } },
            React.createElement('div', null,
                React.createElement(IconComponent, {
                    size: iconSize,
                    style: {
                        alignSelf: 'flex-start',
                        color: iconColor
                    }
                })
            ),
            textRender && React.createElement('span', { style: { marginLeft: 10 } }, textRender())
        )
    );
    debugger
    return ReactDOMServer.renderToString(React.createElement(InnerContent));
}

const showConfirmDialog = ({ title, iconName, iconSize, iconColor, textRender, callback }: SimpleDialogModel) => {
    confirm(dialogContentRender({ iconName, iconSize, iconColor, textRender }), title).then((dialogResult) => {
        if (dialogResult) {
            if (callback) {
                callback();
            }
        }
    });
}

const showConfirmDialogEx = ({ title, iconName, iconSize, iconColor, textRender, callback }: SimpleDialogModel) => {
    confirm(dialogContentRender({ iconName, iconSize, iconColor, textRender }), title).then((dialogResult) => {
            if (callback) {
                callback(dialogResult);
            }
    });
}

const showAlertDialog = ({ title, iconName, iconSize, iconColor, textRender, callback }: SimpleDialogModel) => {
    alert(dialogContentRender({ iconName, iconSize, iconColor, textRender }), title).then(() => {
        if (callback) {
            callback();
        }
    });
};

const showPromptDialog = ({ title, iconName, iconSize, iconColor, textRender, callback, text }: PromptSimpleDialogModel) => {

    textRender = textRender
        ? textRender
        : () => {
            return <div>Введите текстовое значение</div>
        };

    const root = document.querySelector('#root');

    if (!root) {
        return;
    }

    root.insertAdjacentHTML('beforeend', '<div id="dx-prompt-dialog"></div>');
    const element = document.querySelector('#dx-prompt-dialog');
    let textBox: dxTextBox<Properties> | null = null;

    const buildContent = () => {
        const contentContainerElement = document.createElement('div');

        const labelElement = document.createElement('div');
        labelElement.style.marginBottom = '15px';
        labelElement.innerHTML = dialogContentRender({ iconName, iconSize, iconColor, textRender })
        contentContainerElement.insertAdjacentElement('beforeend', labelElement);

        const textBoxElement = document.createElement('div');
        contentContainerElement.insertAdjacentElement('beforeend', textBoxElement)
        textBox = new dxTextBox(textBoxElement, {
            value: text,
            label: 'Значение',
            labelMode: 'floating'
        } as Properties);

        return contentContainerElement;
    };

    const popupToolbars: ToolbarItem[] = [{
        widget: 'dxButton',
        toolbar: 'bottom',
        location: 'center',
        options: {
            text: 'Ok',
            width: 100,
            onClick: async () => {
                if (callback) {
                    await callback({ modalResult: 'OK', text: textBox?.option('text') });
                    popup.hide();
                }
            },
        },
    }, {
        widget: 'dxButton',
        toolbar: 'bottom',
        location: 'center',
        options: {
            text: 'Отмена',
            width: 100,
            onClick: async () => {
                popup.hide();
                await callback({ modalResult: 'CANCEL' });
            },
        },
    }];

    const popup = new dxPopup(element!, {
        title: title,
        showCloseButton: false,
        width: devices.current().phone ? '90%' : '100%',
        maxWidth: 600,
        height: 'auto',
        toolbarItems: popupToolbars,
        onHidden() {
            element?.remove();
        },
        contentTemplate: buildContent,
        animation: {
            hide: {
                type: 'fadeOut'
            },
            show: {
                type: 'pop'
            }
        }
    });

    popup.show();
};

const showAccessTokenPromptDialog = ({ callback }: Omit<PromptSimpleDialogModel, 'title' | 'iconName' | 'textRender'>) =>
    showPromptDialog({
        title: 'Токен доступа',
        iconName: 'AccessTokenIcon',
        textRender: () => 'Введите токен доступа в текстовое поле',
        callback: callback
    });

export { showConfirmDialog, showAlertDialog, showPromptDialog, showConfirmDialogEx, showAccessTokenPromptDialog };
