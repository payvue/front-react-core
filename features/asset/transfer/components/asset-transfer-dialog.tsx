'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { OnlineAssetModel } from '../../summary/model/online-asset'
import UserTransferForm from './user-transfer-form'
import GroupTransferForm from './group-transfer-form'
import { isTransferable, getNonTransferableMessage } from '../../constants/transferable'

interface AssetTransferDialogProps {
  isOpen: boolean
  onClose: () => void
  asset: OnlineAssetModel
}

export default function AssetTransferDialog({ isOpen, onClose, asset }: AssetTransferDialogProps) {
  const [transferTab, setTransferTab] = useState<'user' | 'group'>('user')
  const transferable = isTransferable(asset.category)
  const nonTransferableMessage = getNonTransferableMessage(asset.category)

  // 비전송 자산인 경우 자동으로 다이얼로그 닫기
  useEffect(() => {
    if (isOpen && !transferable) {
      alert(nonTransferableMessage || '이 자산은 전송이 불가능합니다.')
      onClose()
    }
  }, [isOpen, transferable, nonTransferableMessage, onClose])

  if (!transferable) {
    return null
  }

  return (
    <Dialog open={isOpen && transferable} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{asset.name} 전송</DialogTitle>
        </DialogHeader>

        <Tabs
          value={transferTab}
          onValueChange={(v) => setTransferTab(v as 'user' | 'group')}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="user">사용자에게</TabsTrigger>
            <TabsTrigger value="group">그룹에게</TabsTrigger>
          </TabsList>

          <TabsContent value="user">
            <UserTransferForm asset={asset} onSuccess={onClose} />
          </TabsContent>

          <TabsContent value="group">
            <GroupTransferForm asset={asset} onSuccess={onClose} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
