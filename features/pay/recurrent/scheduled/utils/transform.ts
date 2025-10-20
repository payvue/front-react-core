import type { ExecutionStrategy } from "@/types"
import { SCHEDULE_TYPE_OPTIONS } from "../constants/condition"
import type { Pay } from "@/features/pay/types/rule"

export const transformConditionAlias = (strategy: ExecutionStrategy) => {
  return SCHEDULE_TYPE_OPTIONS.find(
    option => option.value === (strategy as Pay.ScheduleStrategy).scheduleType
  )?.label || "미정"
}
