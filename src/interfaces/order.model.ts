import {IssuanceModel, ProductParam} from "./product.model";
import {ClientModel, UserModel} from "./user.model"

export interface SellBuyUnitForm {
  productId: number;
  amount: number;
  numberUnit: number;
  customerId: number;
  settDate: string;
  transactionTradeDate: string;
  cutOffTime: string;
}

export interface OrderPending {
  orderQty: number
  contractAddress: string;
  createDate: string;
  createUid: number;
  currencyCode: string;
  id: number;
  orderId: number;
  paymentToken: string;
  price: number;
  product: IssuanceModel;
  productId: number;
  productName: string;
  sellToken: string;
  account: UserModel;
  status: string;
  orderType: string;
  orderDateTime: string;
  writeDate: string;
  settlementComment: string;
  tradeDateTime: string;
  transactionalValue: number;
  isSubmit: boolean;
  cutOffTime: string;
  orderReason: string;
  settDate: string;
  transactionTradeDate: string;
  txnId: string;
  userID: number;
}

export interface OrderProps {
  listProduct?: any;
  isSwitchTab: boolean;
  isLoadListAgain: () => void;
  clients: Array<ClientModel>;
  orderModify: OrderModifyModel;
  resetOrder: () => void;
  tabSelected: number;
}

export interface OrderModifyModel {
  type: string;
  value: OrderPending;
  tabForm: number;
  tabList: number;
}

export interface OrderPendingProps {
  tabSelected: number;
  isTabBuyUnit: number;
  isLoadAgain: boolean;
  getOrderModify: (order: OrderPending) => void;
}

export interface ApproveOrder {
  orderId: number;
}

export interface RejectOrderParam {
  orderId: number;
  reason: string;
}

export interface FailedOrderProps {
  isLoadAgain: boolean
  isTabBuyUnit: number
  tabSelected: number;
  getOrderModify: (order: any) => void;
}

export interface RejectOrderModel {
  account: UserModel;
  createDate: string;
  createUid: number;
  currencyCode: string;
  id: number;
  orderDateTime: string;
  orderId: string;
  orderQty: number;
  orderReason: string;
  orderType: string;
  price: number;
  product: ProductParam;
  productId: number;
  productName: string;
  status: string;
  tradeDateTime: string;
  transactionalValue: number;
  txnId: string;
  userID: number;
  writeDate: string;
}

export interface OrderTransactionHistoryParam {
  fromDate: string;
  toDate: string;
}