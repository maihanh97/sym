export interface ForgotPassModel {
  username: string;
  email: string;
}

export interface TwoFaParam {
  username: string;
  twoFAKey: string;
}

export interface ResetPassModel {
  email: string;
  forgotHash: string;
  password: string;
}

export interface CheckPwHashModel {
  email: string;
  forgotHash: string;
}