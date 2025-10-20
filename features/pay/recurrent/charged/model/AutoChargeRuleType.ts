

import type { Pay } from "@/features/pay/types/rule"
import type { ExecutionStrategy } from "@/types"
import { ConditionStrategyType } from "./ConditionStrategyType"

class AutoChargeRuleType implements Pay.AutoChargeRule {
  private readonly _id: string
  private readonly _name: string
  private readonly _chargeAmount: string
  private readonly _paymentMethod: string
  private readonly _isActive: boolean
  private readonly _lastTriggered?: string
  private readonly _nextTrigger?: string
  private readonly _strategy: ExecutionStrategy

  constructor(raw: Pay.AutoChargeRule) {
    this._id = raw.id
    this._name = raw.name
    this._chargeAmount = raw.chargeAmount
    this._paymentMethod = raw.paymentMethod
    this._isActive = raw.isActive
    this._lastTriggered = raw.lastTriggered
    this._nextTrigger = raw.nextTrigger

    this._strategy = this.createStrategy(raw.strategy)
  }

  private createStrategy(strategy: Pay.AutoChargeRule["strategy"]): ExecutionStrategy {
    switch (strategy.type) {
      case "condition":
        return new ConditionStrategyType(strategy as Pay.ConditionStrategy, this._name)
      default:
        throw new Error(`지원되지 않는 strategy 타입: ${strategy.type}`)        
    }    
  }

  get id() {
    return this._id
  }
  get name() {
    return this._name
  }
  get chargeAmount() {
    return this._chargeAmount
  }
  get paymentMethod() {
    return this._paymentMethod
  }
  get isActive() {
    return this._isActive
  }
  get lastTriggered() {
    return this._lastTriggered
  }
  get nextTrigger() {
    return this._nextTrigger
  }
  get strategy() {
    return this._strategy
  }

  execute() {
    this._strategy.execute()
  }
}

export { AutoChargeRuleType }
