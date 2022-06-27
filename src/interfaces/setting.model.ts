import {UserModel} from "./user.model";

export interface MainApprovalProps {
  tabSelected: number;
}

export interface ManageApproveProps {
  heading: string;
  type: string;
  users: Array<UserModel>;
  updateApproveDone: (type: string) => void;
}

export interface UpdateApproveParams {
  approveProductFlg?: boolean;
  approveClientFlg?: boolean;
  approveOrderFlg?: boolean;
  approveNavFlg?: boolean;
  userId: number;
}