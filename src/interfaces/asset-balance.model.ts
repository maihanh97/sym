import { IssuanceModel } from "./product.model";

export interface AssetBalanceModel {
  id: number;
  product: IssuanceModel;
  valuationDate: string;
  productId: number;
  netValue: number;
  createDate: string;
  createUid?: string;
  writeDate: string;
  writeUid?: string;
}

export interface AUMFundsParam {
  fromDate: string;
  toDate: string;
}

export interface ProductAUMTrends {
  date: string;
  aum: number;
}

export interface AUMFundsModel {
  product: IssuanceModel;
  date: string;
  aum: number;
}