import { apiClient } from '@/app/shared/infrastructure/apiClient.js'
import { SupportAssembler } from './support.assembler.js'

/**
 * API para gestionar tickets de soporte
 */
export const SupportApi = {
  /**
   * Obtener todos los tickets del usuario
   */
  async listTickets(userId) {
    try {
      const data = await apiClient.get(`/support-tickets?userId=${userId}&_sort=createdAt&_order=desc`)
      return SupportAssembler.toEntityCollection(data)
    } catch (error) {
      console.error('Error fetching support tickets:', error)
      throw error
    }
  },

  /**
   * Obtener un ticket por ID
   */
  async getTicket(ticketId) {
    try {
      const data = await apiClient.get(`/support-tickets/${ticketId}`)
      return SupportAssembler.toEntity(data)
    } catch (error) {
      console.error('Error fetching ticket:', error)
      throw error
    }
  },

  /**
   * Crear nuevo ticket de soporte
   */
  async createTicket(ticketData) {
    try {
      const data = await apiClient.post('/support-tickets', {
        ...ticketData,
        status: ticketData.status || 'open',
        priority: ticketData.priority || 'medium',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      return SupportAssembler.toEntity(data)
    } catch (error) {
      console.error('Error creating ticket:', error)
      throw error
    }
  },

  /**
   * Actualizar ticket existente
   */
  async updateTicket(ticketId, updates) {
    try {
      const data = await apiClient.patch(`/support-tickets/${ticketId}`, {
        ...updates,
        updatedAt: new Date().toISOString()
      })
      return SupportAssembler.toEntity(data)
    } catch (error) {
      console.error('Error updating ticket:', error)
      throw error
    }
  },

  /**
   * Cerrar ticket (marcar como resuelto)
   */
  async closeTicket(ticketId, resolutionNotes = '') {
    try {
      const data = await apiClient.patch(`/support-tickets/${ticketId}`, {
        status: 'resolved',
        resolutionNotes,
        resolvedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      return SupportAssembler.toEntity(data)
    } catch (error) {
      console.error('Error closing ticket:', error)
      throw error
    }
  },

  /**
   * Obtener tickets abiertos
   */
  async getOpenTickets(userId) {
    try {
      const data = await apiClient.get(`/support-tickets?userId=${userId}&status=open&_sort=createdAt&_order=desc`)
      return SupportAssembler.toEntityCollection(data)
    } catch (error) {
      console.error('Error fetching open tickets:', error)
      throw error
    }
  },

  /**
   * Obtener tickets de daño (damage reports)
   */
  async getDamageTickets(userId) {
    try {
      const data = await apiClient.get(`/support-tickets?userId=${userId}&type=damage&_sort=createdAt&_order=desc`)
      return SupportAssembler.toEntityCollection(data)
    } catch (error) {
      console.error('Error fetching damage tickets:', error)
      throw error
    }
  }
}
