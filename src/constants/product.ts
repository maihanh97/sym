export const TAB_FUND_PERFORMANCE = 0;
export const TAB_TRANSACTION_HISTORY = 1;
export const TAB_HOLDER_LIST = 2;
export const TAB_FUND_PRODUCTIVITY = 3;

export const TAB_SUB_RED_STAT = 0;
export const TAB_AUM_TRENDS = 1;

export const TAB_PRODUCT_SELECTOR = 0;
export const TAB_MACRO_VIEW = 1;

export const HeaderIssuance = {
  create: 'Issue New Fund',
  modify: 'Modify New Fund',
  request: 'New Fund Request'
}

export enum ActionType {
  CREATE = 'Create',
  UPDATE = 'Update',
}

export const ProductStatus = {
  approved: 'approved',
  pending: 'pending',
  rejected: 'rejected'
}

export const HeaderHolderList = [
  { label: "ADDRESS", key: "walletAddress" },
  { label: "NAME", key: "clientName" },
  { label: "UNITS", key: "unit" },
  { label: "% HOLDINGS", key: "percentHolding" },
  { label: "NAV OF HOLDINGS", key: "navHolding" },
];