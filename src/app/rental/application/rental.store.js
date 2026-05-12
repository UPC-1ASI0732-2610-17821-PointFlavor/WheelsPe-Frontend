import { reactive, computed } from 'vue'
import { RentalApi } from '../infrastructure/rental-api.js'
import { apiClient } from '@/app/shared/infrastructure/apiClient.js'

export const state = reactive({
  vehicles: [],
  rentals: [],
  loading: false,
  error: null,
  selectedVehicleId: null,
  filters: {
    district: '',
    startDate: '',
    endDate: '',
    minPrice: 0,
    maxPrice: 1000,
    transmission: '',
    minSeats: 0,
    fuelType: ''
  },
  sortBy: 'createdAt', // 'price-asc', 'price-desc', 'rating-desc', 'createdAt'
})

// Helper: Check if a rental is currently active
function isRentalActive(rental) {
  const now = new Date()
  const start = new Date(rental.startDate)
  const end = new Date(rental.endDate)
  
  // Status must be 'active' or 'pending' and dates must overlap with now
  return (rental.status === 'active' || rental.status === 'pending') && now >= start && now <= end
}

// Helper: Check if vehicle is available (not rented right now)
function isVehicleCurrentlyAvailable(vehicleId) {
  return !state.rentals.some(rental => 
    rental.vehicleId === vehicleId && isRentalActive(rental)
  )
}

// Helper: Check if vehicle is available in date range
function isVehicleAvailableInDateRange(vehicleId, startDate, endDate) {
  if (!startDate || !endDate) return true // No date filter, consider available
  
  const searchStart = new Date(startDate)
  const searchEnd = new Date(endDate)
  
  // Check if vehicle has any rental that overlaps with the search dates
  const hasConflict = state.rentals.some(rental => {
    if (rental.vehicleId !== vehicleId) return false
    
    // Only check active, pending, or confirmed rentals
    if (!['active', 'pending', 'confirmed'].includes(rental.status)) return false
    
    const rentalStart = new Date(rental.startDate)
    const rentalEnd = new Date(rental.endDate)
    
    // Check for date overlap
    return searchStart <= rentalEnd && searchEnd >= rentalStart
  })
  
  return !hasConflict
}

// Filter vehicles based on criteria
function applyFilters(vehicles, filters) {
  return vehicles.filter(vehicle => {
    // Filter by district
    if (filters.district && vehicle.location?.district !== filters.district) {
      return false
    }
    
    // Filter by date availability
    if (filters.startDate && filters.endDate) {
      if (!isVehicleAvailableInDateRange(vehicle.id, filters.startDate, filters.endDate)) {
        return false
      }
    }
    
    // Filter by price range
    if (vehicle.dailyPrice < filters.minPrice || vehicle.dailyPrice > filters.maxPrice) {
      return false
    }
    
    // Filter by transmission
    if (filters.transmission && vehicle.transmission !== filters.transmission) {
      return false
    }
    
    // Filter by minimum seats
    if (filters.minSeats > 0 && vehicle.seats < filters.minSeats) {
      return false
    }
    
    // Filter by fuel type
    if (filters.fuelType && vehicle.fuelType !== filters.fuelType) {
      return false
    }
    
    // Filter by vehicle status (exclude paused vehicles)
    if (vehicle.status === 'paused') {
      return false
    }
    
    return true
  })
}

// Sort vehicles based on criteria
function sortVehicles(vehicles, sortBy) {
  const sorted = [...vehicles]
  
  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.dailyPrice - b.dailyPrice)
    
    case 'price-desc':
      return sorted.sort((a, b) => b.dailyPrice - a.dailyPrice)
    
    case 'rating-desc':
      // TODO: Add rating field to vehicles, for now use year as proxy
      return sorted.sort((a, b) => b.year - a.year)
    
    case 'createdAt':
    default:
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }
}

