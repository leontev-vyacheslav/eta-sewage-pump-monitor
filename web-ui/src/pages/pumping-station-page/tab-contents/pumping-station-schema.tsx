import { usePumpingStationPage } from '../pumping-station-page-context';
import './pumping-station-schema.scss';

export const PumpingStationSchema = () => {
    const { pumpingStationObjectState } = usePumpingStationPage();
    return (
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 333.41 396.41">
            <polyline className="default-style" points="303.21 365.38 29.21 363.71 29.71 363.21 29.71 1.21 29.21 1.71 1.21 1.71 1.71 1.21 3.71 393.21 4.21 392.71 332.21 394.69 331.68 395.21 329.71 2.21 330.21 1.71 302.21 1.71 302.71 2.21 302.71 366.21" />
            <rect className="default-style" x="251.71" y="9.71" width="30" height="22" style={ { fill: pumpingStationObjectState?.emergencyLevel ? 'red' : 'none' } } />
            <rect className="default-style" x="251.71" y="104.71" width="30" height="22" style={ { fill: pumpingStationObjectState?.hiLevel ? 'red' : 'none' } } />
            <rect className="default-style" x="251.71" y="199.71" width="30" height="22" style={ { fill: pumpingStationObjectState?.midLevel ? 'red' : 'none' } } />
            <rect className="default-style" x="251.71" y="294.71" width="30" height="22" style={ { fill: pumpingStationObjectState?.lowLevel ? 'red' : 'none' } }  />
        </svg>
    );
}