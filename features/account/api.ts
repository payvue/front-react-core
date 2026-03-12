import { REQUEST_URL } from '@/constants'
import request from '@/lib/api/client'
import APIResponse from '@/lib/api/types/response'
import { Method } from 'axios'

interface AccountAPI {
  signup: <T>(data: T) => Promise<APIResponse>
  exist: (data: { email: string }) => Promise<APIResponse>
  info: () => Promise<APIResponse>
  edit: ({}: { email: string; alias: string }) => Promise<APIResponse>
  changepassword: ({}: { origin: string; changed: string }) => Promise<APIResponse>
  findid: (data: { email: string }) => Promise<APIResponse>
  resetPassword: (data: { email: string; username: string }) => Promise<APIResponse>
}

const useAccountAPI = (): AccountAPI => {
  const signup = <T>(data: T) => {
    return request({
      method: 'POST' as Method,
      url: REQUEST_URL.PUBLIC.SIGNUP,
      data,
    })
  }

  const exist = async (data: { email: string }) => {
    return request({
      method: 'POST' as Method,
      url: REQUEST_URL.PRIVATE.EXIST,
      data,
    })
  }

  const info = async () => {
    return request({
      method: 'GET' as Method,
      url: REQUEST_URL.PRIVATE.INFO,
    })
  }

  const edit = async (data: { email: string; alias: string }) => {
    return request({
      method: 'PUT' as Method,
      url: REQUEST_URL.PRIVATE.EDIT,
      data,
    })
  }

  const changepassword = async (data: { origin: string; changed: string }) => {
    return request({
      method: 'PUT' as Method,
      url: REQUEST_URL.PRIVATE.CHANGEPW,
      data,
    })
  }

  const findid = async (data: { email: string }) => {
    return request({
      method: 'POST' as Method,
      url: REQUEST_URL.PUBLIC.FINDID,
      data,
    })
  }

  const resetPassword = async (data: { email: string; username: string }) => {
    return request({
      method: 'POST' as Method,
      url: REQUEST_URL.PUBLIC.RESET_PASSWORD,
      data,
    })
  }

  return {
    signup,
    exist,
    info,
    edit,
    changepassword,
    findid,
    resetPassword,
  }
}

export default useAccountAPI