export async function loadVehicles() {
  state.loading = true
  state.error = null
  try {
    console.log('🚗 [rental.store] Iniciando carga de vehículos...')
    
    // Load both vehicles and rentals to determine availability
    const [vehicles, rentals] = await Promise.all([
      RentalApi.listVehicles(),
      RentalApi.listRentals()
    ])
    
    console.log('🚗 [rental.store] Vehículos recibidos del API:', vehicles)
    console.log('🚗 [rental.store] Tipo de vehicles:', typeof vehicles, Array.isArray(vehicles))
    
    // Normalize fields from the API. Keep IDs as strings (GUIDs) to avoid NaN conversion.
    const normalizeVehicle = v => {
      const normalized = {
        ...v,
        id: v.id != null ? String(v.id) : null,
        ownerId: v.ownerId != null ? Number(v.ownerId) : v.ownerId,
        dailyPrice: typeof v.dailyPrice === 'object' ? v.dailyPrice.amount : Number(v.dailyPrice),
        depositAmount: typeof v.depositAmount === 'object' ? v.depositAmount.amount : Number(v.depositAmount)
      }
      console.log('🚗 [rental.store] Vehículo normalizado:', {
        id: normalized.id,
        idIsNaN: isNaN(normalized.id),
        originalId: v.id,
        brand: normalized.brand,
        dailyPrice: normalized.dailyPrice
      })
      return normalized
    }

    const normalizeRental = r => ({
      ...r,
      id: r.id != null ? String(r.id) : null,
      vehicleId: r.vehicleId != null ? String(r.vehicleId) : r.vehicleId,
      renterId: r.renterId != null ? Number(r.renterId) : r.renterId,
      ownerId: r.ownerId != null ? Number(r.ownerId) : r.ownerId,
      totalPrice: r.totalPrice != null ? Number(r.totalPrice) : r.totalPrice
    })

    state.vehicles = vehicles.map(normalizeVehicle)
    state.rentals = rentals.map(normalizeRental)
    
    console.log('🚗 [rental.store] Vehículos normalizados en state:', state.vehicles.length)
    console.log('🚗 [rental.store] IDs de vehículos:', state.vehicles.map(v => ({ id: v.id, isNaN: isNaN(v.id) })))
    
    // Mark vehicles as unavailable if they have active rentals
    state.vehicles.forEach(vehicle => {
      if (!isVehicleCurrentlyAvailable(vehicle.id)) {
        vehicle.isAvailable = false
      }
    })
  } catch (e) {
    console.error('🚗 [rental.store] Error cargando vehículos:', e)
    state.error = e.message
  } finally { state.loading = false }
}

export async function loadRentals() {
  state.loading = true
  state.error = null
  try {
    const rentals = await RentalApi.listRentals()
    // Normalize numeric fields
    state.rentals = Array.isArray(rentals) ? rentals.map(r => ({
      ...r,
      id: r.id != null ? String(r.id) : null,
      vehicleId: r.vehicleId != null ? String(r.vehicleId) : r.vehicleId,
      renterId: r.renterId != null ? Number(r.renterId) : r.renterId,
      ownerId: r.ownerId != null ? Number(r.ownerId) : r.ownerId,
      totalPrice: r.totalPrice != null ? Number(r.totalPrice) : r.totalPrice
    })) : []
  } catch (e) { state.error = e.message } finally { state.loading = false }
}

export async function updateRentalStatus(rentalId, newStatus) {
  state.loading = true
  state.error = null
  try {
    const rental = state.rentals.find(r => r.id === rentalId)
    
    await RentalApi.updateRentalStatus(rentalId, newStatus)
    
    // Crear notificaciones según el nuevo estado
    if (rental) {
      if (newStatus === 'completed') {
        // Notificar al owner que el alquiler se completó
        await createRentalCompletedNotification(rental)
      } else if (newStatus === 'accepted' || newStatus === 'confirmed') {
        // Notificar al renter que su solicitud fue aceptada/confirmada
        await createRentalAcceptedNotification(rental)
      } else if (newStatus === 'rejected' || newStatus === 'cancelled') {
        // Notificar al renter que su solicitud fue rechazada/cancelada
        await createRentalRejectedNotification(rental)
      }
    }
    
    // Recargar rentals después de actualizar
    await loadRentals()
  } catch (e) {
    state.error = e.message
    throw e
  } finally {
    state.loading = false
  }
}

export async function rateRental(rentalId, rating, comment, adventureRating = null, adventureComment = null) {
  state.loading = true
  state.error = null
  try {
    const rental = state.rentals.find(r => r.id === rentalId)
    if (!rental) throw new Error('Rental not found')

    // 1. Create Vehicle Review (si tiene vehicleId)
    if (rental.vehicleId) {
      const vehicleReviewData = {
        rentalId: rentalId,
        vehicleId: rental.vehicleId,
        renterId: rental.renterId,
        ownerId: rental.ownerId,
        rating: rating,
        comment: comment,
        type: 'vehicle', // Marcar como reseña de vehículo
        createdAt: new Date().toISOString()
      }
      await RentalApi.createReview(vehicleReviewData)
      
      // Notificar al owner sobre la reseña del vehículo
      await createReviewNotification(rental, rating, comment)
    }

    // 2. Si es una aventura, crear también reseña de aventura
    if (rental.adventureRouteId) {
      const advRating = adventureRating ?? rating
      const advComment = adventureComment ?? comment
      
      const adventureReviewData = {
        rentalId: rentalId,
        adventureRouteId: rental.adventureRouteId,
        renterId: rental.renterId,
        rating: advRating,
        comment: advComment,
        type: 'adventure', // Marcar como reseña de aventura
        createdAt: new Date().toISOString()
      }
      await RentalApi.createReview(adventureReviewData)
      
      // Actualizar el rating promedio de la aventura
      await updateAdventureRating(rental.adventureRouteId)
      
      // Notificar al owner sobre la reseña de la aventura
      await createAdventureReviewNotification(rental, advRating, advComment)
    }

    // 3. Update Rental to mark as rated
    await RentalApi.updateRentalRating(rentalId, { 
      isRated: true,
      rating: rating,
      adventureRating: rental.adventureRouteId ? (adventureRating || rating) : null
    })

    // 4. Reload rentals
    await loadRentals()
    
    return true
  } catch (e) {
    state.error = e.message
    throw e
  } finally {
    state.loading = false
  }
}

