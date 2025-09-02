import { TcpConnectorModel } from './tcp-connector-model';

export type PumpingStationObjectModel = {
    id: string;

    name: string;

    description: string;

    connector: TcpConnectorModel;
}