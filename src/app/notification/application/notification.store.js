import { reactive, computed } from 'vue'
import { apiClient } from '@/app/shared/infrastructure/apiClient.js'

const state = reactive({
  notifications: [],
  loading: false,
  error: null
})

export const useNotificationStore = () => {
  // Cargar notificaciones del usuario
  const fetchNotifications = async (userId) => {
    state.loading = true
    state.error = null
    
    try {
      // Obtener TODAS las notificaciones del db.json
      const data = await apiClient.get('/notifications')
      // Filtrar solo las notificaciones del usuario actual (normalizar tipos)
      const userNotifications = data.filter(n => Number(n.userId) === Number(userId))
      
      // Mapear 'body' a 'message' si viene del backend con ese campo
      const mappedNotifications = userNotifications.map(n => ({
        ...n,
        message: n.message || n.body || ''  // Usar message si existe, sino body
      }))
      
      // Ordenar por fecha (más recientes primero)
      state.notifications = mappedNotifications.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      )
      
      console.log('📬 Notificaciones cargadas:', state.notifications.length)
    } catch (error) {
      console.error('Error loading notifications:', error)
      state.error = 'Error al cargar notificaciones'
      state.notifications = []
    } finally {
      state.loading = false
    }
  }

  // Crear nueva notificación
  const createNotification = async (notification) => {
    try {
      const newNotification = {
        ...notification,
        read: false,
        createdAt: new Date().toISOString()
      }
      
      const created = await apiClient.post('/notifications', newNotification)
      console.log('📬 Notificación creada:', created)
      return created
    } catch (error) {
      console.error('Error creating notification:', error)
      throw error
    }
  }

  // Notificar al dueño sobre solicitud de alquiler
  const notifyOwnerRentalRequest = async ({ ownerId, renterName, vehicleName, rentalId, vehicleId }) => {
    const notification = {
      userId: ownerId,
      type: 'rental_request',
      title: '¡Nueva Solicitud de Alquiler!',
      body: `${renterName} quiere alquilar tu ${vehicleName}. Revisa los detalles y confirma la reserva.`,
      relatedId: rentalId,
      relatedType: 'rental',
      actionUrl: '/rental/rental-requests',
      actionLabel: 'Ver Solicitud',
      metadata: {
        rentalId,
        vehicleId,
        renterName
      }
    }
    
    return await createNotification(notification)
  }

  // Notificar al arrendatario sobre confirmación
  const notifyRenterRentalConfirmed = async ({ renterId, vehicleName, rentalId, vehicleId, pickupDate }) => {
    const notification = {
      userId: renterId,
      type: 'rental_confirmed',
      title: 'Reserva Confirmada',
      body: `Tu reserva del ${vehicleName} ha sido confirmada. Puedes recoger el vehículo el ${pickupDate}.`,
      relatedId: rentalId,
      relatedType: 'rental',
      actionUrl: `/rental/my-rentals/${rentalId}`,
      actionLabel: 'Ver Reserva',
      metadata: {
        rentalId,
        vehicleId
      }
    }
    
    return await createNotification(notification)
  }

  // Marcar notificación como leída
  const markAsRead = async (notificationId) => {
    try {
      await apiClient.patch(`/notifications/${notificationId}`, {
        read: true,
        readAt: new Date().toISOString()
      })
      
      // Actualizar estado local
      const notif = state.notifications.find(n => n.id === notificationId)
      if (notif) {
        notif.read = true
        notif.readAt = new Date().toISOString()
      }
      
      console.log('✅ Notificación marcada como leída')
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  // Marcar todas como leídas
  const markAllAsRead = async (userId) => {
    try {
      const unread = state.notifications.filter(n => !n.read)
      
      // Marcar cada una como leída
      for (const notif of unread) {
        await apiClient.patch(`/notifications/${notif.id}`, {
          read: true,
          readAt: new Date().toISOString()
        })
        notif.read = true
        notif.readAt = new Date().toISOString()
      }
      
      console.log('✅ Todas las notificaciones marcadas como leídas')
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  // Eliminar notificación
  const deleteNotification = async (notificationId) => {
    try {
      await apiClient.delete(`/notifications/${notificationId}`)
      
      // Remover del estado local
      state.notifications = state.notifications.filter(n => n.id !== notificationId)
      
      console.log('✅ Notificación eliminada')
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  // Computed: Notificaciones no leídas
  const unreadNotifications = computed(() => {
    return state.notifications.filter(n => !n.read)
  })

  // Computed: Conteo de no leídas
  const unreadCount = computed(() => {
    return unreadNotifications.value.length
  })

  // Computed: Notificaciones recientes (últimas 5)
  const recentNotifications = computed(() => {
    return state.notifications.slice(0, 5)
  })

  return {
    state,
    notifications: computed(() => state.notifications),
    loading: computed(() => state.loading),
    error: computed(() => state.error),
    unreadNotifications,
    unreadCount,
    recentNotifications,
    fetchNotifications,
    createNotification,
    notifyOwnerRentalRequest,
    notifyRenterRentalConfirmed,
    markAsRead,
    markAllAsRead,
    deleteNotification
  }
}
