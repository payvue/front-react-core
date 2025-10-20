import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PaymentMethodModel } from "@/features/asset/method/model/payment-method-type"
import { Trash2 } from "lucide-react"
import { resolveIcon, resolveTypeLabel } from "@/features/asset/method/utils/payment-method"

interface PaymentMethodItemProps {
  method: PaymentMethodModel
  onDelete: (id: string) => void
  onSetDefault: (id: string) => void
}

const PaymentMethodItem = ({ method, onDelete, onSetDefault }: PaymentMethodItemProps) => {
  const statusBadge = method.isActive ? (
    <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
      활성
    </Badge>
  ) : (
    <Badge variant="outline" className="border-rose-200 bg-rose-50 text-rose-600">
      비활성화
    </Badge>
  )

  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-muted p-2">{resolveIcon(method.type)}</div>
        <div className="space-y-2">
          <p className="font-medium leading-tight">{method.name}</p>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="secondary" className="bg-muted text-muted-foreground">
              {resolveTypeLabel(method.type)}
            </Badge>
            {method.isDefault && (
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                기본
              </Badge>
            )}
            {statusBadge}
          </div>
          {method.details && (
            <p className="text-xs text-muted-foreground opacity-60">{method.details}</p>
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {!method.isDefault && (
          <Button variant="outline" size="sm" onClick={() => onSetDefault(method.id)}>
            기본 설정
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={() => onDelete(method.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default PaymentMethodItem