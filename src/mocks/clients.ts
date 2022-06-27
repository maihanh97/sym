import { IListClientContant } from "../interfaces/client.model";
import { UserModel } from "../interfaces/user.model";

export const listCountry: IListClientContant[] = [
  {
    code: '',
    value: ''
  },
  {
    code: 'SG',
    value: 'Singapore'
  },
  {
    code: 'HK',
    value: 'Hongkong'
  },
  {
    code: 'USA',
    value: 'USA'
  },
  {
    code: 'NA',
    value: 'Not applicable'
  }
]

export const UserState: UserModel = {
  approveClientFlg: false,
  approveNavFlg: false,
  approveOrderFlg: false,
  approveProductFlg: false,
  createUid: "",
  email: "",
  id: 0,
  roleId: 0,
  userRole: "",
  username: "",
  roleCode: "",
  walletAddress: "",
  createDate: "",
  password: "",
  writeDate: "",
  fullName: ""
}

export const listAccountType: IListClientContant[] = [
  {
    code: 'r',
    value: 'Retail'
  },
  {
    code: 'c',
    value: 'Corporate'
  }
]

export const listToken: IListClientContant[] = [
  {
    code: 'T+0',
    value: 'T + 0'
  },
  {
    code: 'T+1',
    value: 'T + 1'
  },
  {
    code: 'T+2',
    value: 'T + 2'
  },
]

export const listCash: IListClientContant[] = [
  {
    code: 'T+0',
    value: 'T + 0'
  },
  {
    code: 'T+1',
    value: 'T + 1'
  },
  {
    code: 'T+2',
    value: 'T + 2'
  },
]

export const DEFAULT_CLIENT_INFOR = {
  accountId: '',
  accountType: '',
  approver: '',
  approver_id: '',
  bankAccountName: '',
  bankAccountNumber: '',
  cashTPlus: '',
  countryCd: '',
  createDate: '',
  createUid: 0,
  fullName: '',
  id: 0,
  reason: '',
  rejecter: 0,
  rejecter_id: 0,
  status: '',
  tokenTPlus: '',
  walletAddress: '',
  writeDate: '',
  writeUid: 0
}