<template>
  <div class="route-detail-page">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Cargando detalles de la ruta...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error || !currentRoute" class="error-container">
      <i class="pi pi-exclamation-triangle error-icon"></i>
      <h2>Ruta no encontrada</h2>
      <p>{{ error || 'No se pudo cargar la información de la ruta' }}</p>
      <button @click="goBack" class="btn-back-error">
        <i class="pi pi-arrow-left"></i>
        Volver a Rutas
      </button>
    </div>

    <!-- Success State (Adventure Requested) -->
    <div v-else-if="requestSent" class="success-container">
      <div class="success-card">
        <div class="success-icon-wrapper">
          <i class="pi pi-check-circle success-icon"></i>
        </div>
        <h2>¡Aventura Solicitada!</h2>
        <p>Tu solicitud para <strong>{{ currentRoute.name }}</strong> ha sido enviada con éxito.</p>
        
        <div class="request-details" v-if="selectedVehicle">
          <div class="detail-row">
            <span>Vehículo:</span>
            <strong>{{ selectedVehicle.brand }} {{ selectedVehicle.model }}</strong>
          </div>
          <div class="detail-row">
            <span>Fecha estimada:</span>
            <strong>Próximamente</strong>
          </div>
        </div>

        <p class="success-note">El propietario revisará tu solicitud y te notificaremos pronto.</p>
        
        <div class="success-actions">
          <button @click="goToMyAdventures" class="btn-primary">Ver Mis Aventuras</button>
          <button @click="goBack" class="btn-secondary">Explorar más rutas</button>
        </div>
      </div>
    </div>

    <!-- Route Content -->
    <div v-else class="route-content">
      <!-- Hero Section -->
      <section class="route-hero">
        <button @click="goBack" class="btn-back-float">
          <i class="pi pi-arrow-left"></i>
          Volver
        </button>
        
        <img :src="currentRoute.imageUrl || defaultImage" :alt="currentRoute.name" class="hero-image" />
        
        <div class="hero-overlay">
          <div class="hero-content">
            <div class="hero-badges">
              <span class="badge type-badge" :class="`type-${currentRoute.type}`">
                {{ currentRoute.typeIcon }} {{ currentRoute.typeLabel }}
              </span>
              <span v-if="currentRoute.featured" class="badge featured-badge">
                <i class="pi pi-star-fill"></i>
                Destacada
              </span>
            </div>
            
            <h1 class="hero-title">{{ currentRoute.name }}</h1>
            
            <div class="hero-meta">
              <div class="meta-item">
                <i class="pi pi-map-marker"></i>
                <span>{{ currentRoute.fullRoute }}</span>
              </div>
              <div class="meta-item">
                <i class="pi pi-star-fill"></i>
                <span>{{ currentRoute.rating.toFixed(1) }} ({{ currentRoute.reviewsCount }} reseñas)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Main Content -->
      <section class="route-main">
        <div class="content-grid">
          <!-- Left Column -->
          <div class="left-column">
            <!-- Description -->
            <div class="section-card">
              <h2 class="section-title">
                <i class="pi pi-align-left"></i>
                Descripción
              </h2>
              <p class="route-description">{{ currentRoute.description }}</p>
            </div>

            <!-- Key Points -->
            <div class="section-card" v-if="currentRoute.keyPoints && currentRoute.keyPoints.length > 0">
              <h2 class="section-title">
                <i class="pi pi-map"></i>
                Puntos Clave del Itinerario
              </h2>
              <div class="key-points-list">
                <div v-for="(point, index) in currentRoute.keyPoints" :key="index" class="key-point-item">
                  <div class="point-number">{{ index + 1 }}</div>
                  <div class="point-content">
                    <h4>{{ point.name || point }}</h4>
                    <p v-if="point.description">{{ point.description }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Highlights -->
            <div class="section-card" v-if="currentRoute.highlights && currentRoute.highlights.length > 0">
              <h2 class="section-title">
                <i class="pi pi-star"></i>
                Aspectos Destacados
              </h2>
              <div class="highlights-grid">
                <div v-for="(highlight, index) in currentRoute.highlights" :key="index" class="highlight-item">
                  <i class="pi pi-check-circle"></i>
                  <span>{{ highlight }}</span>
                </div>
              </div>
            </div>

            <!-- Available Vehicles (Carousel Selection) -->
            <div class="section-card" v-if="recommendedVehicles.length > 0">
              <h2 class="section-title">
                <i class="pi pi-car"></i>
                Elige tu Vehículo
              </h2>
              <p class="section-subtitle">Selecciona cualquier vehículo disponible para esta aventura</p>
              
              <div class="vehicles-carousel-container">
                <div class="vehicles-carousel">
                  <div 
                    v-for="vehicle in recommendedVehicles" 
                    :key="vehicle.id" 
                    class="vehicle-card-select"
                    :class="{ 'selected': selectedVehicleId === vehicle.id }"
                    @click="selectVehicle(vehicle.id)"
                  >
                    <div class="vehicle-image-wrapper">
                      <img :src="vehicle.imageUrl || 'https://via.placeholder.com/300x200/FF6F00/ffffff?text=🚗'" :alt="vehicle.fullName" />
                      <div class="selected-overlay" v-if="selectedVehicleId === vehicle.id">
                        <i class="pi pi-check"></i>
                      </div>
                    </div>
                    <div class="vehicle-info-compact">
                      <h4>{{ vehicle.brand }} {{ vehicle.model }}</h4>
                      <p>{{ vehicle.year }} · {{ vehicle.transmission }}</p>
                      <span class="price">S/. {{ vehicle.dailyPrice }}/día</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column (Sidebar) -->
          <div class="right-column">
            <!-- Info Card -->
            <div class="info-card sticky-card">
              <h3 class="info-title">Resumen de Aventura</h3>
              
              <div class="info-grid">
                <div class="info-item">
                  <i class="pi pi-calendar"></i>
                  <div>
                    <span class="info-label">Duración</span>
                    <span class="info-value">{{ currentRoute.formattedDuration }}</span>
                  </div>
                </div>

                <div class="info-item">
                  <i class="pi pi-compass"></i>
                  <div>
                    <span class="info-label">Distancia</span>
                    <span class="info-value">{{ currentRoute.formattedDistance }}</span>
                  </div>
                </div>

                <div class="info-item">
                  <i class="pi pi-chart-line"></i>
                  <div>
                    <span class="info-label">Dificultad</span>
                    <span class="info-value">{{ currentRoute.difficultyLevel }}</span>
                  </div>
                </div>

                <div class="info-item">
                  <i class="pi pi-dollar"></i>
                  <div>
                    <span class="info-label">Costo Estimado</span>
                    <span class="info-value">{{ currentRoute.formattedCost }}</span>
                  </div>
                </div>
              </div>

              <div class="selected-vehicle-summary" v-if="selectedVehicle">
                <div class="summary-header">Vehículo Seleccionado</div>
                <div class="summary-content">
                  <span>{{ selectedVehicle.brand }} {{ selectedVehicle.model }}</span>
                  <span class="summary-price">S/. {{ selectedVehicle.dailyPrice }}</span>
                </div>
              </div>

              <button 
                @click="handleStartAdventure" 
                class="btn-start-adventure"
                :disabled="!selectedVehicleId && recommendedVehicles.length > 0"
              >
                <i class="pi pi-play" v-if="!processing"></i>
                <span v-if="processing" class="spinner-small"></span>
                {{ processing ? 'Procesando...' : 'Comenzar Aventura' }}
              </button>

              <p class="info-note" v-if="!selectedVehicleId && recommendedVehicles.length > 0">
                <i class="pi pi-info-circle"></i>
                Por favor selecciona un vehículo para continuar
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAdventureRoutesStore } from '../../application/adventure-routes.store.js'
import { RentalApi } from '@/app/rental/infrastructure/rental-api.js'
import { useUserStore } from '@/app/iam/application/user.store.js'
import { useNotificationStore } from '@/app/notification/application/notification.store.js'

