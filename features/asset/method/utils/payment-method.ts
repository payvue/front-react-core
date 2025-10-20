import { createElement, ReactNode } from "react"
import { Building2, CreditCard, Smartphone } from "lucide-react"
import { PaymentMethodType as PaymentMethodCategory } from "../types/payment-method"

export const resolveIcon = (type: PaymentMethodCategory): ReactNode => {
  switch (type) {
    case "card":
      return createElement(CreditCard, { className: "h-5 w-5" })
    case "bank":
      return createElement(Building2, { className: "h-5 w-5" })
    case "mobile":
      return createElement(Smartphone, { className: "h-5 w-5" })
    default:
      return createElement(CreditCard, { className: "h-5 w-5" })
  }
}

export const resolveTypeLabel = (type: PaymentMethodCategory): string => {
  switch (type) {
    case "card":
      return "신용·체크카드"
    case "bank":
      return "은행 계좌"
    case "mobile":
      return "모바일 결제"
    default:
      return "기타 결제수단"
  }
}
