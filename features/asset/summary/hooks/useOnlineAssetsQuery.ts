import { useQuery } from "@tanstack/react-query"
import type { Method } from "axios"
import request from "@/lib/api/client"
import APIResponse from "@/lib/api/types/response"
import { OnlineAssetModel, OnlineAssetResponse } from "../model/online-asset"

export const ONLINE_ASSET_QUERY_KEY = ["onlineAssets"] as const
const ONLINE_ASSET_ENDPOINT = "/asset/summary/online"

const fetchOnlineAssets = async () => {
  const response = await request({
    method: "GET" as Method,
    url: ONLINE_ASSET_ENDPOINT,
  }) as APIResponse<OnlineAssetResponse[]>

  const data = response.data ?? []

  return OnlineAssetModel.fromResponses(data)
}

export const useOnlineAssetsQuery = () => {
  const queryState = useQuery<OnlineAssetModel[]>({
    queryKey: ONLINE_ASSET_QUERY_KEY,
    queryFn: fetchOnlineAssets,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  })

  return {
    ...queryState,
    assets: queryState.data ?? [],
  }
}

export type UseOnlineAssetsQueryResult = ReturnType<typeof useOnlineAssetsQuery>
