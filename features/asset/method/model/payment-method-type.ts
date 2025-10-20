import { PaymentMethodType as PaymentMethodCategory, PaymentMethodSchema } from "../types/payment-method"

interface PaymentMethodResponse {
  id: string
  type?: PaymentMethodCategory | string
  name: string
  details?: string
  maskedNumber?: string
  accountNumber?: string
  default?: boolean
  isDefault?: boolean
  active?: boolean
  isActive?: boolean
}

class PaymentMethodModel implements PaymentMethodSchema {
  private readonly _id: string
  private readonly _type: PaymentMethodCategory
  private readonly _name: string
  private readonly _details: string
  private readonly _isDefault: boolean
  private readonly _isActive: boolean

  private constructor(schema: PaymentMethodSchema) {
    this._id = schema.id
    this._type = schema.type
    this._name = schema.name
    this._details = schema.details
    this._isDefault = schema.isDefault
    this._isActive = schema.isActive
  }

  static fromResponse(raw: PaymentMethodResponse) {
    return new PaymentMethodModel({
      id: raw.id,
      type: PaymentMethodModel.resolveType(raw.type),
      name: raw.name,
      details: PaymentMethodModel.resolveDetails(raw),
      isDefault: PaymentMethodModel.resolveBoolean(raw.isDefault ?? raw.default),
      isActive: PaymentMethodModel.resolveBoolean(raw.isActive ?? raw.active, true),
    })
  }

  static fromResponses(responses: PaymentMethodResponse[] = []) {
    return responses.map((response) => PaymentMethodModel.fromResponse(response))
  }

  private static resolveType(value?: PaymentMethodResponse["type"]) {
    if (!value) {
      return "card"
    }
    const normalized = typeof value === "string" ? value.toLowerCase() : value
    switch (normalized) {
      case "card":
      case "bank":
      case "mobile":
        return normalized
      default:
        return "card"
    }
  }

  private static resolveBoolean(value?: boolean, fallback = false) {
    if (typeof value === "boolean") {
      return value
    }
    return fallback
  }

  private static resolveDetails(raw: PaymentMethodResponse) {
    if (raw.details) {
      return raw.details
    }

    if (raw.maskedNumber) {
      return raw.maskedNumber
    }

    if (raw.accountNumber) {
      return raw.accountNumber
    }

    return ""
  }

  get id() {
    return this._id
  }

  get type() {
    return this._type
  }

  get name() {
    return this._name
  }

  get details() {
    return this._details
  }

  get isDefault() {
    return this._isDefault
  }

  get isActive() {
    return this._isActive
  }

  withDefault(isDefault: boolean) {
    return new PaymentMethodModel({
      id: this._id,
      type: this._type,
      name: this._name,
      details: this._details,
      isDefault,
      isActive: this._isActive,
    })
  }

  withActive(isActive: boolean) {
    return new PaymentMethodModel({
      id: this._id,
      type: this._type,
      name: this._name,
      details: this._details,
      isDefault: this._isDefault,
      isActive,
    })
  }
}

export type { PaymentMethodResponse }
export { PaymentMethodModel }
