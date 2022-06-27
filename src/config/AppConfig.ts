import { AxiosRequestConfig } from "axios";
import { ENV } from './env';

const axios: AxiosRequestConfig = {
  baseURL: ENV.BASE_URL,
  responseType: 'json',
  timeout: 30000,
}
export default {
  axios
};
