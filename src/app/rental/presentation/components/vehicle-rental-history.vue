<script setup>
import { ref, onMounted, computed } from 'vue'
import { RentalApi } from '@/app/rental/infrastructure/rental-api.js'

const props = defineProps({
  vehicleId: {
    type: Number,
    required: true
  }
})

const rentals = ref([])
const expandedRentals = ref([]) // IDs de rentals con reseñas expandidas
const loading = ref(true)

onMounted(async () => {
  await loadHistory()
})

async function loadHistory() {
  try {
    loading.value = true
    rentals.value = await RentalApi.getVehicleRentalHistory(props.vehicleId)
  } catch (error) {
    console.error('Error loading rental history:', error)
  } finally {
    loading.value = false
  }
}

// Toggle para expandir/colapsar reseñas
async function toggleReviews(rentalId) {
  const index = expandedRentals.value.indexOf(rentalId)
  
  if (index > -1) {
    // Colapsar
    expandedRentals.value.splice(index, 1)
  } else {
    // Expandir y cargar reseñas
    expandedRentals.value.push(rentalId)
    const rental = rentals.value.find(r => r.id === rentalId)
    if (!rental.reviews) {
      rental.reviews = await RentalApi.getRentalReviews(rentalId)
    }
  }
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

function getStatusLabel(status) {
  const labels = {
    completed: 'Completado',
    active: 'Activo',
    confirmed: 'Confirmado',
    pending: 'Pendiente',
    canceled: 'Cancelado'
  }
  return labels[status] || status
}

function getStatusClass(status) {
  return `status-${status}`
}
</script>

<template>
  <div class="rental-history">
    <div class="history-header">
      <h2>
        <i class="pi pi-history"></i>
        Historial de Alquileres
      </h2>
      <p class="subtitle">{{ rentals.length }} alquileres realizados</p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-state">
      <i class="pi pi-spin pi-spinner"></i>
      <p>Cargando historial...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="rentals.length === 0" class="empty-state">
      <i class="pi pi-inbox"></i>
      <p>Este vehículo aún no tiene alquileres</p>
    </div>

    <!-- Lista de Alquileres -->
    <div v-else class="rentals-list">
      <div 
        v-for="rental in rentals" 
        :key="rental.id"
        class="rental-card"
      >
        <!-- Info básica del rental -->
        <div class="rental-header">
          <div class="rental-dates">
            <span class="date-badge">
              <i class="pi pi-calendar"></i>
              {{ formatDate(rental.startDate) }}
            </span>
            <i class="pi pi-arrow-right"></i>
            <span class="date-badge">
              <i class="pi pi-calendar"></i>
              {{ formatDate(rental.endDate) }}
            </span>
          </div>
          
          <span :class="['status-badge', getStatusClass(rental.status)]">
            {{ getStatusLabel(rental.status) }}
          </span>
        </div>

        <!-- Detalles -->
        <div class="rental-details">
          <div class="detail-row">
            <i class="pi pi-user"></i>
            <span>Inquilino ID: #{{ rental.renterId }}</span>
          </div>
          <div class="detail-row">
            <i class="pi pi-dollar"></i>
            <span>Total: S/ {{ rental.totalPrice }}</span>
          </div>
          <div v-if="rental.notes" class="detail-row notes">
            <i class="pi pi-comment"></i>
            <span>{{ rental.notes }}</span>
          </div>
        </div>

        <!-- Botón Ver Reseñas (solo para completed) -->
        <button 
          v-if="rental.status === 'completed'"
          @click="toggleReviews(rental.id)"
          class="btn-reviews"
        >
          <i :class="expandedRentals.includes(rental.id) ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"></i>
          {{ expandedRentals.includes(rental.id) ? 'Ocultar' : 'Ver' }} Reseñas
        </button>

        <!-- Sección de Reseñas Expandible -->
        <div 
          v-if="expandedRentals.includes(rental.id) && rental.reviews" 
          class="reviews-section"
        >
          <h4>📝 Reseñas Recibidas</h4>
          
          <div v-if="rental.reviews.length === 0" class="no-reviews">
            <i class="pi pi-info-circle"></i>
            <span>Sin reseñas aún</span>
          </div>

          <div v-else class="reviews-list">
            <div 
              v-for="review in rental.reviews" 
              :key="review.id"
              class="review-card"
            >
              <div class="review-header">
                <div class="reviewer-info">
                  <i class="pi pi-user"></i>
                  <span>{{ review.reviewedType === 'owner' ? 'Inquilino' : 'Propietario' }}</span>
                </div>
                <div class="rating">
                  <i 
                    v-for="star in 5" 
                    :key="star"
                    :class="['pi', star <= review.rating ? 'pi-star-fill' : 'pi-star']"
                  ></i>
                  <span class="rating-number">{{ review.rating }}/5</span>
                </div>
              </div>
              
              <p class="review-comment">{{ review.comment }}</p>
              
              <div class="review-footer">
                <span class="review-date">
                  <i class="pi pi-clock"></i>
                  {{ formatDate(review.createdAt) }}
                </span>
                <span v-if="review.isPublic" class="public-badge">
                  <i class="pi pi-eye"></i>
                  Público
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rental-history {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.history-header {
  margin-bottom: 2rem;
}

.history-header h2 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary-dark);
  margin-bottom: 0.5rem;
}

.subtitle {
  color: var(--neutral-gray);
  font-size: 0.95rem;
}

/* Loading & Empty States */
.loading-state,
.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--neutral-gray);
}

.loading-state i,
.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: block;
}

/* Rental Card */
.rentals-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.rental-card {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.rental-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: var(--accent-orange);
}

.rental-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.rental-dates {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.date-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: #f5f5f5;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Status badges */
.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.status-completed {
  background: #e8f5e9;
  color: #2e7d32;
}

.status-active {
  background: #e3f2fd;
  color: #1976d2;
}

.status-confirmed {
  background: #fff3e0;
  color: #f57c00;
}

.status-pending {
  background: #fef7e0;
  color: #f9a825;
}

.status-canceled {
  background: #ffebee;
  color: #c62828;
}

/* Details */
.rental-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--primary-dark);
  font-size: 0.95rem;
}

.detail-row i {
  color: var(--accent-orange);
  font-size: 1rem;
}

.detail-row.notes {
  padding: 0.75rem;
  background: #f9f9f9;
  border-radius: 8px;
  font-style: italic;
}

/* Botón Ver Reseñas */
.btn-reviews {
  width: 100%;
  padding: 0.75rem;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-reviews:hover {
  background: var(--accent-orange);
  color: white;
  border-color: var(--accent-orange);
}

/* Reviews Section */
.reviews-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid #f0f0f0;
}

.reviews-section h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--primary-dark);
  margin-bottom: 1rem;
}

.no-reviews {
  text-align: center;
  padding: 2rem;
  color: var(--neutral-gray);
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.review-card {
  background: #f9f9f9;
  padding: 1.25rem;
  border-radius: 10px;
  border-left: 4px solid var(--accent-orange);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.reviewer-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: var(--primary-dark);
}

.rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.rating i {
  color: #ffc107;
  font-size: 1rem;
}

.rating-number {
  margin-left: 0.5rem;
  font-weight: 600;
  color: var(--primary-dark);
}

.review-comment {
  color: var(--primary-dark);
  line-height: 1.6;
  margin-bottom: 0.75rem;
}

.review-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: var(--neutral-gray);
}

.review-date {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.public-badge {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: white;
  border-radius: 6px;
  font-weight: 500;
}
</style>