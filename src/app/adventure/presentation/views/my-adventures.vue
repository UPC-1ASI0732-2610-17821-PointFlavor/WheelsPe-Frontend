<template>
  <div class="my-adventures-page">
    <div class="page-header">
      <div class="header-content">
        <h1>Mis Aventuras</h1>
        <p>Gestiona las rutas de aventura que ofreces con tus vehículos</p>
      </div>
      <router-link to="/adventure/create" class="btn-create">
        <span class="icon">+</span>
        Nueva Aventura
      </router-link>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #42b983 0%, #35926d 100%);">
          🗺️
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ myAdventures.length }}</div>
          <div class="stat-label">Aventuras Activas</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);">
          📋
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ totalRequests }}</div>
          <div class="stat-label">Solicitudes Totales</div>
          <div v-if="pendingRequestsTotal > 0" class="stat-pending">
            {{ pendingRequestsTotal }} pendientes
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #27ae60 0%, #1e8449 100%);">
          ✅
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ completedAdventures }}</div>
          <div class="stat-label">Completadas</div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Cargando aventuras...</p>
    </div>

    <!-- Empty State - Enhanced -->
    <div v-else-if="myAdventures.length === 0" class="empty-state">
      <div class="empty-animation">
        <div class="floating-icon">🗺️</div>
        <div class="floating-icon delay-1">🚗</div>
        <div class="floating-icon delay-2">⛰️</div>
      </div>
      
      <div class="empty-content">
        <h2 class="empty-title">¡Comienza Tu Aventura!</h2>
        <p class="empty-description">
          Aún no has creado ninguna aventura. Es hora de compartir experiencias únicas con viajeros de todo el mundo.
        </p>
        
        <div class="empty-features">
          <div class="feature-item">
            <div class="feature-icon">✨</div>
            <div class="feature-text">
              <h4>Crea Rutas Únicas</h4>
              <p>Diseña experiencias memorables</p>
            </div>
          </div>
          
          <div class="feature-item">
            <div class="feature-icon">💰</div>
            <div class="feature-text">
              <h4>Genera Ingresos</h4>
              <p>Monetiza tus conocimientos</p>
            </div>
          </div>
          
          <div class="feature-item">
            <div class="feature-icon">🌟</div>
            <div class="feature-text">
              <h4>Construye Reputación</h4>
              <p>Recibe reseñas y calificaciones</p>
            </div>
          </div>
        </div>
        
        <router-link to="/adventure/create" class="btn-create-big">
          <span class="btn-icon">🚀</span>
          Crear Mi Primera Aventura
          <span class="btn-arrow">→</span>
        </router-link>
        
        <div class="empty-tip">
          <span class="tip-icon">💡</span>
          <span>Tip: Las aventuras con fotos de calidad tienen 3x más solicitudes</span>
        </div>
      </div>
    </div>

    <!-- Adventures List -->
    <div v-else class="adventures-list">
      <div
        v-for="adventure in myAdventures"
        :key="adventure.id"
        class="adventure-card"
      >
        <div class="adventure-image">
          <img :src="getAdventureImage(adventure)" :alt="adventure.title" />
          <div class="adventure-badge" :class="adventure.featured ? 'featured' : 'regular'">
            {{ adventure.featured ? '⭐ Destacada' : '📍 Regular' }}
          </div>
        </div>

        <div class="adventure-content">
          <div class="adventure-header">
            <h3>{{ adventure.title }}</h3>
            <div class="adventure-meta">
              <span class="meta-item">
                <span class="icon">🚗</span>
                {{ adventure.vehicleName }}
              </span>
              <span class="meta-item">
                <span class="icon">📅</span>
                {{ adventure.duration }} días
              </span>
              <span class="meta-item">
                <span class="icon">💰</span>
                S/. {{ adventure.price }}
              </span>
              <span class="meta-item" v-if="adventure.type">
                <span class="icon">🏷️</span>
                {{ adventure.type }}
              </span>
            </div>
          </div>

          <p class="adventure-description">{{ adventure.description }}</p>

          <div class="adventure-stats">
            <div class="stat-item">
              <span class="stat-icon">📋</span>
              <span>{{ adventure.requestsCount || 0 }} solicitudes</span>
            </div>
            <div v-if="adventure.pendingRequestsCount > 0" class="stat-item pending">
              <span class="stat-icon">🔔</span>
              <span>{{ adventure.pendingRequestsCount }} pendientes</span>
            </div>
            <div class="stat-item">
              <span class="stat-icon">✅</span>
              <span>{{ adventure.completedCount || 0 }} completadas</span>
            </div>
          </div>

          <div class="adventure-actions">
            <button @click="viewRequests(adventure)" class="btn-action btn-requests" :class="{ 'has-pending': adventure.pendingRequestsCount > 0 }">
              <span class="icon">📋</span>
              Solicitudes
              <span v-if="adventure.pendingRequestsCount > 0" class="badge">{{ adventure.pendingRequestsCount }}</span>
            </button>

            <button @click="editAdventure(adventure)" class="btn-action btn-edit">
              <span class="icon">✏️</span>
              Editar
            </button>
            <button @click="confirmDelete(adventure)" class="btn-action btn-delete">
              <span class="icon">🗑️</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="showDeleteModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>⚠️ Confirmar Eliminación</h3>
        </div>
        <div class="modal-body">
          <p>¿Estás seguro de que deseas eliminar la aventura <strong>"{{ adventureToDelete?.title }}"</strong>?</p>
          <p class="warning-text">Esta acción no se puede deshacer.</p>
        </div>
        <div class="modal-actions">
          <button @click="showDeleteModal = false" class="btn-cancel">Cancelar</button>
          <button @click="deleteAdventure" class="btn-confirm-delete">Eliminar Aventura</button>
        </div>
      </div>
    </div>

    <!-- Requests Modal -->
    <div v-if="showRequestsModal" class="modal-overlay" @click="showRequestsModal = false">
      <div class="modal-content modal-large" @click.stop>
        <div class="modal-header">
          <h3>📋 Solicitudes de Aventura</h3>
          <button @click="showRequestsModal = false" class="btn-close">✕</button>
        </div>
        <div class="modal-body">
          <h4>{{ selectedAdventure?.title }}</h4>
          
          <div v-if="loadingRequests" class="loading-small">
            <div class="spinner-small"></div>
            Cargando solicitudes...
          </div>

          <div v-else-if="adventureRequests.length === 0" class="empty-requests">
            <p>No hay solicitudes para esta aventura aún</p>
          </div>

          <div v-else class="requests-list">
            <div v-for="request in adventureRequests" :key="request.id" class="request-item">
              <div class="request-header">
                <div class="requester-info">
                  <div class="requester-avatar">{{ request.renterName?.charAt(0) || '?' }}</div>
                  <div>
                    <div class="requester-name">{{ request.renterName }}</div>
                    <div class="request-date">{{ formatDate(request.createdAt) }}</div>
                  </div>
                </div>
                <div class="request-status" :class="request.status">
                  {{ getStatusLabel(request.status) }}
                </div>
              </div>
              <div class="request-details">
                <div class="detail-item">
                  <span class="icon">🚗</span>
                  {{ request.vehicleName }}
                </div>
                <div class="detail-item">
                  <span class="icon">📅</span>
                  {{ formatDate(request.startDate) }} - {{ formatDate(request.endDate) }}
                </div>
                <div class="detail-item">
                  <span class="icon">💰</span>
                  S/. {{ request.totalPrice }}
                </div>
              </div>
              <div v-if="request.notes" class="request-notes">
                <strong>Notas:</strong> {{ request.notes }}
              </div>
              <!-- Action buttons for pending requests -->
              <div v-if="request.status === 'pending'" class="request-actions">
                <button @click="approveRequest(request)" class="btn-approve">
                  <span class="icon">✅</span>
                  Aprobar
                </button>
                <button @click="rejectRequest(request)" class="btn-reject">
                  <span class="icon">❌</span>
                  Rechazar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Reviews Modal -->
    <div v-if="showReviewsModal" class="modal-overlay" @click="showReviewsModal = false">
      <div class="modal-content modal-large" @click.stop>
        <div class="modal-header">
          <h3>⭐ Reseñas de la Aventura</h3>
          <button @click="showReviewsModal = false" class="btn-close">✕</button>
        </div>
        <div class="modal-body">
          <div class="reviews-header">
            <h4>{{ selectedAdventure?.title }}</h4>
            <div class="reviews-summary" v-if="adventureReviews.length > 0">
              <div class="summary-rating">
                <span class="big-star">⭐</span>
                <span class="rating-value">{{ calculateAverageRating(adventureReviews).toFixed(1) }}</span>
                <span class="rating-max">/5</span>
              </div>
              <div class="summary-count">{{ adventureReviews.length }} reseña(s)</div>
            </div>
          </div>
          
          <div v-if="loadingReviews" class="loading-small">
            <div class="spinner-small"></div>
            Cargando reseñas...
          </div>

          <div v-else-if="adventureReviews.length === 0" class="empty-reviews">
            <div class="empty-icon">📝</div>
            <p>Esta aventura aún no tiene reseñas</p>
            <span class="empty-hint">Las reseñas aparecerán cuando los viajeros completen la aventura</span>
          </div>

          <div v-else class="reviews-list">
            <div v-for="review in adventureReviews" :key="review.id" class="review-item">
              <div class="review-header">
                <div class="reviewer-info">
                  <div class="reviewer-avatar">{{ review.renterName?.charAt(0) || '👤' }}</div>
                  <div>
                    <div class="reviewer-name">{{ review.renterName || 'Usuario' }}</div>
                    <div class="review-date">{{ formatDate(review.createdAt) }}</div>
                  </div>
                </div>
                <div class="review-rating">
                  <span v-for="star in 5" :key="star" class="star" :class="{ filled: star <= review.rating }">
                    {{ star <= review.rating ? '⭐' : '☆' }}
                  </span>
                </div>
              </div>
              <div v-if="review.comment" class="review-comment">
                "{{ review.comment }}"
              </div>
              <div v-else class="review-no-comment">
                <i>Sin comentario</i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/app/iam/application/user.store.js'
