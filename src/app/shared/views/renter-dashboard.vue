<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/app/iam/application/user.store'
import { useRentalStore } from '@/app/rental/application/rental.store'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const userStore = useUserStore()
const rentalStore = useRentalStore()

const user = computed(() => userStore.currentUser.value)

// Modal State
const showRatingModal = ref(false)
const selectedRental = ref(null)

// Vehicle Rating
const ratingValue = ref(0)
const ratingComment = ref('')
const hoverRating = ref(0)

const submittingRating = ref(false)

// Cargar datos al montar
onMounted(async () => {
  await rentalStore.loadRentals()
  await rentalStore.loadVehicles()
})

// Filtrar alquileres del usuario actual
const userRentals = computed(() => {
  if (!user.value) return []
  return rentalStore.state.rentals.filter(rental => rental.renterId === user.value.id)
})

// Alquileres activos (status: active, pending, confirmed)
const activeRentals = computed(() => {
  return userRentals.value.filter(rental => 
    ['active', 'pending', 'confirmed'].includes(rental.status)
  )
})

// Alquileres completados (para mostrar opción de calificar si es necesario)
const completedRentals = computed(() => {
  return userRentals.value.filter(rental => rental.status === 'completed')
})

// Calcular total gastado
const totalSpent = computed(() => {
  return userRentals.value
    .filter(rental => rental.status === 'completed')
    .reduce((total, rental) => total + (rental.totalPrice || 0), 0)
})

// Stats funcionales
const stats = computed(() => ({
  activeRentals: activeRentals.value.length,
  completedRentals: completedRentals.value.length,
  totalSpent: totalSpent.value,
  favorites: 0 // TODO: implementar favoritos
}))

