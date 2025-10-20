import type { ExecutionStrategy } from "@/types"

export declare namespace Pay {

	interface RuleBase {
		id: string
		name: string
		paymentMethod: string
		isActive: boolean
		lastTriggered?: string
		nextTrigger?: string
	}

	interface ConditionStrategy extends ExecutionStrategy {
		type: "condition"
		triggerType: "balance_below" | "date_based" | "usage_based"
		triggerValue: string
	}

	interface ScheduleStrategy extends ExecutionStrategy {
		type: "schedule"
		scheduleType: "monthly" | "weekly" | "yearly"
	}

	interface AutoChargeRule extends RuleBase {
		chargeAmount: string
		strategy: ExecutionStrategy
	}

	interface ScheduledRule extends RuleBase {
		merchantName: string
		amount: string
		status: "active" | "paused" | "failed"
		lastPaymentDate?: string
		nextPaymentDate: string
		failureReason?: string
		strategy: ExecutionStrategy
	}
}
