import { PaymentMethodModel } from "@/features/asset/method/model/payment-method-type"
import PaymentMethodItem from "./payment-methods-item"

interface PaymentMethodListProps {
  methods: PaymentMethodModel[]
  isLoading: boolean
  isError: boolean
  showEmptyState: boolean
  onDelete: (id: string) => void
  onSetDefault: (id: string) => void
}

const PaymentMethodList = ({
  methods,
  isLoading,
  isError,
  showEmptyState,
  onDelete,
  onSetDefault,
}: PaymentMethodListProps) => {
  return (
    <div className="space-y-4">
      {isLoading && (
        <div className="space-y-2">
          <div className="h-14 rounded-lg bg-muted animate-pulse" />
          <div className="h-14 rounded-lg bg-muted animate-pulse" />
        </div>
      )}

      {isError && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-destructive">
          결제 수단 정보를 불러오지 못했습니다. 새로고침을 시도해주세요.
        </div>
      )}

      {showEmptyState && (
        <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
          등록된 결제 수단이 없습니다. 상단의 추가 버튼을 눌러 등록을 시작하세요.
        </div>
      )}

      {methods.map((method) => (
        <PaymentMethodItem
          key={method.id}
          method={method}
          onDelete={onDelete}
          onSetDefault={onSetDefault}
        />
      ))}
    </div>
  )
}

export default PaymentMethodList