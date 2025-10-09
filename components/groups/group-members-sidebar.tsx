"use client"

import { useState, useEffect } from "react"
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
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Send,
  CreditCard,
  TrendingUp,
  Bell,
  MoreVertical,
  X,
} from "lucide-react"
import { useAppSelector } from "@/lib/redux/hooks"
import { formatCurrency, timeAgo } from "@/util/display"


interface GroupMembersSidebarProps {
  onCollapseChange?: (isCollapsed: boolean) => void
}

export function GroupMembersSidebar({ onCollapseChange }: GroupMembersSidebarProps = {}) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<string>("1")
  const [dismissingEvents, setDismissingEvents] = useState<Set<string>>(new Set()) // Track dismissing animations
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set()) // Track which dropdowns are open
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['online', 'offline'])) // Track expanded sections

  const { groups } = useAppSelector((state) => state.community.domain)

  // Notify parent component when collapse state changes
  useEffect(() => {
    onCollapseChange?.(isCollapsed)
  }, [isCollapsed, onCollapseChange])

  const currentGroup = Array.from(groups).find((g) => g.id === selectedGroup)
  const onlineMembers = currentGroup?.members.filter((m) => m.status.isLoggedIn) || []
  const offlineMembers = currentGroup?.members.filter((m) => !m.status.isLoggedIn) || []
  // const unreadEvents = Array.from(groups).flatMap(group => group.events.filter(event => !event.isRead))
  const unreadEvents = []

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('[data-dropdown]')) {
        setOpenDropdowns(new Set())
      }
    }

    if (openDropdowns.size > 0) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [openDropdowns])

  const toggleDropdown = (memberId: string) => {
    setOpenDropdowns(prev => {
      const newSet = new Set(prev)
      if (newSet.has(memberId)) {
        newSet.delete(memberId)
      } else {
        newSet.add(memberId)
      }
      return newSet
    })
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(section)) {
        newSet.delete(section)
      } else {
        newSet.add(section)
      }
      return newSet
    })
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
    // setTimeout(() => {
    //   setGroups((prevGroups) =>
    //     prevGroups.map((group) =>
    //       group.id === selectedGroup
    //         ? {
    //             ...group,
    //             recentEvents: group.recentEvents.map((event) =>
    //               event.id === eventId ? { ...event, isRead: true } : event,
    //             ),
    //           }
    //         : group,
    //     ),
    //   )
    //   setDismissingEvents((prev) => {
    //     const newSet = new Set(prev)
    //     newSet.delete(eventId)
    //     return newSet
    //   })
    // }, 300)
  }

  if (isCollapsed) {
    return (
      <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsCollapsed(false)}
          className="bg-background shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className={`fixed left-0 top-30 rounded-lg shadow-2xl h-[calc(100vh-5rem-3rem)] w-64 bg-background border-r border-border shadow-lg z-40 flex flex-col transition-all duration-300 ease-in-out ${
      isAnimatingOut ? "animate-out slide-out-to-left-full" : "animate-in slide-in-from-left-full"
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Users className="h-4 w-4" />
            그룹 멤버
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setIsAnimatingOut(true)
              setTimeout(() => {
                setIsCollapsed(true)
                setIsAnimatingOut(false)
              }, 300)
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* Group Selector */}
        <div className="space-y-2">
          {Array.from(groups).map((group) => (
            <Button
              key={group.id}
              variant={selectedGroup === group.id ? "default" : "ghost"}
              size="sm"
              className="w-full justify-start text-left"
              onClick={() => setSelectedGroup(group.id)}
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{group.name}</div>
                <div className="text-xs text-muted-foreground">{formatCurrency(group.shared.balance)}</div>
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
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {currentGroup && (
            <div className="space-y-4 pr-2">
            {/* Online Members */}
            {onlineMembers.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Circle className="h-2 w-2 fill-green-500 text-green-500" />
                    <span className="text-sm font-medium text-green-600">온라인 ({onlineMembers.length})</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSection('online')}
                    className="h-6 w-6 p-0"
                  >
                    {expandedSections.has('online') ? (
                      <ChevronUp className="h-3 w-3" />
                    ) : (
                      <ChevronDown className="h-3 w-3" />
                    )}
                  </Button>
                </div>
                {expandedSections.has('online') && (
                  <div className="space-y-2">
                  {onlineMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                      <div className="relative">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">{getInitials(member.info.name)}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                        {/* Activity Indicator */}
                        {member.hasNewActivity && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-background animate-pulse" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium truncate">{member.info.name}</span>
                          {member.role === "leader" && <Crown className="h-3 w-3 text-yellow-500" />}
                        </div>
                        <span className="text-xs text-green-600">온라인</span>
                      </div>
                      {/* Member Action Dropdown */}
                      <div className="flex items-center gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity relative" data-dropdown>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleMemberAction(member.id, "chat")}
                        >
                          <MessageCircle className="h-3 w-3" />
                        </Button>
                        <div className="relative">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={() => toggleDropdown(member.id)}
                          >
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                          {openDropdowns.has(member.id) && (
                            <div className="absolute right-0 top-full mt-1 w-28 bg-white border border-gray-200 rounded-md shadow-lg z-[9999]">
                              <div className="py-1">
                                <button 
                                  className="flex items-center w-full px-3 py-1.5 text-xs hover:bg-gray-100"
                                  onClick={() => {
                                    handleMemberAction(member.id, "transfer")
                                    toggleDropdown(member.id)
                                  }}
                                >
                                  <Send className="mr-2 h-3 w-3" />
                                  송금하기
                                </button>
                                <button 
                                  className="flex items-center w-full px-3 py-1.5 text-xs hover:bg-gray-100"
                                  onClick={() => {
                                    handleMemberAction(member.id, "request")
                                    toggleDropdown(member.id)
                                  }}
                                >
                                  <CreditCard className="mr-2 h-3 w-3" />
                                  송금 요청
                                </button>
                                <button 
                                  className="flex items-center w-full px-3 py-1.5 text-xs hover:bg-gray-100"
                                  onClick={() => {
                                    handleMemberAction(member.id, "chat")
                                    toggleDropdown(member.id)
                                  }}
                                >
                                  <MessageCircle className="mr-2 h-3 w-3" />
                                  채팅하기
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  </div>
                )}
              </div>
            )}

            {/* Separator */}
            {onlineMembers.length > 0 && offlineMembers.length > 0 && <Separator />}

            {/* Offline Members */}
            {offlineMembers.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Circle className="h-2 w-2 fill-gray-400 text-gray-400" />
                    <span className="text-sm font-medium text-gray-600">오프라인 ({offlineMembers.length})</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSection('offline')}
                    className="h-6 w-6 p-0"
                  >
                    {expandedSections.has('offline') ? (
                      <ChevronUp className="h-3 w-3" />
                    ) : (
                      <ChevronDown className="h-3 w-3" />
                    )}
                  </Button>
                </div>
                {expandedSections.has('offline') && (
                  <div className="space-y-2">
                  {offlineMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors opacity-75 group"
                    >
                      <div className="relative">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">{getInitials(member.info.name)}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gray-400 rounded-full border-2 border-background" />
                        {/* Activity Indicator for Offline Members */}
                        {member.hasNewActivity && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-background" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium truncate">{member.info.name}</span>
                          {member.role === "leader" && <Crown className="h-3 w-3 text-yellow-500" />}
                        </div>
                        <span className="text-xs text-muted-foreground">{timeAgo(member.status.lastLoggedIn) || "오프라인"}</span>
                      </div>
                      {/* Member Action Dropdown for Offline Members */}
                      <div className="flex items-center gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity relative" data-dropdown>
                        <div className="relative">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={() => toggleDropdown(member.id)}
                          >
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                          {openDropdowns.has(member.id) && (
                            <div className="absolute right-0 top-full mt-1 w-28 bg-white border border-gray-200 rounded-md shadow-lg z-[9999]">
                              <div className="py-1">
                                <button 
                                  className="flex items-center w-full px-3 py-1.5 text-xs hover:bg-gray-100"
                                  onClick={() => {
                                    handleMemberAction(member.id, "transfer")
                                    toggleDropdown(member.id)
                                  }}
                                >
                                  <Send className="mr-2 h-3 w-3" />
                                  송금하기
                                </button>
                                <button 
                                  className="flex items-center w-full px-3 py-1.5 text-xs hover:bg-gray-100"
                                  onClick={() => {
                                    handleMemberAction(member.id, "request")
                                    toggleDropdown(member.id)
                                  }}
                                >
                                  <CreditCard className="mr-2 h-3 w-3" />
                                  송금 요청
                                </button>
                                <button 
                                  className="flex items-center w-full px-3 py-1.5 text-xs hover:bg-gray-100"
                                  onClick={() => {
                                    handleMemberAction(member.id, "chat")
                                    toggleDropdown(member.id)
                                  }}
                                >
                                  <MessageCircle className="mr-2 h-3 w-3" />
                                  메시지 보내기
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        </ScrollArea>
      </div>

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
