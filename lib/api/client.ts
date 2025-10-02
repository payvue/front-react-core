import APPLICATION_ERROR_CODE from "@/constants/error";
import { LOCAL_STORAGE_KEY } from "@/constants/localStorage";
import { getLocalStorageItem } from "@/util/localStorage";

import axios, { AxiosError, AxiosRequestConfig, Method } from 'axios';
import { REQUEST_URL } from '@/constants';



axios.defaults.baseURL = process.env.NEXT_PUBLIC_PAYVUE_API_URI;

const STATUS_CODE = {
  INTERNAL_SERVER_ERROR: 500,
};

const isAxiosError = (error: any): error is AxiosError => {
  return error.isAxiosError;
};

const isNoAuthorizationRequired = (path: string) => {
  return Object.values(REQUEST_URL.PUBLIC).includes(path)
};

const request = async (config: AxiosRequestConfig) => {
  try {
    const response = await axios(config);

    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      if (!error.response) {
        throw { code: APPLICATION_ERROR_CODE.NETWORK_ERROR, message: 'Network Error' };
      }

      if (error.response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
        throw {
          code: APPLICATION_ERROR_CODE.INTERNAL_SERVER_ERROR,
          message: 'internal server error',
        };
      }

      throw error.response?.data;
    }
  }
};

axios.interceptors.request.use(
  (config) => {
    if (!config.headers.Authorization || isNoAuthorizationRequired(config.url as string)) {
      const token = getLocalStorageItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN);

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default request