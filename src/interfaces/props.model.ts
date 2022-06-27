import { IClientInfo } from "./client.model";
import { ClientModel } from "./user.model";

export interface IClientInfoProps {
    onClose: () => void;
    isOpen: boolean;
    clientInfo: IClientInfo;
    update: boolean;
}

export interface ClientPendingProps {
    clients: ClientModel[];
    loadAgain: () => void;
    update: boolean;
}