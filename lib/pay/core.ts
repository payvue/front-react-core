

export interface PayCore {
  reserve: (
    url: string,
    onClose?: () => void,
    popupOptions?: {
      width?: number
      height?: number
    }
  ) => void
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

  const reserve = (
    url: string,
    onClose?: () => void,
    popupOptions?: {
      width?: number
      height?: number
    }
  ) => {
    const width = popupOptions?.width ?? 1000
    const height = popupOptions?.height ?? 600
    const left = Math.max(0, Math.floor((window.screen.width - width) / 2))
    const top = Math.max(0, Math.floor((window.screen.height - height) / 2))
    const features = `width=${width},height=${height},left=${left},top=${top}`

    const win = window.open(url, "_blank", features)

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