import { useRentalStore } from '@/app/rental/application/rental.store.js'
import useAdventuresStore from '@/app/adventure/application/adventures.store.js'
import { apiClient } from '@/app/shared/infrastructure/apiClient.js'

const router = useRouter()
const userStore = useUserStore()
const rentalStore = useRentalStore()
const adventureStore = useAdventuresStore()

const loading = ref(false)
const showDeleteModal = ref(false)
const showRequestsModal = ref(false)
const showReviewsModal = ref(false)
const adventureToDelete = ref(null)
const selectedAdventure = ref(null)
const loadingRequests = ref(false)
const adventureRequests = ref([])

// Data loaded from API
const allRentals = ref([])

const myAdventures = computed(() => {
  const userId = userStore.currentUser.value?.id
  if (!userId) return []
  const adventures = adventureStore.adventures.value || []
  
  // Enrich adventures with real request counts
  return adventures
    .filter(a => Number(a.ownerId) === Number(userId))
    .map(adventure => {
      // Count requests for this adventure
      const requests = allRentals.value.filter(r => Number(r.adventureRouteId) === Number(adventure.id))
      const pendingRequests = requests.filter(r => r.status === 'pending').length
      const completedRequests = requests.filter(r => r.status === 'completed').length
      
      return {
        ...adventure,
        requestsCount: requests.length,
        pendingRequestsCount: pendingRequests,
        completedCount: completedRequests
      }
    })
})