// Actualizar el rating promedio de una aventura
async function updateAdventureRating(adventureRouteId) {
  try {
    // Obtener todas las reseñas de esta aventura
    const reviews = await apiClient.get('/reviews')
    const adventureReviews = reviews.filter(r => 
      Number(r.adventureRouteId) === Number(adventureRouteId) && r.type === 'adventure'
    )
    
    if (adventureReviews.length > 0) {
      const avgRating = adventureReviews.reduce((sum, r) => sum + r.rating, 0) / adventureReviews.length
      
      // Actualizar la aventura con el nuevo rating
      await apiClient.patch(`/adventure-routes/${adventureRouteId}`, {
        rating: Number.parseFloat(avgRating.toFixed(1)),
        reviewsCount: adventureReviews.length
      })
      
      console.log(`✅ Aventura ${adventureRouteId} actualizada: rating=${avgRating.toFixed(1)}, reviews=${adventureReviews.length}`)
    }
  } catch (error) {
    console.error('Error updating adventure rating:', error)
  }
}

// Crear notificación cuando se recibe una reseña de aventura
async function createAdventureReviewNotification(rental, rating, comment) {
  try {
    // Obtener info de la aventura
    const adventure = await apiClient.get(`/adventure-routes/${rental.adventureRouteId}`)
    const starsText = '⭐'.repeat(rating)
    
    const notification = {
      userId: adventure.ownerId,
      type: 'adventure_review_received',
      title: '🌟 Nueva Calificación de Aventura',
      body: `Tu aventura "${adventure.title}" ha recibido una calificación de ${starsText} (${rating}/5). ${comment ? `Comentario: "${comment}"` : ''}`,
      relatedId: rental.adventureRouteId,
      relatedType: 'adventure',
      read: false,
      actionUrl: `/adventure/my-adventures`,
      actionLabel: 'Ver Mis Aventuras',
      metadata: {
        rentalId: rental.id,
        adventureRouteId: rental.adventureRouteId,
        renterId: rental.renterId,
        rating: rating,
        comment: comment
      },
      createdAt: new Date().toISOString(),
      readAt: null
    }
    
    await apiClient.post('/notifications', notification)
    console.log('✅ Notificación de calificación de aventura creada para owner:', adventure.ownerId)
  } catch (error) {
    console.error('Error creating adventure review notification:', error)
  }
}

// Crear notificación cuando se recibe una calificación
async function createReviewNotification(rental, rating, comment) {
  try {
    const vehicle = state.vehicles.find(v => v.id === rental.vehicleId)
    const starsText = '⭐'.repeat(rating)
    
    const notification = {
      userId: rental.ownerId,
      type: 'review_received',
      title: '🌟 Nueva Calificación Recibida',
      body: `Tu vehículo ${vehicle?.brand} ${vehicle?.model} ha recibido una calificación de ${starsText} (${rating}/5). ${comment ? `Comentario: "${comment}"` : ''}`,
      relatedId: rental.id,
      relatedType: 'rental',
      read: false,
      actionUrl: `/rental/my-vehicles`,
      actionLabel: 'Ver Mis Vehículos',
      metadata: {
        rentalId: rental.id,
        vehicleId: rental.vehicleId,
        renterId: rental.renterId,
        rating: rating,
        comment: comment
      },
      createdAt: new Date().toISOString(),
      readAt: null
    }
    
    await apiClient.post('/notifications', notification)
    console.log('✅ Notificación de calificación creada para owner:', rental.ownerId)
  } catch (error) {
    console.error('Error creating review notification:', error)
  }
}

// Crear notificación cuando un rental se completa
async function createRentalCompletedNotification(rental) {
  try {
    const vehicle = state.vehicles.find(v => v.id === rental.vehicleId)
    
    const notification = {
      userId: rental.ownerId,
      type: 'rental_completed',
      title: '✅ Alquiler Completado',
      body: `El cliente ${rental.renterName || ''} ha completado el alquiler del vehículo ${vehicle?.brand} ${vehicle?.model}. Alquiler #${rental.id}. Total: S/. ${rental.totalPrice}`,
      relatedId: rental.id,
      relatedType: 'rental',
      read: false,
      actionUrl: `/rental/vehicles/${rental.vehicleId}`,
      actionLabel: 'Ver Vehículo',
      metadata: {
        rentalId: rental.id,
        vehicleId: rental.vehicleId,
        renterId: rental.renterId,
        renterName: rental.renterName,
        totalPrice: rental.totalPrice
      },
      createdAt: new Date().toISOString(),
      readAt: null
    }
    
    await apiClient.post('/notifications', notification)
    console.log('✅ Notificación de alquiler completado creada para owner:', rental.ownerId)
  } catch (error) {
    console.error('Error creating rental completed notification:', error)
  }
}

