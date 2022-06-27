export interface LoginParam {
    username: string;
    password: string;
}

export interface UserModel {
    createUid: string;
    email: string;
    id: number;
    roleId: number;
    userRole: string;
    username: string;
    fullName: string;
    roleCode: string;
    walletAddress: string;
    createDate: string;
    password: string;
    writeDate?: string;
    approveClientFlg: boolean;
    approveNavFlg: boolean;
    approveOrderFlg: boolean;
    approveProductFlg: boolean;
    twoFAFlg?: boolean;
}

export interface ClientModel {
    accountType: string;
    bankAccountName: string;
    bankAccountNumber: string;
    cashTPlus: string;
    countryCd: string;
    createDate: string;
    createUid: string;
    fullName: string;
    id: number;
    tokenTPlus: string;
    walletAddress: string;
    writeDate: string;
    accountId: string;
    approver: string;
    approver_id: number;
    reason: string;
    rejecter: string;
    rejecter_id: number;
    status: string;
    writeUid: string;
    isApprove?: boolean;
    approvedBy: ApproverRejectByModel;
    rejectBy: ApproverRejectByModel;
}

export interface ApproverRejectByModel {
    approveClientFlg: boolean;
    approveNavFlg: boolean;
    approveOrderFlg: boolean;
    approveProductFlg: boolean;
    createDate: string;
    createUid: string;
    email: string;
    id: number;
    password: string;
    roleId: number;
    userRole: string;
    username: string;
    walletAddress: string;
    writeDate: string;
}

export interface CreateUserModel {
    username: string;
    email: string;
    roleId: number;
    password: string;
}

export interface RoleModel {
    createDate: string;
    createUid: number;
    id: number;
    name: string;
    roleCode: string;
    status: boolean;
    writeDate: string;
    menuCd: string;
}

export interface FunctionModel {
    approveFlg: boolean;
    createFlg: boolean;
    createdAt: string;
    id: number;
    menu: MenuModel
    menuId: number;
    readFlg: boolean;
    role: RoleModel
    roleId: number;
    updatedAt: string;
    writeFlg: boolean;
    importFlg: boolean;
}

export interface MenuModel {
    id: number;
    createDate: string;
    createUid: number;
    menuCd: string;
    name: string;
    writeDate: string;
}

export interface UpdateRoleParam {
    roleFunction: Array<UpdateRoleItem>;
}

export interface UpdateRoleItem {
    menuId: number;
    readFlg: boolean;
    writeFlg: boolean;
    createFlg: boolean;
    approveFlg: boolean;
    importFlg: boolean;
    name: string;
    menuCd: string;
}

export interface SettingProps {
    roles: Array<RoleModel>;
}

export interface NavHistory {
    ISINCode: string;
    createDate: string;
    createUid: string;
    id: number;
    nav: string;
    navDate: string;
    productId: number;
    productName: string;
    writeDate: string;
    writeUid: number;
    status: string;
    reason: string;
}

export interface NavProps {
    type: string;
    value: NavHistory;
}

export interface NavFormProps {
    emitListHistoryNav: () => void;
    itemModify: NavProps;
}

export interface NavUpdateParam {
    productId: number;
    nav: string;
    navDate: string;
}

export interface NavTableProps {
    listNavHistory: NavHistory[];
    modifyNav: (nav: NavHistory) => void;
    emitListHistoryNav: () => void;
}

export interface NavRejectParams {
    reason: string;
}

export interface CreateClientParams {
    accountId: string;
    fullName: string;
    accountType: string;
    countryCd: string;
    bankAccountName: string;
    bankAccountNumber: string;
    tokenTPlus: string;
    cashTPlus: string;
}

export interface RejectClientParams {
    reason: string;
}

export interface updateRejectParams {
  accountId: string;
  fullName: string;
  accountType: string;
  countryCd: string;
  bankAccountName: string;
  bankAccountNumber: string;
  tokenTPlus: string;
  cashTPlus: string;
}

export interface ClientProps {
    tabSelected: number;
}