'use client'

import { SummaryCardHeader } from '@/shared/components/summary-card-header'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { SmartStoreInfo } from '@/features/smartstore/types'

interface StoreSelectorSectionProps {
  stores: SmartStoreInfo[]
  selectedStoreId: string
  onSelect: (storeId: string) => void
}

export function StoreSelectorSection({ stores, selectedStoreId, onSelect }: StoreSelectorSectionProps) {
  return (
    <Card>
      <SummaryCardHeader
        title="참여 중인 스토어"
        description="커뮤니티별 스토어를 선택해 운영 현황과 상품을 확인하세요"
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        titleClassName="text-base md:text-lg"
        action={
          <Select value={selectedStoreId} onValueChange={onSelect}>
            <SelectTrigger className="w-full md:w-64">
              <SelectValue placeholder="스토어 선택" />
            </SelectTrigger>
            <SelectContent>
              {stores.map((store) => (
                <SelectItem key={store.id} value={store.id}>
                  {store.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />
    </Card>
  )
}
