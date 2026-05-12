<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { RentalApi } from '@/app/rental/infrastructure/rental-api.js'
import VehicleRentalHistory from '../components/vehicle-rental-history.vue'
import RentalFlowModal from '../components/rental-flow-modal.vue'
import { useUserStore } from '@/app/iam/application/user.store.js'
import { apiClient } from '@/app/shared/infrastructure/apiClient.js'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const vehicle = ref(null)
const loading = ref(true)
const reviews = ref([])
const loadingReviews = ref(false)

const showRentalModal = ref(false)
const userStore = useUserStore()

const vehicleId = computed(() => String(route.params.id))

// Computed: Calificación promedio
const averageRating = computed(() => {
  if (reviews.value.length === 0) return 0
  const sum = reviews.value.reduce((acc, r) => acc + r.rating, 0)
  return (sum / reviews.value.length).toFixed(1)
})

onMounted(async () => {
  await Promise.all([loadVehicle(), loadReviews()])
})

async function loadVehicle() {
  try {
    loading.value = true
    vehicle.value = await RentalApi.getVehicle(vehicleId.value)
  } catch (error) {
    console.error('Error loading vehicle:', error)
  } finally {
    loading.value = false
  }
}

async function loadReviews() {
  try {
    loadingReviews.value = true
    const allReviews = await apiClient.get(`/reviews?vehicleId=${vehicleId.value}`)
    
    // Cargar usuarios para mostrar nombres
    const users = await apiClient.get('/users')
    
    reviews.value = allReviews.map(review => {
      const renter = users.find(u => u.id === review.renterId)
      return {
        ...review,
        renterName: renter ? `${renter.firstName} ${renter.lastName}` : 'Usuario',
        renterInitials: renter ? `${renter.firstName?.charAt(0)}${renter.lastName?.charAt(0)}`.toUpperCase() : 'U'
      }
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  } catch (error) {
    console.error('Error loading reviews:', error)
    reviews.value = []
  } finally {
    loadingReviews.value = false
  }
}

function formatReviewDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  })
}

function goBack() {
  router.push('/my-vehicles')
}

function openRentalModal() {
  if (!userStore.currentUser.value || !userStore.currentUser.value.id) {
    router.push('/auth/login')
    return
  }
  showRentalModal.value = true
}

function onRentalConfirmed(rental) {
  // Close modal and navigate to my rentals (modal also redirects, but keep safe)
  showRentalModal.value = false
  router.push('/rental/my-rentals')
}
</script>

