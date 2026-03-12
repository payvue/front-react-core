import { EventSourcePolyfill } from 'event-source-polyfill'
import { Alarm } from '@/types'
import { store } from '@/lib/store/store'

interface ClientProps {
  api: string
  event: (data: Alarm.Context) => void
}

export const client = ({ api, event }: ClientProps) => {
  const url = `${process.env.NEXT_PUBLIC_SSE_URI}${api}`

  let eventSource: EventSourcePolyfill | null = null
  let retryCount = 0
  let retryTimer: ReturnType<typeof setTimeout> | null = null

  const connect = () => {
    const token = store.getState().auth.domain.account.token
    const headers: Record<string, string> = {}
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    eventSource = new EventSourcePolyfill(url, {
      withCredentials: true,
      headers,
      heartbeatTimeout: 86400000,
    })

    const handleIncoming = (raw: string) => {
      try {
        const parsed = JSON.parse(raw)
        if (parsed?.code) {
          if (parsed.code === 'SUCCESS' && parsed.data) {
            event(parsed.data)
          }
          return
        }

        event(parsed)
      } catch (err) {
        // Ignore non-JSON messages such as heartbeat/connected text events
      }
    }

    eventSource.onmessage = (response) => {
      handleIncoming(response.data)
    }

    const customEvents = ['GROUP', 'TRANSACTION', 'SYSTEM', 'Group', 'Transaction', 'System']
    customEvents.forEach((eventName) => {
      eventSource?.addEventListener(eventName, (evt: MessageEvent) => {
        handleIncoming(evt.data)
      })
    })

    eventSource.onopen = () => {
      console.log('SSE connected:', url)
      retryCount = 0
    }

    eventSource.onerror = (err) => {
      console.error('SSE error:', err)
      eventSource?.close()

      if (retryTimer) {
        clearTimeout(retryTimer)
      }

      const delay = Math.min(1000 * 2 ** retryCount, 30000)
      retryTimer = setTimeout(() => {
        retryCount += 1
        connect()
      }, delay)
    }
  }

  connect()

  return () => {
    if (retryTimer) {
      clearTimeout(retryTimer)
    }
    eventSource?.close()
  }
}
