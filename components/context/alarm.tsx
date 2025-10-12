'use client'

import { Alarm, Event } from "@/types"
import { createContext, ReactNode, useContext, useRef, useState } from 'react'
import { useUserContext } from "./user"
import useAlarmQuery from "@/features/alarm/useAlarmQuery"

interface AlarmContextType {
  receiveNotifications(type?: keyof Event.Namespace): Promise<Alarm.Context>  
}

const AlarmContext = createContext<AlarmContextType | undefined>(undefined)
export const QUERY_ALARM_KEY = ["alarm"]

const AlarmProvider = ({ children }: { children: ReactNode }) => {
    const { isAuthenticated } = useUserContext()

    const page = useRef(1)
    const [subscribe, setSubscribe] = useState(true)
    
    const { cache } = useAlarmQuery(() => isAuthenticated, subscribe, 0)

    const receiveNotifications = async (type?: keyof Event.Namespace)
    : Promise<Alarm.Context> => {

        const alarm = await cache(page.current)
        let noti: Alarm.Context
        
        if (type === undefined) {
            noti = alarm
        } else {
            noti = {
                noti: alarm.noti.filter(n => n.event.type === type)
            }
        }
        
        return noti
    }

    return (
        <AlarmContext.Provider value={{ receiveNotifications }}>
            {children}
        </AlarmContext.Provider>
    )
}

export const useAlarmContext = () => {
    const context = useContext(AlarmContext)
    if (context === undefined) {
        throw new Error('useAlarmContext must be used within an AlarmProvider')
    }
    return context 
}

export default AlarmProvider
export { AlarmContext }