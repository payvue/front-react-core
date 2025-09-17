"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { UserPlus, Crown, MoreHorizontal, Mail } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface GroupMember {
  id: string
  name: string
  email: string
  role: "admin" | "member"
  joinDate: string
  contribution: number
  status: "active" | "pending"
}

const mockMembers: GroupMember[] = [
  {
    id: "1",
    name: "김아빠",
    email: "dad@family.com",
    role: "admin",
    joinDate: "2024-01-01",
    contribution: 150000,
    status: "active",
  },
  {
    id: "2",
    name: "김엄마",
    email: "mom@family.com",
    role: "member",
    joinDate: "2024-01-01",
    contribution: 100000,
    status: "active",
  },
  {
    id: "3",
    name: "김형",
    email: "brother@family.com",
    role: "member",
    joinDate: "2024-01-02",
    contribution: 75000,
    status: "active",
  },
  {
    id: "4",
    name: "김사용자",
    email: "user@family.com",
    role: "member",
    joinDate: "2024-01-02",
    contribution: 50000,
    status: "active",
  },
]

export function GroupMembers() {
  const [members, setMembers] = useState(mockMembers)
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(amount)
  }

  const handleInvite = () => {
    if (!inviteEmail) return

    // Mock invite process
    alert(`${inviteEmail}로 초대장을 보냈습니다!`)
    setInviteEmail("")
    setIsInviteDialogOpen(false)
  }

  const handleRemoveMember = (memberId: string) => {
    setMembers(members.filter((member) => member.id !== memberId))
  }

  const handlePromoteToAdmin = (memberId: string) => {
    setMembers(members.map((member) => (member.id === memberId ? { ...member, role: "admin" as const } : member)))
  }

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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>새 멤버 초대</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Input
                  placeholder="초대할 사용자의 이메일을 입력하세요"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <Button onClick={handleInvite} className="w-full">
                <Mail className="mr-2 h-4 w-4" />
                초대장 보내기
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{member.name}</p>
                    {member.role === "admin" && <Crown className="h-4 w-4 text-yellow-500" />}
                    <Badge variant={member.status === "active" ? "secondary" : "outline"}>
                      {member.status === "active" ? "활성" : "대기"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{member.email}</p>
                  <p className="text-sm text-muted-foreground">
                    가입일: {member.joinDate} • 기여금: {formatCurrency(member.contribution)}
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
                  {member.role !== "admin" && (
                    <DropdownMenuItem onClick={() => handlePromoteToAdmin(member.id)}>관리자로 승격</DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => handleRemoveMember(member.id)} className="text-red-600">
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
