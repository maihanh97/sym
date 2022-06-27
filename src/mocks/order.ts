import {ProductState} from "./products-selector";
import {UserState} from "./clients";

export const OrderModify = {
  account: UserState,
  contractAddress: "",
  createDate: "",
  createUid: 0,
  currencyCode: "",
  id: 0,
  isSubmit: false,
  orderDateTime: "",
  orderId: 0,
  orderQty: 0,
  orderType: "",
  paymentToken: "",
  price: 0,
  product: ProductState,
  productId: 0,
  productName: "",
  sellToken: "",
  settlementComment: "",
  status: "",
  tradeDateTime: "",
  transactionalValue: 0,
  writeDate: "",
  cutOffTime: "",
  orderReason: "",
  settDate: "",
  transactionTradeDate: "",
  txnId: "",
  userID: 0
}

export const OrderModifyState = {
  type: "",
  value: OrderModify,
  tabForm: 0,
  tabList: 0,
}

export const HeadersOrder = [
  { label: "Order Date", key: "orderDateTime" },
  { label: "Order ID", key: "orderId" },
  { label: "Fund Name", key: "productName" },
  { label: "Account", key: "account.walletAddress" },
  { label: "Order Type", key: "orderType" },
  { label: "ISIN", key: "product.ISINCode" },
  { label: "Transactional Value", key: "transactionalValue" },
  { label: "Number of Units/Shares", key: "orderQty" },
  { label: "Status", key: "status" }
];