const totalRequests = computed(() => {
  return myAdventures.value.reduce((sum, adv) => sum + (adv.requestsCount || 0), 0)
})

const pendingRequestsTotal = computed(() => {
  return myAdventures.value.reduce((sum, adv) => sum + (adv.pendingRequestsCount || 0), 0)
})

const completedAdventures = computed(() => {
  return myAdventures.value.reduce((sum, adv) => sum + (adv.completedCount || 0), 0)
})

onMounted(async () => {
  loading.value = true
  try {
    await adventureStore.fetchAdventures()
    await rentalStore.loadVehicles()
    await rentalStore.loadRentals()
    
    // Load all rentals
    allRentals.value = rentalStore.state.rentals || []
  } catch (error) {
    console.error('Error loading data:', error)
  } finally {
    loading.value = false
  }
})

const editAdventure = (adventure) => {
  router.push(`/adventure/edit/${adventure.id}`)
}

const confirmDelete = (adventure) => {
  adventureToDelete.value = adventure
  showDeleteModal.value = true
}

const deleteAdventure = async () => {
  try {
    await adventureStore.deleteAdventure(adventureToDelete.value.id)
    showDeleteModal.value = false
    adventureToDelete.value = null
    alert('✅ Aventura eliminada exitosamente')
  } catch (error) {
    console.error('Error deleting adventure:', error)
    alert('❌ Error al eliminar la aventura')
  }
}

