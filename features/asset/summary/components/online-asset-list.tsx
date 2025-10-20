import { Skeleton } from "@/components/ui/skeleton"
import { OnlineAssetModel } from "../model/online-asset"
import OnlineAssetItem from "./online-asset-item"

interface OnlineAssetListProps {
  assets: OnlineAssetModel[]
  isLoading: boolean
  isError: boolean
  showEmptyState: boolean
}

const OnlineAssetList = ({ assets, isLoading, isError, showEmptyState }: OnlineAssetListProps) => {
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

      {assets.map((asset) => (
        <OnlineAssetItem key={asset.id} asset={asset} />
      ))}
    </div>
  )
}

export default OnlineAssetList
