import { OnlineAssetCategory, OnlineAssetSchema, OnlineAssetStatus } from "../types/online-asset"
import { isOnlineAssetCategory } from "../utils/online-asset"

interface OnlineAssetResponse {
  id: string
  name: string
  category?: string
  amount?: number
  purchaseDate?: string
  status?: string
  balance?: number
  remainingAmount?: number
  description?: string
}

class OnlineAssetModel implements OnlineAssetSchema {
  private readonly _id: string
  private readonly _name: string
  private readonly _category: OnlineAssetCategory
  private readonly _amount: number
  private readonly _purchaseDate: string
  private readonly _status: OnlineAssetStatus
  private readonly _balance?: number
  private readonly _description?: string

  private constructor(schema: OnlineAssetSchema) {
    this._id = schema.id
    this._name = schema.name
    this._category = schema.category
    this._amount = schema.amount
    this._purchaseDate = schema.purchaseDate
    this._status = schema.status
    this._balance = schema.balance
    this._description = schema.description
  }

  static fromResponse(raw: OnlineAssetResponse) {
    return new OnlineAssetModel({
      id: raw.id,
      name: raw.name,
      category: OnlineAssetModel.resolveCategory(raw.category),
      amount: OnlineAssetModel.resolveAmount(raw.amount ?? raw.balance ?? 0),
      purchaseDate: OnlineAssetModel.resolvePurchaseDate(raw.purchaseDate),
      status: OnlineAssetModel.resolveStatus(raw.status),
      balance: raw.balance ?? raw.remainingAmount,
      description: raw.description,
    })
  }

  static fromResponses(responses: OnlineAssetResponse[] = []) {
    return responses.map((response) => OnlineAssetModel.fromResponse(response))
  }

  private static resolveCategory(value?: string): OnlineAssetCategory {
    if (!value) {
      return "gift"
    }

    const normalized = value.toLowerCase()
    if (isOnlineAssetCategory(normalized)) {
      return normalized as OnlineAssetCategory
    }

    return "gift"
  }

  private static resolveStatus(value?: string): OnlineAssetStatus {
    switch (value) {
      case "used":
      case "expired":
        return value
      case "active":
      default:
        return "active"
    }
  }

  private static resolveAmount(value: number) {
    return Number.isNaN(value) ? 0 : value
  }

  private static resolvePurchaseDate(value?: string) {
    if (!value) {
      return new Date().toISOString().split("T")[0]
    }

    return value.split("T")[0]
  }

  get id() {
    return this._id
  }

  get name() {
    return this._name
  }

  get category() {
    return this._category
  }

  get amount() {
    return this._amount
  }

  get purchaseDate() {
    return this._purchaseDate
  }

  get status() {
    return this._status
  }

  get balance() {
    return this._balance
  }

  get description() {
    return this._description
  }
}

export type { OnlineAssetResponse }
export { OnlineAssetModel }
