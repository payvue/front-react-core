import type { Pay } from "@/features/pay/types/rule"
import request from "@/lib/api/client"
import { useQuery } from "@tanstack/react-query"
import type { Method } from "axios"
import { AutoChargeRuleType } from "../model/AutoChargeRuleType"


export const useRuleQuery = () => {
  const { data: rules} = useQuery({
    queryKey: ["autoChargeRules"],
    queryFn: async (): Promise<Pay.AutoChargeRule[]> => {
        return request({
        method: "GET" as Method,
        url: "/recurrent/condition/charge",
      })
      .then((res) => res.data.map((rule: Pay.AutoChargeRule) => new AutoChargeRuleType(rule)))
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  })

  return {
    rules
  }
}

export default useRuleQuery