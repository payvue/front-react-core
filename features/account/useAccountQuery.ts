"use client"

import { useMutation } from "@tanstack/react-query"
import { RegisterRequest } from "@/features/apis/requests"
import { Request } from "@/types"
import APPLICATION_ERROR_CODE from "@/constants/error"
import PATH from "@/constants/path"
import { useRouter } from "next/navigation"
import useAccountAPI from "./api"


const useAccountQuery = () => {

  const router = useRouter()
  const { signup: signupAPI, edit: editAPI, changepassword: changePwAPI } = useAccountAPI()

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
    signup,
    edit,
    changePw
  }
}

export default useAccountQuery
