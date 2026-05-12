<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/app/iam/application/user.store'
import { RentalApi } from '@/app/rental/infrastructure/rental-api.js'

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()

const vehicles = ref([])
const loading = ref(true)

const user = computed(() => userStore.currentUser.value)

onMounted(async () => {
  await loadVehicles()
})

async function loadVehicles() {
  try {
    loading.value = true
    const allVehicles = await RentalApi.listVehicles()
    // Filtrar solo vehículos del usuario actual
    vehicles.value = allVehicles.filter(v => v.ownerId === user.value?.id)
  } catch (error) {
    console.error('Error loading vehicles:', error)
  } finally {
    loading.value = false
  }
}

function viewVehicleDetail(vehicleId) {
  router.push(`/rental/vehicles/${vehicleId}`)
}

function editVehicle(vehicleId, event) {
  event.stopPropagation()
  router.push(`/rental/edit-vehicle/${vehicleId}`)
}

function goToAddVehicle() {
  router.push('/rental/add-vehicle')
}
</script>

<template>
  <div class="my-vehicles-page">
    <div class="page-header">
      <div class="header-left">
        <h1>{{ t('rental.myVehicles.title') }}</h1>
        <div class="header-stats" v-if="vehicles.length > 0">
          <span class="stat-pill">{{ vehicles.length }} vehículo{{ vehicles.length !== 1 ? 's' : '' }}</span>
        </div>
      </div>
      <button @click="goToAddVehicle" class="btn-add" v-if="vehicles.length > 0">
        <span class="btn-icon">+</span>
        <span>Agregar Vehículo</span>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-container">
      <i class="pi pi-spin pi-spinner"></i>
      <p>{{ t('rental.myVehicles.loading') }}</p>
    </div>

    <!-- Empty State - Enhanced -->
    <div v-else-if="vehicles.length === 0" class="empty-state">
      <div class="empty-animation">
        <div class="floating-car">🚗</div>
        <div class="floating-keys delay-1">🔑</div>
        <div class="floating-road delay-2">🛣️</div>
      </div>
      
      <div class="empty-content">
        <h2 class="empty-title">¡Comienza a Compartir Tus Vehículos!</h2>
        <p class="empty-description">
          Aún no has agregado ningún vehículo a tu flota. Añade tu primer auto y empieza a generar ingresos.
        </p>
        
        <div class="empty-benefits">
          <div class="benefit-card">
            <div class="benefit-icon">💰</div>
            <h4>Ingresos Extra</h4>
            <p>Monetiza tus vehículos cuando no los uses</p>
          </div>
          
          <div class="benefit-card">
            <div class="benefit-icon">🛡️</div>
            <h4>100% Seguro</h4>
            <p>Protección total con nuestro seguro integral</p>
          </div>
          
          <div class="benefit-card">
            <div class="benefit-icon">📊</div>
            <h4>Control Total</h4>
            <p>Gestiona disponibilidad y precios fácilmente</p>
          </div>
        </div>
        
        <button @click="goToAddVehicle" class="btn-primary">
          <span class="btn-icon">➕</span>
          <span>{{ t('rental.myVehicles.addFirstVehicle') }}</span>
          <span class="btn-arrow">→</span>
        </button>
        

      </div>
    </div>

    <!-- Vehicles Grid -->
    <div v-else class="vehicles-grid">
      <div 
        v-for="vehicle in vehicles" 
        :key="vehicle.id"
        class="vehicle-card"
        @click="viewVehicleDetail(vehicle.id)"
      >
        <div class="vehicle-image">
          <i class="pi pi-car"></i>
        </div>
        
        <div class="vehicle-info">
          <div class="vehicle-header">
            <h3>{{ vehicle.brand }} {{ vehicle.model }}</h3>
            <span :class="['status-badge', vehicle.status]">
              {{ vehicle.status === 'active' ? t('rental.myVehicles.vehicleCard.available') : t('rental.myVehicles.vehicleCard.unavailable') }}
            </span>
          </div>
          
          <p class="vehicle-year">{{ vehicle.year }} • {{ vehicle.color }}</p>
          
          <div class="vehicle-specs">
            <span><i class="pi pi-users"></i> {{ vehicle.seats }}</span>
            <span><i class="pi pi-cog"></i> {{ vehicle.transmission }}</span>
            <span><i class="pi pi-bolt"></i> {{ vehicle.fuelType }}</span>
          </div>

          <div class="vehicle-location">
            <i class="pi pi-map-marker"></i>
            <span>{{ vehicle.location.district }}</span>
          </div>

          <div class="vehicle-price">
            <span class="price">S/ {{ vehicle.dailyPrice }}</span>
            <span class="price-label">/{{ t('rental.browse.vehicleCard.perDay') }}</span>
          </div>
        </div>

        <div class="vehicle-actions">
          <button @click="editVehicle(vehicle.id, $event)" class="btn-edit">
            <i class="pi pi-pencil"></i>
            {{ t('rental.myVehicles.vehicleCard.edit') }}
          </button>
          <button class="btn-view">
            {{ t('rental.browse.vehicleCard.viewDetails') }}
            <i class="pi pi-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.my-vehicles-page {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  letter-spacing: -0.5px;
}

.header-stats {
  display: flex;
  gap: 0.75rem;
}

.stat-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background: #f5f5f5;
  color: #666;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 600;
}

.btn-add {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: white;
  color: #1a1a1a;
  border: 2px solid #1a1a1a;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.btn-add::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: #1a1a1a;
  transition: left 0.3s ease;
  z-index: 0;
}

.btn-add:hover::before {
  left: 0;
}

