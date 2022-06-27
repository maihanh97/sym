import API from './configAPI';
import {LoginParam} from "../interfaces/user.model";
import { AppSettings } from './api.setting';
import {CheckPwHashModel, ForgotPassModel, ResetPassModel, TwoFaParam} from "../interfaces/auth.model";

export default {
  login(params: LoginParam) {
    const loginParams = {
      username: params.username,
      password: params.password
    };
    return API.post(AppSettings.API_LOGIN, loginParams, {});
  },

  forgotPassword(params: ForgotPassModel) {
    return API.post(AppSettings.API_FORGOT_PASSWORD, params);
  },

  twoFa(params: TwoFaParam) {
    return API.post(AppSettings.API_TWO_FA, params);
  },

  resetPassword(params: ResetPassModel) {
    return API.post(AppSettings.API_RESET_PASSWORD, params);
  },

  checkPasswordHash(params: CheckPwHashModel) {
    return API.post(AppSettings.API_CHECK_PW_HASH, params);
  }
};
