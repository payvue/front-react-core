import { Badge } from '@/components/ui/badge'
import { OnlineAssetModel } from '../model/online-asset'
import {
  resolveAssetIcon,
  resolveStatusMeta,
  formatAssetAmount,
  resolveCategoryLabel,
} from '../utils/online-asset'
import { isTransferable } from '../../constants/transferable'
import { cn } from '@/lib/utils'

interface OnlineAssetItemProps {
  asset: OnlineAssetModel
}

const OnlineAssetItem = ({ asset }: OnlineAssetItemProps) => {
  const status = resolveStatusMeta(asset.status)
  const transferable = isTransferable(asset.category)

  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-muted p-2">{resolveAssetIcon(asset.category)}</div>
        <div className="space-y-1">
          <p className="font-medium leading-tight">{asset.name}</p>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="secondary" className="bg-muted text-muted-foreground">
              {resolveCategoryLabel(asset.category)}
            </Badge>
            {!transferable && (
              <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100">
                전송 불가
              </Badge>
            )}
            <span>구매일 {asset.purchaseDate}</span>
          </div>
          {asset.description && (
            <p className="text-xs text-muted-foreground">{asset.description}</p>
          )}
        </div>
      </div>
      <div className="text-right space-y-1">
        <p className="font-medium">{formatAssetAmount(asset.amount)}원</p>
        {typeof asset.balance === 'number' && (
          <p className="text-xs text-muted-foreground">잔액 {formatAssetAmount(asset.balance)}원</p>
        )}
        <Badge variant={status.variant} className={cn('inline-flex', status.className)}>
          {status.label}
        </Badge>
      </div>
    </div>
  )
}

export default OnlineAssetItem
