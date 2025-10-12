import { REQUEST_URL } from "@/constants";
import request from "@/lib/api/client";
import APIResponse from "@/lib/api/types/response";
import { Alarm } from "@/types";
import { Method } from "axios";


interface AlarmAPI {
    paginated: (page: number) => Promise<APIResponse<Alarm.Context>>
}

const useAlarmAPI = (): AlarmAPI => {

    const paginated = async (page: number) => {
        return request({
            method: 'GET' as Method,
            url: `${REQUEST_URL.PRIVATE.GET_RECEIVED}/${page}`
        })
    }

    return {
        paginated
    }
}

export default useAlarmAPI