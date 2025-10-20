import { useEffect } from "react"

interface PaymentEventHandlerProps {
  onPaymentClosed?: () => void
}

const usePaymentEventHandler = ({ onPaymentClosed }: PaymentEventHandlerProps) => {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data === "PAYMENT_CLOSED") {
        onPaymentClosed?.()
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [onPaymentClosed])
}

export default usePaymentEventHandler
