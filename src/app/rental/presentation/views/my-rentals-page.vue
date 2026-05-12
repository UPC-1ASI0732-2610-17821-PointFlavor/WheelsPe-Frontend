<template>
  <section class="my-rentals-page">
    <div class="container">
      <header class="page-header">
        <h1 class="page-title">{{ t('rental.myRentals.title') }}</h1>
        <p class="page-subtitle">{{ t('rental.myRentals.subtitle') }}</p>
      </header>

      <div class="rentals-tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.value"
          @click="activeTab = tab.value"
          class="tab-btn"
          :class="{ active: activeTab === tab.value }"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          <span class="tab-label">{{ tab.label }}</span>
          <span v-if="tab.count" class="tab-count">{{ tab.count }}</span>
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>{{ t('rental.myRentals.loading') }}</p>
      </div>

      <!-- Rentals List -->
      <div v-else-if="filteredRentals.length > 0" class="rentals-list">
        <div 
          v-for="rental in filteredRentals" 
          :key="rental.id"
          class="rental-card"
        >
          <div class="rental-vehicle-image">
            <img 
              src="https://via.placeholder.com/300x200/3A5E5E/FFFFFF?text=Vehiculo" 
              :alt="getVehicle(rental.vehicleId)?.brand"
            />
            <span :class="['rental-status-badge', getStatusClass(rental.status)]">
              {{ getStatusLabel(rental.status) }}
            </span>
          </div>

          <div class="rental-details">
            <h3 class="rental-vehicle-name">
              {{ getVehicle(rental.vehicleId)?.brand }} {{ getVehicle(rental.vehicleId)?.model }}
            </h3>
            <p class="rental-vehicle-year">{{ getVehicle(rental.vehicleId)?.year }}</p>

            <div class="rental-info">
              <div class="info-item">
                <i class="pi pi-calendar"></i>
                <span>{{ formatDate(rental.startDate) }} - {{ formatDate(rental.endDate) }}</span>
              </div>
              <div class="info-item">
                <i class="pi pi-clock"></i>
                <span>{{ getRentalDays(rental.startDate, rental.endDate) }} {{ t('rental.myRentals.rentalCard.dates') }}</span>
              </div>
              <div class="info-item">
                <i class="pi pi-map-marker"></i>
                <span>{{ rental.pickupLocation || 'No especificado' }}</span>
              </div>
            </div>

            <div class="rental-footer">
              <div class="rental-price">
                <span class="price-label">{{ t('rental.myRentals.rentalCard.totalPrice') }}</span>
                <span class="price-value">S/. {{ rental.totalPrice }}</span>
              </div>
              <div class="rental-actions">
                <button @click="viewDetails(rental.id)" class="btn-action btn-details">
                  <i class="pi pi-eye"></i>
                  Ver Detalles
                </button>
                <button 
                  v-if="rental.status === 'active' || rental.status === 'confirmed'"
                  @click="completeRental(rental.id)"
                  class="btn-action btn-complete"
                >
                  <i class="pi pi-check"></i>
                  Completar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-icon">📋</div>
        <h3 class="empty-title">{{ t('rental.myRentals.empty.title') }}</h3>
        <p class="empty-message">{{ t('rental.myRentals.empty.message') }}</p>
        <router-link to="/rentals" class="btn btn-primary">
          <span class="icon">🔍</span>
          {{ t('rental.myRentals.empty.searchVehicles') }}
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useRentalStore } from '../../application/rental.store.js'
import { useUserStore } from '@/app/iam/application/user.store.js'

const { t } = useI18n()
const router = useRouter()
const rentalStore = useRentalStore()
const userStore = useUserStore()

const activeTab = ref('pending')
const loading = ref(true)

const currentUser = userStore.currentUser

// Cargar datos
onMounted(async () => {
  try {
    loading.value = true
    await rentalStore.loadVehicles()
    await rentalStore.loadRentals()
    
    console.log('📊 Datos cargados:')
    console.log('- Rentals:', rentalStore.state.rentals)
    console.log('- Vehicles:', rentalStore.state.vehicles)
    console.log('- Current User:', currentUser.value)
  } catch (error) {
    console.error('Error loading rentals:', error)
  } finally {
    loading.value = false
  }
})

// Filtrar alquileres por usuario actual
const userRentals = computed(() => {
  if (!currentUser.value?.id) {
    console.log('⚠️ No hay usuario logueado')
    return []
  }
  console.log(`🔍 Filtrando alquileres para usuario ID: ${currentUser.value.id}`)
  const filtered = rentalStore.state.rentals.filter(r => String(r.renterId) === String(currentUser.value.id))
  console.log(`✅ Se encontraron ${filtered.length} alquileres del usuario`)
  return filtered
})

// Filtrar por estado del tab activo
const filteredRentals = computed(() => {
  const statusMap = {
    'pending': ['pending'],
    'active': ['active', 'confirmed'],
    'completed': ['completed'],
    'cancelled': ['cancelled']
  }
  
  const statuses = statusMap[activeTab.value] || []
  return userRentals.value.filter(r => statuses.includes(r.status))
})

// Obtener vehículo por ID
function getVehicle(vehicleId) {
  if (!vehicleId) return null
  return rentalStore.state.vehicles.find(v => String(v.id) === String(vehicleId))
}

