import APPLICATION_ERROR_CODE from '@/constants/error'

import axios, { AxiosError, AxiosRequestConfig, Method } from 'axios'
import { REQUEST_URL } from '@/constants'
import { store } from '@/lib/store/store'



axios.defaults.baseURL = process.env.NEXT_PUBLIC_PAYVUE_API_URI
axios.defaults.withCredentials = true

const STATUS_CODE = {
  INTERNAL_SERVER_ERROR: 500,
}

const isAxiosError = (error: any): error is AxiosError => {
  return error.isAxiosError
}

const isNoAuthorizationRequired = (path: string) => {
  return Object.values(REQUEST_URL.PUBLIC).includes(path)
}

const request = async (config: AxiosRequestConfig) => {
  try {
    const response = await axios(config)

    return {
      data: response.data,
      headers: response.headers,
      ...response.data,
    }
  } catch (error) {
    if (isAxiosError(error)) {
      if (!error.response) {
        throw { code: APPLICATION_ERROR_CODE.NETWORK_ERROR, message: 'Network Error' }
      }

      if (error.response.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
        throw {
          code: APPLICATION_ERROR_CODE.INTERNAL_SERVER_ERROR,
          message: 'internal server error',
        }
      }

      throw error.response?.data
    }
  }
}

axios.interceptors.request.use(
  (config) => {
    if (!config.url || isNoAuthorizationRequired(config.url)) {
      return config
    }

    const token = store.getState().auth.domain.account.token
    if (token) {
      if (!config.headers) {
        config.headers = {}
      }
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

export default request
