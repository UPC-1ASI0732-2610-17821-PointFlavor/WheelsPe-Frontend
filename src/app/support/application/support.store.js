import { reactive, computed } from 'vue'
import { apiClient } from '@/app/shared/infrastructure/apiClient.js'

const state = reactive({
  tickets: [],
  currentTicket: null,
  loading: false,
  error: null
})

export const useSupportStore = () => {
  // Cargar tickets del usuario
  const fetchTickets = async (userId) => {
    state.loading = true
    state.error = null
    
    try {
      // Obtener TODOS los tickets del db.json
      const response = await apiClient.get('/support-tickets')
      
      // Filtrar solo los tickets del usuario actual
      // Normalizar ids a Number para evitar mismatch string/number
      const uid = Number(userId)
      const userTickets = response.filter(ticket => 
        Number(ticket.userId) === uid || Number(ticket.renterId) === uid
      )
      
      state.tickets = userTickets
      console.log('📋 Tickets cargados:', userTickets.length)
    } catch (error) {
      console.error('Error loading tickets:', error)
      state.error = 'Error al cargar los tickets'
      state.tickets = []
    } finally {
      state.loading = false
    }
  }

  // Crear nuevo ticket
  const createTicket = async (ticketData) => {
    state.loading = true
    state.error = null
    
    try {
      // 1. Crear el ticket (asegurar que category siempre esté presente)
      const newTicket = {
        ...ticketData,
        category: ticketData.category || ticketData.type || 'general',
        status: 'open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      const createdTicket = await apiClient.post('/support-tickets', newTicket)
      
      // 2. Si es un ticket de daño Y tiene renterId, crear notificación automática
      if (ticketData.type === 'damage' && ticketData.renterId) {
        await createDamageNotification(createdTicket, ticketData.renterId, ticketData.renterName)
      }
      
      // 3. Recargar tickets
      await fetchTickets(ticketData.userId)
      
      return createdTicket
    } catch (error) {
      console.error('Error creating ticket:', error)
      state.error = 'Error al crear el ticket'
      throw error
    } finally {
      state.loading = false
    }
  }

  // Crear notificación de daño para el renter
  const createDamageNotification = async (ticket, renterId, renterName) => {
    try {
      const notification = {
        userId: renterId,
        type: 'damage_report',
        title: 'Reporte de Daño - Acción Requerida',
        body: `Se ha reportado un daño en el vehículo ${ticket.vehicleName || 'alquilado'}. El propietario ha creado un ticket #${ticket.id}. Costo estimado: S/. ${ticket.estimatedCost || 0}`,
        relatedId: ticket.id,
        relatedType: 'ticket',
        read: false,
        actionUrl: `/payments/ticket/${ticket.id}`,
        actionLabel: 'Ver Ticket y Pagar',
        metadata: {
          ticketId: ticket.id,
          vehicleId: ticket.vehicleId,
          estimatedCost: ticket.estimatedCost || 0,
          ownerName: ticket.userName,
          renterName: renterName
        },
        createdAt: new Date().toISOString(),
        readAt: null
      }
      
      await apiClient.post('/notifications', notification)
      console.log('✅ Notificación de daño creada para:', renterName)
    } catch (error) {
      console.error('Error creating damage notification:', error)
    }
  }

  // Cargar un ticket específico
  const fetchTicket = async (ticketId) => {
    state.loading = true
    state.error = null
    
    try {
      const rawTicket = await apiClient.get(`/support-tickets/${ticketId}`)
      
      // Procesar ticket para agregar propiedades de vista
      const typeIcons = {
        'damage': 'pi-exclamation-triangle',
        'complaint': 'pi-comment',
        'question': 'pi-question-circle',
        'technical': 'pi-wrench',
        'other': 'pi-info-circle'
      }
      
      const typeLabels = {
        'damage': 'Reporte de daño',
        'complaint': 'Queja',
        'question': 'Consulta',
        'technical': 'Problema técnico',
        'other': 'Otro'
      }
      
      const statusLabels = {
        'open': 'Abierto',
        'in_progress': 'En proceso',
        'resolved': 'Resuelto',
        'closed': 'Cerrado'
      }
      
      const priorityLabels = {
        'low': 'Baja',
        'medium': 'Media',
        'high': 'Alta',
        'urgent': 'Urgente'
      }
      
      const statusClasses = {
        'open': 'status-open',
        'in_progress': 'status-progress',
        'resolved': 'status-resolved',
        'closed': 'status-closed'
      }
      
      state.currentTicket = {
        ...rawTicket,
        typeIcon: typeIcons[rawTicket.type] || 'pi-ticket',
        typeLabel: typeLabels[rawTicket.type] || rawTicket.type,
        statusLabel: statusLabels[rawTicket.status] || rawTicket.status,
        statusClass: statusClasses[rawTicket.status] || '',
        priorityLabel: priorityLabels[rawTicket.priority] || rawTicket.priority,
        formattedDate: rawTicket.createdAt ? new Date(rawTicket.createdAt).toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        }) : '',
        formattedCost: rawTicket.estimatedCost ? `S/. ${rawTicket.estimatedCost.toFixed(2)}` : '',
        isOpen: rawTicket.status === 'open' || rawTicket.status === 'in_progress',
        requiresPayment: rawTicket.type === 'damage' && rawTicket.estimatedCost > 0 && rawTicket.status !== 'closed'
      }
      
      console.log('📋 Ticket cargado:', state.currentTicket)
    } catch (error) {
      console.error('Error loading ticket:', error)
      state.error = 'Error al cargar el ticket'
      state.currentTicket = null
    } finally {
      state.loading = false
    }
  }

  // Cerrar ticket
  const closeTicket = async (ticketId, resolutionNotes) => {
    state.loading = true
    state.error = null
    
    try {
      await apiClient.patch(`/support-tickets/${ticketId}`, {
        status: 'closed',
        resolutionNotes,
        resolvedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      
      // Recargar el ticket actual
      await fetchTicket(ticketId)
    } catch (error) {
      console.error('Error closing ticket:', error)
      state.error = 'Error al cerrar el ticket'
      throw error
    } finally {
      state.loading = false
    }
  }

  // Computed: Estadísticas
  const stats = computed(() => {
    const total = state.tickets.length
    const open = state.tickets.filter(t => t.status === 'open').length
    const closed = state.tickets.filter(t => t.status === 'closed').length
    const damage = state.tickets.filter(t => t.type === 'damage').length
    
    return { total, open, closed, damage }
  })

  return {
    state,
    get tickets() { return state.tickets },
    get currentTicket() { return state.currentTicket },
    get loading() { return state.loading },
    get error() { return state.error },
    stats,
    fetchTickets,
    createTicket,
    fetchTicket,
    closeTicket
  }
}
