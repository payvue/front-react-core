import { Address } from "./features/auth";
import { Transaction } from '@/lib/api/types';


interface DomainState<T> {
  domain: T
  loading: boolean;
  error: string | null;  
}

declare namespace Request {
  interface Error {
    code: number;
    message: string;
  }
}

declare namespace User {
    interface Context {
        account: Account
        info: Info
        asset: Balance
    }
    interface Account {
        alias: string
        id: string    
        token: string  
        status: AccountStatus
    }
    interface AccountStatus {
        isLoggedIn: boolean
        lastLoggedIn: string
        joinAt?: string
    }
    interface Info {
        name: string
        resident?: string
        address?: Address
        contact: Contact
        birth?: string
        provider?: string
        avatar?: string
    }
    interface Contact {
        email: string
        phone?: string
    }
}



declare namespace Asset {

  interface Context {
  }

  interface Balance {
    balance: number
    point: number    
  }

}

declare namespace Alarm {
  interface Context {
    noti: Notification[]
  }

  interface Notification {
    id: string    
    title: string
    message: string
    timestamp: string
    event: Event.Context<keyof Event.Namespace>    
  } 
}

declare namespace Event {
  
  type Context<T extends keyof EventNamespaces> = {
    type: T
    event: ExtractEvent<T>
  }     

  type Namespace = {
    Group: typeof Group
  }  

  type ExtractEvent<T extends keyof EventNamespaces> = 
    EventNamespaces[T] extends { Event: infer E } ? E : never 

  type Meta = {
    description: string
    isRead: boolean    
  }

}

declare namespace Community {
  interface Context {
    id: string
    hasIssue: boolean
    groups: Group.Context[]
  }
}

declare namespace Group {
  interface Context {
    id?: string
    name: string
    description: string
    members: Participant[]
    shared: Balance
    Transactions?: Transaction[]
    createdDate?: string
  }
  interface Participant {
    id?: string
    info: User.Info
    status?: User.AccountStatus
    role: "leader" | "member" | "follower"
    hasNewActivity?: boolean
    contribution: Contribution
    policy: Policy
  }
  interface Contribution {
    amount: number
    joinDate: string
  }

  interface Policy {
    active: boolean
  }

  type Event = {
    meta: Event.Meta
    groupId: string
    groupName?: string
    trigger: Participant
  }
}


declare namespace Transaction {
  interface Context {
    id: string
    paidBy: User.Info
    payment: Payment.Context
    billing: Billing
    date: string
  }

}

declare namespace Payment {

  interface Context {
    type: "payment" | "charge" | "transfer" | "refund" | "point_converison"
    method: Method
    billing: Billing
  }
  interface Method {
    type: "card" | "bank" | "mobile"
    name: string
    details: string
    isDefault: boolean
    isActive: boolean
  }
  interface Billing {
    merchant?: string
    amount: number
    description: string
    status: "completed" | "pending" | "failed"
    category: string
  }  

}

interface Balance {
  balance: number
  point?: number    
}

interface Address {
  city: string;
  district: string;
  street: string;
  postCode: string;
  detailed: string;
}