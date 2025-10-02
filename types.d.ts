import { Address } from "./features/auth";


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
        joinAt: string
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

interface Balance {
  balance: number
  point: number    
}

interface Address {
  city: string;
  district: string;
  street: string;
  postCode: string;
  detailed: string;
}