import { Address } from "@/types"

export interface RegisterRequest {
  alias: string
  id: string
  password: string
  confirmPassword: string
  name: string
  resident: string
  birth: string
  email: string
  phone: string
  address: Address
}