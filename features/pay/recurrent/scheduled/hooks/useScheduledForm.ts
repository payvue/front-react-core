import { useMemo, useState } from "react";
import { SCHEDULE_TYPE_OPTIONS } from "../constants/condition";
import type { Pay } from "@/features/pay/types/rule";

const initialState: Partial<Pay.ScheduledRule> = {
  merchantName: "",
  amount: "",
  paymentMethod: "",
  nextPaymentDate: "",
  strategy: {
    type: "schedule",
    scheduleType: "monthly"
  } as Pay.ScheduleStrategy
}

const useScheduledForm = () => {

  const [scheduledPayment, setScheduledPayment] = useState<Partial<Pay.ScheduledRule>>(initialState)

    const conditions = useMemo(() => {
        return Object.entries(SCHEDULE_TYPE_OPTIONS).map(([key, config]) => ({
            value: key,
            label: config.label,
        }))
    }, [])

  const updateField = (field: string, value: any) => {
    setScheduledPayment({ ...scheduledPayment, [field]: value });
  }

  const updateStrategyField = (field: string, value: any) => {
  setScheduledPayment((prev) => ({
    ...prev,
    strategy: {
      ...prev.strategy,
      [field]: value,
    } as Pay.ScheduleStrategy
  }))
  }  

  const scheduleOptions = SCHEDULE_TYPE_OPTIONS;

  return {
    scheduled: scheduledPayment,
    conditions,
    updateField,
    updateStrategyField,
    scheduleOptions,
  }
}

export default useScheduledForm