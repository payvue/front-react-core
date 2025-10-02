"use client"

import { useAppSelector } from "@/lib/redux/hooks"
import { ProfileEditForm } from "./profile-edit"
import { PasswordChangeForm } from "./profile-pw-change"
import useAccountQuery from "@/features/account/useAccountQuery"
import { useUserContext } from "../context/user"
import { useRouter } from "next/navigation"
import useAsyncAccountQuery from "@/features/account/useAsyncAccountQuery"

export function ProfileSettings() {
  const { account, info } = useAppSelector((state) => state.auth.domain)

  const { edit, changePw } = useAccountQuery()
  const { unauthorized, isAuthenticated } = useUserContext()
  const { fetch } = useAsyncAccountQuery(() => isAuthenticated)


  const router = useRouter()

  const resetAuthenticated = () => {
    unauthorized()
    router.push('/login')
  }

  return (
    <div className="space-y-6">
      <ProfileEditForm 
        account={account}
        info={info}
        onSave={async (data) => edit(data)}
        callback={fetch}
      />
      
      <PasswordChangeForm
        onSave={async (data) => changePw(data)} callback={resetAuthenticated}
      />
    </div>
  )
}