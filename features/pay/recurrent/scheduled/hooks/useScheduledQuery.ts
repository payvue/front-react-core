import type { Pay } from "@/features/pay/types/rule"
import request from "@/lib/api/client"
import { useQuery } from "@tanstack/react-query"
import type { Method } from "axios"
import { ScheduledRuleType } from "../models/ScheduledRuleType"




export const useScheduledQuery = () => {
  const { data: scheduled } = useQuery({
    queryKey: ["scheduledPaymentRules"],
    queryFn: async (): Promise<Pay.ScheduledRule[]> => {
        return request({
        method: "GET" as Method,
        url: "/recurrent/condition/scheduled",
      })
      .then((res) => res.data.map((schedule: Pay.ScheduledRule) => new ScheduledRuleType(schedule)))
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  })

  return {
    scheduled
  }
}

export default useScheduledQuery