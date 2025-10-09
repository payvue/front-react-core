"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Users, X, Search, Wallet, AlertCircle } from "lucide-react"
import { useAppSelector } from "@/lib/redux/hooks"
import { Group, User } from "@/types"
import { formatCurrency } from "@/util/display"
import useCommunityQuery from "@/features/community/useCommunityQuery"
import useSelector from "@/features/user/useSelector"

export function CreateGroupModal() {

  const user = useAppSelector((state) => state.auth.domain)
  
  const { create, invite } = useCommunityQuery()
  const { search } = useSelector()


  const [isOpen, setIsOpen] = useState(false)
  const [inviteMembers, setInviteMembers] = useState<User.Info[]>([])
  const [currentEmail, setCurrentEmail] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState("")

  const { control, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm<Group.Context>({
    defaultValues: {
      name: "",
      description: "",
      shared: {
        balance: 0
      },
      members: []
    }
  })

  const watchedValues = watch()
  const groupName = watchedValues.name || ""
  const groupDescription = watchedValues.description || ""
  const initialBalance = watchedValues.shared.balance || 0

  const searchUser = async () => {
    
    setIsSearching(true)
    setSearchError("")

    search({ searched: inviteMembers, email: currentEmail}, setInviteMembers).then(() => {
        setCurrentEmail("")
        setSearchError("") 
    })
    .catch(err => setSearchError(err.message))    

    setIsSearching(false)    

  }

  const onSubmit = async (data: Group.Context) => {

    setIsCreating(true)

    data.members.push({
      info: {
        name: user.info.name,
        contact: {
          email: user.info.contact.email
        }
      },
      role: "leader" as const,
      contribution: {
        amount: initialBalance,
        joinDate: new Date().toISOString().split("T")[0],  
      },
      policy: {
        active: true
      }       
    })

    inviteMembers.forEach(follower => {
      data.members.push({
          info: follower,
          role: "follower",
          contribution: {
            amount: 0,
            joinDate: new Date().toISOString().split("T")[0]  
          },         
          policy: {
            active: false
          }        
      })
    })

    
    create(data).then(() => {

      invite(inviteMembers.map(m => m.contact.email))
        .then(() => {
          reset()
          setInviteMembers([])
          setCurrentEmail("")
          setSearchError("")
          setIsCreating(false)
          setIsOpen(false)      
        })
        .catch(error => setSearchError(error.message))

    })
  }

  const handleBalanceChange = (value: string, onChange: (value: string) => void) => {
    const numericValue = value.replace(/[^0-9]/g, "")
    onChange(numericValue)
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 기본 정보 */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">그룹 이름 *</Label>
              <Controller
                name="name"
                control={control}
                rules={{ 
                  required: "그룹 이름을 입력해주세요",
                  maxLength: { value: 30, message: "그룹 이름은 30자를 초과할 수 없습니다" }
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="name"
                    placeholder="예: 우리 가족, 회사 동료들"
                    maxLength={30}
                  />
                )}
              />
              <p className="text-xs text-muted-foreground">{groupName.length}/30자</p>
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">그룹 설명</Label>
              <Controller
                name="description"
                control={control}
                rules={{ 
                  maxLength: { value: 100, message: "그룹 설명은 100자를 초과할 수 없습니다" }
                }}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    id="description"
                    placeholder="그룹에 대한 간단한 설명을 입력하세요"
                    maxLength={100}
                    rows={3}
                  />
                )}
              />
              <p className="text-xs text-muted-foreground">{groupDescription.length}/100자</p>
              {errors.description && (
                <p className="text-xs text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="shared.balance">내 잔고에서 충전</Label>
              <div className="flex items-center gap-2 mb-2 p-3 bg-muted/50 rounded-md">
                <Wallet className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">내 잔고:</span>
                <span className="font-medium">{formatCurrency(user.asset.balance)}원</span>
              </div>
              <Controller
                name="shared.balance"
                control={control}
                rules={{
                  validate: (value) => {
                    const amount = value || 0
                    if (amount > user.asset.balance) {
                      return `잔고가 부족합니다. 최대 ${formatCurrency(user.asset.balance)}원까지 충전 가능합니다.`
                    }
                    return true
                  }
                }}
                render={({ field }) => (
                  <div className="relative">
                    <Input
                      id="initialBalance"
                      placeholder="0"
                      value={formatCurrency(field.value)}
                      onChange={(e) => handleBalanceChange(e.target.value, field.onChange)}
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                      원
                    </span>
                  </div>
                )}
              />
              {initialBalance && initialBalance > user.asset.balance && (
                <Alert variant="destructive" className="py-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    잔고가 부족합니다. 최대 {formatCurrency(user.asset.balance)}원까지 충전 가능합니다.
                  </AlertDescription>
                </Alert>
              )}
              {errors.shared?.balance && (
                <p className="text-xs text-destructive">{errors.shared.balance.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                내 잔고에서 그룹 공용 잔액으로 충전됩니다. 나중에도 추가 충전 가능합니다.
              </p>
            </div>
          </div>

          <Separator />

          {/* 멤버 초대 */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">멤버 초대</Label>
              <p className="text-sm text-muted-foreground">이메일 주소로 사용자를 검색하여 그룹에 초대하세요</p>
            </div>

            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="이메일 주소 입력 후 엔터"
                  value={currentEmail}
                  onChange={(e) => {
                    setCurrentEmail(e.target.value)
                    setSearchError("")
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      searchUser()
                    }
                  }}
                  type="email"
                  disabled={isSearching}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={searchUser} 
                  disabled={!currentEmail || isSearching}
                >
                  {isSearching ? (
                    <span className="animate-spin">⏳</span>
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              {searchError && (
                <Alert variant="destructive" className="py-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">{searchError}</AlertDescription>
                </Alert>
              )}
            </div>

            {inviteMembers.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">초대할 멤버 ({inviteMembers.length}명)</Label>
                <div className="space-y-2">
                  {inviteMembers.map((member) => (
                    <div key={member.contact.email} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.contact.email}</p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-destructive/20"
                        onClick={() => setInviteMembers(inviteMembers.filter((m) => m.contact.email !== member.contact.email))}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
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
                  {1 + inviteMembers.length}명 (나 + 초대 {inviteMembers.length}명)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">충전 금액:</span>
                <span className="font-medium">{initialBalance ? `${formatCurrency(Number.parseInt(initialBalance))}원` : "0원"}</span>
              </div>
              {initialBalance && Number.parseInt(initialBalance) > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">충전 후 내 잔고:</span>
                  <span>{formatCurrency((user.asset.balance - Number.parseInt(initialBalance)))}원</span>
                </div>
              )}
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1 bg-transparent"
              disabled={isCreating}
            >
              취소
            </Button>
            <Button type="submit" className="flex-1" disabled={isCreating || !groupName.trim()}>
              {isCreating ? "생성 중..." : "그룹 만들기"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}