const router = useRouter()
const route = useRoute()
const store = useAdventureRoutesStore()
const userStore = useUserStore()
const notificationStore = useNotificationStore()

const { currentRoute, loading, error, fetchRoute } = store
const recommendedVehicles = ref([])
const selectedVehicleId = ref(null)
const requestSent = ref(false)
const processing = ref(false)

const selectedVehicle = computed(() => {
  return recommendedVehicles.value.find(v => v.id === selectedVehicleId.value)
})

const defaultImage = computed(() => {
  if (!currentRoute.value) return ''
  const images = {
    beach: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600',
    mountain: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600',
    cultural: 'https://images.unsplash.com/photo-1555791018-6572a7ad7e0e?w=1600',
    gastronomic: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600',
    adventure: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1600',
    scenic: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600'
  }
  return images[currentRoute.value.type] || images.scenic
})

onMounted(async () => {
  const routeId = route.params.id
  await fetchRoute(routeId)
  
  // Siempre cargar todos los vehículos disponibles
  await loadAllAvailableVehicles()
})

async function loadAllAvailableVehicles() {
  try {
    const allVehicles = await RentalApi.listVehicles()
    
    // Obtener todos los vehículos disponibles (activos, no pausados)
    const availableVehicles = allVehicles.filter(v => v.status !== 'paused')
    
    // Ordenar: primero los recomendados (si existen), luego los demás
    const recommendedIds = currentRoute.value?.recommendedVehicles || []
    
    // Separar vehículos recomendados y otros
    const recommended = availableVehicles.filter(v => recommendedIds.includes(v.id))
    const others = availableVehicles.filter(v => !recommendedIds.includes(v.id))
    
    // Combinar: recomendados primero, luego los demás
    recommendedVehicles.value = [...recommended, ...others]
    
    console.log(`🚗 Vehículos cargados: ${recommended.length} recomendados, ${others.length} adicionales`)
  } catch (err) {
    console.error('Error loading vehicles:', err)
  }
}

