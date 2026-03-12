import { useQuery } from "@tanstack/react-query"
import type { Method } from "axios"
import request from "@/lib/api/client"
import APIResponse from "@/lib/api/types/response"
import type { AssetSummaryResponse, AssetSummaryView } from "../types/asset-summary"
import { mapAssetSummaryResponse } from "../utils/asset-summary"

export const ASSET_SUMMARY_QUERY_KEY = ["assetSummary"] as const
const ASSET_SUMMARY_ENDPOINT = "/asset/summary"

const fetchAssetSummary = async (): Promise<AssetSummaryView> => {
  const response = await request({
    method: "GET" as Method,
    url: ASSET_SUMMARY_ENDPOINT,
  }) as APIResponse<AssetSummaryResponse>

  return mapAssetSummaryResponse(response.data)
}

export const useAssetSummaryQuery = () => {
  const queryState = useQuery<AssetSummaryView>({
    queryKey: ASSET_SUMMARY_QUERY_KEY,
    queryFn: fetchAssetSummary,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  })

  return {
    ...queryState,
    summary: queryState.data ?? mapAssetSummaryResponse(),
  }
}

export type UseAssetSummaryQueryResult = ReturnType<typeof useAssetSummaryQuery>
