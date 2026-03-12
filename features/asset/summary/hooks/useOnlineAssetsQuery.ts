import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import type { Method } from "axios"
import request from "@/lib/api/client"
import APIResponse from "@/lib/api/types/response"
import { OnlineAssetModel, OnlineAssetResponse } from "../model/online-asset"
import { useAppDispatch } from "@/lib/redux/hooks"
import { setAssetItems } from "@/features/asset/store/slice"

type OnlineAssetRecipientType = "user" | "community"

interface UseOnlineAssetsQueryOptions {
  recipientType?: OnlineAssetRecipientType
  communityId?: string
  enabled?: boolean
  syncToStore?: boolean
}

export const ONLINE_ASSET_QUERY_KEY = ["onlineAssets"] as const
const ONLINE_ASSET_ENDPOINT = "/asset/summary/online"

const fetchOnlineAssets = async ({
  recipientType,
  communityId,
}: {
  recipientType: OnlineAssetRecipientType
  communityId?: string
}) => {
  const response = await request({
    method: "GET" as Method,
    url: ONLINE_ASSET_ENDPOINT,
    params: {
      recipientType,
      ...(communityId ? { communityId } : {}),
    },
  }) as APIResponse<OnlineAssetResponse[]>

  const data = response.data ?? []

  return OnlineAssetModel.fromResponses(data)
}

export const useOnlineAssetsQuery = (options: UseOnlineAssetsQueryOptions = {}) => {
  const {
    recipientType = "user",
    communityId,
    enabled = true,
    syncToStore = recipientType === "user",
  } = options
  const dispatch = useAppDispatch()
  const queryState = useQuery<OnlineAssetModel[]>({
    queryKey: [...ONLINE_ASSET_QUERY_KEY, recipientType, communityId ?? "self"],
    queryFn: () => fetchOnlineAssets({ recipientType, communityId }),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    enabled: enabled && (recipientType !== "community" || Boolean(communityId)),
  })

  useEffect(() => {
    if (!syncToStore) {
      return
    }

    const assets = queryState.data ?? []
    dispatch(setAssetItems(assets.map((asset) => ({
      id: asset.id,
      name: asset.name,
      category: asset.category,
      amount: asset.amount,
      purchaseDate: asset.purchaseDate,
      status: asset.status,
      balance: asset.balance,
      description: asset.description,
    }))))
  }, [dispatch, queryState.data, syncToStore])

  return {
    ...queryState,
    assets: queryState.data ?? [],
  }
}

export type UseOnlineAssetsQueryResult = ReturnType<typeof useOnlineAssetsQuery>
