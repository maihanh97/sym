import moment from "moment";
import { FORMATDATE } from "../constants";


export const NavModify = {
  ISINCode: "",
  createDate: "",
  createUid: "",
  id: 0,
  nav: "",
  productId: 0,
  navDate: moment().format(FORMATDATE),
  productName: "",
  reason: "",
  status: "",
  writeDate: "",
  writeUid: 0
}

export const HeadersNavStatus = [
  { label: "Fund Name", key: "productName" },
  { label: "Update Date", key: "writeDate" },
  { label: "ISIN", key: "ISINCode" },
  { label: "NAV Input", key: "nav" },
  { label: "Status", key: "status" },
];