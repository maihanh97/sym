import API from './configAPI';
import { AppSettings } from './api.setting';
import { ApproveOrder, SellBuyUnitForm, RejectOrderParam, OrderTransactionHistoryParam } from "../interfaces/order.model";

export default {
  getOrderPending() {
    return API.get(AppSettings.API_ORDER_PENDING);
  },

  getOrderExecute() {
    return API.get(AppSettings.API_ORDER_EXECUTED);
  },

  sellOrder(params: SellBuyUnitForm) {
    return API.post(AppSettings.API_ORDER_SELL, params);
  },

  buyOrder(params: SellBuyUnitForm) {
    return API.post(AppSettings.API_ORDER_BUY, params);
  },

  approveBuyOrder(params: ApproveOrder) {
    return API.post(AppSettings.API_APPROVE_BUY_ORDER, params);
  },

  approveSellOrder(params: ApproveOrder) {
    return API.post(AppSettings.API_APPROVE_SELL_ORDER, params);
  },

  rejectOrder(params: RejectOrderParam) {
    return API.post(AppSettings.API_REJECT_ORDER, params);
  },

  getOrderTransactionHistory(params: OrderTransactionHistoryParam) {
    return API.get(`${AppSettings.API_ORDER_HISTORY}`, {params});
  },

  updateOrder(id: number, params: SellBuyUnitForm) {
    return API.put(`${AppSettings.API_ORDER}/${id}`, params);
  },

  getListFailedOrder() {
    return API.get(AppSettings.API_REJECT_ORDER);
  }
}