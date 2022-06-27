import {user} from "../api";
import {RoleFunction} from "../constants";
import { IListClientContant } from "../interfaces/client.model";
import {FunctionModel} from "../interfaces/user.model";
import { listAccountType, listCountry } from "../mocks/clients";

export function checkUserAdmin() {
  const userInfo = user.getInfoUser();
  return userInfo?.roleCode === RoleFunction.pcm_admin;
}

export function getRoleByScreen(roleCd: string) {
  const roleFunction: FunctionModel[] = user.getRoleFunction() || [];
  return roleFunction.find(func => func?.menu?.menuCd === roleCd);
}

export function getCountryName(clientItem: string) {
  return listCountry.find((item: IListClientContant) => item.code === clientItem)?.value
}

export function getAccountType(accountType: string) {
  return listAccountType.find((item: IListClientContant) => item.code === accountType)?.value
}

export function roundFloat(num: number) {
  return Math.round(num * 100) / 100
}