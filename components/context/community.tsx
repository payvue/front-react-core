'use client'

import { createContext, ReactNode, useContext, useEffect } from "react"
import { useUserContext } from "./user"
import { useAsyncCommunityQuery } from "@/features/community/useAsyncCommunityQuery"
import { Community } from "@/types"
import { useAppSelector } from "@/lib/redux/hooks"
import { COMMUNITY_REFRESH_EVENT } from "@/features/community/utils/sync"


interface CommunityContextType {
    participated: () => string
    newIssued: () => void
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined)
export const QUERY_COMMUNITY_KEY = ["community"]

const CommunityProvider = ({ children }: { children: ReactNode }) => {

    const community: Community.Context = useAppSelector((state) => state.community.domain)
    const user = useAppSelector((state) => state.auth.domain)

    const { isAuthenticated } = useUserContext()
    const { fetch } = useAsyncCommunityQuery(() => isAuthenticated, { isLoggedIn: user.account.status.isLoggedIn, hasIssue: community.hasIssue })

    useEffect(() => {
        if (!user.account.status.isLoggedIn) {
            return
        }
        fetch()
    }, [fetch, user.account.status.isLoggedIn]);

    useEffect(() => {
        const onRefresh = () => {
            fetch()
        }

        window.addEventListener(COMMUNITY_REFRESH_EVENT, onRefresh)
        return () => {
            window.removeEventListener(COMMUNITY_REFRESH_EVENT, onRefresh)
        }
    }, [fetch])

    const newIssued = () => {
        fetch()
    }

    const participated = () => {
        return community.id
    }

    return (
        <CommunityContext.Provider value={{ newIssued, participated }}>
            {children}
        </CommunityContext.Provider>
    )

}

export const useCommunityContext = () => {
    const context = useContext(CommunityContext)
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider')
    }
    return context    
}

export default CommunityProvider
export { CommunityContext }
