export interface CommunityCreatePayload {
  name: string
  description?: string
  initialAmount: number
  invitedMembers: string[]
}