const viewRequests = async (adventure) => {
  selectedAdventure.value = adventure
  showRequestsModal.value = true
  loadingRequests.value = true
  
  try {
    // Filter rentals that are for THIS adventure route
    const adventureRentals = allRentals.value.filter(rental => 
      Number(rental.adventureRouteId) === Number(adventure.id)
    )
    
    adventureRequests.value = await Promise.all(adventureRentals.map(async (rental) => {
      let renterName = 'Usuario'
      let vehicle = null
      
      // Get renter info
      if (rental.renterId) {
        try {
          const response = await apiClient.get(`/users/${rental.renterId}`)
          renterName = `${response.firstName} ${response.lastName}`.trim()
        } catch (e) {
          console.log('Could not load renter info')
        }
      }
      
      // Get vehicle info if selected
      if (rental.vehicleId) {
        vehicle = rentalStore.state.vehicles.find(v => Number(v.id) === Number(rental.vehicleId))
      }
      
      return {
        ...rental,
        vehicleName: vehicle ? `${vehicle.brand} ${vehicle.model}` : 'Por seleccionar',
        renterName
      }
    }))
  } catch (error) {
    console.error('Error loading requests:', error)
    adventureRequests.value = []
  } finally {
    loadingRequests.value = false
  }
}

const approveRequest = async (request) => {
  try {
    // Determinar el estado según si el alquiler ya empezó
    const now = new Date()
    const startDate = new Date(request.startDate)
    const endDate = new Date(request.endDate)
    
    let newStatus = 'confirmed' // Por defecto, confirmado para el futuro
    
    // Si la fecha de inicio ya pasó y aún no terminó, está activo
    if (now >= startDate && now <= endDate) {
      newStatus = 'active'
    }
    
    // Update rental status
    await apiClient.patch(`/rentals/${request.id}`, {
      status: newStatus,
      acceptedAt: new Date().toISOString()
    })
    
    // Send notification to renter
    await apiClient.post('/notifications', {
      userId: request.renterId,
      type: 'adventure_accepted',
      title: '¡Solicitud de aventura aceptada!',
      message: `Tu solicitud para la aventura "${selectedAdventure.value.title}" ha sido aceptada. ¡Prepárate para tu aventura!`,
      relatedId: request.id,
      relatedType: 'rental',
      read: false,
      actionUrl: '/rental/my-rentals',
      actionLabel: 'Ver mis alquileres',
      metadata: {
        rentalId: request.id,
        adventureRouteId: selectedAdventure.value.id
      },
      createdAt: new Date().toISOString(),
      readAt: null
    })
    
    // Update local state
    const index = adventureRequests.value.findIndex(r => r.id === request.id)
    if (index !== -1) {
      adventureRequests.value[index].status = newStatus
    }
    
    // Also update allRentals to refresh counters
    const rentalIndex = allRentals.value.findIndex(r => r.id === request.id)
    if (rentalIndex !== -1) {
      allRentals.value[rentalIndex].status = newStatus
    }
    
    const statusMessage = newStatus === 'active' ? 'activada' : 'confirmada'
    alert(`✅ Solicitud aprobada y ${statusMessage} exitosamente`)
  } catch (error) {
    console.error('Error approving request:', error)
    alert('❌ Error al aprobar la solicitud')
  }
}