// Crear notificación cuando una solicitud es aceptada
async function createRentalAcceptedNotification(rental) {
  try {
    const vehicle = state.vehicles.find(v => v.id === rental.vehicleId)
    
    const notification = {
      userId: rental.renterId,
      type: 'rental_confirmed',
      title: '🎉 ¡Solicitud Aceptada!',
      body: `Tu solicitud de alquiler del vehículo ${vehicle?.brand} ${vehicle?.model} ha sido aceptada. Alquiler #${rental.id}. Puedes recoger el vehículo el ${new Date(rental.startDate).toLocaleDateString('es-ES')}`,
      relatedId: rental.id,
      relatedType: 'rental',
      read: false,
      actionUrl: `/rental/details/${rental.id}`,
      actionLabel: 'Ver Detalles',
      metadata: {
        rentalId: rental.id,
        vehicleId: rental.vehicleId,
        ownerId: rental.ownerId,
        totalPrice: rental.totalPrice,
        startDate: rental.startDate,
        endDate: rental.endDate
      },
      createdAt: new Date().toISOString(),
      readAt: null
    }
    
    await apiClient.post('/notifications', notification)
    console.log('✅ Notificación de solicitud aceptada creada para renter:', rental.renterId)
  } catch (error) {
    console.error('Error creating rental accepted notification:', error)
  }
}

// Crear notificación cuando una solicitud es rechazada
async function createRentalRejectedNotification(rental) {
  try {
    const vehicle = state.vehicles.find(v => v.id === rental.vehicleId)
    
    const notification = {
      userId: rental.renterId,
      type: 'rental_cancelled',
      title: '❌ Solicitud Rechazada',
      body: `Lo sentimos, tu solicitud de alquiler del vehículo ${vehicle?.brand} ${vehicle?.model} ha sido rechazada por el propietario. Alquiler #${rental.id}`,
      relatedId: rental.id,
      relatedType: 'rental',
      read: false,
      actionUrl: `/rental/browse`,
      actionLabel: 'Ver Otros Vehículos',
      metadata: {
        rentalId: rental.id,
        vehicleId: rental.vehicleId,
        ownerId: rental.ownerId
      },
      createdAt: new Date().toISOString(),
      readAt: null
    }
    
    await apiClient.post('/notifications', notification)
    console.log('✅ Notificación de solicitud rechazada creada para renter:', rental.renterId)
  } catch (error) {
    console.error('Error creating rental rejected notification:', error)
  }
}

export function selectVehicle(id) {
  console.log('🚗 [rental.store] selectVehicle llamado con id:', id, 'tipo:', typeof id)
  state.selectedVehicleId = id != null ? String(id) : null
  console.log('🚗 [rental.store] selectedVehicleId establecido a:', state.selectedVehicleId)
  console.log('🚗 [rental.store] Vehículos disponibles para búsqueda:', state.vehicles.map(v => ({ id: v.id, tipo: typeof v.id })))
}

export const selectedVehicle = computed(() => {
  const found = state.vehicles.find(v => v.id === state.selectedVehicleId)
  console.log('🚗 [rental.store] selectedVehicle computed - buscando id:', state.selectedVehicleId, 'encontrado:', found ? found.brand : 'null')
  return found || null
})

// Computed: Get filtered and sorted vehicles
export const filteredVehicles = computed(() => {
  let vehicles = applyFilters(state.vehicles, state.filters)
  vehicles = sortVehicles(vehicles, state.sortBy)
  return vehicles
})

// Set filters
export function setFilters(filters) {
  state.filters = { ...state.filters, ...filters }
}

// Set sort criteria
export function setSortBy(sortBy) {
  state.sortBy = sortBy
}

// Clear all filters
export function clearFilters() {
  state.filters = {
    district: '',
    startDate: '',
    endDate: '',
    minPrice: 0,
    maxPrice: 1000,
    transmission: '',
    minSeats: 0,
    fuelType: ''
  }
}

export function useRentalStore() {
  return {
    state,
    loadVehicles,
    loadRentals,
    updateRentalStatus,
    rateRental,
    selectVehicle,
    selectedVehicle,
    filteredVehicles,
    setFilters,
    setSortBy,
    clearFilters,
  }
}
