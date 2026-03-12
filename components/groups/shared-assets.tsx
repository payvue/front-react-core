'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Share } from 'lucide-react'
import { useOnlineAssetsQuery } from '@/features/asset/summary/hooks/useOnlineAssetsQuery'
import {
  formatAssetAmount,
  resolveAssetIcon,
  resolveCategoryLabel,
  resolveStatusMeta,
} from '@/features/asset/summary/utils/online-asset'

export function SharedAssets({ groupId }: { groupId: string }) {
  const { assets, isLoading, isError, refetch } = useOnlineAssetsQuery({
    recipientType: 'community',
    communityId: groupId,
    syncToStore: false,
  })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Share className="h-5 w-5" />
          공유 온라인 재화
        </CardTitle>
        <Button size="sm" variant="outline" onClick={() => refetch()}>
          새로고침
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {isLoading && <p className="text-sm text-muted-foreground">공유 재화를 불러오는 중입니다...</p>}

        {!isLoading && isError && (
          <div className="space-y-2">
            <p className="text-sm text-destructive">공유 재화 조회에 실패했습니다.</p>
            <Button size="sm" variant="outline" onClick={() => refetch()}>
              다시 시도
            </Button>
          </div>
        )}

        {!isLoading && !isError && assets.length === 0 && (
          <p className="text-sm text-muted-foreground">등록된 공유 재화가 없습니다.</p>
        )}

        {!isLoading &&
          !isError &&
          assets.map((asset) => {
            const status = resolveStatusMeta(asset.status)

            return (
              <div key={asset.id} className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-muted p-2">{resolveAssetIcon(asset.category)}</div>
                  <div>
                    <p className="font-medium">{asset.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{resolveCategoryLabel(asset.category)}</span>
                      <span>•</span>
                      <span>{asset.purchaseDate}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-medium">{formatAssetAmount(asset.amount)}원</p>
                  <Badge variant={status.variant} className={status.className}>
                    {status.label}
                  </Badge>
                </div>
              </div>
            )
          })}
      </CardContent>
    </Card>
  )
}
