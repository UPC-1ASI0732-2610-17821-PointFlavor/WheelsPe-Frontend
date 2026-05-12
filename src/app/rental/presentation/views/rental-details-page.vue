<template>
  <div class="rental-details-page">
    <div class="container">
      <button @click="goBack" class="btn-back">
        <i class="pi pi-arrow-left"></i>
        Volver
      </button>

      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Cargando detalles...</p>
      </div>

      <div v-else-if="rental" class="rental-details">
        <!-- Header -->
        <div class="details-header">
          <h1>Detalles del Alquiler #{{ rental.id }}</h1>
          <span :class="['status-badge', getStatusClass(rental.status)]">
            {{ getStatusLabel(rental.status) }}
          </span>
        </div>

        <!-- Vehicle Info -->
        <div class="section">
          <h2>Vehículo</h2>
          <div class="vehicle-info">
            <img 
              src="https://via.placeholder.com/400x250/3A5E5E/FFFFFF?text=Vehiculo" 
              alt="Vehicle"
              class="vehicle-image"
            />
            <div class="vehicle-details">
              <h3>{{ vehicle?.brand }} {{ vehicle?.model }}</h3>
              <p>{{ vehicle?.year }}</p>
              <div class="vehicle-specs">
                <span><i class="pi pi-cog"></i> {{ vehicle?.transmission }}</span>
                <span><i class="pi pi-car"></i> {{ vehicle?.licensePlate }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Rental Info -->
        <div class="section">
          <h2>Información del Alquiler</h2>
          <div class="rental-info-grid">
            <div class="info-card">
              <i class="pi pi-calendar"></i>
              <div>
                <strong>Fecha de Inicio</strong>
                <p>{{ formatDate(rental.startDate) }}</p>
              </div>
            </div>
            <div class="info-card">
              <i class="pi pi-calendar"></i>
              <div>
                <strong>Fecha de Fin</strong>
                <p>{{ formatDate(rental.endDate) }}</p>
              </div>
            </div>
            <div class="info-card">
              <i class="pi pi-clock"></i>
              <div>
                <strong>Duración</strong>
                <p>{{ getRentalDays(rental.startDate, rental.endDate) }} días</p>
              </div>
            </div>
            <div class="info-card">
              <i class="pi pi-dollar"></i>
              <div>
                <strong>Precio Total</strong>
                <p class="price">${{ rental.totalPrice }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Location -->
        <div class="section" v-if="rental.pickupLocation">
          <h2>Ubicación</h2>
          <div class="location-info">
            <i class="pi pi-map-marker"></i>
            <p>{{ rental.pickupLocation }}</p>
          </div>
        </div>

        <!-- Actions -->
        <div class="actions" v-if="rental.status === 'active' || rental.status === 'confirmed'">
          <button @click="completeRental" class="btn btn-complete">
            <i class="pi pi-check"></i>
            Marcar como Completado
          </button>
        </div>
      </div>

      <div v-else class="error">
        <p>No se encontró el alquiler</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRentalStore } from '../../application/rental.store.js'

const route = useRoute()
const router = useRouter()
const rentalStore = useRentalStore()

const loading = ref(true)
const rentalId = String(route.params.id)

const rental = computed(() => {
  return rentalStore.state.rentals.find(r => String(r.id) === rentalId)
})

const vehicle = computed(() => {
  if (!rental.value) return null
  return rentalStore.state.vehicles.find(v => v.id === rental.value.vehicleId)
})

onMounted(async () => {
  loading.value = true
  await rentalStore.loadRentals()
  await rentalStore.loadVehicles()
  loading.value = false
})

const goBack = () => {
  router.back()
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

const getRentalDays = (start, end) => {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const diffTime = Math.abs(endDate - startDate)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

const getStatusClass = (status) => {
  const classes = {
    'pending': 'status-pending',
    'active': 'status-active',
    'confirmed': 'status-confirmed',
    'completed': 'status-completed',
    'cancelled': 'status-cancelled'
  }
  return classes[status] || 'status-pending'
}

const getStatusLabel = (status) => {
  const labels = {
    'pending': 'Pendiente',
    'active': 'Activo',
    'confirmed': 'Confirmado',
    'completed': 'Completado',
    'cancelled': 'Cancelado'
  }
  return labels[status] || status
}

const completeRental = async () => {
  try {
    await rentalStore.updateRentalStatus(rentalId, 'completed')
    await rentalStore.loadRentals()
    router.push('/rental/my-rentals')
  } catch (error) {
    console.error('Error completing rental:', error)
  }
}
</script>

<style scoped>
.rental-details-page {
  padding: 2rem 1rem;
  min-height: calc(100vh - 200px);
}

.container {
  max-width: 900px;
  margin: 0 auto;
}

.btn-back {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: white;
  border: 2px solid #3A5E5E;
  border-radius: 8px;
  color: #3A5E5E;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 2rem;
}

.btn-back:hover {
  background: #3A5E5E;
  color: white;
}

.loading {
  text-align: center;
  padding: 4rem 0;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3A5E5E;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.rental-details {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e0e0e0;
}

.details-header h1 {
  margin: 0;
  color: #2C3E50;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
}

.status-pending {
  background: #FFF3CD;
  color: #856404;
}

.status-active,
.status-confirmed {
  background: #D1ECF1;
  color: #0C5460;
}

.status-completed {
  background: #D4EDDA;
  color: #155724;
}

.status-cancelled {
  background: #F8D7DA;
  color: #721C24;
}

.section {
  margin-bottom: 2rem;
}

.section h2 {
  margin: 0 0 1rem 0;
  color: #2C3E50;
  font-size: 1.5rem;
}

.vehicle-info {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 2rem;
}

.vehicle-image {
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.vehicle-details h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.75rem;
  color: #3A5E5E;
}

.vehicle-details p {
  margin: 0 0 1rem 0;
  color: #666;
}

.vehicle-specs {
  display: flex;
  gap: 1.5rem;
}

.vehicle-specs span {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
}

.rental-info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.info-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: #F8F9FA;
  border-radius: 12px;
  border-left: 4px solid #3A5E5E;
}

.info-card i {
  font-size: 1.5rem;
  color: #3A5E5E;
}

.info-card strong {
  display: block;
  margin-bottom: 0.25rem;
  color: #2C3E50;
}

.info-card p {
  margin: 0;
  color: #666;
}

.info-card .price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #3A5E5E;
}

.location-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #F8F9FA;
  border-radius: 12px;
}

.location-info i {
  font-size: 1.5rem;
  color: #3A5E5E;
}

.location-info p {
  margin: 0;
  font-size: 1.1rem;
  color: #666;
}

.actions {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-complete {
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
}

.btn-complete:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.error {
  text-align: center;
  padding: 4rem 0;
  color: #666;
}

@media (max-width: 768px) {
  .vehicle-info {
    grid-template-columns: 1fr;
  }

  .rental-info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
