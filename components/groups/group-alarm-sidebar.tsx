"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Bell,
  ChevronUp,
  ChevronDown,
  CreditCard,
  Send,
  TrendingUp,
  MailPlus,
  X,
} from "lucide-react"
import { formatCurrency, formatTimestamp } from "@/util/display"
import { useAppSelector } from "@/lib/redux/hooks"
import { useAlarmContext } from "../context/alarm"
import { Alarm } from "@/types"
import { client } from "@/lib/sse/client"

interface EnhancedNotification extends Alarm.Notification {
  isNew?: boolean
}

export function GroupAlarmsSidebar() {
  const [notifications, setNotifications] = useState<{ noti: EnhancedNotification[] }>({ noti: [] })
  const [isNotificationOpen, setIsNotificationOpen] = useState(true)
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set())

  const { receiveNotifications } = useAlarmContext()
  const { groups } = useAppSelector((state) => state.community.domain)

  useEffect(() => {
    const load = async () => {
      const alarm = await receiveNotifications("Group")
      if (alarm?.noti) {
        setNotifications({
          noti: alarm.noti
            .filter((n) => !n.event.meta.isRead && n.event.type === "Group")
            .map((n) => ({ ...n, isNew: false })),
        })
      }
    }
    load()
  }, [])

  useEffect(() => {
    const unsubscribe = client({
      api: "/sse/subscribe",
      event: (alarm) => {
        setNotifications((prev) => ({
          noti: alarm.noti
            .filter((n) => n.event.type === "Group")
            .map((n) => ({ ...n, isNew: true }))
            .concat(prev.noti),
        }))


        setTimeout(() => {
          setNotifications((prev) => ({
            noti: prev.noti.map((n) => ({ ...n, isNew: false })),
          }))
        }, 3000)
      },
    })

    return () => unsubscribe()
  }, [])

  const handleEventDismiss = (eventId: string) => {
    setRemovingIds((prev) => new Set([...prev, eventId]))
    setTimeout(() => {
      setNotifications((prev) => ({
        noti: prev.noti.filter((n) => n.id !== eventId),
      }))
      setRemovingIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(eventId)
        return newSet
      })
    }, 300)
  }

  const unreadEvents = notifications.noti

  return (
    <div className="p-4 border-b border-border bg-muted/30 flex flex-col">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsNotificationOpen((prev) => !prev)}
      >
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-medium">읽지 않은 알림</span>
          {unreadEvents.length > 0 && (
            <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
              {unreadEvents.length}
            </Badge>
          )}
        </div>
        {isNotificationOpen ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </div>

      {isNotificationOpen && (
        <ScrollArea className="mt-2 h-32 pr-2">
          <div className="space-y-2">
            {unreadEvents.map((noti) => (
              <div
                key={noti.id}
                className={`relative text-xs p-2 rounded border transition-all duration-500 ease-out
                ${
                  noti.isNew
                    ? "border-purple-300 bg-purple-50/70 shadow-[0_0_8px_rgba(168,85,247,0.4)] animate-fadePulse"
                    : "border-blue-200 bg-blue-50/50"
                }
                ${removingIds.has(noti.id) ? "opacity-0 max-h-0 p-0 m-0 overflow-hidden" : "opacity-100 max-h-40"}
                `}
              >
                {/* 신규 알림 Dot */}
                {noti.isNew && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping opacity-80" />
                )}

                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1">
                    {noti.event.action === "payment" && (
                      <CreditCard className="h-3 w-3 text-green-500" />
                    )}
                    {noti.event.action === "point_conversion" && (
                      <TrendingUp className="h-3 w-3 text-blue-500" />
                    )}
                    {noti.event.action === "transfer" && (
                      <Send className="h-3 w-3 text-purple-500" />
                    )}
                    {noti.event.action === "invite" && (
                      <MailPlus className="h-3 w-3 text-purple-500" />
                    )}
                    <span className="font-medium">
                      {noti.event.content.trigger.name}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 hover:bg-red-100"
                    onClick={() => handleEventDismiss(noti.id)}
                  >
                    <X className="h-2.5 w-2.5" />
                  </Button>
                </div>
                <div className="text-muted-foreground">
                  {noti.event.meta.description}
                </div>
                <div className="text-muted-foreground mt-1">
                  {noti.event.content.amount ? `${formatCurrency(noti.event.content.amount)} · ` : ''}
                  {formatTimestamp(noti.timestamp)}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}
