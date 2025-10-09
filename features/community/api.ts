import { REQUEST_URL } from "@/constants";
import request from "@/lib/api/client";
import APIResponse from "@/lib/api/types/response";
import { Group } from "@/types";
import { Method } from "axios";


interface CommunityAPI {
    create: (data: Group.Context) => Promise<APIResponse>    
    info: () => Promise<APIResponse>
    invite: ({ id, emails }: { id: string, emails: string[] }) => Promise<APIResponse>
}

const useCommunityAPI = (): CommunityAPI => {

    const create = async (data: Group.Context) => {
        return request({
            method: 'POST' as Method,
            url: REQUEST_URL.PRIVATE.CREATE_COMMUNITYINFO,
            data
        })
    }
    
    const info = async () => {
        return request({
            method: 'GET' as Method,
            url: REQUEST_URL.PRIVATE.COMMUNITYINFO,
        })
    }

    const invite = async ({ id, emails }: { id: string, emails: string[] }) => {
        return request({
            method: 'POST' as Method,
            url: `${REQUEST_URL.PRIVATE.INVITE_FOLLOWER}/${id}`,
            data: emails
        })
    }

    return {
        create,
        info,
        invite
    }
    
}

export default useCommunityAPI