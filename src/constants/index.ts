export const myTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
export const FORMATDATE_HH_MM_SS = 'DD-MMM-YYYY HH:mm:ss';
export const FORMATDATE_DD_MMM_YYYY = 'DD-MMM-YYYY';
export const FORMATDATE = 'YYYY-MM-DD';
export const FORMATDATE_yyyy_MM_dd = 'yyyy-MM-dd';
export const FORMATDATE_DD_MMM_YY = "DD-MMM-YY"
export const HH_MM_SS = 'HH:mm:ss';
export const FILE_FORMATDATE = 'YYYYMMDD';
export const TYPE_SELECT_PRODUCT = 'productId';
export const PAGE_COUNT_SELECTION = [10, 20, 30, 40, 50];
export const PASSWORD_POLICY = "Minimum 8 alphanumeric characters, consists of at least capital letter (Uppercase char) and a special symbol";
export const REGEX_PASSWORD =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&,.\-"#'\(\)\+\/:;<=>\[\]\^_`{\|}~\\])[A-Za-z\d@$!%*?&,.\-"#'\(\)\+\/:;<=>\[\]\^_`{\|}~\\]{8,}$/;
export const REGEX_STRING_INPUT = /^(?![=+-@]).*/

export enum AccountType {
  RETAIL = 'Retail',
  CORPORATE = 'Corporate'
}

export enum NationalityCode {
  HK = 'Hong Kong',
  SG = 'Singapore',
  USA = 'USA',
  NA = 'Not applicable'
}

export const RoleFunction = {
  view_product: 'pm',
  view_client: 'cm',
  view_issuance: 'is',
  view_order: 'om',
  view_nav: 'nu',
  view_audit: 'al',
  view_asset: 'am',
  pcm_admin: 'pa'
}

export const ListRoleAllowCreate = ['cm', 'is', 'om', 'nu'];
export const ListRoleAllowWrite = ['cm', 'is', 'om', 'nu'];
export const ListRoleAllowApprove = ['cm', 'is', 'om', 'nu'];
export const ListRoleAllowImport = ['pm', 'nu'];

export const ACCESS_TOKEN = 'accessToken';
export const USER_INFOR = 'user';
export const ROLE_FUNCTION = 'roleFunction';
export const REMEMBER_LOGIN = 'rememberme';

export * as ORDER from './orders';
export * as PRODUCT from './product';

export enum AccountStatus {
  PENDING = 'pending',
  REJECTED = 'rejected',
  APPROVE = 'approved'
}

export const IDLE_TIME_COUNT = 60000