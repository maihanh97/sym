export interface IListClientContant {
    code: string;
    value: string;
}

export interface IClientInfo {
    accountId: string;
    accountType: string;
    approver?: string;
    approver_id?: string;
    bankAccountName: string;
    bankAccountNumber: string;
    cashTPlus: string;
    countryCd: string;
    createDate: string;
    createUid: number;
    fullName: string;
    id: number;
    reason: string;
    rejecter: number;
    rejecter_id: number;
    status:string;
    tokenTPlus: string;
    walletAddress?: string;
    writeDate: string;
    writeUid: number;
}