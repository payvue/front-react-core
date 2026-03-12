'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { OnlineAssetModel } from '../../summary/model/online-asset'
import { useProfileSearch } from '@/features/transfer/useTransferQuery'
import { useTransferAssetToUser } from '../hooks/useAssetTransferMutation'

interface UserTransferFormProps {
  asset: OnlineAssetModel
  onSuccess: () => void
}

export default function UserTransferForm({ asset, onSuccess }: UserTransferFormProps) {
  const [email, setEmail] = useState('')
  const [debouncedEmail, setDebouncedEmail] = useState('')
  const [message, setMessage] = useState('')
  const [selectedUser, setSelectedUser] = useState<any>(null)

  const profileQuery = useProfileSearch(debouncedEmail)
  const transferMutation = useTransferAssetToUser()

  // 이메일 입력 시 디바운싱
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedEmail(email.trim()), 250)
    return () => clearTimeout(timer)
  }, [email])

  const handleTransfer = async () => {
    if (!selectedUser) {
      alert('받는 사람을 선택하세요.')
      return
    }

    try {
      await transferMutation.mutateAsync({
        assetType: asset.category,
        payload: {
          assetId: asset.id,
          recipientEmail: selectedUser.email,
          message: message || undefined,
        },
      })

      alert(`${selectedUser.name}님에게 ${asset.name}을 전송했습니다.`)
      setEmail('')
      setMessage('')
      setSelectedUser(null)
      onSuccess()
    } catch (err: any) {
      alert(err?.message || '전송에 실패했습니다.')
    }
  }

  return (
    <div className="space-y-4">
      {/* 받는 사람 검색 */}
      <div className="space-y-2">
        <Label htmlFor="email">받는 사람 이메일</Label>
        <Input
          id="email"
          placeholder="이메일을 입력하세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {email && profileQuery.data && (
          <div
            className="rounded-lg border p-3 cursor-pointer hover:bg-muted"
            onClick={() => setSelectedUser(profileQuery.data)}
          >
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profileQuery.data.avatar} alt={profileQuery.data.name} />
                <AvatarFallback>{profileQuery.data.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{profileQuery.data.name}</p>
                <p className="text-xs text-muted-foreground">{profileQuery.data.email}</p>
              </div>
            </div>
          </div>
        )}

        {selectedUser && (
          <div className="rounded-lg border border-primary/50 bg-primary/5 p-3">
            <p className="text-sm font-medium">선택된 받는 사람: {selectedUser.name}</p>
          </div>
        )}
      </div>

      {/* 메시지 (선택사항) */}
      <div className="space-y-2">
        <Label htmlFor="message">메시지 (선택사항)</Label>
        <Input
          id="message"
          placeholder="전송 메시지를 입력하세요"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      {/* 전송 버튼 */}
      <Button
        onClick={handleTransfer}
        disabled={!selectedUser || transferMutation.isPending}
        className="w-full"
      >
        {transferMutation.isPending ? '전송 중...' : '전송하기'}
      </Button>
    </div>
  )
}
