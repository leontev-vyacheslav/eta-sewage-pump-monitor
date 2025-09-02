import { IconTabProps } from '../../models/icon-tab-props';


const IconTab = ({ tab, icon }: IconTabProps ) => {
    return (
        <div style={ { display: 'flex', alignItems: 'center', gap: 5 } }>
            {icon ? icon : null}
            <span>{tab.title}</span>
        </div>
    );
}

export { IconTab };