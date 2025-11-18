'use client'

import type { SmartStoreInfo, SmartStoreMember } from '@/features/smartstore/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star } from 'lucide-react'
import { formatCurrency } from '@/util/display'
import { CommunityMemberGrid } from '@/features/smartstore/components/community-member-grid'

interface StoreOverviewTabProps {
  store: SmartStoreInfo
  communityName?: string
  members: SmartStoreMember[]
  manager?: SmartStoreMember
}

export function StoreOverviewTab({ store, communityName, members, manager }: StoreOverviewTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">{store.name}</CardTitle>
            {communityName && <Badge variant="secondary">{communityName}</Badge>}
          </div>
          <p className="text-sm text-muted-foreground">{store.description}</p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">평점</span>
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Star className="h-5 w-5 text-yellow-500" />
                {store.rating}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">구독자</span>
              <span className="text-lg font-semibold">{store.subscribers.toLocaleString()}명</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">월 거래액</span>
              <span className="text-lg font-semibold">{formatCurrency(store.monthlyVolume)}</span>
            </div>
          </div>
          <div className="rounded-lg border p-4 bg-muted/30">
            <p className="text-sm text-muted-foreground mb-2">스토어 매니저</p>
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={manager?.avatar} alt={manager?.name} />
                <AvatarFallback>{manager?.name?.slice(0, 2) ?? 'GM'}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">{manager?.name ?? '미정'}</p>
                <p className="text-xs text-muted-foreground">{manager?.role ?? '할당 필요'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <CommunityMemberGrid members={members} />
    </div>
  )
}