function selectVehicle(id) {
  selectedVehicleId.value = id
}

function goBack() {
  router.push({ name: 'adventure-routes' })
}

function goToMyAdventures() {
  router.push({ name: 'my-rentals' }) // Assuming this is where they see their requests
}

async function handleStartAdventure() {
  if (!selectedVehicleId.value && recommendedVehicles.value.length > 0) return
  
  processing.value = true
  
  try {
    const vehicle = selectedVehicle.value
    const currentUser = userStore.currentUser.value
    
    const rentalData = {
      vehicleId: selectedVehicleId.value,
      renterId: currentUser?.id,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 86400000 * currentRoute.value.duration).toISOString(),
      status: 'pending',
      totalPrice: currentRoute.value.estimatedCost || 0,
      adventureRouteId: currentRoute.value.id
    }
    
    const createdRental = await RentalApi.createRental(rentalData)
    
    // Enviar notificación al dueño del vehículo
    if (vehicle && vehicle.ownerId && currentUser) {
      const renterFullName = `${currentUser.firstName} ${currentUser.lastName}`
      const vehicleName = `${vehicle.brand} ${vehicle.model}`
      
      await notificationStore.notifyOwnerRentalRequest({
        ownerId: vehicle.ownerId,
        renterName: renterFullName,
        vehicleName: vehicleName,
        rentalId: createdRental?.id || Date.now(),
        vehicleId: vehicle.id
      })
      
      console.log(`📬 Notificación enviada al dueño (ID: ${vehicle.ownerId})`)
    }
    
    // Show success state
    setTimeout(() => {
      requestSent.value = true
      processing.value = false
      window.scrollTo(0, 0)
    }, 1000)
    
  } catch (err) {
    console.error('Error starting adventure:', err)
    alert('Hubo un error al procesar tu solicitud. Por favor intenta nuevamente.')
    processing.value = false
  }
}
</script>

<style scoped>
.route-detail-page {
  min-height: 100vh;
  background: #f8f9fa;
}

/* Loading & Error States */
.loading-container,
.error-container,
.success-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3A5E5E;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-icon {
  font-size: 4rem;
  color: #ef4444;
  margin-bottom: 1rem;
}

/* Success State */
.success-card {
  background: white;
  padding: 3rem;
  border-radius: 24px;
  text-align: center;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.success-icon-wrapper {
  width: 80px;
  height: 80px;
  background: #e6fffa;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.success-icon {
  font-size: 3rem;
  color: #059669;
}

.success-card h2 {
  color: #2C3E50;
  font-size: 2rem;
  margin-bottom: 1rem;
}

.success-card p {
  color: #666;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.request-details {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  text-align: left;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  color: #4a5568;
}

.detail-row:last-child {
  margin-bottom: 0;
}

.success-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn-primary {
  background: #3A5E5E;
  color: white;
  border: none;
  padding: 0.875rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: #2C5050;
}

.btn-secondary {
  background: transparent;
  color: #666;
  border: 2px solid #e2e8f0;
  padding: 0.875rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  border-color: #cbd5e0;
  color: #2d3748;
}

/* Hero Section */
.route-hero {
  position: relative;
  height: 500px;
  overflow: hidden;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.btn-back-float {
  position: absolute;
  top: 2rem;
  left: 2rem;
  z-index: 10;
  padding: 0.875rem 1.5rem;
  background: rgba(255, 255, 255, 0.95);
  color: #2C3E50;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.btn-back-float:hover {
  background: white;
  transform: translateX(-4px);
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.7) 100%);
  display: flex;
  align-items: flex-end;
}

.hero-content {
  width: 100%;
  padding: 3rem 2rem;
  color: white;
}

