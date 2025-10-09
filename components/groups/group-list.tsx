"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreateGroupModal } from "./create-group-modal"
import { Users, Settings, Crown } from "lucide-react"
import Link from "next/link"
import { useAppSelector } from "@/lib/redux/hooks"
import { Group } from "@/types"
import { formatCurrency } from "@/util/display"


export function GroupList() {
  
  const { info } = useAppSelector((state) => state.auth.domain)
  const { groups } = useAppSelector((state) => state.community.domain)
  const leaderGroups = new Set<string>(
    groups.flatMap(group =>
      group.members.some(m => info.name === m.info.name && m.role === 'leader') ? [group.id] : []
    )
  );

  const handleGroupCreated = (newGroup: Group.Context) => {
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
                  {leaderGroups.has(group.id) && <Crown className="h-4 w-4 text-yellow-500" />}
                </div>
                <p className="text-sm text-muted-foreground">{group.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">공용 잔액</span>
                  <span className="font-semibold text-primary">{formatCurrency(group.shared.balance)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">멤버</span>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">{group.members.length}명</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={leaderGroups.has(group.id) ? "default" : "secondary"}>
                    {leaderGroups.has(group.id) ? "리더" : "멤버"}
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Link href={`/groups/${group.id}`}>상세보기</Link>
                  </Button>
                  {leaderGroups.has(group.id) && (
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
