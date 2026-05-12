// Repositorio / gateway API para payments
import { apiClient } from '@/app/shared/infrastructure/apiClient.js'
import { toPaymentCollection, toPaymentEntity } from './payment.assembler.js'

export const PaymentApi = {
  async listPayments() {
    const data = await apiClient.get('/payments')
    return toPaymentCollection(data)
  },
  
  async getPayment(id) {
    const data = await apiClient.get(`/payments/${id}`)
    return toPaymentEntity(data)
  },
  
  async createPayment(payload) {
    const data = await apiClient.post('/payments', payload)
    return toPaymentEntity(data)
  },
  
  async updatePayment(id, payload) {
    const data = await apiClient.put(`/payments/${id}`, payload)
    return toPaymentEntity(data)
  },
  
  async deletePayment(id) {
    await apiClient.delete(`/payments/${id}`)
  }
}
