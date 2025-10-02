import { ApiResponse } from "@/lib/api/types";
import { User } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { fetchUserInfo } from '../auth/thunk';
import { useAppDispatch } from "@/lib/redux/hooks";
import { unauthenticated } from "../auth";
import { QUERY_USER_KEY } from "@/components/context/user";
import useAccountAPI from "./api";


const useAsyncAccountQuery = (authenticated: () => (() => boolean)) => {
    
    const dispatch = useAppDispatch()
    const { info } = useAccountAPI()
    
    const { refetch: fetch } = useQuery({
        queryKey: QUERY_USER_KEY,
        queryFn: async () => {
            if(!authenticated()()) {
                dispatch(unauthenticated())
                return
            }

            const response = await (info() as Promise<ApiResponse<User.Context>>);
            dispatch(fetchUserInfo(response))
        },
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: 1,
        enabled: false
    })

    return {
        fetch   
    }
}

export default useAsyncAccountQuery