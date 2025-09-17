"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Users,
  Crown,
  Circle,
  ChevronRight,
  ChevronLeft,
  MessageCircle,
  Send,
  CreditCard,
  TrendingUp,
  Bell,
  MoreVertical,
  X,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface GroupMember {
  id: string
  name: string
  role: "admin" | "member"
  isOnline: boolean
  lastSeen?: string
  avatar?: string
  hasNewActivity?: boolean
}

interface GroupEvent {
  id: string
  type: "payment" | "point_conversion" | "transfer"
  memberName: string
  amount: number
  description: string
  timestamp: string
  isRead: boolean // Added isRead property to track notification status
}

interface Group {
  id: string
  name: string
  members: GroupMember[]
  sharedBalance: number
  recentEvents: GroupEvent[]
}

const mockGroups: Group[] = [
  {
    id: "1",
    name: "가족 계정",
    sharedBalance: 250000,
    recentEvents: [
      {
        id: "1",
        type: "payment",
        memberName: "김엄마",
        amount: 15000,
        description: "마트에서 결제",
        timestamp: "5분 전",
        isRead: false, // Added unread status
      },
      {
        id: "2",
        type: "point_conversion",
        memberName: "김형",
        amount: 5000,
        description: "포인트를 현금으로 전환",
        timestamp: "1시간 전",
        isRead: false, // Added unread status
      },
      {
        id: "3",
        type: "transfer",
        memberName: "김아빠",
        amount: 30000,
        description: "김사용자에게 송금",
        timestamp: "2시간 전",
        isRead: true, // Already read notification
      },
    ],
    members: [
      { id: "1", name: "김아빠", role: "admin", isOnline: true },
      { id: "2", name: "김엄마", role: "member", isOnline: true, hasNewActivity: true },
      { id: "3", name: "김형", role: "member", isOnline: false, lastSeen: "5분 전", hasNewActivity: true },
      { id: "4", name: "김사용자", role: "member", isOnline: true },
    ],
  },
  {
    id: "2",
    name: "회사 동료들",
    sharedBalance: 120000,
    recentEvents: [],
    members: [
      { id: "5", name: "이팀장", role: "admin", isOnline: false, lastSeen: "1시간 전" },
      { id: "6", name: "박대리", role: "member", isOnline: true },
      { id: "7", name: "최사원", role: "member", isOnline: false, lastSeen: "30분 전" },
      { id: "8", name: "김사용자", role: "member", isOnline: true },
    ],
  },
  {
    id: "3",
    name: "대학 친구들",
    sharedBalance: 180000,
    recentEvents: [],
    members: [
      { id: "9", name: "정친구", role: "admin", isOnline: true },
      { id: "10", name: "한친구", role: "member", isOnline: false, lastSeen: "2시간 전" },
      { id: "11", name: "김사용자", role: "member", isOnline: true },
    ],
  },
]