<template>
  <div class="vehicle-detail-page">
    <!-- Loading -->
    <div v-if="loading" class="loading-container">
      <i class="pi pi-spin pi-spinner"></i>
      <p>{{ t('rental.vehicleDetail.loading') }}</p>
    </div>

    <!-- Content -->
    <div v-else-if="vehicle" class="content">
      <!-- Header -->
      <div class="page-header">
        <button @click="goBack" class="btn-back">
          <i class="pi pi-arrow-left"></i>
          {{ t('rental.vehicleDetail.backToMyVehicles') }}
        </button>
      </div>

      <!-- Vehicle Info Card -->
      <div class="vehicle-info-card">
        <div class="vehicle-image">
          <i class="pi pi-car"></i>
        </div>
        
        <div class="vehicle-details">
          <div class="vehicle-header">
            <h1>{{ vehicle.brand }} {{ vehicle.model }}</h1>
            <span :class="['status-badge', vehicle.status]">
              {{ vehicle.status === 'active' ? t('rental.myVehicles.vehicleCard.available') : t('rental.myVehicles.vehicleCard.unavailable') }}
            </span>
          </div>
          
          <div class="vehicle-specs">
            <div class="spec-item">
              <i class="pi pi-calendar"></i>
              <span>{{ vehicle.year }}</span>
            </div>
            <div class="spec-item">
              <i class="pi pi-palette"></i>
              <span>{{ vehicle.color }}</span>
            </div>
            <div class="spec-item">
              <i class="pi pi-users"></i>
              <span>{{ vehicle.seats }} {{ t('rental.vehicleDetail.features.seats') }}</span>
            </div>
            <div class="spec-item">
              <i class="pi pi-cog"></i>
              <span>{{ vehicle.transmission }}</span>
            </div>
            <div class="spec-item">
              <i class="pi pi-bolt"></i>
              <span>{{ vehicle.fuelType }}</span>
            </div>
          </div>

          <div class="pricing">
            <div class="price-item">
              <span class="label">{{ t('rental.vehicleDetail.pricePerDay') }}:</span>
              <span class="price">S/ {{ vehicle.dailyPrice }}</span>
            </div>
            <div class="price-item">
              <span class="label">{{ t('rental.addVehicle.fields.dailyPrice') }}:</span>
              <span class="price">S/ {{ vehicle.depositAmount }}</span>
            </div>
          </div>

          <div class="location">
            <i class="pi pi-map-marker"></i>
            <div>
              <p class="district">{{ vehicle.location.district }}</p>
              <p class="address">{{ vehicle.location.address }}</p>
            </div>
          </div>

          <div v-if="vehicle.features && vehicle.features.length" class="features">
            <h3>Características:</h3>
            <div class="features-list">
              <span v-for="(feature, index) in vehicle.features" :key="index" class="feature-tag">
                <i class="pi pi-check"></i>
                {{ feature }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Historial de Alquileres -->
      <VehicleRentalHistory :vehicle-id="vehicleId" />

      <!-- Sección de Calificaciones y Comentarios -->
      <div class="reviews-section">
        <div class="reviews-header">
          <div class="reviews-title">
            <h2>Calificaciones y Opiniones</h2>
            <div class="rating-summary" v-if="reviews.length > 0">
              <div class="avg-rating">
                <span class="rating-number">{{ averageRating }}</span>
                <span class="rating-star">★</span>
              </div>
              <span class="review-count">{{ reviews.length }} {{ reviews.length === 1 ? 'reseña' : 'reseñas' }}</span>
            </div>
          </div>
        </div>

        <!-- Sin reseñas -->
        <div v-if="!loadingReviews && reviews.length === 0" class="no-reviews">
          <i class="pi pi-star"></i>
          <p>Este vehículo aún no tiene reseñas</p>
          <span>¡Sé el primero en alquilar y dejar tu opinión!</span>
        </div>

        <!-- Loading reseñas -->
        <div v-else-if="loadingReviews" class="loading-reviews">
          <i class="pi pi-spin pi-spinner"></i>
          <p>Cargando reseñas...</p>
        </div>

        <!-- Lista de reseñas -->
        <div v-else class="reviews-list">
          <div 
            v-for="review in reviews" 
            :key="review.id" 
            class="review-card"
          >
            <div class="review-header">
              <div class="reviewer-avatar">{{ review.renterInitials }}</div>
              <div class="reviewer-info">
                <span class="reviewer-name">{{ review.renterName }}</span>
                <span class="review-date">{{ formatReviewDate(review.createdAt) }}</span>
              </div>
              <div class="review-rating">
                <span v-for="star in 5" :key="star" class="star" :class="{ filled: star <= review.rating }">★</span>
              </div>
            </div>
            <p class="review-comment" v-if="review.comment">{{ review.comment }}</p>
            <p class="review-no-comment" v-else>Sin comentarios adicionales</p>
          </div>
        </div>
      </div>

      <!-- Botón de reservar / comenzar aventura -->
      <div class="actions-row" style="margin-top:1rem">
        <button
          v-if="vehicle && vehicle.status === 'active'"
          @click="openRentalModal"
          class="btn-primary btn-book"
        >
          <i class="pi pi-play"></i>
          {{ t('rental.vehicleDetail.proceedToRent') || 'Alquilar / Comenzar Aventura' }}
        </button>
      </div>

      <RentalFlowModal
        v-if="showRentalModal"
        :vehicle="vehicle"
        @close="showRentalModal = false"
        @rental-confirmed="onRentalConfirmed"
      />
    </div>

    <!-- Error State -->
    <div v-else class="error-state">
      <i class="pi pi-exclamation-triangle"></i>
      <p>No se pudo cargar el vehículo</p>
      <button @click="goBack" class="btn-primary">Volver</button>
    </div>
  </div>
</template>

<style scoped>
.vehicle-detail-page {
  min-height: calc(100vh - 100px);
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.loading-container, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: 1rem;
}

.loading-container i, .error-state i {
  font-size: 3rem;
  color: var(--accent-orange);
}

.page-header {
  margin-bottom: 2rem;
}

.btn-back {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-back:hover {
  background: #f5f5f5;
  border-color: var(--accent-orange);
  color: var(--accent-orange);
}

.vehicle-info-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
}

.vehicle-image {
  height: 300px;
  background: linear-gradient(135deg, #FF6F00 0%, #FF8F00 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.vehicle-image i {
  font-size: 6rem;
  color: white;
  opacity: 0.9;
}

.vehicle-details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.vehicle-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.vehicle-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-dark);
  margin: 0;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
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

.vehicle-specs {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.spec-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f5f7fa;
  border-radius: 8px;
  font-weight: 500;
}

.spec-item i {
  color: var(--accent-orange);
}

.pricing {
  display: flex;
  gap: 2rem;
  padding: 1rem;
  background: #f5f7fa;
  border-radius: 8px;
}

.price-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.price-item .label {
  font-size: 0.875rem;
  color: var(--neutral-gray);
}

.price-item .price {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent-orange);
}

