

export interface PayCore {
  reserve: (url: string, onClose?: () => void) => void
  startProcessing: () => void
  finishProcessing: () => void
  waitUntilFinished: () => Promise<void>
  isProcessing: () => boolean
  notifyPaymentClosed: (message?: string) => void
}

export const payCore = (): PayCore => {
  let processing = false
  let resume: (() => void) | null = null

  const startProcessing = () => {
    processing = true
  }

  const finishProcessing = () => {
    if (!processing) {
      return
    }

    processing = false

    if (resume) {
      resume()
      resume = null
    }
  }

  const waitUntilFinished = () => {
    if (!processing) {
      return Promise.resolve()
    }

    return new Promise<void>((resolve) => {
      resume = resolve
    })
  }

  const reserve = (url: string, onClose?: () => void) => {
    const win = window.open(url, "_blank", "width=1000,height=600,left=200,top=200")

    if (!win) {
      finishProcessing()
      onClose?.()
      return
    }

    win.focus()

    const interval = window.setInterval(() => {
      if (!win || win.closed) {
        clearInterval(interval)
        finishProcessing()
        onClose?.()
      }
    }, 100)
  }

  const notifyPaymentClosed = (message = "PAYMENT_CLOSED") => {
    if (typeof window === "undefined") {
      return
    }

    window.postMessage(message, "*")
  }

  return {
    reserve,
    startProcessing,
    finishProcessing,
    waitUntilFinished,
    isProcessing: () => processing,
    notifyPaymentClosed,
  }
}
