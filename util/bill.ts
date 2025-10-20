import { Product } from "@/types"

const calculateSingleTotal = (product: Product) => product.price * product.amount

export const total = (product: Product | Product[]) => {
  if (Array.isArray(product)) {
    return product.reduce((sum, current) => sum + calculateSingleTotal(current), 0)
  }

  return calculateSingleTotal(product)
}
