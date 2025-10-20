import { useCallback, useEffect, useState } from "react"
import type { Pay } from "@/features/pay/types/rule"

interface UseAutoChargeRulesProps {
  initialRules?: Pay.AutoChargeRule[]
}

const initial:Partial<Pay.AutoChargeRule> = {
    name: "",
    strategy: { type: "condition", triggerType: "balance_below", triggerValue: "" } as Pay.ConditionStrategy,
    chargeAmount: "",
    paymentMethod: "",    
}

const useAutoChargeRules = ({ initialRules = [] }: UseAutoChargeRulesProps = {}) => {
  const [autoChargeRules, setAutoChargeRules] = useState<Pay.AutoChargeRule[]>(initialRules)
  const [newRule, setNewRule] = useState<Partial<Pay.AutoChargeRule>>(initial)
  
  useEffect(() => {
    setAutoChargeRules(prevRules =>
        JSON.stringify(prevRules) !== JSON.stringify(initialRules)
            ? initialRules
            : prevRules
        )
  }, [initialRules])
  const createRule = useCallback(() => { setNewRule(initial) }, [newRule])

  const toggleRule = useCallback((ruleId: string) => {
    setAutoChargeRules((prev) =>
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
    autoChargeRules,
    newRule,
    setNewRule,
    createRule,
    toggleRule,
  }
}

export default useAutoChargeRules