const rejectRequest = async (request) => {
  if (!confirm('¿Estás seguro de rechazar esta solicitud?')) return
  
  try {
    // Update rental status to rejected
    await apiClient.patch(`/rentals/${request.id}`, {
      status: 'rejected',
      rejectedAt: new Date().toISOString()
    })
    
    // Send notification to renter
    await apiClient.post('/notifications', {
      userId: request.renterId,
      type: 'adventure_rejected',
      title: 'Solicitud de aventura no aceptada',
      message: `Tu solicitud para la aventura "${selectedAdventure.value.title}" no ha sido aceptada en esta ocasión.`,
      relatedId: request.id,
      relatedType: 'rental',
      read: false,
      actionUrl: '/adventure',
      actionLabel: 'Explorar otras aventuras',
      metadata: {
        rentalId: request.id,
        adventureRouteId: selectedAdventure.value.id
      },
      createdAt: new Date().toISOString(),
      readAt: null
    })
    
    // Update local state
    const index = adventureRequests.value.findIndex(r => r.id === request.id)
    if (index !== -1) {
      adventureRequests.value[index].status = 'rejected'
    }
    
    // Also update allRentals to refresh counters
    const rentalIndex = allRentals.value.findIndex(r => r.id === request.id)
    if (rentalIndex !== -1) {
      allRentals.value[rentalIndex].status = 'rejected'
    }
    
    alert('Solicitud rechazada')
  } catch (error) {
    console.error('Error rejecting request:', error)
    alert('❌ Error al rechazar la solicitud')
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

const getStatusLabel = (status) => {
  const labels = {
    'pending': 'Pendiente',
    'accepted': 'Aceptada',
    'confirmed': 'Confirmada',
    'active': 'Activa',
    'completed': 'Completada',
    'rejected': 'Rechazada',
    'canceled': 'Cancelada'
  }
  return labels[status] || status
}

const getAdventureImage = (adventure) => {
  if (adventure.imageUrl) return adventure.imageUrl
  
  const type = adventure.type || 'adventure'
  const images = {
    beach: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    mountain: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    cultural: 'https://images.unsplash.com/photo-1555791018-6572a7ad7e0e?w=800',
    gastronomic: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
    adventure: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
    scenic: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'
  }
  
  return images[type] || images.adventure
}

// View reviews for an adventure
const viewReviews = async (adventure) => {
  selectedAdventure.value = adventure
  showReviewsModal.value = true
  loadingReviews.value = true
  
  try {
    // Filtrar reseñas directamente por adventureRouteId 
    // Las reseñas de aventura ahora tienen el campo adventureRouteId
    const reviews = allReviews.value.filter(rev => 
      Number(rev.adventureRouteId) === Number(adventure.id) && rev.type === 'adventure'
    )
    
    // Si no hay reseñas con adventureRouteId, buscar por rentals (compatibilidad con reseñas antiguas)
    let finalReviews = reviews
    if (reviews.length === 0) {
      const adventureRentals = allRentals.value.filter(r => 
        Number(r.adventureRouteId) === Number(adventure.id)
      )
      const adventureRentalIds = adventureRentals.map(r => r.id)
      finalReviews = allReviews.value.filter(rev => 
        adventureRentalIds.includes(rev.rentalId)
      )
    }
    
    // Enrich reviews with renter names
    adventureReviews.value = await Promise.all(finalReviews.map(async (review) => {
      let renterName = 'Usuario'
      
      if (review.renterId) {
        try {
          const response = await apiClient.get(`/users/${review.renterId}`)
          const renter = response
          renterName = `${renter.firstName} ${renter.lastName}`.trim()
        } catch (e) {
          console.log('Could not load reviewer info')
        }
      }
      
      return {
        ...review,
        renterName
      }
    }))
  } catch (error) {
    console.error('Error loading reviews:', error)
    adventureReviews.value = []
  } finally {
    loadingReviews.value = false
  }
}

// Calculate average rating for reviews
const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0
  const total = reviews.reduce((sum, r) => sum + (r.rating || 0), 0)
  return total / reviews.length
}
</script>

<style scoped>
.my-adventures-page {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
  background: linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #e0e0e0;
}

.header-content h1 {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #42b983 0%, #2c3e50 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.header-content p {
  margin: 0.5rem 0 0 0;
  color: #666;
  font-size: 1.1rem;
}

.btn-create {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  background: linear-gradient(135deg, #42b983 0%, #35926d 100%);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.3);
  transition: all 0.3s ease;
}

.btn-create:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(66, 185, 131, 0.4);
}

.btn-create .icon {
  font-size: 1.5rem;
  font-weight: bold;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 1.25rem;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  color: white;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.25rem;
}

/* Loading */
.loading-container {
  text-align: center;
  padding: 4rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #42b983;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Empty State - Enhanced */
.empty-state {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 24px;
  padding: 4rem 3rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 2px solid #e8f5e9;
  position: relative;
  overflow: hidden;
}

.empty-state::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(66, 185, 131, 0.1) 0%, transparent 70%);
  animation: pulse 4s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

.empty-animation {
  position: relative;
  height: 120px;
  margin-bottom: 2rem;
}

.floating-icon {
  position: absolute;
  font-size: 4rem;
  animation: float 3s ease-in-out infinite;
  left: 50%;
  transform: translateX(-50%);
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15));
}