.location {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.location i {
  font-size: 1.5rem;
  color: var(--accent-orange);
}

.district {
  font-weight: 600;
  color: var(--primary-dark);
  margin: 0 0 0.25rem 0;
}

.address {
  color: var(--neutral-gray);
  margin: 0;
  font-size: 0.95rem;
}

.features h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--primary-dark);
  margin-bottom: 0.75rem;
}

.features-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.feature-tag {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.875rem;
}

.feature-tag i {
  color: #4caf50;
  font-size: 0.75rem;
}

@media (max-width: 768px) {
  .vehicle-info-card {
    grid-template-columns: 1fr;
  }
  
  .vehicle-image {
    height: 200px;
  }
}

/* Reviews Section Styles */
.reviews-section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
}

.reviews-header {
  margin-bottom: 1.5rem;
}

.reviews-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.reviews-title h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-dark);
  margin: 0;
}

.rating-summary {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avg-rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  border-radius: 24px;
}

.rating-number {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1e293b;
}

.rating-star {
  font-size: 1.25rem;
  color: #1e293b;
}

.review-count {
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 500;
}

.no-reviews {
  text-align: center;
  padding: 3rem 2rem;
  background: #f8fafc;
  border-radius: 12px;
}

.no-reviews i {
  font-size: 3rem;
  color: #e2e8f0;
  margin-bottom: 1rem;
}

.no-reviews p {
  font-size: 1.1rem;
  font-weight: 600;
  color: #475569;
  margin: 0 0 0.5rem 0;
}

.no-reviews span {
  font-size: 0.9rem;
  color: #94a3b8;
}

.loading-reviews {
  text-align: center;
  padding: 2rem;
  color: #64748b;
}

.loading-reviews i {
  font-size: 2rem;
  color: var(--accent-orange);
  margin-bottom: 0.5rem;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.review-card {
  padding: 1.25rem;
  background: #f8fafc;
  border-radius: 12px;
  border-left: 4px solid #fbbf24;
  transition: transform 0.2s, box-shadow 0.2s;
}

.review-card:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.review-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.reviewer-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF6F00 0%, #FF8F00 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.reviewer-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.reviewer-name {
  font-weight: 600;
  color: #1e293b;
  font-size: 0.95rem;
}

.review-date {
  font-size: 0.75rem;
  color: #94a3b8;
}

.review-rating {
  display: flex;
  gap: 0.125rem;
}

.review-rating .star {
  font-size: 1.1rem;
  color: #e2e8f0;
}

.review-rating .star.filled {
  color: #fbbf24;
}

.review-comment {
  margin: 0;
  font-size: 0.9rem;
  color: #475569;
  line-height: 1.6;
}

.review-no-comment {
  margin: 0;
  font-size: 0.85rem;
  color: #94a3b8;
  font-style: italic;
}
</style>