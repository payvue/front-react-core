export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasNext: boolean
  hasPrev: boolean
}

export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  image: string
  mall: string
  category: string
  discount?: number
  isLiked: boolean
  description?: string
  stock?: number
}

export interface PaymentMethod {
  id: string
  type: "card" | "bank" | "mobile"
  name: string
  details: string
  isDefault: boolean
  isActive: boolean
}

export interface Transaction {
  id: string
  type: "payment" | "charge" | "transfer" | "refund"
  amount: number
  description: string
  date: string
  status: "completed" | "pending" | "failed"
  merchant?: string
  category?: string
  groupId?: string
}

export interface Group {
  id: string
  name: string
  description?: string
  memberCount: number
  balance: number
  leaderId: string
  members: GroupMember[]
  createdAt: string
  isActive: boolean
}

export interface GroupMember {
  id: string
  name: string
  role: "leader" | "member"
  avatar?: string
  joinedAt: string
  isActive: boolean
}

export interface PaymentRequest {
  id: string
  requesterId: string
  requesterName: string
  requesterAvatar?: string
  groupId: string
  amount: number
  description: string
  category: string
  requestDate: string
  status: "pending" | "approved" | "rejected"
  approvedDate?: string
  rejectedDate?: string
  rejectionReason?: string
  urgency: "low" | "medium" | "high"
}