.btn-add:hover {
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-add span {
  position: relative;
  z-index: 1;
}

.btn-icon {
  font-size: 1.25rem;
  font-weight: 700;
  transition: transform 0.3s ease;
}

.btn-add:hover .btn-icon {
  transform: rotate(90deg);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: 1rem;
}

.loading-container i {
  font-size: 4rem;
  color: var(--accent-orange);
}

/* Empty State - Enhanced Modern Design */
.empty-state {
  background: linear-gradient(135deg, #fafafa 0%, #ffffff 100%);
  border-radius: 24px;
  padding: 4rem 3rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
  border: 2px solid #f0f0f0;
  position: relative;
  overflow: hidden;
}

.empty-state::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -30%;
  width: 80%;
  height: 150%;
  background: radial-gradient(circle, rgba(255, 111, 0, 0.05) 0%, transparent 70%);
  animation: pulse-bg 4s ease-in-out infinite;
}

@keyframes pulse-bg {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.2); opacity: 0.9; }
}

.empty-animation {
  position: relative;
  height: 100px;
  margin-bottom: 2.5rem;
}

.floating-car,
.floating-keys,
.floating-road {
  position: absolute;
  font-size: 3.5rem;
  animation: float-smooth 3s ease-in-out infinite;
  left: 50%;
  transform: translateX(-50%);
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1));
}

.floating-car {
  font-size: 4.5rem;
  z-index: 2;
}

.floating-keys {
  font-size: 2.5rem;
  left: 35%;
  animation-delay: 0.5s;
  opacity: 0.7;
}

.floating-road {
  font-size: 2.5rem;
  left: 65%;
  animation-delay: 1s;
  opacity: 0.7;
}

@keyframes float-smooth {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-15px); }
}

.empty-content {
  position: relative;
  z-index: 1;
  text-align: center;
}

.empty-title {
  font-size: 2.25rem;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.empty-description {
  color: #666;
  font-size: 1.1rem;
  line-height: 1.7;
  max-width: 550px;
  margin: 0 auto 3rem;
}

.empty-benefits {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

.benefit-card {
  background: white;
  padding: 2rem 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  border: 2px solid transparent;
  text-align: center;
}

.benefit-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.1);
  border-color: #FF6F00;
}

.benefit-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  animation: bounce-icon 2.5s infinite;
}

@keyframes bounce-icon {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.benefit-card h4 {
  margin: 0 0 0.75rem 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: #1a1a1a;
}

.benefit-card p {
  margin: 0;
  color: #777;
  font-size: 0.95rem;
  line-height: 1.5;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 2.5rem;
  background: white;
  color: #1a1a1a;
  border: 3px solid #1a1a1a;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1.15rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: #1a1a1a;
  transition: left 0.4s ease;
  z-index: -1;
}

.btn-primary:hover::before {
  left: 0;
}

.btn-primary:hover {
  color: white;
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.btn-icon {
  font-size: 1.5rem;
  transition: transform 0.3s ease;
}

.btn-primary:hover .btn-icon {
  transform: rotate(90deg);
}

.btn-arrow {
  font-size: 1.5rem;
  transition: transform 0.3s ease;
}

.btn-primary:hover .btn-arrow {
  transform: translateX(5px);
}

.empty-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-top: 3rem;
  padding-top: 2.5rem;
  border-top: 2px solid #f0f0f0;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 1.75rem;
  font-weight: 800;
  color: #FF6F00;
  margin-bottom: 0.25rem;
}

.stat-label {
  display: block;
  font-size: 0.85rem;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-divider {
  width: 2px;
  height: 40px;
  background: linear-gradient(to bottom, transparent, #e0e0e0, transparent);
}

.vehicles-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

/* Responsive */
@media (max-width: 1400px) {
  .vehicles-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 1024px) {
  .vehicles-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .vehicles-grid {
    grid-template-columns: 1fr;
  }
}

.vehicle-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  cursor: pointer;
}

.vehicle-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.vehicle-image {
  height: 180px;
  background: linear-gradient(135deg, #FF6F00 0%, #FF8F00 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.vehicle-image i {
  font-size: 4rem;
  color: white;
  opacity: 0.9;
}

.vehicle-info {
  padding: 1.5rem;
}

.vehicle-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.vehicle-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--primary-dark);
  margin: 0;
}

.status-badge {
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge.active {
  background: #e8f5e9;
  color: #2e7d32;
}

.status-badge.paused {
  background: #fff3e0;
  color: #ff6f00;
}

.vehicle-year {
  color: var(--neutral-gray);
  font-size: 0.95rem;
  margin-bottom: 1rem;
}

.vehicle-specs {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: var(--primary-dark);
}

.vehicle-specs span {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.vehicle-specs i {
  color: var(--accent-orange);
}

.vehicle-location {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: var(--neutral-gray);
  font-size: 0.875rem;
}

.vehicle-location i {
  color: var(--accent-orange);
}

.vehicle-price {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
}

.vehicle-price .price {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent-orange);
}

.vehicle-price .price-label {
  color: var(--neutral-gray);
  font-size: 0.875rem;
}

.vehicle-actions {
  padding: 0 1.5rem 1.5rem;
  display: flex;
  gap: 0.75rem;
}

.btn-edit {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: transparent;
  color: #3B82F6;
  border: 2px solid #3B82F6;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-edit:hover {
  background: #3B82F6;
  color: white;
}

.btn-view {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: transparent;
  color: var(--accent-orange);
  border: 2px solid var(--accent-orange);
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-view:hover {
  background: var(--accent-orange);
  color: white;
}
</style>