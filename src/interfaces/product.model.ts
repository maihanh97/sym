import {ApproverRejectByModel, UserModel} from "./user.model";

export interface ProductParam {
  productName: string;
  productType: string;
  currencyCode: string;
  countryDomicileCd: string;
  countryDomicileName: string;
  countryTradeCd: string;
  countryTradeName: string;
  ISINCode: string;
  qtyMax: string;
  inceptionDate: string;
  launchPrice: string;
  settTPlus: string;
  tickerCode: string;
  cufOffTime: string;
  id?: number;
  nav: string;
  files: Array<string>;
  orderId?: string;
  writeDate?: string;
  contractAddress?: string;
  approvedBy?: string;
  totalSupply?: string;
}

export interface FundPerformance {
  diffPercent: string;
  different: number;
  nav: number;
  preNav: number;
  preNavDate: string;
  productType: string;
}

export interface TransactionHistoryModel {
  account: UserModel;
  contractAddress: string;
  createDate: string;
  createUid: number;
  currencyCode: string;
  id: number;
  orderDateTime: string;
  orderId: number;
  orderQty: number;
  orderType: string;
  paymentToken: string;
  price: number;
  product: ProductParam;
  productId: number;
  productName: string;
  status: string;
  tradeDateTime: string;
  txnId: string;
  userID: number;
  writeDate: string;
}

export interface TransactionHistoryProps {
  tabSelected: number;
  id: any;
}

export interface ProductsManagementTabContextProps {
  tabSelected: number;
}

export interface IssuanceModel {
  ISINCode: string;
  active?: boolean;
  approvedBy?: UserModel;
  approver?: string;
  contractAddress?: string;
  countryDomicileCd: string;
  countryDomicileName: string;
  countryTradeCd: string;
  countryTradeName: string;
  createDate: string;
  createUid?: string;
  cufOffTime: string;
  currencyCode: string;
  files: string[];
  fundAccountant?: string;
  id?: number;
  inceptionDate: string;
  launchPrice: string;
  nav: number;
  productManager?: string;
  productName: string;
  productType: string;
  qtyMax: string;
  settTPlus: string;
  status?: string;
  transferAgentCode: string;
  tickerCode: string;
  tickerId?: string;
  writeDate: string;
  writeUid?: string;
  isApprove?: boolean;
  isReject?: boolean;
  orderId?: string;
  rejectBy?: ApproverRejectByModel;
  rejecter?: number;
  umbrellaFund: string;
  class: string;
  trustee: string;
  fundAdmin: string;
  transferAgent: string;
  custodian: string;
  auditor: string;
  taxAgent: string;
  reason?: string;
}

export interface IssuanceRejectParams {
  reason: string;
}

export interface IssuanceProps {
  isLoad: boolean;
  modifyProduct: (item: IssuanceModel) => void;
}

export interface NewProductFormProps {
  checkIsCreateDone: () => void;
  typeModify: string;
  itemModify: IssuanceModel;
  isModify: boolean;
}

export interface IHolderList {
  clientName: string;
  navHolding: string;
  percentHolding: number;
  unit: string;
  walletAddress: string;
}

export interface IHolderListProps {
  tabSelected: number;
  id: string;
}

export interface FundProductivityProps {
  tabSelected: number;
  id: any;
}

export interface ProductAUMTrendsProps {
  tabSelected: number;
  tabFundSelected: number;
  id: any;
}

export interface ProductPurchaseActivitiesProps {
  tabSelected: number;
  tabFundSelected: number;
  id: any;
}
