/**
 * Entidad SupportTicket
 * Representa un ticket de soporte para reportar daños o solicitar ayuda
 */
export class SupportTicket {
  constructor({
    id = 0,
    userId = 0,
    userName = '',
    userRole = '', // 'renter' o 'owner'
    vehicleId = null,
    vehicleName = '',
    rentalId = null,
    type = 'damage', // damage, complaint, question, technical, other
    subject = '',
    description = '',
    status = 'open', // open, in_progress, resolved, closed
    priority = 'medium', // low, medium, high, urgent
    attachments = [],
    assignedTo = null,
    resolutionNotes = null,
    estimatedCost = 0,
    createdAt = null,
    updatedAt = null,
    resolvedAt = null
  } = {}) {
    this.id = id
    this.userId = userId
    this.userName = userName
    this.userRole = userRole
    this.vehicleId = vehicleId
    this.vehicleName = vehicleName
    this.rentalId = rentalId
    this.type = type
    this.subject = subject
    this.description = description
    this.status = status
    this.priority = priority
    this.attachments = attachments || []
    this.assignedTo = assignedTo
    this.resolutionNotes = resolutionNotes
    this.estimatedCost = estimatedCost
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.resolvedAt = resolvedAt
  }

  // Computed properties
  get isOpen() {
    return this.status === 'open' || this.status === 'in_progress'
  }

  get isClosed() {
    return this.status === 'resolved' || this.status === 'closed'
  }

  get typeLabel() {
    const labels = {
      damage: 'Reporte de Daño',
      complaint: 'Queja',
      question: 'Consulta',
      technical: 'Problema Técnico',
      other: 'Otro'
    }
    return labels[this.type] || 'Ticket'
  }

  get typeIcon() {
    const icons = {
      damage: 'pi-exclamation-circle',
      complaint: 'pi-comment',
      question: 'pi-question-circle',
      technical: 'pi-cog',
      other: 'pi-info-circle'
    }
    return icons[this.type] || 'pi-ticket'
  }

  get statusLabel() {
    const labels = {
      open: 'Abierto',
      in_progress: 'En Progreso',
      resolved: 'Resuelto',
      closed: 'Cerrado'
    }
    return labels[this.status] || this.status
  }

  get statusClass() {
    const classes = {
      open: 'status-open',
      in_progress: 'status-progress',
      resolved: 'status-resolved',
      closed: 'status-closed'
    }
    return classes[this.status] || 'status-default'
  }

  get priorityLabel() {
    const labels = {
      low: 'Baja',
      medium: 'Media',
      high: 'Alta',
      urgent: 'Urgente'
    }
    return labels[this.priority] || this.priority
  }

  get priorityClass() {
    const classes = {
      low: 'priority-low',
      medium: 'priority-medium',
      high: 'priority-high',
      urgent: 'priority-urgent'
    }
    return classes[this.priority] || 'priority-default'
  }

  get formattedDate() {
    if (!this.createdAt) return ''
    const date = new Date(this.createdAt)
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  get formattedCost() {
    if (!this.estimatedCost) return 'S/. 0.00'
    return `S/. ${this.estimatedCost.toFixed(2)}`
  }

  get requiresPayment() {
    return this.type === 'damage' && this.estimatedCost > 0
  }

  // Methods
  static fromJson(json) {
    return new SupportTicket(json)
  }

  toJson() {
    return {
      id: this.id,
      userId: this.userId,
      userName: this.userName,
      userRole: this.userRole,
      vehicleId: this.vehicleId,
      vehicleName: this.vehicleName,
      rentalId: this.rentalId,
      type: this.type,
      subject: this.subject,
      description: this.description,
      status: this.status,
      priority: this.priority,
      attachments: this.attachments,
      assignedTo: this.assignedTo,
      resolutionNotes: this.resolutionNotes,
      estimatedCost: this.estimatedCost,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      resolvedAt: this.resolvedAt
    }
  }
}
