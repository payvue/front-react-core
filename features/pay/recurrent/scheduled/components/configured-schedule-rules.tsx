import type { Pay } from "@/features/pay/types/rule"
import { formatCurrency } from "@/util/display"
import { Calendar, CreditCard, AlertTriangle } from "lucide-react"
import { transformConditionAlias } from "../utils/transform"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"


interface ConfiguredRulesProp {
    rules: Pay.ScheduledRule[]
    toggle: (ruleId: string) => void
}


const ConfiguredScheduledRules = ({ rules, toggle }: ConfiguredRulesProp) => {
    
    return (
        <>
            <div className="space-y-4">
                {rules.map((rule) => (
                    <div key={rule.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                        <h3 className="font-medium">{rule.merchantName}</h3>
                        <p className="text-sm text-muted-foreground">
                            {transformConditionAlias(rule.strategy as Pay.ScheduleStrategy)} {formatCurrency(Number(rule.amount))} 결제
                        </p>
                        </div>
                        <div className="flex items-center gap-2">
                        <Badge variant={rule.isActive ? "default" : "secondary"}>
                            {rule.isActive ? "활성" : "비활성"}
                        </Badge>
                        <Switch checked={rule.isActive} onCheckedChange={() => toggle(rule.id)} />
                        </div>
                    </div>

                    <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        <span>{rule.paymentMethod}</span>
                        </div>
                        <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>다음 결제: {rule.nextPaymentDate}</span>
                        {rule.lastPaymentDate && (
                            <>
                            <span>•</span>
                            <span>마지막 결제: {rule.lastPaymentDate}</span>
                            </>
                        )}
                        </div>
                        {rule.status === "failed" && rule.failureReason && (
                        <div className="flex items-center gap-2 text-red-600">
                            <AlertTriangle className="h-4 w-4" />
                            <span>실패 사유: {rule.failureReason}</span>
                        </div>
                        )}
                    </div>
                    </div>
                ))}
            </div>     
        </>
    )
}

export default ConfiguredScheduledRules