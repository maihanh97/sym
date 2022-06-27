import {IssuanceModel} from "../interfaces/product.model";
import moment from "moment";
import { FORMATDATE } from "../constants";

export const ProductState: IssuanceModel = {
  createDate: "",
  writeDate: "",
  auditor: "",
  class: "",
  custodian: "",
  fundAdmin: "",
  taxAgent: "",
  transferAgent: "",
  transferAgentCode: "",
  trustee: "",
  umbrellaFund: "",
  productName: '',
  productType: '',
  currencyCode: '',
  countryDomicileCd: '',
  countryDomicileName: '',
  countryTradeCd: '',
  countryTradeName: '',
  ISINCode: '',
  qtyMax: '',
  inceptionDate: moment().format('YYYY-MM-DD'),
  launchPrice: '',
  settTPlus: '',
  tickerCode: '',
  cufOffTime: moment().format('HH:mm:ss'),
  nav: 0,
  files: []
};

export const NavUpdateInit = {
  productId: 0,
  nav: "",
  navDate: moment().format(FORMATDATE),
}

export const TYPE_COUNTRY_TRADE_CODE = 'countryTradeCd';
export const TYPE_COUNTRY_DOMICILE_CODE = 'countryDomicileCd';

export const HeadersTransactionHistory = [
  { label: "TXN ID", key: "txnId" },
  { label: "Timestamp", key: "orderDateTime" },
  { label: "Contract Address", key: "product.contractAddress" },
  { label: "Initiator", key: "account.fullName" },
  { label: "Product Name", key: "product.productName" },
  { label: "ISIN", key: "product.ISINCode" },
  { label: "Order Type", key: "orderType" },
  { label: "Number of Units/Shares", key: "orderQty" },
  { label: "Status", key: "status" }
];

export const HeadersProductAUMTrends = [
  { label: "Date", key: "date" },
  { label: "AUM($)", key: "aum" },
];

export const HeadersMacroViewAUMFunds = [
  { label: "Fund Name", key: "product.productName" },
  { label: "Fund Type", key: "product.productType" },
  { label: "Class", key: "product.class" },
  { label: "Date", key: "date" },
  { label: "AUM($)", key: "aum" },
];

export const HeadersMacroViewPurchaseActivities = [
  { label: "Product", key: "product.productName" },
  { label: "Class", key: "product.class" },
  { label: "Date", key: "activityDate" },
  { label: "CCY", key: "product.currencyCode" },
  { label: "Total Number of Shares Subscribed", key: "subscriptionUnits" },
  { label: "Total Notional Amount (Subscribed)", key: "subscriptionAmount" },
  { label: "Total Number of Shares Redeemed", key: "redemptionUnits" },
  { label: "Total Notional Amount (Redeemed)", key: "redemptionAmount" },
  { label: "Net Subscription/ Redemption", key: "netSubRedUnits" },
  { label: "Net Notional Amount", key: "netSubRedAmount" },
];

export const HeadersProductPurchaseStats = [
  { label: "Date", key: "activityDate" },
  { label: "Total Number of Shares Subscribed", key: "subscriptionUnits" },
  { label: "Total Notional Amount (Subscribed)", key: "subscriptionAmount" },
  { label: "Total Number of Shares Redeemed", key: "redemptionUnits" },
  { label: "Total Notional Amount (Redeemed)", key: "redemptionAmount" },
  { label: "Net Subscription/ Redemption", key: "netSubRedUnits" },
  { label: "Net Notional Amount", key: "netSubRedAmount" }
];