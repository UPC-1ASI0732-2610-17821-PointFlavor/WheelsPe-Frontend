// Assembler para transformar datos de API a entidades de Payment
import { Payment } from '../domain/model/payment.model.js'

export function toPaymentEntity(data) {
  if (!data) return null
  return new Payment(data)
}

export function toPaymentCollection(dataArray) {
  if (!Array.isArray(dataArray)) return []
  return dataArray.map(item => toPaymentEntity(item))
}

export function toPaymentDTO(payment) {
  return {
    id: payment.id,
    payerId: payment.payerId,
    recipientId: payment.recipientId,
    rentalId: payment.rentalId,
    amount: payment.amount,
    currency: payment.currency,
    method: payment.method,
    status: payment.status,
    transactionId: payment.transactionId,
    type: payment.type,
    description: payment.description,
    reason: payment.reason,
    createdAt: payment.createdAt
  }
}
