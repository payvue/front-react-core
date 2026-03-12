"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { UserPlus, Crown, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Group } from "@/types"
import { formatCurrency } from "@/util/display"
import { InviteFollower } from "./invite"
import { isLeaderRole } from "@/features/community/utils/role"

interface GroupDetailProps {
  group: Group.Context,
  participant: Group.Participant
}

export function GroupMembers({ group, participant }: GroupDetailProps) {

  const { members } = group
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>그룹 멤버</CardTitle>
        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <UserPlus className="mr-2 h-4 w-4" />
              멤버 초대
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>새 멤버 초대</DialogTitle>
            </DialogHeader>
            <InviteFollower
              groupId={group.id}
              onInviteSuccess={() => setIsInviteDialogOpen(false)}
            ></InviteFollower>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{member.info.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{member.info.name}</p>
                    {isLeaderRole(member.role) && <Crown className="h-4 w-4 text-yellow-500" />}
                    <Badge variant={member.status.isLoggedIn ? "secondary" : "outline"}>
                      {member.policy.active ? "활성" : "비활성"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{member.info.contact.email}</p>
                  <p className="text-sm text-muted-foreground">
                    가입일: {new Date(member.contribution.joinDate).toLocaleDateString("ko-KR")} • 기여금: {formatCurrency(member.contribution.amount)}. 
                  </p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {true && (
                    <DropdownMenuItem>관리자로 승격</DropdownMenuItem>
                  )}
                  <DropdownMenuItem className="text-red-600">
                    그룹에서 제거
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
