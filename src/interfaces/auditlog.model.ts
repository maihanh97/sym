import {UserModel} from "./user.model";

export interface AuditlogModel {
    actionName: string;
    createDate: string;
    createUid: string;
    fieldName: string;
    id: number;
    menu: string;
    newValue: string;
    oldValue: string;
    recordId: number;
    user: UserModel;
    userId: number;
    writeDate: string;
    writeUid: string;
}