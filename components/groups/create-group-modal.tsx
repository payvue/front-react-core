"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plus, Users, X, UserPlus, Mail } from "lucide-react"

interface CreateGroupModalProps {
  onGroupCreated: (group: any) => void
}

export function CreateGroupModal({ onGroupCreated }: CreateGroupModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [groupName, setGroupName] = useState("")
  const [groupDescription, setGroupDescription] = useState("")
  const [initialBalance, setInitialBalance] = useState("")
  const [inviteEmails, setInviteEmails] = useState<string[]>([])
  const [currentEmail, setCurrentEmail] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  const addEmail = () => {
    if (currentEmail && !inviteEmails.includes(currentEmail)) {
      setInviteEmails([...inviteEmails, currentEmail])
      setCurrentEmail("")
    }
  }

  const removeEmail = (email: string) => {
    setInviteEmails(inviteEmails.filter((e) => e !== email))
  }

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      alert("그룹 이름을 입력해주세요.")
      return
    }

    setIsCreating(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const newGroup = {
      id: Date.now().toString(),
      name: groupName,
      description: groupDescription || "새로 생성된 그룹",
      memberCount: 1 + inviteEmails.length,
      sharedBalance: Number.parseInt(initialBalance) || 0,
      role: "admin" as const,
      members: [
        {
          id: "current-user",
          name: "나",
          role: "admin" as const,
          joinDate: new Date().toISOString().split("T")[0],
        },
        ...inviteEmails.map((email, index) => ({
          id: `invited-${index}`,
          name: email,
          role: "member" as const,
          joinDate: new Date().toISOString().split("T")[0],
        })),
      ],
      createdDate: new Date().toISOString().split("T")[0],
    }

    onGroupCreated(newGroup)

    // Reset form
    setGroupName("")
    setGroupDescription("")
    setInitialBalance("")
    setInviteEmails([])
    setCurrentEmail("")
    setIsCreating(false)
    setIsOpen(false)

    alert(
      `${groupName} 그룹이 생성되었습니다!${inviteEmails.length > 0 ? ` ${inviteEmails.length}명에게 초대 메일을 발송했습니다.` : ""}`,
    )
  }

  const formatCurrency = (amount: string) => {
    const num = Number.parseInt(amount.replace(/[^0-9]/g, ""))
    if (isNaN(num)) return ""
    return new Intl.NumberFormat("ko-KR").format(num)
  }

  const handleBalanceChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "")
    setInitialBalance(numericValue)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />새 그룹 만들기
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />새 그룹 만들기
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 기본 정보 */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="groupName">그룹 이름 *</Label>
              <Input
                id="groupName"
                placeholder="예: 우리 가족, 회사 동료들"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                maxLength={30}
              />
              <p className="text-xs text-muted-foreground">{groupName.length}/30자</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="groupDescription">그룹 설명</Label>
              <Textarea
                id="groupDescription"
                placeholder="그룹에 대한 간단한 설명을 입력하세요"
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                maxLength={100}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">{groupDescription.length}/100자</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="initialBalance">초기 공용 잔액</Label>
              <div className="relative">
                <Input
                  id="initialBalance"
                  placeholder="0"
                  value={formatCurrency(initialBalance)}
                  onChange={(e) => handleBalanceChange(e.target.value)}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                  원
                </span>
              </div>
              <p className="text-xs text-muted-foreground">그룹 생성 후 언제든지 충전할 수 있습니다</p>
            </div>
          </div>

          <Separator />

          {/* 멤버 초대 */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">멤버 초대</Label>
              <p className="text-sm text-muted-foreground">이메일 주소로 그룹에 초대할 멤버를 추가하세요</p>
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="이메일 주소 입력"
                value={currentEmail}
                onChange={(e) => setCurrentEmail(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addEmail()}
                type="email"
              />
              <Button type="button" variant="outline" onClick={addEmail} disabled={!currentEmail}>
                <UserPlus className="h-4 w-4" />
              </Button>
            </div>

            {inviteEmails.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">초대할 멤버 ({inviteEmails.length}명)</Label>
                <div className="flex flex-wrap gap-2">
                  {inviteEmails.map((email) => (
                    <Badge key={email} variant="secondary" className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {email}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-destructive/20"
                        onClick={() => removeEmail(email)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* 요약 */}
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium">그룹 생성 요약</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">그룹 이름:</span>
                <span>{groupName || "미입력"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">초기 멤버:</span>
                <span>
                  {1 + inviteEmails.length}명 (나 + 초대 {inviteEmails.length}명)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">초기 잔액:</span>
                <span>{initialBalance ? `${formatCurrency(initialBalance)}원` : "0원"}</span>
              </div>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1 bg-transparent"
              disabled={isCreating}
            >
              취소
            </Button>
            <Button onClick={handleCreateGroup} className="flex-1" disabled={isCreating || !groupName.trim()}>
              {isCreating ? "생성 중..." : "그룹 만들기"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
