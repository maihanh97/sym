import { IssuanceModel } from "./product.model";

export interface PurchaseActivitiesModel {
  product: IssuanceModel;
  activityDate: string;
  subscriptionUnits: number;
  subscriptionAmount: number;
  redemptionUnits: number;
  redemptionAmount: number;
  netSubRedUnits: number;
  netSubRedAmount: number;
}

export interface ProductPurchaseModel {
  activityDate: string;
  subscriptionUnits: number;
  subscriptionAmount: number;
  redemptionUnits: number;
  redemptionAmount: number;
  netSubRedUnits: number;
  netSubRedAmount: number;
}

export interface PurchaseActivitiesParam {
  fromDate: string;
  toDate: string;
}
