import { useRouter } from "next/navigation"
import useCommunityAPI from "./api"
import { useMutation } from "@tanstack/react-query"
import { Group, Request } from "@/types"
import type { CommunityCreatePayload } from "./types"
import APPLICATION_ERROR_CODE from "@/constants/error"
import PATH from "@/constants/path"
import { useCommunityContext } from "@/components/context/community"
import { responseCode } from "../apis"



const useCommunityQuery = () => {
    
    const router = useRouter()

    const { participated, newIssued } = useCommunityContext()
    const { create: createAPI, invite: inviteAPI } = useCommunityAPI()

    const { mutateAsync: create } = useMutation({
        mutationFn: (data: CommunityCreatePayload) => createAPI(data),
        onSuccess: ({ code }) => {
            if(code === responseCode.SUCCESS) {
                newIssued()
            }
        },
        onError: (error: Request.Error) => {
            if (
            error.code === APPLICATION_ERROR_CODE.NETWORK_ERROR ||
            error.code === APPLICATION_ERROR_CODE.INTERNAL_SERVER_ERROR
            ) {
            router.push(`${PATH.ERROR}?code=${error.code}`)
            }
        },    
    })

    const { mutateAsync: invite } = useMutation({
        mutationFn: (emails: string[]) => inviteAPI({ id: participated(), emails: emails}),
        onSuccess: ({ code }) => {
            if(code === responseCode.SUCCESS) {
                newIssued()
            }
        },        
        onError: (error: Request.Error) => {
            if (
            error.code === APPLICATION_ERROR_CODE.NETWORK_ERROR ||
            error.code === APPLICATION_ERROR_CODE.INTERNAL_SERVER_ERROR
            ) {
            router.push(`${PATH.ERROR}?code=${error.code}`)
            }
        },    
    })

    const { mutateAsync: inviteWithId } = useMutation({
        mutationFn: ({ id, emails }: { id: string; emails: string[] }) => inviteAPI({ id, emails }),
        onSuccess: ({ code }) => {
            if(code === responseCode.SUCCESS) {
                newIssued()
            }
        },
        onError: (error: Request.Error) => {
            if (
            error.code === APPLICATION_ERROR_CODE.NETWORK_ERROR ||
            error.code === APPLICATION_ERROR_CODE.INTERNAL_SERVER_ERROR
            ) {
            router.push(`${PATH.ERROR}?code=${error.code}`)
            }
        },
    })
    
    return {
        create,
        invite,
        inviteWithId
    }
}

export default useCommunityQuery
