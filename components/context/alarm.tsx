'use client'

import { Alarm, Event } from '@/types'
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react'
import { useUserContext } from './user'
import useAlarmQuery from '@/features/alarm/useAlarmQuery'
import { useAppSelector } from '@/lib/redux/hooks'
import { client } from '@/lib/sse/client'
import { requestCommunityRefresh } from '@/features/community/utils/sync'
import { useQueryClient } from '@tanstack/react-query'
import { ONLINE_ASSET_QUERY_KEY } from '@/features/asset/summary/hooks/useOnlineAssetsQuery'
import { ASSET_SUMMARY_QUERY_KEY } from '@/features/asset/summary/hooks/useAssetSummaryQuery'
import { ASSET_TRANSACTION_QUERY_KEY } from '@/features/transaction/hooks/useAssetTransactionsQuery'

interface AlarmContextType {
  receiveNotifications(type?: keyof Event.Namespace): Promise<Alarm.Context>
  notifications: Alarm.Context
  markNotificationAsRead(id: string): void
  markNotificationsAsRead(ids: string[]): void
  dismissNotification(id: string): void
}

const AlarmContext = createContext<AlarmContextType | undefined>(undefined)
export const QUERY_ALARM_KEY = ['alarm']

const AlarmProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient()
  const { isAuthenticated } = useUserContext()
  const isLoggedIn = useAppSelector((state) => state.auth.domain.account.status.isLoggedIn)
  const token = useAppSelector((state) => state.auth.domain.account.token)

  const page = useRef(1)
  const communityRefreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const assetRefreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [subscribe, setSubscribe] = useState(true)

  const { cache } = useAlarmQuery(() => isAuthenticated, subscribe, 0, isLoggedIn)
  const [notifications, setNotifications] = useState<Alarm.Context>({ noti: [] })

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => ({
      noti: prev.noti.map((n) => {
        if (n.id !== id) {
          return n
        }
        return {
          ...n,
          event: {
            ...n.event,
            meta: {
              ...n.event.meta,
              isRead: true,
            },
          },
        }
      }),
    }))
  }

  const markNotificationsAsRead = (ids: string[]) => {
    const targetIds = new Set(ids)
    setNotifications((prev) => ({
      noti: prev.noti.map((n) => {
        if (!targetIds.has(n.id)) {
          return n
        }
        return {
          ...n,
          event: {
            ...n.event,
            meta: {
              ...n.event.meta,
              isRead: true,
            },
          },
        }
      }),
    }))
  }

  const dismissNotification = (id: string) => {
    setNotifications((prev) => ({
      noti: prev.noti.map((n) => (n.id === id ? { ...n, isDismissing: true } : n)),
    }))

    setTimeout(() => {
      setNotifications((prev) => ({
        noti: prev.noti.filter((n) => n.id !== id),
      }))
    }, 320)
  }

  useEffect(() => {
    if (!isLoggedIn) {
      setNotifications({ noti: [] })
    }
  }, [isLoggedIn])

  useEffect(() => {
    if (!isLoggedIn || !token) {
      return
    }

    const scheduleCommunityRefresh = () => {
      if (communityRefreshTimer.current) {
        clearTimeout(communityRefreshTimer.current)
      }
      communityRefreshTimer.current = setTimeout(() => {
        requestCommunityRefresh()
      }, 250)
    }

    const scheduleAssetRefresh = () => {
      if (assetRefreshTimer.current) {
        clearTimeout(assetRefreshTimer.current)
      }
      assetRefreshTimer.current = setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ONLINE_ASSET_QUERY_KEY })
        queryClient.invalidateQueries({ queryKey: ASSET_SUMMARY_QUERY_KEY })
        queryClient.invalidateQueries({ queryKey: ASSET_TRANSACTION_QUERY_KEY })
      }, 250)
    }

    const unsubscribe = client({
      api: '/sse/subscribe',
      event: (alarm) => {
        const incoming = alarm?.noti ? alarm.noti : [alarm]
        const shouldRefreshCommunity = incoming.some((n) => {
          const action = n?.event?.action?.toLowerCase()
          const type = n?.event?.type?.toLowerCase()
          return action === 'invite' || type === 'group'
        })
        const shouldRefreshAssets = incoming.some((n) => {
          const type = n?.event?.type?.toLowerCase()
          return type === 'transaction'
        })
        const normalized = incoming.map((n) => ({
          ...n,
          isNew: true,
          createdAt: n?.createdAt ?? n?.timestamp ?? new Date().toISOString(),
        }))
        setNotifications((prev) => ({
          noti: normalized.concat(prev.noti),
        }))
        if (shouldRefreshCommunity) {
          scheduleCommunityRefresh()
        }
        if (shouldRefreshAssets) {
          scheduleAssetRefresh()
        }
        setTimeout(() => {
          setNotifications((prev) => ({
            noti: prev.noti.map((n) => ({ ...n, isNew: false })),
          }))
        }, 3000)
      },
    })

    return () => {
      if (communityRefreshTimer.current) {
        clearTimeout(communityRefreshTimer.current)
      }
      if (assetRefreshTimer.current) {
        clearTimeout(assetRefreshTimer.current)
      }
      unsubscribe()
    }
  }, [isLoggedIn, queryClient, token])

  const receiveNotifications = async (type?: keyof Event.Namespace): Promise<Alarm.Context> => {
    const alarm = await cache(page.current)
    setNotifications(alarm)

    if (type === undefined) {
      return alarm
    }

    return {
      noti: alarm.noti.filter((n) => n.event.type === type),
    }
  }

  return (
    <AlarmContext.Provider
      value={{
        receiveNotifications,
        notifications,
        markNotificationAsRead,
        markNotificationsAsRead,
        dismissNotification,
      }}
    >
      {children}
    </AlarmContext.Provider>
  )
}

export const useAlarmContext = () => {
  const context = useContext(AlarmContext)
  if (context === undefined) {
    throw new Error('useAlarmContext must be used within an AlarmProvider')
  }
  return context
}

export default AlarmProvider
export { AlarmContext }
