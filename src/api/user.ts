import API from './configAPI';
import {
  CreateUserModel,
  CreateClientParams,
  UpdateRoleParam,
  RejectClientParams,
  updateRejectParams
} from "../interfaces/user.model";
import { AppSettings } from './api.setting';
import { getItemLocalStorage } from "../hooks";
import {ROLE_FUNCTION, USER_INFOR} from "../constants";

export default {
  getInfoUser() { //TODO: call api later
    const user: string = getItemLocalStorage(USER_INFOR) || '';
    return user ? JSON.parse(user) : undefined;
  },

  getRoleFunction() {
    const roleStr = getItemLocalStorage(ROLE_FUNCTION) || '';
    return roleStr ? JSON.parse(roleStr) : undefined;
  },

  listRoleFunction() {
    return API.get(AppSettings.API_ROLE_FUNCTION);
  },

  getListClients() {
    return API.get(AppSettings.API_CLIENTS);
  },

  getClientPending() {
    return API.get(AppSettings.API_CLIENTS_PENDING);
  },

  getClientRejected() {
    return API.get(AppSettings.API_CLIENTS_REJECT);
  },

  getClientPendingRejected() {
    return API.get(AppSettings.API_PENDING_REJECT);
  },

  createClient(params: CreateClientParams) {
    return API.post(AppSettings.API_CLIENTS, params);
  },

  approveClient(id: number) {
    return API.post(`${AppSettings.API_CLIENTS}/${id}/approve`, {});
  },

  rejectClient(id: number, params: RejectClientParams) {
    return API.post(`${AppSettings.API_CLIENTS}/${id}/reject`, params);
  },

  updateRejectClient(id: string, params: updateRejectParams) {
    return API.put(`${AppSettings.API_CLIENTS}/${id}`, params);
  },

  getClientById(id: string) {
    return API.get(`${AppSettings.API_CLIENTS}/${id}`);
  },

  createUser(params: CreateUserModel) {
    return API.post(AppSettings.API_USER, params);
  },

  getListUser() {
    return API.get(AppSettings.API_USER);
  },

  getFunctions() {
    return API.get(AppSettings.API_GET_FUNCTIONS);
  },

  getRole() {
    return API.get(AppSettings.API_GET_ROLE);
  },

  getMenu() {
    return API.get(AppSettings.API_GET_MENU);
  },

  getRoleById(id: string) {
    return API.get(`${AppSettings.API_GET_ROLE}/${id}`);
  },

  updateAccessRole(id: string, params: UpdateRoleParam) {
    return API.put(`${AppSettings.API_GET_ROLE}/${id}`, params)
  },

  getListNavHistory() {
    return API.get(AppSettings.API_NAV_HISTORY);
  }
};
