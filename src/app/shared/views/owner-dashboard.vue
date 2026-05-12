<script setup>
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/app/iam/application/user.store'
import { useRentalStore } from '@/app/rental/application/rental.store'

const { t } = useI18n()
const userStore = useUserStore()
const rentalStore = useRentalStore()

const user = computed(() => userStore.currentUser.value)

// Cargar datos al montar
onMounted(async () => {
  await rentalStore.loadRentals()
  await rentalStore.loadVehicles()
})

// Vehículos del owner
const ownerVehicles = computed(() => {
  if (!user.value) return []
  return rentalStore.state.vehicles.filter(vehicle => vehicle.ownerId === user.value.id)
})

// Alquileres de los vehículos del owner
const ownerRentals = computed(() => {
  if (!user.value) return []
  const vehicleIds = ownerVehicles.value.map(v => v.id)
  return rentalStore.state.rentals.filter(rental => vehicleIds.includes(rental.vehicleId))
})

// Solicitudes pendientes (status: pending)
const pendingRequests = computed(() => {
  return ownerRentals.value.filter(rental => rental.status === 'pending')
})

// Alquileres activos
const activeRentals = computed(() => {
  return ownerRentals.value.filter(rental => rental.status === 'active')
})

// Calcular total ganado (alquileres completados)
const totalEarned = computed(() => {
  return ownerRentals.value
    .filter(rental => rental.status === 'completed')
    .reduce((total, rental) => total + (rental.totalPrice || 0), 0)
})

// Calcular ganancias por mes
const monthlyEarnings = computed(() => {
  const earnings = {}
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  
  // Inicializar todos los meses en 0
  months.forEach(month => {
    earnings[month] = 0
  })
  
  // Calcular ganancias por mes de alquileres completados
  ownerRentals.value
    .filter(rental => rental.status === 'completed')
    .forEach(rental => {
      const endDate = new Date(rental.endDate)
      const monthName = months[endDate.getMonth()]
      earnings[monthName] += rental.totalPrice || 0
    })
  
  return earnings
})

// Obtener el mes con mayores ganancias
const bestMonth = computed(() => {
  const earnings = monthlyEarnings.value
  let maxEarning = 0
  let bestMonthName = 'Ene'
  
  Object.entries(earnings).forEach(([month, amount]) => {
    if (amount > maxEarning) {
      maxEarning = amount
      bestMonthName = month
    }
  })
  
  return { month: bestMonthName, amount: maxEarning }
})

// Stats funcionales
const stats = computed(() => ({
  totalEarned: totalEarned.value,
  activeRentals: activeRentals.value.length,
  totalVehicles: ownerVehicles.value.length,
  pendingRequests: pendingRequests.value.length
}))

// Obtener datos del vehículo
function getVehicleData(vehicleId) {
  return ownerVehicles.value.find(v => v.id === vehicleId)
}

// Formatear fecha
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

// Aceptar solicitud
const acceptRequest = async (rentalId) => {
  try {
    // Use 'confirmed' as the canonical status for accepted/confirmed rentals
    await rentalStore.updateRentalStatus(rentalId, 'confirmed')
    await rentalStore.loadRentals()
    console.log('✅ Solicitud confirmada')
  } catch (error) {
    console.error('Error accepting request:', error)
  }
}

// Rechazar solicitud
const rejectRequest = async (rentalId) => {
  try {
    await rentalStore.updateRentalStatus(rentalId, 'rejected')
    await rentalStore.loadRentals()
    console.log('❌ Solicitud rechazada')
  } catch (error) {
    console.error('Error rejecting request:', error)
  }
}
</script>

