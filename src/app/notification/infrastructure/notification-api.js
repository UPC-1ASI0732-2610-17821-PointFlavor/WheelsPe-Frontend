import { apiClient } from '@/app/shared/infrastructure/apiClient.js'
import { NotificationAssembler } from './notification.assembler.js'

/**
 * API para gestionar notificaciones
 */
export const NotificationApi = {
  /**
   * Obtener todas las notificaciones del usuario actual
   */
  async listNotifications(userId) {
    try {
      const data = await apiClient.get(`/notifications?userId=${userId}&_sort=createdAt&_order=desc`)
      return NotificationAssembler.toEntityCollection(data)
    } catch (error) {
      console.error('Error fetching notifications:', error)
      throw error
    }
  },

  /**
   * Obtener notificaciones no leídas
   */
  async getUnreadNotifications(userId) {
    try {
      const data = await apiClient.get(`/notifications?userId=${userId}&read=false&_sort=createdAt&_order=desc`)
      return NotificationAssembler.toEntityCollection(data)
    } catch (error) {
      console.error('Error fetching unread notifications:', error)
      throw error
    }
  },

  /**
   * Marcar notificación como leída
   */
  async markAsRead(notificationId) {
    try {
      const data = await apiClient.patch(`/notifications/${notificationId}`, {
        read: true,
        readAt: new Date().toISOString()
      })
      return NotificationAssembler.toEntity(data)
    } catch (error) {
      console.error('Error marking notification as read:', error)
      throw error
    }
  },

  /**
   * Marcar todas como leídas
   */
  async markAllAsRead(userId) {
    try {
      const notifications = await this.getUnreadNotifications(userId)
      const promises = notifications.map(n => this.markAsRead(n.id))
      await Promise.all(promises)
      return true
    } catch (error) {
      console.error('Error marking all as read:', error)
      throw error
    }
  },

  /**
   * Eliminar notificación
   */
  async deleteNotification(notificationId) {
    try {
      await apiClient.delete(`/notifications/${notificationId}`)
      return true
    } catch (error) {
      console.error('Error deleting notification:', error)
      throw error
    }
  },

  /**
   * Crear nueva notificación (para sistema/admin)
   */
  async createNotification(notificationData) {
    try {
      const data = await apiClient.post('/notifications', {
        ...notificationData,
        createdAt: new Date().toISOString()
      })
      return NotificationAssembler.toEntity(data)
    } catch (error) {
      console.error('Error creating notification:', error)
      throw error
    }
  }
}
