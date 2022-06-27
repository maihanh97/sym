import API from './configAPI';
import {AppSettings} from './api.setting';
import {UpdateApproveParams} from "../interfaces/setting.model";

export default {
  getApproveProduct() {
    return API.get(AppSettings.API_APPROVE_PRODUCT);
  },

  getApproveClient() {
    return API.get(AppSettings.API_APPROVE_CLIENT);
  },

  getApproveOrder() {
    return API.get(AppSettings.API_APPROVE_ORDER);
  },

  getApproveNav() {
    return API.get(AppSettings.API_APPROVE_NAV);
  },

  updateApprove(params: UpdateApproveParams) {
    return API.put(AppSettings.API_UPDATE_APPROVE, params);
  }
};
