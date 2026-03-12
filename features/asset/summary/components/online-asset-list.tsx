import { Skeleton } from '@/components/ui/skeleton'
import { OnlineAssetModel } from '../model/online-asset'
import OnlineAssetItem from './online-asset-item'
import { isTransferable, getNonTransferableMessage } from '../../constants/transferable'

interface OnlineAssetListProps {
  assets: OnlineAssetModel[]
  isLoading: boolean
  isError: boolean
  showEmptyState: boolean
  onTransferClick?: (asset: OnlineAssetModel) => void
}

const OnlineAssetList = ({
  assets,
  isLoading,
  isError,
  showEmptyState,
  onTransferClick,
}: OnlineAssetListProps) => {
  return (
    <div className="space-y-4">
      {isLoading && (
        <div className="space-y-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      )}

      {isError && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-destructive">
          온라인 재화 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
        </div>
      )}

      {showEmptyState && (
        <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
          등록된 온라인 재화가 없습니다.
        </div>
      )}

      {assets.map((asset) => {
        const transferable = isTransferable(asset.category)
        const nonTransferableMessage = getNonTransferableMessage(asset.category)

        return (
          <div key={asset.id} className="flex items-center justify-between">
            <div className="flex-1">
              <OnlineAssetItem asset={asset} />
            </div>
            {onTransferClick && (
              <div className="ml-2 relative group">
                <button
                  onClick={() => onTransferClick(asset)}
                  disabled={!transferable}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    transferable
                      ? 'text-primary hover:bg-primary/10 cursor-pointer'
                      : 'text-muted-foreground bg-muted/50 cursor-not-allowed opacity-60'
                  }`}
                  title={nonTransferableMessage || undefined}
                >
                  송금
                </button>
                {!transferable && nonTransferableMessage && (
                  <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                    {nonTransferableMessage}
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default OnlineAssetList
