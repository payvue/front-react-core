"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreateGroupModal } from "./create-group-modal"
import { Users, Settings, Crown } from "lucide-react"
import Link from "next/link"

interface GroupMember {
  id: string
  name: string
  role: "admin" | "member"
  joinDate: string
}

interface Group {
  id: string
  name: string
  description: string
  memberCount: number
  sharedBalance: number
  role: "admin" | "member"
  members: GroupMember[]
  createdDate: string
}

const mockGroups: Group[] = [
  {
    id: "1",
    name: "가족 계정",
    description: "우리 가족 공용 결제 계정",
    memberCount: 4,
    sharedBalance: 250000,
    role: "admin",
    members: [
      { id: "1", name: "김아빠", role: "admin", joinDate: "2024-01-01" },
      { id: "2", name: "김엄마", role: "member", joinDate: "2024-01-01" },
      { id: "3", name: "김형", role: "member", joinDate: "2024-01-02" },
      { id: "4", name: "김사용자", role: "member", joinDate: "2024-01-02" },
    ],
    createdDate: "2024-01-01",
  },
  {
    id: "2",
    name: "회사 동료들",
    description: "점심값 모아서 결제하기",
    memberCount: 6,
    sharedBalance: 120000,
    role: "member",
    members: [
      { id: "5", name: "이팀장", role: "admin", joinDate: "2024-01-05" },
      { id: "6", name: "박대리", role: "member", joinDate: "2024-01-05" },
      { id: "7", name: "최사원", role: "member", joinDate: "2024-01-06" },
      { id: "8", name: "김사용자", role: "member", joinDate: "2024-01-06" },
    ],
    createdDate: "2024-01-05",
  },
  {
    id: "3",
    name: "대학 친구들",
    description: "여행 경비 공동 관리",
    memberCount: 5,
    sharedBalance: 180000,
    role: "member",
    members: [
      { id: "9", name: "정친구", role: "admin", joinDate: "2024-01-10" },
      { id: "10", name: "한친구", role: "member", joinDate: "2024-01-10" },
      { id: "11", name: "김사용자", role: "member", joinDate: "2024-01-11" },
    ],
    createdDate: "2024-01-10",
  },
]

export function GroupList() {
  const [groups, setGroups] = useState(mockGroups)

  const handleGroupCreated = (newGroup: Group) => {
    setGroups((prev) => [newGroup, ...prev])
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">내 그룹 계정</h2>
          <p className="text-muted-foreground">참여 중인 그룹 계정을 관리하세요</p>
        </div>
        <CreateGroupModal onGroupCreated={handleGroupCreated} />
      </div>

      {groups.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">참여 중인 그룹이 없습니다</h3>
          <p className="text-muted-foreground mb-4">새 그룹을 만들어 가족이나 친구들과 함께 결제를 관리해보세요</p>
          <CreateGroupModal onGroupCreated={handleGroupCreated} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <Card key={group.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {group.name}
                  </CardTitle>
                  {group.role === "admin" && <Crown className="h-4 w-4 text-yellow-500" />}
                </div>
                <p className="text-sm text-muted-foreground">{group.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">공용 잔액</span>
                  <span className="font-semibold text-primary">{formatCurrency(group.sharedBalance)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">멤버</span>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">{group.memberCount}명</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={group.role === "admin" ? "default" : "secondary"}>
                    {group.role === "admin" ? "관리자" : "멤버"}
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Link href={`/groups/${group.id}`}>상세보기</Link>
                  </Button>
                  {group.role === "admin" && (
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
