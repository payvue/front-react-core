interface Wallet {
  holder: User.Info,
  limit: Currency	
}

interface Valueable {
	values: Product[] | Product	
}

interface Product {
  name: string
  type: string
	price: number
	amount: number
}

interface Provider {
  id: string
  name?: string
}

interface ExecutionStrategy {
  type: string
  execute: () => void
}