// Obtener datos del vehículo para mostrar en las tarjetas
function getVehicleData(vehicleId) {
  return rentalStore.state.vehicles.find(v => v.id === vehicleId)
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

// Verificar si el rental es una aventura (tiene ruta de aventura asociada)
function isRentalAdventure(rental) {
  return rental && rental.adventureRouteId != null
}

// Actions
async function handleFinishRental(rental) {
  if (!confirm('¿Estás seguro de que deseas finalizar este viaje?')) return

  try {
    await rentalStore.updateRentalStatus(rental.id, 'completed')
    // Optionally open rating modal immediately
    openRatingModal(rental)
  } catch (error) {
    console.error('Error finishing rental:', error)
    alert('Error al finalizar el viaje')
  }
}

function openRatingModal(rental) {
  selectedRental.value = rental
  ratingValue.value = 0
  ratingComment.value = ''
  hoverRating.value = 0
  showRatingModal.value = true
}

function skipRating() {
  showRatingModal.value = false
  selectedRental.value = null
}

function getRatingLabel(stars) {
  const labels = {
    0: 'Selecciona una calificación',
    1: '⭐ Muy malo',
    2: '⭐⭐ Malo',
    3: '⭐⭐⭐ Regular',
    4: '⭐⭐⭐⭐ Bueno',
    5: '⭐⭐⭐⭐⭐ ¡Excelente!'
  }
  return labels[stars] || ''
}

async function submitRating() {
  if (ratingValue.value === 0) {
    alert('Por favor selecciona una calificación')
    return
  }

  submittingRating.value = true
  try {
    await rentalStore.rateRental(selectedRental.value.id, ratingValue.value, ratingComment.value)
    showRatingModal.value = false
    await rentalStore.loadRentals()
  } catch (error) {
    console.error('Error submitting rating:', error)
    alert('Error al enviar la calificación. Por favor intenta de nuevo.')
  } finally {
    submittingRating.value = false
  }
}
</script>

<template>
  <div class="renter-dashboard">
    <div class="dashboard-header">
      <h1>{{ t('dashboard.renter.welcome', { name: user?.firstName }) }} 👋</h1>
      <p>{{ t('dashboard.renter.summary') }}</p>
    </div>

    <!-- Stats Grid -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">🚗</div>
        <div class="stat-content">
          <h3>{{ stats.activeRentals }}</h3>
          <p>{{ t('dashboard.renter.activeRentals') }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-content">
          <h3>{{ stats.completedRentals }}</h3>
          <p>{{ t('dashboard.renter.completedTrips') }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">💰</div>
        <div class="stat-content">
          <h3>S/. {{ stats.totalSpent.toFixed(2) }}</h3>
          <p>{{ t('dashboard.renter.totalSpent') }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">❤️</div>
        <div class="stat-content">
          <h3>{{ stats.favorites }}</h3>
          <p>{{ t('dashboard.renter.favorites') }}</p>
        </div>
      </div>
    </div>

    <!-- Próximos Viajes (Activos) -->
    <div class="section">
      <h2>{{ t('dashboard.renter.upcomingTrips') }}</h2>
      <div class="empty-state" v-if="activeRentals.length === 0">
        <p>{{ t('dashboard.renter.noUpcomingTrips') }}</p>
        <router-link to="/rentals" class="btn-primary">{{ t('dashboard.renter.exploreVehicles') }}</router-link>
      </div>
      <div v-else class="rentals-grid">
        <div 
          v-for="rental in activeRentals" 
          :key="rental.id" 
          class="rental-card"
        >
          <div class="rental-status" :class="rental.status">
            {{ rental.status === 'pending' ? t('dashboard.renter.status.pending') : rental.status === 'confirmed' ? t('dashboard.renter.status.confirmed') : t('dashboard.renter.status.active') }}
          </div>
          <div class="vehicle-info">
            <h3>{{ getVehicleData(rental.vehicleId)?.brand }} {{ getVehicleData(rental.vehicleId)?.model }}</h3>
            <p class="vehicle-year">{{ getVehicleData(rental.vehicleId)?.year }}</p>
          </div>
          <div class="rental-dates">
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
          <div class="rental-price">
            <span class="price">S/. {{ rental.totalPrice }}</span>
            <span class="price-label">{{ t('dashboard.renter.total') }}</span>
          </div>
          
          <div class="card-actions">
            <router-link :to="`/my-rentals`" class="btn-view">
              {{ t('dashboard.renter.viewDetails') }}
            </router-link>
            
            <button 
              v-if="rental.status === 'active' || rental.status === 'confirmed'" 
              @click="handleFinishRental(rental)" 
              class="btn-finish"
            >
              Terminar Viaje
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Viajes Recientes (Completados) -->
    <div class="section" v-if="completedRentals.length > 0">
      <h2>Viajes Recientes</h2>
      <div class="completed-rentals-grid">
        <div 
          v-for="rental in completedRentals.slice(0, 6)" 
          :key="rental.id" 
          class="completed-rental-card"
          :class="{ 'is-adventure-rental': isRentalAdventure(rental) }"
        >
          <!-- Vehicle Image Placeholder -->
          <div class="vehicle-image" :class="{ 'adventure-bg': isRentalAdventure(rental) }">
            <div class="image-placeholder">
              <i :class="isRentalAdventure(rental) ? 'pi pi-compass' : 'pi pi-car'"></i>
            </div>
            <div class="completed-badge">
              <i class="pi pi-check"></i>
              Completado
            </div>
            <!-- Adventure Badge -->
            <div v-if="isRentalAdventure(rental)" class="adventure-badge">
              <i class="pi pi-compass"></i> Aventura
            </div>
          </div>
          
          <!-- Card Content -->
          <div class="card-body">
            <!-- Adventure Title (si es aventura) -->
            <div v-if="isRentalAdventure(rental) && getAdventureData(rental.adventureRouteId)" class="adventure-title">
              <i class="pi pi-map"></i>
              {{ getAdventureData(rental.adventureRouteId).title }}
            </div>
            
            <h3 class="vehicle-name">
              {{ getVehicleData(rental.vehicleId)?.brand }} {{ getVehicleData(rental.vehicleId)?.model }}
            </h3>
            <p class="vehicle-year">{{ getVehicleData(rental.vehicleId)?.year }}</p>
            
            <div class="trip-info">
              <div class="info-row">
                <i class="pi pi-calendar"></i>
                <span>{{ formatDate(rental.startDate) }} - {{ formatDate(rental.endDate) }}</span>
              </div>
              <div class="info-row">
                <i class="pi pi-wallet"></i>
                <span class="price">S/. {{ rental.totalPrice }}</span>
              </div>
            </div>
            
            <!-- Rating Section -->
            <div class="rating-section">
              <template v-if="!rental.isRated">
                <p class="rate-prompt">¿Cómo fue tu experiencia?</p>
                <button 
                  @click="openRatingModal(rental)" 
                  class="btn-rate-now"
                >
                  <i class="pi pi-star"></i>
                  Calificar Ahora
                </button>
              </template>
              <template v-else>
                <div class="rating-display">
                  <div class="stars-display">
                    <span v-for="star in 5" :key="star" class="mini-star" :class="{ filled: star <= rental.rating }">★</span>
                  </div>
                  <span class="rating-text">{{ rental.rating }}/5 - ¡Gracias!</span>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Rating Modal - Simplified Vehicle Only (Optional) -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showRatingModal" class="rating-modal-overlay" @click="showRatingModal = false">
          <div class="rating-modal" @click.stop>
            <!-- Close Button -->
            <button @click="showRatingModal = false" class="modal-close">
              <i class="pi pi-times"></i>
            </button>
            
            <!-- Modal Header -->
            <div class="modal-hero">
              <div class="hero-icon">
                <i class="pi pi-star-fill"></i>
              </div>
              <h2>¿Cómo fue tu viaje?</h2>
              <p class="hero-subtitle">
                Tu opinión nos ayuda a mejorar
              </p>
            </div>
            
            <!-- Vehicle Rating Section -->
            <div class="rating-section-block" v-if="selectedRental?.vehicleId">
              <div class="section-header">
                <i class="pi pi-car"></i>
                <span>Califica el Vehículo</span>
                <span class="optional-badge">Opcional</span>
              </div>
              <p class="section-subtitle">
                <strong>{{ getVehicleData(selectedRental?.vehicleId)?.brand }} {{ getVehicleData(selectedRental?.vehicleId)?.model }}</strong>
              </p>
              
              <!-- Vehicle Rating Stars -->
              <div class="rating-container">
                <div class="stars-row">
                  <span 
                    v-for="star in 5" 
                    :key="'vehicle-' + star" 
                    class="rating-star" 
                    :class="{ active: star <= ratingValue, hover: star <= hoverRating }"
                    @click="ratingValue = star"
                    @mouseenter="hoverRating = star"
                    @mouseleave="hoverRating = 0"
                  >
                    ★
                  </span>
                </div>
                <p class="rating-feedback">{{ getRatingLabel(ratingValue || hoverRating) }}</p>
              </div>
              
              <!-- Vehicle Comment -->
              <div class="comment-section">
                <label>
                  <i class="pi pi-comment"></i>
                  Comentario (opcional)
                </label>
                <textarea 
                  v-model="ratingComment" 
                  rows="2" 
                  placeholder="¿Cómo estuvo el vehículo? ¿Limpio? ¿En buen estado?"
                ></textarea>
              </div>
            </div>
            
            <!-- Actions -->
            <div class="modal-footer">
              <button @click="skipRating" class="btn-skip">
                <i class="pi pi-forward"></i>
                Omitir
              </button>
              <button 
                @click="submitRating" 
                class="btn-primary-rating" 
                :disabled="submittingRating || ratingValue === 0"
              >
                <i v-if="submittingRating" class="pi pi-spin pi-spinner"></i>
                <i v-else class="pi pi-send"></i>
                {{ submittingRating ? 'Enviando...' : 'Enviar Calificación' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.renter-dashboard {
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
  box-shadow: 4px 16px rgba(0, 0, 0, 0.12);
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

.section h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary-dark);
  margin-bottom: 1.5rem;
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

.btn-primary {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
  background: var(--accent-orange);
  color: white;
}

.btn-primary:hover {
  background: #e65100;
  transform: translateY(-2px);
}

/* Rentals Grid */
.rentals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.rental-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.rental-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.rental-status {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  align-self: flex-start;
}

.rental-status.pending { background: #FFF3E0; color: #FF6F00; }
.rental-status.confirmed { background: #E8F5E9; color: #2E7D32; }
.rental-status.active { background: #E3F2FD; color: #1976D2; }
.rental-status.completed { background: #E0E0E0; color: #616161; }

.vehicle-info h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--primary-dark);
  margin: 0;
}

.vehicle-year {
  font-size: 0.875rem;
  color: var(--neutral-gray);
  margin: 0.25rem 0 0 0;
}

.rental-dates {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f5f7fa;
  border-radius: 8px;
}

.date-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  color: var(--primary-dark);
}

.date-item i { color: var(--accent-orange); }

.rental-price {
  display: flex;
  flex-direction: column;
  padding-top: 0.75rem;
  border-top: 1px solid #e0e0e0;
}

.rental-price .price {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent-orange);
}

.rental-price .price-label {
  font-size: 0.75rem;
  color: var(--neutral-gray);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: auto;
}

.btn-view {
  flex: 1;
  padding: 0.625rem;
  background: transparent;
  color: var(--accent-orange);
  border: 2px solid var(--accent-orange);
  border-radius: 8px;
  text-align: center;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.btn-view:hover {
  background: var(--accent-orange);
  color: white;
}

.btn-finish {
  flex: 1;
  padding: 0.625rem;
  background: #2E7D32;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-finish:hover {
  background: #1B5E20;
}

/* Modern Rating Modal */
.rating-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.rating-modal {
  background: white;
  border-radius: 24px;
  padding: 2rem;
  max-width: 420px;
  width: 100%;
  position: relative;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.25);
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f1f5f9;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.modal-close:hover {
  background: #e2e8f0;
  transform: rotate(90deg);
}

.modal-close i {
  font-size: 0.9rem;
  color: #64748b;
}

.modal-hero {
  text-align: center;
  margin-bottom: 1.5rem;
}

.hero-icon {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  box-shadow: 0 8px 24px rgba(251, 191, 36, 0.4);
}

.hero-icon i {
  font-size: 2rem;
  color: white;
}

.modal-hero h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.hero-subtitle {
  font-size: 0.9rem;
  color: #64748b;
  margin: 0;
}

.hero-subtitle strong {
  color: #1e293b;
}

.rating-container {
  text-align: center;
  padding: 1.5rem 0;
  background: #f8fafc;
  border-radius: 16px;
  margin-bottom: 1.5rem;
}

.stars-row {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.rating-star {
  font-size: 2.75rem;
  color: #e2e8f0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.rating-star:hover,
.rating-star.hover {
  color: #fcd34d;
  transform: scale(1.15);
}

.rating-star.active {
  color: #fbbf24;
  text-shadow: 0 0 20px rgba(251, 191, 36, 0.5);
}

.rating-feedback {
  font-size: 0.9rem;
  font-weight: 600;
  color: #64748b;
  margin: 0;
  min-height: 1.5rem;
}

.comment-section {
  margin-bottom: 1.5rem;
}

.comment-section label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #475569;
  margin-bottom: 0.5rem;
}

.comment-section label i {
  color: #94a3b8;
}

.comment-section textarea {
  width: 100%;
  padding: 0.875rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-family: inherit;
  font-size: 0.9rem;
  resize: none;
  transition: border-color 0.2s;
}

.comment-section textarea:focus {
  outline: none;
  border-color: #fbbf24;
}

.comment-section textarea::placeholder {
  color: #94a3b8;
}

.modal-footer {
  display: flex;
  gap: 0.75rem;
}

.btn-secondary {
  flex: 1;
  padding: 0.875rem;
  background: #f1f5f9;
  color: #475569;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #e2e8f0;
}

.btn-skip {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem;
  background: transparent;
  color: #64748b;
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-skip:hover {
  background: #f8fafc;
  border-color: #94a3b8;
  color: #475569;
}

.optional-badge {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border-radius: 20px;
  font-weight: 600;
  margin-left: auto;
}

.btn-primary-rating {
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: #1e293b;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary-rating:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(251, 191, 36, 0.45);
}

.btn-primary-rating:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Modal Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .rating-modal,
.modal-leave-to .rating-modal {
  transform: scale(0.9) translateY(20px);
}

/* Completed Rentals Grid - Modern Design */
.completed-rentals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.completed-rental-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.completed-rental-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.vehicle-image {
  position: relative;
  height: 140px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-placeholder i {
  font-size: 3.5rem;
  color: rgba(255, 255, 255, 0.6);
}

.completed-badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background: rgba(46, 125, 50, 0.95);
  color: #fff;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
  backdrop-filter: blur(4px);
}

.completed-badge i {
  font-size: 0.65rem;
}

.card-body {
  padding: 1.25rem;
}

.vehicle-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
}

.card-body .vehicle-year {
  font-size: 0.8rem;
  color: #64748b;
  margin: 0 0 1rem 0;
}

.trip-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 10px;
  margin-bottom: 1rem;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #475569;
}

.info-row i {
  color: #94a3b8;
  font-size: 0.85rem;
}

.info-row .price {
  font-weight: 700;
  color: #FF6F00;
}

.rating-section {
  border-top: 1px solid #e2e8f0;
  padding-top: 1rem;
}

.rate-prompt {
  font-size: 0.8rem;
  color: #64748b;
  margin: 0 0 0.75rem 0;
  text-align: center;
}

.btn-rate-now {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: #1e293b;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-rate-now:hover {
  transform: scale(1.02);
  box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
}

.btn-rate-now i {
  font-size: 1rem;
}

.rating-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
}

.stars-display {
  display: flex;
  gap: 0.125rem;
}

.mini-star {
  font-size: 1.25rem;
  color: #e2e8f0;
}

.mini-star.filled {
  color: #fbbf24;
}

.rating-text {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 600;
}

/* ======================== */
/* RATING MODAL STYLES */
/* ======================== */

.rating-section-block {
  background: #f8fafc;
  border-radius: 16px;
  padding: 1.25rem;
  margin-bottom: 1rem;
  border: 2px solid #e2e8f0;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 1rem;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.section-header i {
  font-size: 1.1rem;
  color: #3b82f6;
}

.section-subtitle {
  font-size: 0.9rem;
  color: #64748b;
  margin: 0 0 0.75rem 0;
}

.section-subtitle strong {
  color: #1e293b;
}

.rating-section-block .rating-container {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 0.75rem;
}

.rating-section-block .comment-section {
  margin-bottom: 0;
}

.rating-section-block .comment-section label {
  font-size: 0.8rem;
  color: #64748b;
}

.rating-section-block .comment-section textarea {
  border: 1px solid #e2e8f0;
  font-size: 0.85rem;
}

/* Responsive */
@media (max-width: 768px) {
  .renter-dashboard {
    padding: 1rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .rating-modal {
    max-width: 95vw;
    margin: 0.5rem;
  }
}
</style>
