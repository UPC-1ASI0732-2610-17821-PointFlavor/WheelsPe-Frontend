/**
 * Entidad Notification
 * Representa una notificación del sistema para el usuario
 */
export class Notification {
  constructor({
    id = 0,
    userId = 0,
    type = 'info', // info, warning, success, error, damage_report, payment_required
    title = '',
    message = '',
    body = '',      // Backend puede enviar 'body' en vez de 'message'
    relatedId = null, // ID del rental, vehicle, ticket, etc.
    relatedType = null, // 'rental', 'vehicle', 'ticket', 'payment'
    read = false,
    actionUrl = null,
    actionLabel = null,
    metadata = {},
    createdAt = null,
    readAt = null
  } = {}) {
    this.id = id
    this.userId = userId
    this.type = type
    this.title = title
    // Usar 'message' si existe, sino usar 'body' (compatibilidad con backend)
    this.message = message || body || ''
    this.relatedId = relatedId
    this.relatedType = relatedType
    this.read = read
    this.actionUrl = actionUrl
    this.actionLabel = actionLabel
    this.metadata = metadata || {}
    this.createdAt = createdAt
    this.readAt = readAt
  }

  // Computed properties
  get isUnread() {
    return !this.read
  }

  get typeIcon() {
    const icons = {
      info: 'pi-info-circle',
      warning: 'pi-exclamation-triangle',
      success: 'pi-check-circle',
      error: 'pi-times-circle',
      damage_report: 'pi-exclamation-circle',
      payment_required: 'pi-dollar',
      rental_confirmed: 'pi-check',
      rental_cancelled: 'pi-times',
      rental_completed: 'pi-flag',
      vehicle_approved: 'pi-thumbs-up',
      message: 'pi-envelope'
    }
    return icons[this.type] || 'pi-bell'
  }

  get typeClass() {
    const classes = {
      info: 'notification-info',
      warning: 'notification-warning',
      success: 'notification-success',
      error: 'notification-error',
      damage_report: 'notification-danger',
      payment_required: 'notification-payment',
      rental_confirmed: 'notification-success',
      rental_cancelled: 'notification-error',
      rental_completed: 'notification-info'
    }
    return classes[this.type] || 'notification-default'
  }

  get formattedDate() {
    if (!this.createdAt) return ''
    const date = new Date(this.createdAt)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Ahora'
    if (diffMins < 60) return `Hace ${diffMins} min`
    if (diffHours < 24) return `Hace ${diffHours}h`
    if (diffDays < 7) return `Hace ${diffDays}d`
    
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
  }

  get hasAction() {
    return !!this.actionUrl
  }

  // Methods
  markAsRead() {
    this.read = true
    this.readAt = new Date().toISOString()
  }

  static fromJson(json) {
    return new Notification(json)
  }

  toJson() {
    return {
      id: this.id,
      userId: this.userId,
      type: this.type,
      title: this.title,
      message: this.message,
      relatedId: this.relatedId,
      relatedType: this.relatedType,
      read: this.read,
      actionUrl: this.actionUrl,
      actionLabel: this.actionLabel,
      metadata: this.metadata,
      createdAt: this.createdAt,
      readAt: this.readAt
    }
  }
}
