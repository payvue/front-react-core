import { REQUEST_URL } from "@/constants";
import request from "@/lib/api/client";
import { Method } from "axios";


interface AuthAPI {
  login: <T>(data: T) => Promise<any>;
  logout: () => Promise<any>;
}

const useAuthAPI = (): AuthAPI => {

    const login = <T>(data: T) => {
        return request({
            method: 'POST' as Method,
            url: REQUEST_URL.PUBLIC.LOGIN
        })
    }


    const logout = () => {
        return request({
            method: 'POST' as Method,
            url: REQUEST_URL.PRIVATE.LOGOUT      
        }) 
    }

    return {
        login,
        logout
    }

}

export default useAuthAPI