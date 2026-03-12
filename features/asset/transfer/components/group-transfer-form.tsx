'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { OnlineAssetModel } from '../../summary/model/online-asset'
import { useMyGroupsQuery } from '../hooks/useMyGroupsQuery'
import { useTransferAssetToCommunity } from '../hooks/useAssetTransferMutation'

interface GroupTransferFormProps {
  asset: OnlineAssetModel
  onSuccess: () => void
}

export default function GroupTransferForm({ asset, onSuccess }: GroupTransferFormProps) {
  const [selectedGroupId, setSelectedGroupId] = useState('')
  const [message, setMessage] = useState('')

  const groupsQuery = useMyGroupsQuery()
  const transferMutation = useTransferAssetToCommunity()

  const selectedGroup = groupsQuery.data?.find((g) => g.id === selectedGroupId)

  const handleTransfer = async () => {
    if (!selectedGroupId) {
      alert('그룹을 선택하세요.')
      return
    }

    try {
      await transferMutation.mutateAsync({
        assetType: asset.category,
        payload: {
          assetId: asset.id,
          groupId: selectedGroupId,
          message: message || undefined,
        },
      })

      alert(`${selectedGroup?.name}에 ${asset.name}을 전송했습니다.`)
      setSelectedGroupId('')
      setMessage('')
      onSuccess()
    } catch (err: any) {
      alert(err?.message || '전송에 실패했습니다.')
    }
  }

  return (
    <div className="space-y-4">
      {/* 그룹 선택 */}
      <div className="space-y-2">
        <Label htmlFor="group">그룹 선택</Label>
        <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
          <SelectTrigger id="group">
            <SelectValue placeholder="그룹을 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            {groupsQuery.data?.map((group) => (
              <SelectItem key={group.id} value={group.id}>
                {group.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {groupsQuery.isLoading && <p className="text-xs text-muted-foreground">그룹 로딩 중...</p>}
        {groupsQuery.isError && (
          <p className="text-xs text-destructive">그룹을 불러올 수 없습니다.</p>
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
        disabled={!selectedGroupId || transferMutation.isPending}
        className="w-full"
      >
        {transferMutation.isPending ? '전송 중...' : '전송하기'}
      </Button>
    </div>
  )
}
