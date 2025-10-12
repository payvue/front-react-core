import { AlertCircle, Bell, CheckCircle, CreditCard, DollarSign, UserPlus, Users } from "lucide-react"


export const getNotificationIcon = (type: string) => {
    switch (type) {
      case "group_payment":
        return <Users className="h-4 w-4 text-blue-500" />
      case "balance_charge":
        return <DollarSign className="h-4 w-4 text-green-500" />
      case "payment_request":
        return <CreditCard className="h-4 w-4 text-purple-500" />
      case "payment_approved":
        return <CreditCard className="h-4 w-4 text-purple-500" />        
      case "transaction":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />
      case "system":
        return <AlertCircle className="h-4 w-4 text-orange-500" />
      case "invite":
        return <UserPlus className="h-4 w-4 text-indigo-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }