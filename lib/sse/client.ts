import { EventSourcePolyfill } from 'event-source-polyfill';
import { Alarm } from '@/types';
import { responseCode } from '@/features/apis';
import { getLocalStorageItem } from '@/util/localStorage';
import { LOCAL_STORAGE_KEY } from '@/constants';

interface ClientProps {
  api: string;
  event: (data: Alarm.Context) => void;
}

export const client = ({ api, event }: ClientProps) => {

  const token = getLocalStorageItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN).replace(/^['"]|['"]$/g, '')
  const url = `${process.env.NEXT_PUBLIC_SSE_URI}${api}`

  const eventSource = new EventSourcePolyfill(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Connetction: 'keep-alive',
      Accept: 'text/event-stream',      
    },
    withCredentials: true,
    heartbeatTimeout: 86400000,     
  })

  eventSource.onmessage = (response) => {
    try {
      const { code, data: alarm } = JSON.parse(response.data)
      if (code === responseCode.SUCCESS) {
        event(alarm);
      }
    } catch (err) {
      console.error('Failed to parse SSE message:', err)
    }
  }

  eventSource.onopen = () => {
    console.log('SSE connected:', url)
  }

  eventSource.onerror = (err) => {
    console.error('SSE error:', err)
    eventSource.close();
  }

  return () => {
    eventSource.close()
  }
};
