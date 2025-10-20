import type { Pay } from "@/features/pay/types/rule";
import { CONDITION_CONFIGS, type ConditionType, type TriggerType } from "../constants/condition";
import { useMemo } from "react";

interface UseAutoChargeFormProps {
  newRule: any;
  onRuleChange: (rule: any) => void;
}

const useAutoChargeForm = ({ newRule, onRuleChange }: UseAutoChargeFormProps) => {
  const strategy = (newRule.strategy as Pay.ConditionStrategy) || {}
  const triggerType = (strategy.triggerType || "balance_below") as ConditionType
  const config = CONDITION_CONFIGS[triggerType]

  const conditions = useMemo(() => {
    return Object.entries(CONDITION_CONFIGS).map(([key, config]) => ({
        value: key,
        label: config.displayName,
    }))
  }, [])

  const updateField = (field: string, value: any) => {
    onRuleChange({ ...newRule, [field]: value });
  }

  const updateStrategy = (updates: Partial<Pay.ConditionStrategy>) => {
    onRuleChange({
      ...newRule,
      strategy: { ...strategy, ...updates } as Pay.ConditionStrategy,
    })
  }

  const handleTriggerTypeChange = (type: TriggerType) => {
    updateStrategy({ triggerType: type, triggerValue: "" });
  }

  const handleTriggerValueChange = (value: string) => {
    updateStrategy({ triggerValue: value });
  }

  return {
    conditions,
    triggerType,
    config,
    strategy,
    updateField,
    handleTriggerTypeChange,
    handleTriggerValueChange,
  }
}

export default useAutoChargeForm