import { REQUEST_URL } from '@/constants'
import request from '@/lib/api/client'
import APIResponse from '@/lib/api/types/response'
import { Alarm } from '@/types'
import { Method } from 'axios'

interface AlarmAPI {
  paginated: (page: number) => Promise<APIResponse<Alarm.Context>>
  markAsRead: (alarmId: string) => Promise<APIResponse<void>>
  markAllAsRead: (alarmIds: string[]) => Promise<APIResponse<void>[]>
  processInviteAction: (alarmId: string, action: 'accept' | 'reject') => Promise<APIResponse<void>>
}

const useAlarmAPI = (): AlarmAPI => {
  const paginated = async (page: number) => {
    return request({
      method: 'GET' as Method,
      url: `${REQUEST_URL.PRIVATE.GET_RECEIVED}/${page}`,
    })
  }

  const markAsRead = async (alarmId: string) => {
    return request({
      method: 'PUT' as Method,
      url: `/alarm/${encodeURIComponent(alarmId)}/read`,
    }) as Promise<APIResponse<void>>
  }

  const markAllAsRead = async (alarmIds: string[]) => {
    const targets = alarmIds.filter(Boolean)
    if (targets.length === 0) return []
    return Promise.all(targets.map((id) => markAsRead(id)))
  }

  const processInviteAction = async (alarmId: string, action: 'accept' | 'reject') => {
    return request({
      method: 'PUT' as Method,
      url: `${REQUEST_URL.PRIVATE.GET_RECEIVED}/${encodeURIComponent(alarmId)}`,
      params: {
        action,
      },
    }) as Promise<APIResponse<void>>
  }

  return {
    paginated,
    markAsRead,
    markAllAsRead,
    processInviteAction,
  }
}

export default useAlarmAPI
