import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createOnlineAsset, type CreateOnlineAssetPayload } from '../api'
import { ONLINE_ASSET_QUERY_KEY } from './useOnlineAssetsQuery'
import { ASSET_SUMMARY_QUERY_KEY } from './useAssetSummaryQuery'

export const useCreateOnlineAsset = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateOnlineAssetPayload) => createOnlineAsset(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ONLINE_ASSET_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ASSET_SUMMARY_QUERY_KEY })
    },
  })
}
