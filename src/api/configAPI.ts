import axios from 'axios';
import AppConfig from '../config/AppConfig';
import { getItemLocalStorage } from "../hooks";
import { ACCESS_TOKEN } from "../constants";
const client = axios.create(AppConfig.axios);

const configHeader = () => {
  return {
    headers: {
      'Authorization': `Bearer ${getItemLocalStorage(ACCESS_TOKEN)}`
    }
  }
}

const myClient = {
  post(endpoint: string, mParams: any, config?: any) {
    return client.post(endpoint, mParams, {...config, ...configHeader()});
  },
  put(endpoint: string, mParams: any, config?: any) {
    return client.put(endpoint, mParams, {...config, ...configHeader()});
  },
  get(endpoint: string, config?: any) {
    return client.get(endpoint, {...config, ...configHeader()});
  },
  delete(endpoint: string, config?: any) {
    return client.delete(endpoint, {...config, ...configHeader()});
  },
};

export default myClient;
