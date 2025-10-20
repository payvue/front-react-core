import type { ExecutionStrategy } from "@/types"
import type { Pay } from "@/features/pay/types/rule"
import { ScheduleStrategyType } from "./ScheduleStrategyType"

class ScheduledRuleType implements Pay.ScheduledRule {
  private readonly _id: string
  private readonly _name: string
  private readonly _merchantName: string
  private readonly _amount: number
  private readonly _paymentMethod: string
  private readonly _status: "active" | "paused" | "failed"
  private readonly _lastPaymentDate?: string
  private readonly _nextPaymentDate: string
  private readonly _failureReason?: string
  private readonly _strategy: ExecutionStrategy
  private readonly _isActive: boolean
  private readonly _lastTriggered?: string
  private readonly _nextTrigger?: string

  constructor(raw: Pay.ScheduledRule) {
    if (!raw) throw new Error("ScheduledRuleType 생성 시 raw 데이터가 필요합니다.")

    this._id = raw.id
    this._name = raw.name
    this._merchantName = raw.merchantName
    this._amount = raw.amount
    this._paymentMethod = raw.paymentMethod
    this._status = raw.status
    this._lastPaymentDate = raw.lastPaymentDate
    this._nextPaymentDate = raw.nextPaymentDate
    this._failureReason = raw.failureReason
    this._isActive = raw.status === "active"
    this._lastTriggered = raw.lastPaymentDate
    this._nextTrigger = raw.nextPaymentDate

    this._strategy = this.createStrategy(raw.strategy)
  }

  private createStrategy(strategy: Pay.ScheduledRule["strategy"]): ExecutionStrategy {
    switch (strategy.type) {
      case "schedule":
        return new ScheduleStrategyType(strategy as Pay.ScheduleStrategy, this._name)
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

  get merchantName() {
    return this._merchantName
  }

  get amount() {
    return this._amount
  }

  get paymentMethod() {
    return this._paymentMethod
  }

  get status() {
    return this._status
  }

  get lastPaymentDate() {
    return this._lastPaymentDate
  }

  get nextPaymentDate() {
    return this._nextPaymentDate
  }

  get failureReason() {
    return this._failureReason
  }

  get strategy() {
    return this._strategy
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

  execute() {
    this._strategy.execute()
  }
}

export { ScheduledRuleType }