.floating-icon.delay-1 {
  font-size: 3rem;
  left: 30%;
  animation-delay: 0.5s;
  opacity: 0.6;
}

.floating-icon.delay-2 {
  font-size: 3rem;
  left: 70%;
  animation-delay: 1s;
  opacity: 0.6;
}

@keyframes float {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-20px); }
}

.empty-content {
  position: relative;
  z-index: 1;
}

.empty-title {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #42b983 0%, #2c3e50 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
}

.empty-description {
  color: #555;
  font-size: 1.2rem;
  line-height: 1.8;
  max-width: 600px;
  margin: 0 auto 3rem;
}

.empty-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  text-align: left;
  padding: 1.5rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.feature-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  border-color: #42b983;
}

.feature-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.feature-text h4 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.1rem;
  font-weight: 700;
}

.feature-text p {
  margin: 0;
  color: #777;
  font-size: 0.95rem;
}

.btn-create-big {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 2.5rem;
  background: linear-gradient(135deg, #42b983 0%, #35926d 100%);
  color: white;
  text-decoration: none;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1.2rem;
  box-shadow: 0 8px 24px rgba(66, 185, 131, 0.4);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.btn-create-big::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s;
}

.btn-create-big:hover::before {
  left: 100%;
}

.btn-create-big:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 12px 32px rgba(66, 185, 131, 0.5);
}

.btn-icon {
  font-size: 1.5rem;
  animation: rotate-icon 2s linear infinite;
}

@keyframes rotate-icon {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-10deg); }
  75% { transform: rotate(10deg); }
}

.btn-arrow {
  font-size: 1.5rem;
  transition: transform 0.3s ease;
}

.btn-create-big:hover .btn-arrow {
  transform: translateX(5px);
}

.empty-tip {
  margin-top: 2rem;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
  border-radius: 50px;
  color: #856404;
  font-size: 0.95rem;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(255, 193, 7, 0.2);
}

.tip-icon {
  font-size: 1.5rem;
  animation: blink 2s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Adventures List */
.adventures-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

@media (max-width: 1200px) {
  .adventures-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .adventures-list {
    grid-template-columns: 1fr;
  }
}

.adventure-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.adventure-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.adventure-image {
  position: relative;
  height: 220px;
  overflow: hidden;
}

.adventure-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.adventure-card:hover .adventure-image img {
  transform: scale(1.05);
}

.adventure-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.adventure-badge.featured {
  background: rgba(255, 215, 0, 0.9);
  color: #2c3e50;
}

.adventure-badge.regular {
  background: rgba(66, 185, 131, 0.9);
  color: white;
}

.adventure-content {
  padding: 1.5rem;
}

.adventure-header h3 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin: 0 0 1rem 0;
  font-weight: 700;
}

.adventure-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  color: #666;
}

