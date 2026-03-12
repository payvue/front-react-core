import { useEffect, useState } from 'react'
import { Bell, Clock, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useAlarmContext } from '../context/alarm'
import { getNotificationIcon } from './style'
import { formatCurrency, formatTimestamp } from '@/util/display'
import useAlarmAPI from '@/features/alarm/api'
import { requestCommunityRefresh } from '@/features/community/utils/sync'

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const {
    receiveNotifications,
    notifications,
    markNotificationAsRead,
    markNotificationsAsRead,
    dismissNotification,
  } = useAlarmContext()
  const alarmAPI = useAlarmAPI()

  const load = async () => {
    if (isLoading || !hasMore) return
    setIsLoading(true)
    try {
      const alarm = await receiveNotifications()
      if (alarm?.noti) {
        setHasMore(alarm.noti.length > 0)
      }
    } catch (error) {
      console.error('추가 알림 로드 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const unreadCount = notifications.noti.filter((n) => !n.event.meta.isRead).length

  const markAsRead = async (id: string) => {
    try {
      await alarmAPI.markAsRead(id)
      markNotificationAsRead(id)
    } catch (error) {
      console.error('알림 읽음 처리 실패:', error)
    }
  }

  const markAllAsRead = async () => {
    const unreadIds = notifications.noti.filter((n) => !n.event.meta.isRead).map((n) => n.id)
    if (unreadIds.length === 0) return
    try {
      await alarmAPI.markAllAsRead(unreadIds)
      markNotificationsAsRead(unreadIds)
    } catch (error) {
      console.error('알림 전체 읽음 처리 실패:', error)
    }
  }

  const deleteNotification = (id: string) => {
    dismissNotification(id)
  }

  const handleGroupInviteAction = async (id: string, action: 'accept' | 'reject') => {
    const notification = notifications.noti.find((n) => n.id === id)
    if (!notification) return

    const groupName = notification.event?.content?.groupName ?? '해당'

    try {
      await alarmAPI.processInviteAction(id, action)
      await alarmAPI.markAsRead(id)
      markNotificationAsRead(id)
      requestCommunityRefresh()
      setTimeout(() => requestCommunityRefresh(), 600)
      alert(
        action === 'accept'
          ? `${groupName} 그룹 초대를 수락했습니다.`
          : `${groupName} 그룹 초대를 거절했습니다.`,
      )
      setTimeout(() => {
        deleteNotification(id)
      }, 180)
    } catch (error) {
      console.error('그룹 초대 처리 실패:', error)
      alert('그룹 초대 처리에 실패했습니다.')
    }
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement
    const bottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 50
    if (bottom && hasMore && !isLoading) load()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs animate-pulse"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] max-h-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              알림
              {unreadCount > 0 && <Badge variant="secondary" className="text-xs">{unreadCount}개 안읽음</Badge>}
            </DialogTitle>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
                모두 읽음
              </Button>
            )}
          </div>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-4" onScrollCapture={handleScroll}>
          {notifications.noti.length === 0 && !isLoading ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">새로운 알림이 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.noti.map((n) => {
                return (
                  <div
                    key={`${n.id}-${n.timestamp}`}
                    className={`group transition-all duration-300 ease-out origin-left ${
                      n.isDismissing
                        ? 'max-h-0 opacity-0 scale-95 -translate-x-4 mb-0'
                        : 'max-h-[500px] opacity-100 scale-100 translate-x-0 mb-1'
                    }`}
                    style={{ transitionProperty: 'max-height, opacity, transform, margin-bottom' }}
                  >
                  <div
                    className={`
                      p-4 rounded-lg cursor-pointer border-l-4 transition-colors duration-200
                      ${!n.event.meta.isRead ? 'bg-blue-50/50 border-l-blue-500 hover:bg-blue-50/80 shadow-sm' : 'bg-transparent border-l-transparent hover:bg-muted/50'}
                      ${n.isNew ? 'animate-pulse bg-purple-50 border-l-purple-300' : ''}
                    `}
                    onClick={() => !n.event.meta.isRead && markAsRead(n.id)}
                  >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="mt-0.5">{getNotificationIcon(n.event.action)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4
                                className={`text-sm truncate ${
                                  !n.event.meta.isRead ? 'font-semibold text-foreground' : 'font-medium text-muted-foreground'
                                }`}
                              >
                                {n.title}
                              </h4>

                              {/* 기존 unread dot */}
                              {!n.event.meta.isRead && (
                                <div className="relative">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                                  <div className="absolute inset-0 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-75" />
                                </div>
                              )}

                              {/* New 배지 */}
                              {n.isNew && (
                                <Badge variant="secondary" className="text-xs px-1 py-0.5 animate-puls">
                                  New
                                </Badge>
                              )}
                            </div>

                            <p className={`text-sm mb-2 ${!n.event.meta.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {n.message}
                            </p>

                            {n.event.content.amount && (
                              <p className="text-sm font-medium text-primary">{formatCurrency(n.event.content.amount)}</p>
                            )}

                            {n.event.action === 'invite' && n.event.content.requiresAction && (
                              <div className="flex gap-2 mt-3">
                                <Button
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleGroupInviteAction(n.id, 'accept')
                                  }}
                                  className="h-7 px-3 text-xs"
                                >
                                  <Check className="h-3 w-3 mr-1" /> 수락
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleGroupInviteAction(n.id, 'reject')
                                  }}
                                  className="h-7 px-3 text-xs bg-transparent"
                                >
                                  <X className="h-3 w-3 mr-1" /> 거절
                                </Button>
                              </div>
                            )}

                            <div className="flex items-center gap-2 mt-2">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {formatTimestamp(n.createdAt ?? n.timestamp)}
                              </span>
                              {n.event.meta.isRead && (
                                <Badge variant="outline" className="text-xs px-1.5 py-0.5 h-4 text-muted-foreground">
                                  읽음
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteNotification(n.id)
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    {!n.isDismissing && <Separator className="my-1 last:hidden" />}
                  </div>
                )
              })}

              {isLoading && (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              )}

              {!hasMore && notifications.noti.length > 0 && (
                <div className="text-center py-4 text-sm text-muted-foreground">모든 알림을 불러왔습니다</div>
              )}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
