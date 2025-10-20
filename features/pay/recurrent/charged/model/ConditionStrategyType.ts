import type { Pay } from "@/features/pay/types/rule"

class ConditionStrategyType implements Pay.ConditionStrategy {
  private readonly _type = "condition" as const
  private readonly _triggerType: "balance_below" | "date_based" | "usage_based"
  private readonly _triggerValue: string
  private readonly _ruleName: string

  constructor(strategy: Pay.ConditionStrategy, ruleName: string) {
    this._triggerType = strategy.triggerType
    this._triggerValue = strategy.triggerValue
    this._ruleName = ruleName
  }

  get type() {
    return this._type
  }

  execute() {
    console.log(`자동 충전 실행: ${this._ruleName}`)
  }

  get triggerType() {
    return this._triggerType
  }

  get triggerValue() {
    return this._triggerValue
  }

  get ruleName() {
    return this._ruleName
  }
}

export { ConditionStrategyType }