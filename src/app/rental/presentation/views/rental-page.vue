<template>
  <section class="rental-page">
    <!-- Sección de filtros horizontal debajo del hero -->
    <div class="filters-section">
      <div class="filters-container">
        <button class="filters-toggle-btn" @click="filtersExpanded = !filtersExpanded">
          <i class="pi pi-filter"></i>
          <span>{{ t('rental.browse.filters.title') }}</span>
          <i :class="filtersExpanded ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"></i>
        </button>
        
        <div class="sort-control">
          <i class="pi pi-sort-alt"></i>
          <select v-model="currentSortBy" @change="handleSortChange">
            <option value="createdAt">{{ t('rental.browse.sortOptions.newest') }}</option>
            <option value="price-asc">{{ t('rental.browse.sortOptions.priceAsc') }}</option>
            <option value="price-desc">{{ t('rental.browse.sortOptions.priceDesc') }}</option>
            <option value="rating-desc">{{ t('rental.browse.sortOptions.default') }}</option>
          </select>
        </div>

        <button v-if="filtersExpanded" class="btn-clear-filters" @click="clearAllFilters">
          <i class="pi pi-times-circle"></i>
          {{ t('rental.browse.filters.clearFilters') }}
        </button>
      </div>
      
      <!-- Panel de filtros expandible -->
      <div v-if="filtersExpanded" class="filters-panel">
        <search-filters 
          :result-count="filteredVehicles.length"
          @filter-change="handleFilterChange"
        />
      </div>
    </div>

    <!-- Layout de vehículos -->
    <div class="page-layout">
      <!-- Área principal de vehículos -->
      <div class="vehicles-section">
        <header class="section-header">
          <div>
            <h1 class="title">{{ t('rental.browse.title') }}</h1>
            <p class="subtitle">{{ filteredVehicles.length }} {{ t('rental.browse.vehiclesFound') }}</p>
          </div>
        </header>

        <div v-if="error" class="alert error">{{ error }}</div>

        <!-- Grid de vehículos -->
        <div v-if="filteredVehicles.length" class="vehicles-grid">
          <div 
            v-for="(vehicle, index) in filteredVehicles" 
            :key="vehicle.id ?? `vehicle-${index}`"
            class="vehicle-card"
            @click="openCalendar(vehicle)"
          >
            <div class="vehicle-image">
              <i class="pi pi-car"></i>
              <div class="vehicle-price">
                <span class="price">S/ {{ vehicle.dailyPrice }}</span>
                <span class="period">/{{ t('rental.browse.vehicleCard.perDay') }}</span>
              </div>
            </div>
            
            <div class="vehicle-info">
              <h3 class="vehicle-name">{{ vehicle.brand }} {{ vehicle.model }}</h3>
              <p class="vehicle-year">{{ vehicle.year }} • {{ vehicle.color }}</p>
              
              <div class="vehicle-features">
                <span><i class="pi pi-users"></i> {{ vehicle.seats }}</span>
                <span><i class="pi pi-cog"></i> {{ vehicle.transmission }}</span>
                <span><i class="pi pi-bolt"></i> {{ vehicle.fuelType }}</span>
              </div>
              
              <div class="vehicle-location">
                <i class="pi pi-map-marker"></i>
                {{ vehicle.location?.district || 'Lima' }}
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="!loading" class="empty-state">
          <i class="pi pi-inbox"></i>
          <p>{{ t('rental.browse.empty.title') }}</p>
          <button class="btn-secondary" @click="clearAllFilters">{{ t('rental.browse.filters.clearFilters') }}</button>
        </div>
      </div>
    </div>

    <!-- Modal de calendario y confirmación -->
    <rental-flow-modal
      v-if="selectedVehicle && showRentalFlow"
      :vehicle="selectedVehicle"
      @close="closeCalendar"
      @rental-confirmed="handleRentalConfirmed"
    />
  </section>