<template>
  <div class="owner-dashboard">
    <div class="dashboard-header">
      <h1>{{ t('shared.dashboard.owner.welcome', { name: user?.firstName || 'Propietario' }) }} 🚀</h1>
      <p>{{ t('shared.dashboard.owner.summary') }}</p>
    </div>

    <!-- Stats Grid -->
    <div class="stats-grid">
      <div class="stat-card highlight">
        <div class="stat-icon">💵</div>
        <div class="stat-content">
          <h3>${{ stats.totalEarned.toFixed(2) }}</h3>
          <p>{{ t('shared.dashboard.owner.totalEarnings') }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">🚗</div>
        <div class="stat-content">
          <h3>{{ stats.totalVehicles }}</h3>
          <p>{{ t('shared.dashboard.owner.publishedVehicles') }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">📋</div>
        <div class="stat-content">
          <h3>{{ stats.activeRentals }}</h3>
          <p>{{ t('shared.dashboard.owner.activeRentals') }}</p>
        </div>
      </div>

      <div class="stat-card warning">
        <div class="stat-icon">⏳</div>
        <div class="stat-content">
          <h3>{{ stats.pendingRequests }}</h3>
          <p>{{ t('shared.dashboard.owner.pendingRequests') }}</p>
        </div>
      </div>
    </div>

    <!-- Solicitudes Pendientes -->
    <div class="section">
      <div class="section-header">
        <h2>{{ t('shared.dashboard.owner.pendingRequestsTitle') }}</h2>
        <router-link to="/rental/rental-requests" class="link">{{ t('shared.dashboard.owner.viewAll') }} →</router-link>
      </div>
      <div class="empty-state" v-if="pendingRequests.length === 0">
        <p>{{ t('shared.dashboard.owner.noPendingRequests') }}</p>
      </div>
      <div v-else>
        <div class="alert-box">
          <p>⚠️ {{ t('shared.dashboard.owner.requestsWaiting', { count: stats.pendingRequests }) }}</p>
          <router-link to="/rental/rental-requests" class="btn-primary">{{ t('shared.dashboard.owner.reviewRequests') }}</router-link>
        </div>

        <!-- Mostrar últimas 3 solicitudes -->
        <div class="requests-grid">
          <div
            v-for="rental in pendingRequests.slice(0, 3)"
            :key="rental.id"
            class="request-card"
          >
            <div class="request-header">
              <div class="request-status">⏳ Pendiente</div>
              <span class="request-date">{{ formatDate(rental.createdAt) }}</span>
            </div>
            <div class="vehicle-info">
              <h3>{{ getVehicleData(rental.vehicleId)?.brand }} {{ getVehicleData(rental.vehicleId)?.model }}</h3>
              <p class="vehicle-plate">{{ getVehicleData(rental.vehicleId)?.licensePlate }}</p>
            </div>
            <div class="request-dates">
              <div class="date-item">
                <i class="pi pi-calendar"></i>
                <span>{{ formatDate(rental.startDate) }}</span>
              </div>
              <i class="pi pi-arrow-right"></i>
              <div class="date-item">
                <i class="pi pi-calendar"></i>
                <span>{{ formatDate(rental.endDate) }}</span>
              </div>
            </div>
            <div class="request-price">
              <span class="price">${{ rental.totalPrice }}</span>
            </div>
            <div class="request-actions">
              <button class="btn-accept" @click="acceptRequest(rental.id)">✓ Aceptar</button>
              <button class="btn-decline" @click="rejectRequest(rental.id)">✗ Rechazar</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mis Vehículos -->
    <div class="section">
      <div class="section-header">
        <h2>{{ t('shared.dashboard.owner.myVehicles') }}</h2>
        <router-link to="/rental/add-vehicle" class="btn-secondary">+ {{ t('shared.dashboard.owner.addVehicle') }}</router-link>
      </div>
      <div class="empty-state" v-if="ownerVehicles.length === 0">
        <p>{{ t('shared.dashboard.owner.noVehicles') }}</p>
        <router-link to="/rental/add-vehicle" class="btn-primary">+ {{ t('shared.dashboard.owner.addVehicle') }}</router-link>
      </div>
      <div v-else class="vehicles-grid">
        <div
          v-for="vehicle in ownerVehicles.slice(0, 4)"
          :key="vehicle.id"
          class="vehicle-card"
        >
          <div class="vehicle-image-placeholder">
            <i class="pi pi-car"></i>
          </div>
          <div class="vehicle-details">
            <h3>{{ vehicle.brand }} {{ vehicle.model }}</h3>
            <p class="vehicle-year">{{ vehicle.year }} • {{ vehicle.color }}</p>
            <div class="vehicle-specs">
              <span><i class="pi pi-users"></i> {{ vehicle.seats }}</span>
              <span><i class="pi pi-cog"></i> {{ vehicle.transmission }}</span>
            </div>
            <div class="vehicle-price">
              <span class="price">${{ vehicle.dailyPrice }}</span>
              <span class="price-unit">/día</span>
            </div>
            <div class="vehicle-status" :class="vehicle.status">
              {{ vehicle.status === 'active' ? '✓ Activo' : '⏸ Pausado' }}
            </div>
          </div>
          <router-link
            :to="`/rental/vehicles/${vehicle.id}`"
            class="btn-view-vehicle"
          >
            Ver Detalles
          </router-link>
        </div>

        <router-link
          v-if="ownerVehicles.length > 4"
          to="/rental/my-vehicles"
          class="view-all-card"
        >
          <i class="pi pi-arrow-right"></i>
          <span>Ver todos ({{ ownerVehicles.length }})</span>
        </router-link>
      </div>
    </div>

    <!-- Gráfica de Ganancias Mensuales -->
    <div class="section">
      <div class="section-header">
        <h2>{{ t('shared.dashboard.owner.monthlyEarnings') }}</h2>
        <div class="best-month-badge">
          <i class="pi pi-trophy"></i>
          <span>{{ t('shared.dashboard.owner.bestMonth') }}: {{ bestMonth.month }} - ${{ bestMonth.amount.toFixed(2) }}</span>
        </div>
      </div>
      <div class="chart-container">
        <div class="earnings-grid">
          <div 
            v-for="(amount, month) in monthlyEarnings" 
            :key="month"
            class="earnings-bar-wrapper"
          >
            <div class="earnings-bar">
              <div 
                class="earnings-fill"
                :style="{ 
                  height: amount > 0 ? `${(amount / Math.max(...Object.values(monthlyEarnings))) * 100}%` : '0%',
                  background: month === bestMonth.month ? 'linear-gradient(180deg, #FF8F00 0%, #FF6F00 100%)' : 'linear-gradient(180deg, #FFB74D 0%, #FFA726 100%)'
                }"
              >
                <span class="earnings-amount" v-if="amount > 0">${{ amount.toFixed(0) }}</span>
              </div>
            </div>
            <span class="month-label">{{ month }}</span>
          </div>
        </div>
        <div class="chart-summary">
          <div class="summary-item">
            <i class="pi pi-calendar"></i>
            <div>
              <strong>{{ t('shared.dashboard.owner.totalEarned') }}</strong>
              <span class="summary-value">${{ totalEarned.toFixed(2) }}</span>
            </div>
          </div>
          <div class="summary-item">
            <i class="pi pi-chart-line"></i>
            <div>
              <strong>{{ t('shared.dashboard.owner.averagePerMonth') }}</strong>
              <span class="summary-value">${{ (totalEarned / 12).toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.owner-dashboard {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  font-size: 2rem;
  font-weight: 600;
  color: var(--primary-dark);
  margin-bottom: 0.5rem;
}

.dashboard-header p {
  color: var(--neutral-gray);
  font-size: 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.stat-card.highlight {
  background: linear-gradient(135deg, #FF6F00 0%, #FF8F00 100%);
}

.stat-card.highlight .stat-content h3,
.stat-card.highlight .stat-content p {
  color: white;
}

.stat-card.warning {
  border-left: 4px solid #FF6F00;
}

.stat-icon {
  font-size: 2.5rem;
  line-height: 1;
}

.stat-content h3 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-dark);
  margin-bottom: 0.25rem;
}

.stat-content p {
  color: var(--neutral-gray);
  font-size: 0.875rem;
}

.section {
  margin-bottom: 3rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary-dark);
}

.link {
  color: var(--accent-orange);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.link:hover {
  color: #e65100;
}

.empty-state {
  background: white;
  border-radius: 12px;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.empty-state p {
  color: var(--neutral-gray);
  margin-bottom: 1.5rem;
  font-size: 1rem;
}

.alert-box {
  background: #FFF3E0;
  border-left: 4px solid var(--accent-orange);
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.alert-box p {
  color: var(--primary-dark);
  margin: 0;
}

.btn-primary, .btn-secondary {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-primary {
  background: var(--accent-orange);
  color: white;
}

.btn-primary:hover {
  background: #e65100;
  transform: translateY(-2px);
}

.btn-secondary {
  background: transparent;
  color: var(--accent-orange);
  border: 2px solid var(--accent-orange);
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.btn-secondary:hover {
  background: var(--accent-orange);
  color: white;
}

/* Requests Grid */
.requests-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.request-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-left: 4px solid #FF6F00;
  transition: transform 0.2s, box-shadow 0.2s;
}

.request-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.request-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.request-status {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  background: #FFF3E0;
  color: #FF6F00;
}

.request-date {
  font-size: 0.75rem;
  color: var(--neutral-gray);
}

.vehicle-info h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--primary-dark);
  margin: 0 0 0.25rem 0;
}

.vehicle-plate {
  font-size: 0.875rem;
  color: var(--neutral-gray);
  margin: 0;
  font-family: monospace;
}

.request-dates {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f5f7fa;
  border-radius: 8px;
  margin: 1rem 0;
}

.date-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  color: var(--primary-dark);
}

.date-item i {
  color: var(--accent-orange);
}

.request-dates > .pi-arrow-right {
  color: var(--neutral-gray);
  font-size: 0.75rem;
}

.request-price {
  margin: 1rem 0;
}

.request-price .price {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent-orange);
}

.request-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

.btn-accept,
.btn-decline {
  flex: 1;
  padding: 0.625rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-accept {
  background: #4CAF50;
  color: white;
}

.btn-accept:hover {
  background: #45a049;
  transform: translateY(-1px);
}

.btn-decline {
  background: #f5f7fa;
  color: #d32f2f;
}

.btn-decline:hover {
  background: #ffebee;
  transform: translateY(-1px);
}

/* Vehicles Grid */
.vehicles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.vehicle-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
}

.vehicle-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.vehicle-image-placeholder {
  height: 160px;
  background: linear-gradient(135deg, #FF6F00 0%, #FF8F00 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.vehicle-image-placeholder i {
  font-size: 4rem;
  color: white;
  opacity: 0.8;
}

.vehicle-details {
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.vehicle-details h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--primary-dark);
  margin: 0;
}

.vehicle-year {
  font-size: 0.875rem;
  color: var(--neutral-gray);
  margin: 0;
}

.vehicle-specs {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: var(--neutral-gray);
}

.vehicle-specs span {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.vehicle-specs i {
  color: var(--accent-orange);
}

.vehicle-price {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
}

.vehicle-price .price {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent-orange);
}

.vehicle-price .price-unit {
  font-size: 0.875rem;
  color: var(--neutral-gray);
}

.vehicle-status {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  align-self: flex-start;
}

.vehicle-status.active {
  background: #E8F5E9;
  color: #2E7D32;
}

.vehicle-status.paused {
  background: #FFF3E0;
  color: #FF6F00;
}

/* Chart Container */
.chart-container {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.best-month-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #FFD54F 0%, #FFC107 100%);
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #333;
  box-shadow: 0 2px 8px rgba(255, 193, 7, 0.3);
}

.best-month-badge i {
  font-size: 1rem;
  color: #FF6F00;
}

.earnings-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1rem;
  padding: 1rem 0;
  min-height: 250px;
  align-items: flex-end;
}

.earnings-bar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.earnings-bar {
  width: 100%;
  height: 200px;
  background: #f5f5f5;
  border-radius: 8px 8px 0 0;
  position: relative;
  overflow: hidden;
  border: 2px solid #e0e0e0;
}

.earnings-fill {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 6px 6px 0 0;
  transition: height 0.5s ease;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 0.5rem;
}

.earnings-amount {
  font-size: 0.75rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.month-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #666;
  text-align: center;
}

.chart-summary {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #f0f0f0;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%);
  border-radius: 12px;
  border-left: 4px solid #FF6F00;
}

.summary-item i {
  font-size: 2rem;
  color: #FF6F00;
}

.summary-item strong {
  display: block;
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.summary-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #FF6F00;
}

.btn-view-vehicle {
  display: block;
  padding: 0.75rem;
  background: var(--accent-orange);
  color: white;
  text-align: center;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.btn-view-vehicle:hover {
  background: #e65100;
}

.view-all-card {
  background: #f5f7fa;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 2rem;
  text-decoration: none;
  color: var(--accent-orange);
  transition: all 0.2s;
  border: 2px dashed var(--accent-orange);
}

.view-all-card:hover {
  background: #FFF3E0;
  transform: translateY(-4px);
}

.view-all-card i {
  font-size: 2rem;
}

.view-all-card span {
  font-weight: 600;
  font-size: 1rem;
}
</style>