export function GroupMembersSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<string>("1")
  const [groups, setGroups] = useState(mockGroups) // Made groups state mutable to handle read status
  const [dismissingEvents, setDismissingEvents] = useState<Set<string>>(new Set()) // Track dismissing animations

  const currentGroup = groups.find((g) => g.id === selectedGroup)
  const onlineMembers = currentGroup?.members.filter((m) => m.isOnline) || []
  const offlineMembers = currentGroup?.members.filter((m) => !m.isOnline) || []

  const unreadEvents = currentGroup?.recentEvents.filter((event) => !event.isRead) || []

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(amount)
  }

  const getInitials = (name: string) => {
    return name.charAt(0)
  }

  const handleMemberAction = (memberId: string, action: string) => {
    console.log(`[v0] Member action: ${action} for member ${memberId}`)
    // 실제 구현에서는 여기에 송금, 채팅 등의 로직이 들어갑니다
  }

  const handleEventDismiss = (eventId: string) => {
    setDismissingEvents((prev) => new Set(prev).add(eventId))

    // Wait for animation to complete before removing from state
    setTimeout(() => {
      setGroups((prevGroups) =>
        prevGroups.map((group) =>
          group.id === selectedGroup
            ? {
                ...group,
                recentEvents: group.recentEvents.map((event) =>
                  event.id === eventId ? { ...event, isRead: true } : event,
                ),
              }
            : group,
        ),
      )
      setDismissingEvents((prev) => {
        const newSet = new Set(prev)
        newSet.delete(eventId)
        return newSet
      })
    }, 300)
  }

  if (isCollapsed) {
    return (
      <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsCollapsed(false)}
          className="bg-background shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem-3rem)] w-80 bg-background border-r border-border shadow-lg z-40 flex flex-col animate-in slide-in-from-left-full duration-300">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Users className="h-4 w-4" />
            그룹 멤버
          </h3>
          <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(true)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* Group Selector */}
        <div className="space-y-2">
          {groups.map((group) => (
            <Button
              key={group.id}
              variant={selectedGroup === group.id ? "default" : "ghost"}
              size="sm"
              className="w-full justify-start text-left"
              onClick={() => setSelectedGroup(group.id)}
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{group.name}</div>
                <div className="text-xs text-muted-foreground">{formatCurrency(group.sharedBalance)}</div>
              </div>
              <Badge variant="secondary" className="ml-2">
                {group.members.length}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {unreadEvents.length > 0 && (
        <div className="p-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">읽지 않은 알림</span>
            <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
              {unreadEvents.length}
            </Badge>
          </div>
          <div className="space-y-2">
            {unreadEvents.slice(0, 3).map((event) => (
              <div
                key={event.id}
                className={`text-xs p-2 bg-background rounded border border-blue-200 bg-blue-50/50 transition-all duration-300 ${
                  dismissingEvents.has(event.id)
                    ? "opacity-0 transform translate-x-full scale-95"
                    : "opacity-100 transform translate-x-0 scale-100"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1">
                    {event.type === "payment" && <CreditCard className="h-3 w-3 text-green-500" />}
                    {event.type === "point_conversion" && <TrendingUp className="h-3 w-3 text-blue-500" />}
                    {event.type === "transfer" && <Send className="h-3 w-3 text-purple-500" />}
                    <span className="font-medium">{event.memberName}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 hover:bg-red-100"
                    onClick={() => handleEventDismiss(event.id)}
                  >
                    <X className="h-2.5 w-2.5" />
                  </Button>
                </div>
                <div className="text-muted-foreground">{event.description}</div>
                <div className="text-muted-foreground mt-1">
                  {formatCurrency(event.amount)} · {event.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Members List */}
      <ScrollArea className="flex-1 p-4">
        {currentGroup && (
          <div className="space-y-4">
            {/* Online Members */}
            {onlineMembers.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Circle className="h-2 w-2 fill-green-500 text-green-500" />
                  <span className="text-sm font-medium text-green-600">온라인 ({onlineMembers.length})</span>
                </div>
                <div className="space-y-2">
                  {onlineMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                      <div className="relative">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">{getInitials(member.name)}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                        {/* Activity Indicator */}
                        {member.hasNewActivity && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-background animate-pulse" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium truncate">{member.name}</span>
                          {member.role === "admin" && <Crown className="h-3 w-3 text-yellow-500" />}
                        </div>
                        <span className="text-xs text-green-600">온라인</span>
                      </div>
                      {/* Member Action Dropdown */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleMemberAction(member.id, "chat")}
                        >
                          <MessageCircle className="h-3 w-3" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleMemberAction(member.id, "transfer")}>
                              <Send className="mr-2 h-3 w-3" />
                              송금하기
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleMemberAction(member.id, "request")}>
                              <CreditCard className="mr-2 h-3 w-3" />
                              송금 요청
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleMemberAction(member.id, "chat")}>
                              <MessageCircle className="mr-2 h-3 w-3" />
                              채팅하기
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Separator */}
            {onlineMembers.length > 0 && offlineMembers.length > 0 && <Separator />}

            {/* Offline Members */}
            {offlineMembers.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Circle className="h-2 w-2 fill-gray-400 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">오프라인 ({offlineMembers.length})</span>
                </div>
                <div className="space-y-2">
                  {offlineMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors opacity-75 group"
                    >
                      <div className="relative">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">{getInitials(member.name)}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gray-400 rounded-full border-2 border-background" />
                        {/* Activity Indicator for Offline Members */}
                        {member.hasNewActivity && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-background" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium truncate">{member.name}</span>
                          {member.role === "admin" && <Crown className="h-3 w-3 text-yellow-500" />}
                        </div>
                        <span className="text-xs text-muted-foreground">{member.lastSeen || "오프라인"}</span>
                      </div>
                      {/* Member Action Dropdown for Offline Members */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleMemberAction(member.id, "transfer")}>
                              <Send className="mr-2 h-3 w-3" />
                              송금하기
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleMemberAction(member.id, "request")}>
                              <CreditCard className="mr-2 h-3 w-3" />
                              송금 요청
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleMemberAction(member.id, "chat")}>
                              <MessageCircle className="mr-2 h-3 w-3" />
                              메시지 보내기
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-center">
          <div className="text-sm font-medium">{currentGroup?.name}</div>
          <div className="text-xs text-muted-foreground">
            총 {currentGroup?.members.length}명 · 온라인 {onlineMembers.length}명
          </div>
        </div>
      </div>
    </div>
  )
}
