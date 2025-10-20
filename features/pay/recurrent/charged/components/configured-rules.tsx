import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import type { Pay } from "@/features/pay/types/rule"
import { formatCurrency } from "@/util/display"
import { CreditCard } from "lucide-react"


interface ConfiguredRulesProp {
    rules: Pay.AutoChargeRule[]
    toggle: (ruleId: string) => void
}

const ConfiguredRules = ({ rules, toggle }: ConfiguredRulesProp) => {
    
    return (
        <>
            <div className="space-y-4">
                {rules.map((rule) => (
                <div key={rule.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                    <div>
                        <h3 className="font-medium">{rule.name}</h3>
                        <p className="text-sm text-muted-foreground">
                        {rule.nextTrigger} → {formatCurrency(Number(rule.chargeAmount))} 충전
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant={rule.isActive ? "default" : "secondary"}>
                        {rule.isActive ? "활성" : "비활성"}
                        </Badge>
                        <Switch checked={rule.isActive} onCheckedChange={() => toggle(rule.id)} />
                    </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CreditCard className="h-4 w-4" />
                    <span>{rule.paymentMethod}</span>
                    {rule.lastTriggered && (
                        <>
                        <span>•</span>
                        <span>마지막 실행: {rule.lastTriggered}</span>
                        </>
                    )}
                    </div>
                </div>
                ))}
            </div>
        </>
    )
}

export default ConfiguredRules