</template>
<script setup>
import { onMounted, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { state, loadVehicles, selectVehicle, selectedVehicle, filteredVehicles, setFilters, setSortBy, clearFilters } from '@/app/rental/application/rental.store.js'
import SearchFilters from '@/app/rental/presentation/components/search-filters.vue'
import RentalFlowModal from '@/app/rental/presentation/components/rental-flow-modal.vue'

const { t } = useI18n()
const loading = ref(false)
const showRentalFlow = ref(false)
const currentSortBy = ref('createdAt')
const filtersExpanded = ref(false)

const error = computed(() => state.error)

async function reload() {
  console.log('🚗 [rental-page] Iniciando recarga de vehículos...')
  loading.value = true
  await loadVehicles()
  console.log('🚗 [rental-page] Vehículos cargados. filteredVehicles:', filteredVehicles.value)
  console.log('🚗 [rental-page] IDs de vehículos filtrados:', filteredVehicles.value.map(v => ({ id: v.id, brand: v.brand, isNaN: isNaN(v.id) })))
  loading.value = false
}

function handleFilterChange(filters) {
  setFilters(filters)
}

function handleSortChange() {
  setSortBy(currentSortBy.value)
}

function clearAllFilters() {
  clearFilters()
}

function openCalendar(vehicle) {
  console.log('🚗 [rental-page] openCalendar llamado con vehicle:', vehicle)
  console.log('🚗 [rental-page] vehicle.id:', vehicle.id, 'tipo:', typeof vehicle.id)
  selectVehicle(vehicle.id)
  console.log('🚗 [rental-page] selectedVehicle después de selectVehicle:', selectedVehicle.value)
  showRentalFlow.value = true
  console.log('🚗 [rental-page] showRentalFlow:', showRentalFlow.value)
}

function closeCalendar() {
  console.log('🚗 [rental-page] Cerrando calendario')
  selectVehicle(null)
  showRentalFlow.value = false
}

function handleRentalConfirmed(rentalData) {
  console.log('Rental confirmed:', rentalData)
  closeCalendar()
  // Aquí podríamos mostrar una notificación de éxito
}

onMounted(() => { reload() })
</script>
<style scoped>
.rental-page {
  padding: 0;
  margin: 0;
  min-height: 100vh;
  background: #f8f9fa;
}

/* Sección de filtros horizontal (debajo del hero) */
.filters-section {
  background: white;
  border-bottom: 2px solid #e0e0e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.filters-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.filters-toggle-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #FF6F00 0%, #FF8F00 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(255, 111, 0, 0.3);
}

.filters-toggle-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 111, 0, 0.4);
}

.filters-toggle-btn i {
  font-size: 1.1rem;
}

.sort-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: #f8f9fa;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  transition: all 0.3s ease;
  flex: 1;
  max-width: 300px;
}

.sort-control:hover {
  border-color: #FF6F00;
  background: white;
}

.sort-control i {
  color: #FF6F00;
  font-size: 1.1rem;
}

.sort-control select {
  border: none;
  background: transparent;
  color: #2C3E50;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  outline: none;
  flex: 1;
}

.btn-clear-filters {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: transparent;
  border: 2px solid #dc3545;
  color: #dc3545;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-left: auto;
}

.btn-clear-filters:hover {
  background: #dc3545;
  color: white;
}

.filters-panel {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.5rem 2rem 2rem 2rem;
  background: #f8f9fa;
  border-top: 1px solid #e0e0e0;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 1000px;
  }
}

.page-layout {
  max-width: 1400px;
  margin: 0 auto;
}

/* Sección de vehículos */
.vehicles-section {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e0e0e0;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  color: #2C3E50;
  margin: 0;
}

.subtitle {
  color: #666;
  font-size: 1rem;
  margin: 0.25rem 0 0 0;
}

/* Grid de vehículos - Mejor distribución */
.vehicles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
  padding: 1rem 0;
}

.vehicle-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
}

.vehicle-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(255, 111, 0, 0.2);
}

.vehicle-image {
  height: 200px;
  background: linear-gradient(135deg, #FF6F00 0%, #FF8F00 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.vehicle-image i {
  font-size: 5rem;
  color: white;
  opacity: 0.8;
}

.vehicle-price {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: white;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.price {
  font-size: 1.5rem;
  font-weight: 800;
  color: #FF6F00;
}

.period {
  font-size: 0.85rem;
  color: #666;
  font-weight: 500;
}

.vehicle-info {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.vehicle-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2C3E50;
  margin: 0;
}

.vehicle-year {
  font-size: 0.875rem;
  color: #666;
  margin: 0;
}

.vehicle-features {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.vehicle-features span {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  color: #2C3E50;
  font-weight: 500;
}

.vehicle-features i {
  color: #FF6F00;
  font-size: 1rem;
}

.vehicle-location {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  color: #666;
  padding-top: 0.75rem;
  border-top: 1px solid #e0e0e0;
}

.vehicle-location i {
  color: #FF6F00;
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.empty-state i {
  font-size: 4rem;
  color: #e0e0e0;
  margin-bottom: 1rem;
}

.empty-state p {
  color: #666;
  font-size: 1.1rem;
  margin: 0 0 1.5rem 0;
}

.btn-secondary {
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: 2px solid #FF6F00;
  color: #FF6F00;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: #FF6F00;
  color: white;
  transform: translateY(-2px);
}

/* Alert */
.alert {
  padding: 1rem;
  border-radius: 10px;
  font-size: 0.9rem;
}

.alert.error {
  background: #ffebee;
  color: #c62828;
  border-left: 4px solid #c62828;
}

/* Responsive */
@media (max-width: 1200px) {
  .vehicles-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

@media (max-width: 768px) {
  .rental-page {
    padding: 0;
  }

  .filters-container {
    padding: 1rem;
    gap: 1rem;
  }

  .filters-toggle-btn {
    flex: 1;
  }

  .sort-control {
    flex: 1;
    max-width: none;
  }

  .btn-clear-filters {
    width: 100%;
    margin-left: 0;
  }

  .filters-panel {
    padding: 1rem;
  }

  .vehicles-section {
    padding: 1rem;
  }

  .title {
    font-size: 1.5rem;
  }

  .vehicles-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>