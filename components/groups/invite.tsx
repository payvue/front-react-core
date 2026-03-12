import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, X, Search, AlertCircle, Mail } from "lucide-react"
import { useState } from "react"
import useSelector from "@/features/user/useSelector"
import { User } from "@/types"
import useCommunityQuery from "@/features/community/useCommunityQuery"

interface InviteFollowerProps {
  groupId: string
  onInviteSuccess?: () => void
}

export function InviteFollower({ groupId, onInviteSuccess }: InviteFollowerProps) {

    const { search } = useSelector()
    const { inviteWithId } = useCommunityQuery()

    const [isSearching, setIsSearching] = useState(false)
    const [searchError, setSearchError] = useState("")    
    const [inviteMembers, setInviteMembers] = useState<User.Info[]>([])
    const [currentEmail, setCurrentEmail] = useState("")

    const searchUser = async () => {
        
        setIsSearching(true)
        setSearchError("")

        search({ searched: inviteMembers, email: currentEmail}, setInviteMembers)
            .then(() => {
                setCurrentEmail("")
                setSearchError("") 
            })
            .catch(err => setSearchError(err.message))        

        setIsSearching(false)    

    }    

    const handleInvite = () => {
        setIsSearching(true)
        setSearchError("")

        inviteWithId({ id: groupId, emails: inviteMembers.map(m => m.contact.email) })
            .then(() => {
                setInviteMembers([])
                setSearchError("")                     
                onInviteSuccess?.()
            })
            .catch(err => setSearchError(err.message))        

        setIsSearching(false)          
    }

    return (

        <>
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
                    <div key={member.contact?.email ?? member.name ?? "unknown"} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.contact?.email ?? "이메일 정보 없음"}</p>
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
                    <Button 
                        onClick={handleInvite} 
                        className="w-full"
                        disabled={inviteMembers.length === 0}
                    >
                        <Mail className="mr-2 h-4 w-4" />
                        {inviteMembers.length > 0 
                        ? `${inviteMembers.length}명에게 초대장 보내기` 
                        : '사용자를 선택해주세요'}
                    </Button>                                     
                </div>               
              </div>
            )}

            
          </div>          

          <Separator />        
        </>        

    )

}
