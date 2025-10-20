import { Button } from "@/components/ui/button"
import { Calendar, Clock } from "lucide-react"
import useScheduledRule from "../hooks/useScheduledRule"
import { CardSection } from "@/shared/components/section"
import { SelectField, TextField } from "@/shared/components/field"
import { GridLayout } from "@/shared/components/layout"
import useScheduledForm from "../hooks/useScheduledForm"
import useScheduledQuery from "../hooks/useScheduledQuery"
import ConfiguredScheduledRules from "./configured-schedule-rules"
import type { Pay } from "@/features/pay/types/rule"


const Scheduled = () => {

  const { scheduled } = useScheduledQuery()
  const { scheduledPayments, toggleRule } = useScheduledRule({
    initialRules: scheduled
  })

  const form = useScheduledForm()

  const handleCreateScheduledPayment = () => {
    alert("예약 결제가 등록되었습니다!");
  }

  return (

    <>
      <CardSection
        icon={<Calendar className="h-5 w-5" />}
        title="새 예약 결제 등록"
        description="정기적으로 결제되는 구독 서비스나 정기 결제를 등록할 수 있습니다"
      >
        <div className="space-y-4">
          <TextField
            label="가맹점명"
            value={form.scheduled.merchantName}
            onChange={(value) => form.updateField("merchantName", value)}
            placeholder="예: 넷플릭스, 스포티파이"
            id="merchantName"
          />

          <TextField
            label="결제 금액"
            value={form.scheduled.amount}
            onChange={(value) => form.updateField("amount", value)}
            placeholder="17000"
            id="paymentAmount"
            type="number"
          />

          <GridLayout columns={2}>
            <SelectField
              label="결제 주기"
              value={(form.scheduled.strategy as Pay.ScheduleStrategy).scheduleType}
              onChange={(value) => form.updateStrategyField("scheduleType", value)}
              options={form.scheduleOptions}
            />

            <TextField
              label="다음 결제일"
              value={form.scheduled.nextPaymentDate}
              onChange={(value) => form.updateField("nextPaymentDate", value)}
              id="nextPaymentDate"
              type="date"
            />
          </GridLayout>

          <Button onClick={handleCreateScheduledPayment} className="w-full" size="lg">
            예약 결제 등록
          </Button>
        </div>
      </CardSection>
      <CardSection
        icon={<Clock className="h-5 w-5" />}
        title="활성 자동 충전 규칙"
        description="설정한 자동 충전 규칙을 확인할 수 있습니다."        
      >
        <ConfiguredScheduledRules
          rules={scheduledPayments}
          toggle={toggleRule}
        >
        </ConfiguredScheduledRules>
      </CardSection>

    </>
  )
}

export default Scheduled;