export const OrderTabList = {
  1: 'Pending Open Order',
  2: 'Failed Order',
  3: 'Execute Order',
  4: 'Pending Cash Settlement'
};

export const TAB_PENDING_OPEN_ORDER = 0;
export const TAB_FAILED_ORDER = 1;
export const TAB_EXECUTED_ORDER = 2;
export const TAB_BALANCE = '1';
export const TAB_QUANTITY = '2';

export const TAB_REDEMPTION = 1;
export const TAB_SUBCRIPTION = 0;
export const FORMAT_DATE = 'YYYYMMDD';

export const BuySellOrderState = {
  productId: 0,
  amount: 0,
  numberUnit: 0,
  customerId: 0,
  settDate: '',
  transactionTradeDate: '',
  cutOffTime: ''
}

export enum OrderType {
   REDEMTION  =  'Redemption',
   SUBCRIPTION  = 'Subscription'
}

export const OrderStatus = {
  rejected: 'rejected',
  pending: 'pending',
  approved: 'approved'
}