.hero-badges {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.badge {
  padding: 0.625rem 1.25rem;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.type-badge {
  background: rgba(255, 255, 255, 0.95);
  color: #2C3E50;
}

.type-badge.type-beach { background: rgba(255, 140, 0, 0.95); color: white; }
.type-badge.type-mountain { background: rgba(65, 105, 225, 0.95); color: white; }
.type-badge.type-cultural { background: rgba(139, 69, 19, 0.95); color: white; }

.featured-badge {
  background: rgba(255, 215, 0, 0.95);
  color: #2C3E50;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin: 0 0 1.5rem 0;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  line-height: 1.2;
}

.hero-meta {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  font-weight: 500;
}

.meta-item i {
  font-size: 1.25rem;
  color: #FFD700;
}

/* Main Content */
.route-main {
  padding: 3rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 3rem;
}

.section-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.section-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2C3E50;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-title i {
  color: #3A5E5E;
}

.section-subtitle {
  font-size: 1rem;
  color: #666;
  margin: 0 0 1.5rem 0;
}

.route-description {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #444;
  margin: 1rem 0 0 0;
}

/* Key Points */
.key-points-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.key-point-item {
  display: flex;
  gap: 1.25rem;
  align-items: flex-start;
}

.point-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3A5E5E 0%, #2C5050 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.point-content h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2C3E50;
  margin: 0 0 0.5rem 0;
}

.point-content p {
  font-size: 0.95rem;
  color: #666;
  margin: 0;
  line-height: 1.6;
}

/* Highlights */
.highlights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}

.highlight-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 10px;
  font-size: 0.95rem;
  color: #2C3E50;
  font-weight: 500;
}

.highlight-item i {
  color: #22c55e;
  font-size: 1.25rem;
  flex-shrink: 0;
}

/* Vehicles Carousel */
.vehicles-carousel-container {
  overflow-x: auto;
  padding-bottom: 1rem;
  margin: 0 -1rem;
  padding: 0 1rem 1rem 1rem;
}

.vehicles-carousel {
  display: flex;
  gap: 1.5rem;
  min-width: min-content;
}

.vehicle-card-select {
  width: 280px;
  background: #f8f9fa;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
}

.vehicle-card-select:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.vehicle-card-select.selected {
  border-color: #3A5E5E;
  background: #f0fdfa;
  box-shadow: 0 4px 12px rgba(58, 94, 94, 0.2);
}

.vehicle-image-wrapper {
  position: relative;
  height: 160px;
}

.vehicle-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.selected-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(58, 94, 94, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.2s ease;
}

.selected-overlay i {
  font-size: 3rem;
  color: white;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  padding: 1rem;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.vehicle-info-compact {
  padding: 1rem;
}

.vehicle-info-compact h4 {
  margin: 0 0 0.25rem 0;
  color: #2C3E50;
  font-size: 1rem;
}

.vehicle-info-compact p {
  margin: 0 0 0.5rem 0;
  color: #666;
  font-size: 0.85rem;
}

.vehicle-info-compact .price {
  font-weight: 700;
  color: #3A5E5E;
  font-size: 1.1rem;
}

/* Right Column (Sidebar) */
.info-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.sticky-card {
  position: sticky;
  top: 2rem;
}

.info-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2C3E50;
  margin: 0 0 1.5rem 0;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 10px;
}

.info-item i {
  font-size: 1.5rem;
  color: #3A5E5E;
  flex-shrink: 0;
}

.info-item > div {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-label {
  font-size: 0.85rem;
  color: #666;
  font-weight: 500;
}

.info-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: #2C3E50;
}

.selected-vehicle-summary {
  background: #f0fdfa;
  border: 1px solid #ccfbf1;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 1.5rem;
}

.summary-header {
  font-size: 0.85rem;
  color: #3A5E5E;
  font-weight: 600;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.summary-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
  color: #2C3E50;
}

.summary-price {
  color: #3A5E5E;
}

.btn-start-adventure {
  width: 100%;
  padding: 1.125rem;
  background: linear-gradient(135deg, #FF6F00 0%, #FF8F00 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(255, 111, 0, 0.3);
  margin-bottom: 1rem;
}

.btn-start-adventure:hover:not(:disabled) {
  background: linear-gradient(135deg, #E66500 0%, #E67E00 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 111, 0, 0.4);
}

.btn-start-adventure:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.info-note {
  font-size: 0.85rem;
  color: #666;
  margin: 0;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.info-note i {
  color: #3A5E5E;
  margin-top: 0.125rem;
  flex-shrink: 0;
}

.spinner-small {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* Responsive */
@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .sticky-card {
    position: static;
  }

  .hero-title {
    font-size: 2.5rem;
  }
}

@media (max-width: 768px) {
  .route-hero {
    height: 400px;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-content {
    padding: 2rem 1.5rem;
  }

  .route-main {
    padding: 2rem 1rem;
  }

  .section-card {
    padding: 1.5rem;
  }

  .highlights-grid {
    grid-template-columns: 1fr;
  }
}
</style>
