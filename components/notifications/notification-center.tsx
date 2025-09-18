"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Bell, Users, CreditCard, DollarSign, AlertCircle, CheckCircle, Clock, X, UserPlus, Check } from "lucide-react"

interface Notification {
  id: string
  type: "group_payment" | "balance_charge" | "payment_request" | "system" | "transaction" | "group_invite"
  title: string
  message: string
  timestamp: string
  isRead: boolean
  groupId?: string
  amount?: number
  inviterName?: string
  groupName?: string
  requiresAction?: boolean
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "group_invite",
    title: "그룹 초대",
    message: "김민수님이 '우리 가족' 그룹에 초대했습니다.",
    timestamp: "2024-01-15T11:30:00Z",
    isRead: false,
    groupId: "family1",
    inviterName: "김민수",
    groupName: "우리 가족",
    requiresAction: true,
  },
  {
    id: "2",
    type: "group_invite",
    title: "그룹 초대",
    message: "이영희님이 '친척들' 그룹에 초대했습니다.",
    timestamp: "2024-01-15T10:45:00Z",
    isRead: false,
    groupId: "family2",
    inviterName: "이영희",
    groupName: "친척들",
    requiresAction: true,
  },
  {
    id: "3",
    type: "payment_request",
    title: "결제 요청 승인됨",
    message: "김민수님이 요청한 '온라인 쇼핑' 결제가 승인되었습니다.",
    timestamp: "2024-01-15T10:30:00Z",
    isRead: false,
    groupId: "1",
    amount: 45000,
  },
  {
    id: "4",
    type: "group_payment",
    title: "그룹 잔액 충전",
    message: "이영희님이 가족 계정에 100,000원을 충전했습니다.",
    timestamp: "2024-01-15T09:15:00Z",
    isRead: false,
    groupId: "1",
    amount: 100000,
  },
  {
    id: "5",
    type: "balance_charge",
    title: "자동 충전 완료",
    message: "잔액이 10,000원 이하로 떨어져 50,000원이 자동 충전되었습니다.",
    timestamp: "2024-01-14T18:45:00Z",
    isRead: true,
    amount: 50000,
  },
  {
    id: "6",
    type: "transaction",
    title: "결제 완료",
    message: "네이버페이에서 25,000원 결제가 완료되었습니다.",
    timestamp: "2024-01-14T16:20:00Z",
    isRead: true,
    amount: 25000,
  },
  {
    id: "7",
    type: "system",
    title: "보안 알림",
    message: "새로운 기기에서 로그인이 감지되었습니다.",
    timestamp: "2024-01-14T14:10:00Z",
    isRead: false,
  },
]

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [dismissingIds, setDismissingIds] = useState<Set<string>>(new Set())

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "group_payment":
        return <Users className="h-4 w-4 text-blue-500" />
      case "balance_charge":
        return <DollarSign className="h-4 w-4 text-green-500" />
      case "payment_request":
        return <CreditCard className="h-4 w-4 text-purple-500" />
      case "transaction":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />
      case "system":
        return <AlertCircle className="h-4 w-4 text-orange-500" />
      case "group_invite":
        return <UserPlus className="h-4 w-4 text-indigo-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
      return `${diffInMinutes}분 전`
    } else if (diffInHours < 24) {
      return `${diffInHours}시간 전`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}일 전`
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(amount)
  }

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId ? { ...notification, isRead: true } : notification,
      ),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== notificationId))
  }

  const handleGroupInviteAction = (notificationId: string, action: "accept" | "reject") => {
    const notification = notifications.find((n) => n.id === notificationId)
    if (!notification) return

    if (action === "accept") {
      // Add user to the group (in real app, this would be an API call)
      const existingGroups = JSON.parse(localStorage.getItem("userGroups") || "[]")
      const newGroup = {
        id: notification.groupId,
        name: notification.groupName,
        inviterName: notification.inviterName,
        joinedAt: new Date().toISOString(),
      }
      localStorage.setItem("userGroups", JSON.stringify([...existingGroups, newGroup]))

      alert(`${notification.groupName} 그룹에 가입되었습니다!`)
    } else {
      alert(`${notification.groupName} 그룹 초대를 거절했습니다.`)
    }

    // Animate out then remove the notification
    setDismissingIds((prev) => new Set(prev).add(notificationId))
    setTimeout(() => {
      deleteNotification(notificationId)
      setDismissingIds((prev) => {
        const next = new Set(prev)
        next.delete(notificationId)
        return next
      })
    }, 300)
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
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              알림
              {unreadCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {unreadCount}개 안읽음
                </Badge>
              )}
            </DialogTitle>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
                모두 읽음
              </Button>
            )}
          </div>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-4">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">새로운 알림이 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.map((notification, index) => (
                <div key={notification.id} className="group">
                  <div
                    className={`p-4 rounded-lg cursor-pointer border-l-4 transition-all duration-300 ${
                      !notification.isRead
                        ? "bg-blue-50/50 border-l-blue-500 hover:bg-blue-50/80 shadow-sm"
                        : "bg-transparent border-l-transparent hover:bg-muted/50"
                    } ${
                      dismissingIds.has(notification.id)
                        ? "opacity-0 translate-x-full scale-95"
                        : "opacity-100 translate-x-0 scale-100"
                    }`}
                    onClick={() => !notification.isRead && markAsRead(notification.id)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4
                              className={`text-sm truncate ${
                                !notification.isRead
                                  ? "font-semibold text-foreground"
                                  : "font-medium text-muted-foreground"
                              }`}
                            >
                              {notification.title}
                            </h4>
                            {!notification.isRead && (
                              <div className="relative">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                                <div className="absolute inset-0 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-75" />
                              </div>
                            )}
                            {!notification.isRead &&
                              new Date().getTime() - new Date(notification.timestamp).getTime() < 3600000 && (
                                <Badge variant="destructive" className="text-xs px-1.5 py-0.5 h-5">
                                  NEW
                                </Badge>
                              )}
                          </div>
                          <p
                            className={`text-sm mb-2 ${
                              !notification.isRead ? "text-foreground" : "text-muted-foreground"
                            }`}
                          >
                            {notification.message}
                          </p>
                          {notification.amount && (
                            <p className="text-sm font-medium text-primary">{formatCurrency(notification.amount)}</p>
                          )}

                          {notification.type === "group_invite" && notification.requiresAction && (
                            <div className="flex gap-2 mt-3">
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleGroupInviteAction(notification.id, "accept")
                                }}
                                className="h-7 px-3 text-xs"
                              >
                                <Check className="h-3 w-3 mr-1" />
                                수락
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleGroupInviteAction(notification.id, "reject")
                                }}
                                className="h-7 px-3 text-xs bg-transparent"
                              >
                                <X className="h-3 w-3 mr-1" />
                                거절
                              </Button>
                            </div>
                          )}

                          <div className="flex items-center gap-2 mt-2">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                            {notification.isRead && (
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
                          setDismissingIds((prev) => new Set(prev).add(notification.id))
                          setTimeout(() => {
                            deleteNotification(notification.id)
                            setDismissingIds((prev) => {
                              const next = new Set(prev)
                              next.delete(notification.id)
                              return next
                            })
                          }, 300)
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  {index < notifications.length - 1 && <Separator className="my-1" />}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
