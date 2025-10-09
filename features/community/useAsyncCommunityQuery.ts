import { useAppDispatch } from "@/lib/redux/hooks";
import useCommunityAPI from "./api";
import { useQuery } from "@tanstack/react-query";
import { QUERY_COMMUNITY_KEY } from "@/components/context/community";
import { fetchParticipatingGroups } from "./thunk";


export const useAsyncCommunityQuery = (authenticated: () => (() => boolean), { isLoggedIn, hasIssue }: {isLoggedIn: boolean, hasIssue: boolean}) => {
    
    const dispatch = useAppDispatch()
    const { info } = useCommunityAPI()

    const { refetch: fetch } = useQuery({
        queryKey: [QUERY_COMMUNITY_KEY, isLoggedIn, hasIssue],
        queryFn: async () => {
            if(!authenticated()()) return

            info().then(response => {
                dispatch(fetchParticipatingGroups(response))
            })
        },
        enabled: isLoggedIn && hasIssue
    })

    return {
        fetch
    }
    

}