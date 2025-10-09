"use client"

import { useMutation } from "@tanstack/react-query"
import { RegisterRequest } from "@/features/apis/requests"
import { Request, User } from "@/types"
import APPLICATION_ERROR_CODE from "@/constants/error"
import PATH from "@/constants/path"
import { useRouter } from "next/navigation"
import useAccountAPI from "./api"
import { responseCode } from "../apis"


const useAccountQuery = () => {

  const router = useRouter()
  const { exist: existAPI, signup: signupAPI, edit: editAPI, changepassword: changePwAPI } = useAccountAPI()

  const { mutateAsync: exist } = useMutation({
    mutationFn: (data: { email: string, finder?: (found: User.Info) => void }) => existAPI(data),
    onSuccess: ({ code, data: found }, variables) => {
      if(code == responseCode.SUCCESS) {
        if(variables.finder) {
          variables.finder(found!)
          return
        }
      }

      throw Error("해당 이메일로 가입된 사용자를 찾을 수 없습니다.")
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

  const { mutateAsync: signup } = useMutation({
    mutationFn: (data: RegisterRequest) => signupAPI<RegisterRequest>(data),
    onSuccess: ({ code, message }) => {
      router.push(`/result?code=${code}&message=${message}`)
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

  const { mutate: edit } = useMutation({
    mutationFn: (data: { email: string, alias: string}) => editAPI(data),
    onSuccess: ({ code, message }) => {
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

  const { mutate: changePw } = useMutation({
    mutationFn: (data: { origin: string, changed: string}) => changePwAPI(data),
    onSuccess: ({ code, message }) => {
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
    exist,
    signup,
    edit,
    changePw
  }
}

export default useAccountQuery
