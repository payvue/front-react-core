import { Button } from "@/components/ui/button"
import { Settings, Zap } from "lucide-react"
import useAutoChargeRules from "../hooks/useChargeCacheRule"
import useRuleQuery from "../hooks/useRuleQuery"
import ConfiguredRules from "./configured-rules"
import useAutoChargeForm from "../hooks/useAutoChargeForm"
import { GridLayout } from "@/shared/components/layout"
import { CardSection } from "@/shared/components/section"
import { DynamicField, SelectField, TextField } from "@/shared/components/field"


const AutoCharge = () => {
  const { rules } = useRuleQuery();
  const { autoChargeRules, newRule, setNewRule, createRule, toggleRule } = useAutoChargeRules({
    initialRules: rules
  });

  const form = useAutoChargeForm({
    newRule,
    onRuleChange: setNewRule,
  });

  return (
    <>
      <CardSection
        icon={<Zap className="h-5 w-5" />}
        title="자동 충전 규칙 생성"
        description="특정 조건을 만족할 때 자동으로 잔액을 충전하는 규칙을 설정할 수 있습니다"
      >
        <div className="space-y-4">
          <GridLayout columns={2}>
            <TextField
              label="규칙 이름"
              value={newRule.name!}
              onChange={(value) => form.updateField("name", value)}
              placeholder="예: 잔액 부족시 자동 충전"
              id="ruleName"
            />

            <SelectField
              label="충전 조건"
              value={form.triggerType}
              onChange={form.handleTriggerTypeChange}
              options={form.conditions}
              placeholder="조건 선택"
            />
          </GridLayout>

          <GridLayout columns={2}>
            <DynamicField label={form.config.label}>
              {form.config.renderInput(form.strategy.triggerValue?.toString() || "", form.handleTriggerValueChange)}
            </DynamicField>

            <TextField
              label="충전 금액"
              value={newRule.chargeAmount}
              onChange={(value) => form.updateField("chargeAmount", value)}
              placeholder="50000"
              id="chargeAmount"
            />
          </GridLayout>

          <Button onClick={createRule} className="w-full" size="lg">
            자동 충전 규칙 생성
          </Button>
        </div>   
      </CardSection>    
      <CardSection
        icon={<Settings className="h-5 w-5" />}
        title="활성 자동 충전 규칙"
        description="설정한 자동 충전 규칙을 확인할 수 있습니다."
      >
        <ConfiguredRules 
          rules={autoChargeRules}
          toggle={toggleRule}
        ></ConfiguredRules>                   
      </CardSection>        
    </>  
  );
};

export default AutoCharge