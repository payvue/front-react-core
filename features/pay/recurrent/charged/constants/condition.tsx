import { NumberInput } from "@/shared/components/input";
import { CycleSelect } from "@/shared/components/select";

export type ConditionType = "balance_below" | "date_based" | "usage_based";

interface ConditionConfig {
  label: string;
  displayName: string;
  renderInput: (value: string, onChange: (value: string) => void) => React.ReactNode;
}

export const CONDITION_CONFIGS: Record<ConditionType, ConditionConfig> = {
  balance_below: {
    label: "기준 잔액",
    displayName: "잔액이 특정 금액 이하일 때",
    renderInput: (value, onChange) => (
      <NumberInput value={value} onChange={onChange} placeholder="10000" id="triggerValue" />
    ),
  },
  date_based: {
    label: "결제 주기",
    displayName: "특정 날짜마다",
    renderInput: (value, onChange) => (
      <CycleSelect
        value={value}
        onChange={onChange}
        options={[
          { value: "1", label: "매주" },
          { value: "2", label: "매월" },
        ]}
      />
    ),
  },
  usage_based: {
    label: "기준 사용량",
    displayName: "사용량 기준",
    renderInput: (value, onChange) => (
      <NumberInput value={value} onChange={onChange} placeholder="사용량 입력" id="triggerValue" />
    ),
  },
}