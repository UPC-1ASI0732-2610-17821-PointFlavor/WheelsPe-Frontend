// Repositorio / gateway API para rental
import { apiClient } from '@/app/shared/infrastructure/apiClient.js'
import { toVehicleCollection, toVehicleEntity, toRentalCollection, toRentalEntity } from './rental.assembler.js'
import http from '@/app/shared/infrastructure/http-common.js'

export const RentalApi = {
  // Obtener vehículos por propietario
  async getVehiclesByOwner(ownerId) {
    try {
      const data = await apiClient.get('/vehicles')
      const vehicles = toVehicleCollection(data)
      
      // Filtrar vehículos por ownerId (convertir a número para comparación segura)
      return vehicles.filter(v => Number(v.ownerId) === Number(ownerId))
    } catch (error) {
      console.error('Error al obtener vehículos por propietario:', error)
      return []
    }
  },

  // Obtener reviews de un rental
  async getRentalReviews(rentalId) {
    const response = await http.get(`/reviews?rentalId=${rentalId}`)
    return response.data
  },

  // Obtener historial de rentals de un vehículo
  async getVehicleRentalHistory(vehicleId) {
    const response = await http.get(`/rentals?vehicleId=${vehicleId}&_sort=startDate&_order=desc`)
    return response.data
  },

  // Listar todos los vehículos
  async listVehicles() {
    const data = await apiClient.get('/vehicles')
    return toVehicleCollection(data)
  },

  // Obtener un vehículo específico
  async getVehicle(id) {
    const data = await apiClient.get(`/vehicles/${id}`)
    return toVehicleEntity(data)
  },

  // Crear un nuevo vehículo
  async createVehicle(payload) {
    const data = await apiClient.post('/vehicles', payload)
    return toVehicleEntity(data)
  },

  // Actualizar un vehículo existente
  async updateVehicle(id, payload) {
    const data = await apiClient.put(`/vehicles/${id}`, payload)
    return toVehicleEntity(data)
  },

  // Eliminar un vehículo
  async deleteVehicle(id) {
    await apiClient.delete(`/vehicles/${id}`)
  },

  // Listar todos los rentals
  async listRentals() {
    const data = await apiClient.get('/rentals')
    return toRentalCollection(data)
  },

  // Crear un nuevo rental
  async createRental(payload) {
    const data = await apiClient.post('/rentals', payload)
    return toRentalEntity(data)
  },

  // Actualizar el estado de un rental
  async updateRentalStatus(rentalId, newStatus) {
    const data = await apiClient.patch(`/rentals/${rentalId}`, { status: newStatus })
    return toRentalEntity(data)
  },

  // Crear una reseña
  async createReview(reviewData) {
    const data = await apiClient.post('/reviews', reviewData)
    return data
  },

  // Actualizar rental con datos de reseña (para marcar como calificado)
  async updateRentalRating(rentalId, ratingData) {
    const data = await apiClient.patch(`/rentals/${rentalId}`, ratingData)
    return toRentalEntity(data)
  }
}