.adventure-description {
  color: #555;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.adventure-stats {
  display: flex;
  gap: 1.5rem;
  padding: 1rem 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  margin-bottom: 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

.adventure-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-action {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-requests {
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  color: white;
}

.btn-requests:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

.btn-edit {
  background: linear-gradient(135deg, #f39c12 0%, #d68910 100%);
  color: white;
}

.btn-edit:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(243, 156, 18, 0.3);
}

.btn-delete {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  color: white;
}

.btn-delete:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-large {
  max-width: 800px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.5rem;
  color: #2c3e50;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-close:hover {
  background: #f0f0f0;
  color: #333;
}

.modal-body {
  margin-bottom: 1.5rem;
}

.modal-body h4 {
  color: #42b983;
  margin-bottom: 1rem;
}

.warning-text {
  color: #e74c3c;
  font-weight: 600;
  margin-top: 0.5rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-cancel {
  padding: 0.75rem 1.5rem;
  border: 1px solid #ddd;
  background: white;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background: #f5f5f5;
}

.btn-confirm-delete {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-confirm-delete:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
}

/* Requests List */
.loading-small {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.spinner-small {
  width: 30px;
  height: 30px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #42b983;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 0.5rem;
}

.empty-requests {
  text-align: center;
  padding: 3rem;
  color: #999;
}

.requests-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.request-item {
  background: #f8f9fa;
  padding: 1.25rem;
  border-radius: 12px;
  border-left: 4px solid #42b983;
}

.request-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.requester-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.requester-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #42b983 0%, #35926d 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
}

.requester-name {
  font-weight: 600;
  color: #2c3e50;
}

.request-date {
  font-size: 0.85rem;
  color: #999;
}

.request-status {
  padding: 0.375rem 0.875rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.request-status.pending {
  background: #fff3cd;
  color: #856404;
}

.request-status.accepted,
.request-status.confirmed {
  background: #d4edda;
  color: #155724;
}

.request-status.active {
  background: #d1ecf1;
  color: #0c5460;
}

.request-status.completed {
  background: #d4edda;
  color: #155724;
}

.request-status.rejected,
.request-status.canceled {
  background: #f8d7da;
  color: #721c24;
}

.request-details {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 0.75rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #555;
}

.request-notes {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e0e0e0;
  font-size: 0.9rem;
  color: #666;
}

.request-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e0e0e0;
}

.btn-approve {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #42b983 0%, #35926d 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-approve:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.3);
}

.btn-reject {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-reject:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
}

@media (max-width: 768px) {
  .my-adventures-page {
    padding: 1rem;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .adventures-list {
    grid-template-columns: 1fr;
  }

  .adventure-actions {
    flex-direction: column;
  }

  .modal-content {
    padding: 1.5rem;
  }
}

/* Stat pending indicator */
.stat-pending {
  font-size: 0.75rem;
  color: #f39c12;
  font-weight: 600;
  margin-top: 0.25rem;
}

/* Adventure stats pending */
.stat-item.pending {
  color: #f39c12;
  font-weight: 600;
  background: #fff3cd;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
}

/* Button badges */
.btn-action .badge {
  background: #e74c3c;
  color: white;
  font-size: 0.7rem;
  padding: 0.15rem 0.4rem;
  border-radius: 10px;
  margin-left: 0.25rem;
  font-weight: 700;
}

.btn-action .badge-reviews {
  background: #f39c12;
  color: white;
  font-size: 0.7rem;
  padding: 0.15rem 0.4rem;
  border-radius: 10px;
  margin-left: 0.25rem;
  font-weight: 700;
}

.btn-action.has-pending {
  animation: pulse-btn 2s infinite;
}

@keyframes pulse-btn {
  0%, 100% { box-shadow: 0 0 0 0 rgba(52, 152, 219, 0.4); }
  50% { box-shadow: 0 0 0 8px rgba(52, 152, 219, 0); }
}

/* Reviews button */
.btn-reviews {
  background: linear-gradient(135deg, #f39c12 0%, #d68910 100%);
  color: white;
}

.btn-reviews:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(243, 156, 18, 0.3);
}

/* Reviews Modal Styles */
.reviews-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e0e0e0;
}

.reviews-header h4 {
  color: #42b983;
  margin: 0;
  font-size: 1.25rem;
}

.reviews-summary {
  text-align: center;
}

.summary-rating {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
}

.big-star {
  font-size: 1.5rem;
}

.rating-value {
  font-size: 2rem;
  font-weight: 700;
  color: #f39c12;
}

.rating-max {
  font-size: 1rem;
  color: #999;
}

.summary-count {
  font-size: 0.85rem;
  color: #666;
  margin-top: 0.25rem;
}

.empty-reviews {
  text-align: center;
  padding: 3rem 2rem;
  color: #999;
}

.empty-reviews .empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-reviews p {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.empty-reviews .empty-hint {
  font-size: 0.9rem;
  color: #aaa;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.review-item {
  background: #f8f9fa;
  padding: 1.25rem;
  border-radius: 12px;
  border-left: 4px solid #f39c12;
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
  gap: 0.75rem;
}

.reviewer-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f39c12 0%, #d68910 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
}

.reviewer-name {
  font-weight: 600;
  color: #2c3e50;
}

.review-date {
  font-size: 0.85rem;
  color: #999;
}

.review-rating {
  display: flex;
  gap: 0.125rem;
}

.review-rating .star {
  font-size: 1.1rem;
  filter: grayscale(100%);
}

.review-rating .star.filled {
  filter: none;
}

.review-comment {
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
  font-style: italic;
  color: #555;
  line-height: 1.5;
}

.review-no-comment {
  color: #aaa;
  font-size: 0.9rem;
}
</style>
