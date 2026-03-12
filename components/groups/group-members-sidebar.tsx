'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Users,
  ChevronRight,
  ChevronLeft,
  Circle,
  ChevronUp,
  ChevronDown,
  Crown,
  MessageCircle,
  MoreVertical,
  CreditCard,
  Send,
} from 'lucide-react'
import { useAppSelector } from '@/lib/redux/hooks'
import { formatCurrency, formatTimestamp } from '@/util/display'
import { Alarm } from '@/types'
import { useAlarmContext } from '../context/alarm'
import { GroupAlarmsSidebar } from './group-alarm-sidebar'
import { isLeaderRole } from '@/features/community/utils/role'
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar'
import { Separator } from '@radix-ui/react-select'

interface GroupMembersSidebarProps {
  onCollapseChange?: (isCollapsed: boolean) => void
}

export function GroupMembersSidebar({ onCollapseChange }: GroupMembersSidebarProps = {}) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<string>('1')
  const [isGroupListOpen, setIsGroupListOpen] = useState(true)
  const [isMembersOpen, setIsMembersOpen] = useState(true)

  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set())
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['online', 'offline']),
  )
  const [isNotificationOpen, setIsNotificationOpen] = useState(true)

  const [notifications, setNotifications] = useState<Alarm.Context>({ noti: [] })
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const { groups } = useAppSelector((state) => state.community.domain)
  const { receiveNotifications } = useAlarmContext()

  const load = async () => {
    if (isLoading || !hasMore) return
    setIsLoading(true)
    try {
      const alarm = await receiveNotifications('Group')
      if (alarm && alarm.noti) {
        setNotifications((prev) => ({
          noti: [
            ...prev.noti,
            ...alarm.noti.filter((n) => !n.event.meta.isRead && n.event.type === 'Group'),
          ],
        }))
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

  useEffect(() => {
    onCollapseChange?.(isCollapsed)
  }, [isCollapsed, onCollapseChange])

  const currentGroup = Array.from(groups).find((g) => g.id === selectedGroup)
  const onlineMembers = currentGroup?.members.filter((m) => m.status.isLoggedIn) || []
  const offlineMembers = currentGroup?.members.filter((m) => !m.status.isLoggedIn) || []
  const unreadEvents = notifications.noti.filter((noti) => !noti.event.meta.isRead)

  // 드롭다운 외부 클릭 시 닫기
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
    setOpenDropdowns((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(memberId)) newSet.delete(memberId)
      else newSet.add(memberId)
      return newSet
    })
  }

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(section)) newSet.delete(section)
      else newSet.add(section)
      return newSet
    })
  }

  const getInitials = (name: string) => name.charAt(0)

  const handleMemberAction = (memberId: string, action: string) => {
    console.log(`[v0] Member action: ${action} for member ${memberId}`)
  }

  // ✅ 공백 없이 즉시 알림 제거
  const handleEventDismiss = (eventId: string) => {
    setNotifications((prev) => ({
      noti: prev.noti.filter((n) => n.id !== eventId),
    }))
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
    <div
      className={`fixed left-0 top-[5rem] rounded-lg shadow-2xl h-[calc(100vh-5rem-3rem)] w-64 bg-background border-r border-border z-40 flex flex-col transition-all duration-300 ease-in-out ${
        isAnimatingOut ? 'animate-out slide-out-to-left-full' : 'animate-in slide-in-from-left-full'
      }`}
    >
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
          <button
            type="button"
            className="flex w-full items-center justify-between text-xs font-medium text-muted-foreground"
            onClick={() => setIsGroupListOpen((prev) => !prev)}
          >
            <span>내 그룹 ({Array.from(groups).length})</span>
            {isGroupListOpen ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </button>

          {isGroupListOpen
            ? Array.from(groups).map((group) => (
                <Button
                  key={group.id}
                  variant={selectedGroup === group.id ? 'default' : 'ghost'}
                  size="sm"
                  className="w-full justify-start text-left"
                  onClick={() => setSelectedGroup(group.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{group.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatCurrency(group.shared.balance)}
                    </div>
                  </div>
                  <Badge variant="secondary" className="ml-2">
                    {group.members.length}
                  </Badge>
                </Button>
              ))
            : currentGroup && (
                <div className="rounded-md border border-border bg-muted/30 px-3 py-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-medium truncate">{currentGroup.name}</span>
                    <Badge variant="secondary">{currentGroup.members.length}</Badge>
                  </div>
                  <div className="text-muted-foreground mt-1">
                    {formatCurrency(currentGroup.shared.balance)}
                  </div>
                </div>
              )}
        </div>

      </div>

      {/* 알림 토글 */}
      <GroupAlarmsSidebar></GroupAlarmsSidebar>

      {/* 멤버 목록 */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {currentGroup && (
            <div className="space-y-4 pr-2">
              <button
                type="button"
                className="flex w-full items-center justify-between text-xs font-medium text-muted-foreground"
                onClick={() => setIsMembersOpen((prev) => !prev)}
              >
                <span>멤버 ({currentGroup.members.length})</span>
                {isMembersOpen ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </button>

              {!isMembersOpen && (
                <div className="rounded-md border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                  온라인 {onlineMembers.length}명 · 오프라인 {offlineMembers.length}명
                </div>
              )}

              {/* Online Members */}
              {isMembersOpen && onlineMembers.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Circle className="h-2 w-2 fill-green-500 text-green-500" />
                      <span className="text-sm font-medium text-green-600">
                        온라인 ({onlineMembers.length})
                      </span>
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
                              <AvatarFallback className="text-xs">
                                {getInitials(member.info.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                            {/* Activity Indicator */}
                            {member.hasNewActivity && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-background animate-pulse" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium truncate">
                                {member.info.name}
                              </span>
                              {isLeaderRole(member.role) && (
                                <Crown className="h-3 w-3 text-yellow-500" />
                              )}
                            </div>
                            <span className="text-xs text-green-600">온라인</span>
                          </div>
                          {/* Member Action Dropdown */}
                          <div
                            className="flex items-center gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity relative"
                            data-dropdown
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleMemberAction(member.id, 'chat')}
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
                                        handleMemberAction(member.id, 'transfer')
                                        toggleDropdown(member.id)
                                      }}
                                    >
                                      <Send className="mr-2 h-3 w-3" />
                                      송금하기
                                    </button>
                                    <button
                                      className="flex items-center w-full px-3 py-1.5 text-xs hover:bg-gray-100"
                                      onClick={() => {
                                        handleMemberAction(member.id, 'request')
                                        toggleDropdown(member.id)
                                      }}
                                    >
                                      <CreditCard className="mr-2 h-3 w-3" />
                                      송금 요청
                                    </button>
                                    <button
                                      className="flex items-center w-full px-3 py-1.5 text-xs hover:bg-gray-100"
                                      onClick={() => {
                                        handleMemberAction(member.id, 'chat')
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
              {isMembersOpen && onlineMembers.length > 0 && offlineMembers.length > 0 && (
                <Separator />
              )}

              {/* Offline Members */}
              {isMembersOpen && offlineMembers.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Circle className="h-2 w-2 fill-gray-400 text-gray-400" />
                      <span className="text-sm font-medium text-gray-600">
                        오프라인 ({offlineMembers.length})
                      </span>
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
                              <AvatarFallback className="text-xs">
                                {getInitials(member.info.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gray-400 rounded-full border-2 border-background" />
                            {/* Activity Indicator for Offline Members */}
                            {member.hasNewActivity && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-background" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium truncate">
                                {member.info.name}
                              </span>
                              {isLeaderRole(member.role) && (
                                <Crown className="h-3 w-3 text-yellow-500" />
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatTimestamp(member.status.lastLoggedIn) || '오프라인'}
                            </span>
                          </div>
                          {/* Member Action Dropdown for Offline Members */}
                          <div
                            className="flex items-center gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity relative"
                            data-dropdown
                          >
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
                                        handleMemberAction(member.id, 'transfer')
                                        toggleDropdown(member.id)
                                      }}
                                    >
                                      <Send className="mr-2 h-3 w-3" />
                                      송금하기
                                    </button>
                                    <button
                                      className="flex items-center w-full px-3 py-1.5 text-xs hover:bg-gray-100"
                                      onClick={() => {
                                        handleMemberAction(member.id, 'request')
                                        toggleDropdown(member.id)
                                      }}
                                    >
                                      <CreditCard className="mr-2 h-3 w-3" />
                                      송금 요청
                                    </button>
                                    <button
                                      className="flex items-center w-full px-3 py-1.5 text-xs hover:bg-gray-100"
                                      onClick={() => {
                                        handleMemberAction(member.id, 'chat')
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
