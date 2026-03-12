import { QUERY_ALARM_KEY } from '@/components/context/alarm'
import { useAppDispatch } from '@/lib/redux/hooks'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { unauthenticated } from '../auth'
import useAlarmAPI from './api'
import { Alarm } from '@/types'

const useAlarmQuery = (
  authenticated: () => (() => boolean),
  subscribe: boolean,
  page: number,
  isLoggedIn: boolean,
) => {
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()
  const { paginated } = useAlarmAPI()

  const cache = async (next: number) => {
    const data = await queryClient.ensureQueryData({
      queryKey: [QUERY_ALARM_KEY, subscribe, next, isLoggedIn],
      queryFn: async () => {
        if (!isLoggedIn || !authenticated()()) {
          dispatch(unauthenticated())
          return { noti: [] }
        }

        const result = await paginated(next)
        return result.data
      },
      staleTime: isLoggedIn ? 0 : 1000 * 60 * 5,
    })

    return data as Alarm.Context
  }

  const { data, refetch: received } = useQuery({
    queryKey: [QUERY_ALARM_KEY, subscribe, page, isLoggedIn],
    queryFn: async () => {
      if (!isLoggedIn || !authenticated()()) {
        dispatch(unauthenticated())
        return { noti: [] }
      }

      return await cache(page)
    },
    staleTime: isLoggedIn ? 0 : 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: 1,
    enabled: subscribe && page > 0,
  })

  return {
    data,
    cache,
    received,
  }
}

export default useAlarmQuery
