import type { Pay } from "@/features/pay/types/rule"
import { useCallback, useEffect, useState } from "react"

interface UseScheduledRulesProps {
  initialRules?: Pay.ScheduledRule[]
}

const useScheduledRule = ({ initialRules = [] }: UseScheduledRulesProps = {}) => {

  const [scheduledPayments, setScheduledPayments] = useState<Pay.ScheduledRule[]>(initialRules)

  useEffect(() => {
      setScheduledPayments(prevRules =>
          JSON.stringify(prevRules) !== JSON.stringify(initialRules)
              ? initialRules
              : prevRules
          )
  }, [initialRules])      

  const toggleRule = useCallback((ruleId: string) => {
    setScheduledPayments((prev) =>
      prev.map((rule) =>
        rule.id === ruleId
          ? {
              ...rule,
              isActive: !rule.isActive,
              strategy: { ...rule.strategy }
            }
          : rule
      )
    )
  }, [])    

      return {
        scheduledPayments, 
        setScheduledPayments,
        toggleRule
      }
}

export default useScheduledRule