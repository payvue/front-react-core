
export interface PayError extends Error {
    message: string
    paymentId: string
    status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
}