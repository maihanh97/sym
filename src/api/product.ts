import API from './configAPI';
import { AppSettings } from './api.setting';
import { IssuanceRejectParams, ProductParam} from "../interfaces/product.model";
import {IssuanceModel} from "../interfaces/product.model";
import {NavRejectParams, NavUpdateParam} from "../interfaces/user.model";
import { AUMFundsParam } from '../interfaces/asset-balance.model';
import { PurchaseActivitiesParam } from '../interfaces/purchase.model';

export default {
  createNewProduct(productParam: IssuanceModel) {
    return API.post(AppSettings.API_PRODUCT, productParam);
  },

  updateProduct(id: number, productParam: IssuanceModel) {
    return API.put(`${AppSettings.API_PRODUCT}/${id}`, productParam);
  },

  getListProducts() {
    return API.get(AppSettings.API_PRODUCT);
  },

  getProductDetail(id: any) {
    return API.get(`${AppSettings.API_PRODUCT}/${id}`);
  },

  getFundPerformance(id: any) {
    return API.get(`${AppSettings.API_PRODUCT}/${id}/fund-performance`);
  },

  getTransactionHistory(id: any, params: any) {
    return API.get(`${AppSettings.API_PRODUCT}/${id}/trans-history`, {params: params});
  },

  getHolderList(id: string) {
    return API.get(`${AppSettings.API_PRODUCT}/${id}/holders`);
  },

  getListProductApproved() {
    return API.get(`${AppSettings.API_PRODUCT_APPROVED}`);
  },

  getListProductPending() {
    return API.get(AppSettings.API_PRODUCT_PENDING);
  },

  getListProductRejected() {
    return API.get(AppSettings.API_PRODUCT_REJECTED);
  },

  approveProduct(id: number) {
    return API.post(`${AppSettings.API_PRODUCT}/${id}/approve`, {});
  },

  rejectProduct(id: number, params: IssuanceRejectParams) {
    return API.post(`${AppSettings.API_PRODUCT}/${id}/reject`, params);
  },

  checkNav(param: NavUpdateParam) {
    return API.post(AppSettings.API_CHECK_NAV, param);
  },

  submitNav(param: NavUpdateParam) {
    return API.post(AppSettings.API_UPDATE_NAV, param);
  },

  updateNav(id: number, params: NavUpdateParam) {
    return API.put(`${AppSettings.API_NAV_REQUEST}/${id}`, params);
  },

  approveNav(id: number) {
    return API.post(`${AppSettings.API_NAV_REQUEST}/${id}/approve`, {});
  },

  rejectNav(id: number, params: NavRejectParams) {
    return API.post(`${AppSettings.API_NAV_REQUEST}/${id}/reject`, params);
  },

  getAumFunds(params: AUMFundsParam) {
    return API.get(`${AppSettings.API_AUM_FUNDS}`, {params});
  },

  getProductAumFunds(id: number, params: AUMFundsParam) {
    return API.get(`${AppSettings.API_PRODUCT}/${id}/asset-balance`, {params});
  },

  getPurchaseActivities(params: PurchaseActivitiesParam) {
    return API.get(`${AppSettings.API_ACTIVITIES}`, {params});
  },

  getProductPurchaseActivities(id: number, params: PurchaseActivitiesParam) {
    return API.get(`${AppSettings.API_PRODUCT}/${id}/activities`, {params});
  },
};