// Formatear fecha
function formatDate(dateString) {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

// Calcular días de alquiler
function getRentalDays(startDate, endDate) {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
  return diff
}

// Tabs con conteo dinámico
const tabs = computed(() => [
  { value: 'pending', label: 'Pendientes', icon: '⏳', count: userRentals.value.filter(r => r.status === 'pending').length },
  { value: 'active', label: 'Activos', icon: '�', count: userRentals.value.filter(r => ['active', 'confirmed'].includes(r.status)).length },
  { value: 'completed', label: 'Completados', icon: '✅', count: userRentals.value.filter(r => r.status === 'completed').length },
  { value: 'cancelled', label: 'Cancelados', icon: '❌', count: userRentals.value.filter(r => r.status === 'cancelled').length }
])

const statusLabel = computed(() => {
  const labels = {
    pending: 'pendientes',
    active: 'activos',
    completed: 'completados',
    cancelled: 'cancelados'
  }
  return labels[activeTab.value]
})

function getStatusClass(status) {
  const classes = {
    'pending': 'status-pending',
    'active': 'status-active',
    'confirmed': 'status-confirmed',
    'completed': 'status-completed',
    'cancelled': 'status-cancelled'
  }
  return classes[status] || 'status-pending'
}

function getStatusLabel(status) {
  const labels = {
    'pending': 'Pendiente',
    'active': 'Activo',
    'confirmed': 'Confirmado',
    'completed': 'Completado',
    'cancelled': 'Cancelado'
  }
  return labels[status] || status
}

// Ver detalles del alquiler
const viewDetails = (rentalId) => {
  router.push(`/rental/details/${rentalId}`)
}

// Completar alquiler
const completeRental = async (rentalId) => {
  try {
    await rentalStore.updateRentalStatus(rentalId, 'completed')
    await rentalStore.loadRentals()
    console.log('✅ Alquiler completado')
  } catch (error) {
    console.error('Error completing rental:', error)
  }
}
</script>

<style scoped>
.my-rentals-page {
  padding: 2rem 1rem;
  min-height: calc(100vh - 200px);
}

.container {
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-title {
  font-family: var(--font-family-primary);
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
}

.page-subtitle {
  font-family: var(--font-family-primary);
  color: var(--text-secondary);
  margin: 0;
  font-size: 1rem;
}

.rentals-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  background: white;
  padding: 0.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  border-radius: 8px;
  cursor: pointer;
  font-family: var(--font-family-primary);
  font-weight: 500;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.tab-btn:hover {
  background: var(--bg-base);
  color: var(--text-primary);
}

.tab-btn.active {
  background: linear-gradient(135deg, var(--bg-moveo-green) 0%, var(--brand-green) 100%);
  color: var(--text-secondary-2);
}

.tab-icon {
  font-size: 1.2rem;
}

.tab-count {
  background: rgba(255, 255, 255, 0.3);
  padding: 0.15rem 0.5rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
}

.tab-btn.active .tab-count {
  background: rgba(255, 255, 255, 0.4);
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-title {
  font-family: var(--font-family-primary);
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
}

.empty-message {
  font-family: var(--font-family-primary);
  color: var(--text-secondary);
  margin: 0 0 2rem 0;
  font-size: 1rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-family: var(--font-family-primary);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  font-size: 1rem;
}

.btn-primary {
  background: linear-gradient(135deg, var(--bg-moveo-green) 0%, var(--brand-green) 100%);
  color: var(--text-secondary-2);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(58, 94, 94, 0.4);
}

.btn .icon {
  font-size: 1.2rem;
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

/* Rentals List */
.rentals-list {
  display: grid;
  gap: 1.5rem;
}

.rental-card {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 1.5rem;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.rental-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.rental-vehicle-image {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 200px;
}

.rental-vehicle-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.rental-status-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-pending {
  background: #FFF3E0;
  color: #F57C00;
}

.status-active {
  background: #E8F5E9;
  color: #2E7D32;
}

.status-confirmed {
  background: #E3F2FD;
  color: #1976D2;
}

.status-completed {
  background: #F3E5F5;
  color: #7B1FA2;
}

.status-cancelled {
  background: #FFEBEE;
  color: #C62828;
}

.rental-details {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.rental-vehicle-name {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: var(--text-primary);
}

.rental-vehicle-year {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0;
}

.rental-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.info-item i {
  color: #3A5E5E;
  font-size: 1.1rem;
}

.rental-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
}

.rental-price {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.price-label {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.price-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #3A5E5E;
}

.rental-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-action {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 8px;
  font-family: var(--font-family-primary);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.btn-details {
  background: linear-gradient(135deg, #3A5E5E 0%, #2C5050 100%);
  color: white;
}

.btn-details:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(58, 94, 94, 0.3);
}

.btn-complete {
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
}

.btn-complete:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.5rem;
  }

  .rentals-tabs {
    justify-content: flex-start;
  }

  .tab-label {
    display: none;
  }

  .tab-btn {
    padding: 0.75rem 1rem;
  }

  .rental-card {
    grid-template-columns: 1fr;
  }

  .rental-vehicle-image {
    min-height: 200px;
  }

  .rental-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .rental-actions {
    width: 100%;
  }

  .btn-action {
    flex: 1;
  }
}
</style>
