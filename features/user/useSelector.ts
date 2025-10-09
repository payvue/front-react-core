import { User } from "@/types"
import { isvalidEmailRegex } from "@/util/display"
import { SetStateAction } from "react"
import useAccountQuery from "../account/useAccountQuery"


const useSelector = () => {

    const { exist } = useAccountQuery()

    const search = async (
        { searched, email}: { searched: User.Info[], email: string }, 
        appender: (value: SetStateAction<User.Info[]>) => void
    ): Promise<void> => {
        
      if(!isvalidEmailRegex(email))
        throw Error("올바른 이메일 형식이 아닙니다.")

      if (searched.some(member => member.contact.email === email))
        throw Error("이미 추가된 멤버입니다.")

      const finder = (found: User.Info) => appender(prev => [...prev, found])
      exist({ email: email, finder: finder })
    }

    return {
        search
    }
}

export default useSelector