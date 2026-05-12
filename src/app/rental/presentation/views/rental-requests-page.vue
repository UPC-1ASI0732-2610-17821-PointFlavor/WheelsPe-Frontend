<template>
  <div class="rental-requests-page">
    <div class="page-header">
      <div class="header-content">
        <div class="icon-wrapper">
          <i class="pi pi-inbox"></i>
        </div>
        <h1>{{ t('rental.rentalRequests.title') }}</h1>
        <p class="subtitle">{{ t('rental.rentalRequests.subtitle') }}</p>
      </div>
    </div>

    <div v-if="loading" class="loading-container">
      <i class="pi pi-spin pi-spinner"></i>
      <p>{{ t('rental.rentalRequests.loading') }}</p>
    </div>

    <div v-else class="content-container">
      <!-- Tabs de filtrado -->
      <div class="filter-tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.value"
          :class="['tab', { active: activeTab === tab.value }]"
          @click="activeTab = tab.value"
        >
          <i :class="tab.icon"></i>
          <span>{{ tab.label }}</span>
          <span class="badge" v-if="getCountByStatus(tab.value) > 0">
            {{ getCountByStatus(tab.value) }}
          </span>
        </button>
      </div>

      <!-- Lista de solicitudes -->
      <div v-if="filteredRequests.length === 0" class="empty-state">
        <i class="pi pi-inbox"></i>
        <h3>{{ t('rental.rentalRequests.empty.title') }}</h3>
        <p>{{ t('rental.rentalRequests.empty.message') }}</p>
      </div>

      <div v-else class="requests-grid">
        <div 
          v-for="request in filteredRequests" 
          :key="request.id"
          class="request-card"
          :class="`status-${request.status}`"
        >
          <!-- Header del card -->
          <div class="card-header">
            <div class="vehicle-info">
              <img 
                :src="request.vehicle?.images?.[0] || 'https://via.placeholder.com/80'" 
                alt="Vehicle"
                class="vehicle-thumbnail"
              />
              <div>
                <h3>{{ request.vehicle?.brand }} {{ request.vehicle?.model }}</h3>
                <p class="plate">{{ request.vehicle?.licensePlate }}</p>
              </div>
            </div>
            <div class="badges-container">
              <span v-if="request.adventureRouteId" class="adventure-badge">
                <i class="pi pi-compass"></i>
                Aventura
              </span>
              <span :class="`status-badge status-${request.status}`">
                {{ statusLabels[request.status] }}
              </span>
            </div>
          </div>

          <!-- Información del solicitante -->
          <div class="card-body">
            <div class="info-row renter-row">
              <i class="pi pi-user"></i>
              <div class="renter-info">
                <span class="label">Solicitante:</span>
                <span class="value">{{ request.renter?.firstName }} {{ request.renter?.lastName }}</span>
              </div>
              <button class="btn-view-user" @click="openUserProfile(request.renter, request)">
                <i class="pi pi-eye"></i>
                Ver perfil
              </button>
            </div>

            <div class="info-row">
              <i class="pi pi-calendar"></i>
              <div>
                <span class="label">Período:</span>
                <span class="value">
                  {{ formatDate(request.startDate) }} - {{ formatDate(request.endDate) }}
                </span>
              </div>
            </div>

            <div class="info-row">
              <i class="pi pi-clock"></i>
              <div>
                <span class="label">Duración:</span>
                <span class="value">{{ calculateDays(request.startDate, request.endDate) }} días</span>
              </div>
            </div>

            <div class="info-row">
              <i class="pi pi-dollar"></i>
              <div>
                <span class="label">Total:</span>
                <span class="value price">S/ {{ (request.totalPrice || request.totalAmount || 0).toFixed(2) }}</span>
              </div>
            </div>

            <div v-if="request.message" class="info-row message">
              <i class="pi pi-comment"></i>
              <div>
                <span class="label">Mensaje:</span>
                <p class="value">{{ request.message }}</p>
              </div>
            </div>
          </div>

          <!-- Acciones -->
          <div class="card-actions" v-if="request.status === 'pending'">
            <pv-button 
              label="Rechazar" 
              severity="danger"
              outlined
              icon="pi pi-times"
              @click="handleReject(request)"
              :loading="processingId === request.id"
            />
            <pv-button 
              label="Aceptar" 
              severity="success"
              icon="pi pi-check"
              @click="handleAccept(request)"
              :loading="processingId === request.id"
            />
          </div>

          <!-- Acción para calificar después de completar -->
          <div class="card-actions" v-else-if="request.status === 'completed' && !request.ownerRatedRenter">
            <pv-button 
              label="Calificar inquilino" 
              severity="warning"
              icon="pi pi-star"
              @click="openRateUserModal(request)"
            />
          </div>

          <div class="card-footer" v-else>
            <small>
              <i class="pi pi-info-circle"></i>
              <template v-if="request.status === 'confirmed'">
                Confirmada el {{ formatDate(request.acceptedAt) }}
              </template>
              <template v-else-if="request.status === 'active'">
                Alquiler en curso desde {{ formatDate(request.startDate) }}
              </template>
              <template v-else-if="request.status === 'completed'">
                <template v-if="request.ownerRatedRenter">
                  ✅ Inquilino calificado
                </template>
                <template v-else>
                  Completada el {{ formatDate(request.endDate) }}
                </template>
              </template>
              <template v-else-if="request.status === 'rejected'">
                Rechazada el {{ formatDate(request.respondedAt) }}
              </template>
            </small>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Ver Perfil del Usuario -->
    <Teleport to="body">
      <div v-if="showUserProfileModal" class="modal-overlay" @click.self="closeUserProfile">
        <div class="user-profile-modal">
          <button class="btn-close-modal" @click="closeUserProfile">
            <i class="pi pi-times"></i>
          </button>
          
          <div class="profile-header">
            <div class="profile-avatar">
              <i class="pi pi-user"></i>
            </div>
            <h2>{{ selectedUser?.firstName }} {{ selectedUser?.lastName }}</h2>
            <p class="profile-email">{{ selectedUser?.email }}</p>
            
            <div class="profile-rating-summary">
              <div class="rating-big">
                <i class="pi pi-star-fill"></i>
                <span>{{ userAverageRating.toFixed(1) }}</span>
              </div>
              <span class="rating-text">{{ userReviews.length }} calificaciones como inquilino</span>
            </div>
          </div>

          <div class="profile-stats">
            <div class="stat-item">
              <i class="pi pi-car"></i>
              <div>
                <span class="stat-value">{{ selectedUser?.stats?.totalRentals || 0 }}</span>
                <span class="stat-label">Alquileres</span>
              </div>
            </div>
            <div class="stat-item">
              <i class="pi pi-check-circle"></i>
              <div>
                <span class="stat-value">{{ selectedUser?.stats?.completedRentals || 0 }}</span>
                <span class="stat-label">Completados</span>
              </div>
            </div>
            <div class="stat-item">
              <i class="pi pi-calendar"></i>
              <div>
                <span class="stat-value">{{ getMemberSince(selectedUser?.createdAt) }}</span>
                <span class="stat-label">Miembro desde</span>
              </div>
            </div>
          </div>

          <!-- Rating Bars -->
          <div class="user-rating-bars">
            <h4>Distribución de calificaciones</h4>
            <div class="rating-bars-container">
              <div v-for="star in 5" :key="star" class="rating-bar-row">
                <span class="star-num">{{ 6 - star }}</span>
                <i class="pi pi-star-fill"></i>
                <div class="bar-bg">
                  <div class="bar-fill" :style="{ width: getUserRatingPercentage(6 - star) + '%' }"></div>
                </div>
                <span class="bar-count">{{ getUserRatingCount(6 - star) }}</span>
              </div>
            </div>
          </div>

          <!-- Reseñas del Usuario -->
          <div class="user-reviews-section">
            <h4>Opiniones de propietarios</h4>
            
            <div v-if="userReviews.length === 0" class="no-user-reviews">
              <i class="pi pi-comments"></i>
              <p>Este usuario aún no tiene calificaciones</p>
            </div>

            <div v-else class="user-reviews-list">
              <div v-for="review in userReviews" :key="review.id" class="user-review-card">
                <div class="review-card-header">
                  <div class="reviewer-info">
                    <div class="reviewer-avatar-small">
                      <i class="pi pi-user"></i>
                    </div>
                    <div>
                      <span class="reviewer-name">Propietario verificado</span>
                      <span class="review-date">{{ formatReviewDate(review.createdAt) }}</span>
                    </div>
                  </div>
                  <div class="review-rating">
                    <i v-for="s in 5" :key="s" 
                       :class="s <= review.rating ? 'pi pi-star-fill' : 'pi pi-star'"></i>
                  </div>
                </div>
                <p class="review-text" v-if="review.comment">{{ review.comment }}</p>
                <p class="review-text no-comment" v-else>Sin comentario adicional</p>
              </div>
            </div>
          </div>

          <div class="profile-actions">
            <pv-button 
              v-if="selectedRequest?.status === 'pending'"
              label="Aceptar solicitud" 
              icon="pi pi-check"
              severity="success"
              @click="handleAcceptFromModal"
            />
            <pv-button 
              label="Cerrar" 
              outlined
              @click="closeUserProfile"
            />
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal Calificar Usuario -->
    <Teleport to="body">
      <div v-if="showRateUserModal" class="modal-overlay" @click.self="closeRateUserModal">
        <div class="rate-user-modal">
          <button class="btn-close-modal" @click="closeRateUserModal">
            <i class="pi pi-times"></i>
          </button>

          <div class="rate-header">
            <div class="rate-avatar">
              <i class="pi pi-user"></i>
            </div>
            <h2>Calificar a {{ ratingUser?.firstName }}</h2>
            <p>¿Cómo fue tu experiencia con este inquilino?</p>
          </div>

          <div class="star-rating-input">
            <button 
              v-for="star in 5" 
              :key="star" 
              class="star-btn"
              :class="{ active: star <= ratingValue }"
              @click="ratingValue = star"
              @mouseover="hoverRating = star"
              @mouseleave="hoverRating = 0"
            >
              <i :class="star <= (hoverRating || ratingValue) ? 'pi pi-star-fill' : 'pi pi-star'"></i>
            </button>
            <span class="rating-label">{{ getRatingLabel(ratingValue) }}</span>
          </div>

          <div class="rating-comment-input">
            <label>Comentario (opcional)</label>
            <textarea 
              v-model="ratingComment" 
              placeholder="Cuéntanos sobre tu experiencia con este inquilino..."
              rows="4"
            ></textarea>
          </div>

          <div class="rate-actions">
            <pv-button 
              label="Cancelar" 
              outlined
              @click="closeRateUserModal"
            />
            <pv-button 
              label="Enviar calificación" 
              icon="pi pi-send"
              :disabled="ratingValue === 0"
              :loading="submittingRating"
              @click="submitUserRating"
            />
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/app/iam/application/user.store'
import { apiClient } from '@/app/shared/infrastructure/apiClient.js'

const { t } = useI18n()
const userStore = useUserStore()
const loading = ref(true)
const requests = ref([])
const activeTab = ref('all')
const processingId = ref(null)

// User Profile Modal
const showUserProfileModal = ref(false)
const selectedUser = ref(null)
const selectedRequest = ref(null)
const userReviews = ref([])

// Rate User Modal
const showRateUserModal = ref(false)
const ratingUser = ref(null)
const ratingRental = ref(null)
const ratingValue = ref(0)
const hoverRating = ref(0)
const ratingComment = ref('')
const submittingRating = ref(false)

const tabs = [
  { label: t('rental.rentalRequests.tabs.all'), value: 'all', icon: 'pi pi-list' },
  { label: t('rental.rentalRequests.tabs.pending'), value: 'pending', icon: 'pi pi-clock' },
  { label: t('rental.rentalRequests.tabs.confirmed'), value: 'confirmed', icon: 'pi pi-check-circle' },
  { label: t('rental.rentalRequests.tabs.active'), value: 'active', icon: 'pi pi-play-circle' },
  { label: t('rental.rentalRequests.tabs.completed'), value: 'completed', icon: 'pi pi-check' },
  { label: t('rental.rentalRequests.tabs.rejected'), value: 'rejected', icon: 'pi pi-times-circle' }
]

const statusLabels = {
  all: '',
  pending: t('rental.rentalRequests.tabs.pending'),
  confirmed: t('rental.rentalRequests.tabs.confirmed'),
  active: t('rental.rentalRequests.tabs.active'),
  completed: t('rental.rentalRequests.tabs.completed'),
  rejected: t('rental.rentalRequests.tabs.rejected')
}

const filteredRequests = computed(() => {
  if (activeTab.value === 'all') return requests.value
  return requests.value.filter(r => r.status === activeTab.value)
})

// User rating computed
const userAverageRating = computed(() => {
  if (userReviews.value.length === 0) return 0
  const sum = userReviews.value.reduce((acc, r) => acc + r.rating, 0)
  return sum / userReviews.value.length
})

function getUserRatingCount(stars) {
  return userReviews.value.filter(r => r.rating === stars).length
}

function getUserRatingPercentage(stars) {
  if (userReviews.value.length === 0) return 0
  return (getUserRatingCount(stars) / userReviews.value.length) * 100
}

function getRatingLabel(rating) {
  const labels = {
    0: 'Selecciona una calificación',
    1: 'Muy malo',
    2: 'Malo',
    3: 'Regular',
    4: 'Bueno',
    5: 'Excelente'
  }
  return labels[rating]
}

function getMemberSince(dateString) {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-PE', { month: 'short', year: 'numeric' })
}

function formatReviewDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return 'Hoy'
  if (days === 1) return 'Ayer'
  if (days < 7) return `Hace ${days} días`
  if (days < 30) return `Hace ${Math.floor(days / 7)} semanas`
  return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })
}

// User Profile Modal Functions
async function openUserProfile(user, request) {
  selectedUser.value = user
  selectedRequest.value = request
  showUserProfileModal.value = true
  
  // Cargar reseñas del usuario
  try {
    const reviews = await apiClient.get('/user-reviews')
    userReviews.value = reviews.filter(r => 
      Number(r.reviewedUserId) === Number(user.id) && r.type === 'owner_to_renter'
    ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  } catch (error) {
    console.error('Error loading user reviews:', error)
    userReviews.value = []
  }
}

function closeUserProfile() {
  showUserProfileModal.value = false
  selectedUser.value = null
  selectedRequest.value = null
  userReviews.value = []
}

async function handleAcceptFromModal() {
  if (selectedRequest.value) {
    await handleAccept(selectedRequest.value)
    closeUserProfile()
  }
}

// Rate User Modal Functions
function openRateUserModal(request) {
  ratingUser.value = request.renter
  ratingRental.value = request
  ratingValue.value = 0
  ratingComment.value = ''
  showRateUserModal.value = true
}

function closeRateUserModal() {
  showRateUserModal.value = false
  ratingUser.value = null
  ratingRental.value = null
  ratingValue.value = 0
  ratingComment.value = ''
}

async function submitUserRating() {
  if (ratingValue.value === 0 || !ratingUser.value || !ratingRental.value) return
  
  submittingRating.value = true
  
  try {
    // Crear la reseña del usuario
    const reviewData = {
      reviewerId: userStore.currentUser.value?.id,
      reviewedUserId: ratingUser.value.id,
      rentalId: ratingRental.value.id,
      rating: ratingValue.value,
      comment: ratingComment.value || '',
      type: 'owner_to_renter',
      createdAt: new Date().toISOString()
    }
    
    await apiClient.post('/user-reviews', reviewData)
    
    // Marcar el rental como calificado por el owner
    await apiClient.patch(`/rentals/${ratingRental.value.id}`, {
      ownerRatedRenter: true,
      ownerRatingForRenter: ratingValue.value
    })
    
    // Actualizar localmente
    const idx = requests.value.findIndex(r => r.id === ratingRental.value.id)
    if (idx !== -1) {
      requests.value[idx].ownerRatedRenter = true
    }
    
    // Crear notificación para el renter
    try {
      const starsEmoji = '⭐'.repeat(ratingValue.value)
      const commentPart = ratingComment.value ? ` "${ratingComment.value}"` : ''
      const notification = {
        userId: ratingUser.value.id,
        type: 'user_review_received',
        title: '⭐ Nueva calificación recibida',
        body: `Has recibido una calificación de ${starsEmoji} como inquilino.${commentPart}`,
        relatedId: ratingRental.value.id,
        relatedType: 'user-review',
        read: false,
        actionUrl: '/profile',
        actionLabel: 'Ver mi perfil',
        metadata: {
          rentalId: ratingRental.value.id,
          rating: ratingValue.value
        },
        createdAt: new Date().toISOString(),
        readAt: null
      }
      
      await apiClient.post('/notifications', notification)
    } catch (err) {
      console.error('Error creating notification:', err)
    }
    
    alert('✅ ¡Calificación enviada exitosamente!')
    closeRateUserModal()
  } catch (error) {
    console.error('Error submitting rating:', error)
    alert('Error al enviar la calificación')
  } finally {
    submittingRating.value = false
  }
}

function getCountByStatus(status) {
  if (status === 'all') return requests.value.length
  return requests.value.filter(r => r.status === status).length
}

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-PE', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  })
}

function calculateDays(start, end) {
  if (!start || !end) return 0
  const startDate = new Date(start)
  const endDate = new Date(end)
  const diffTime = Math.abs(endDate - startDate)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

async function handleAccept(request) {
  if (!confirm(`¿Aceptar la solicitud de ${request.renter?.firstName}?`)) return
  
  try {
    processingId.value = request.id
    
    // Determinar el estado según si el alquiler ya empezó
    const now = new Date()
    const startDate = new Date(request.startDate)
    const endDate = new Date(request.endDate)
    
    let newStatus = 'confirmed' // Por defecto, alquiler confirmado para el futuro
    
    // Si la fecha de inicio ya pasó y aún no terminó, está activo
    if (now >= startDate && now <= endDate) {
      newStatus = 'active'
    }
    
    await apiClient.patch(`/rentals/${request.id}`, {
      status: newStatus,
      acceptedAt: new Date().toISOString()
    })
    
    // Crear notificación para el renter
    try {
      const notification = {
        userId: request.renterId,
        type: 'rental_accepted',
        title: '¡Solicitud aceptada!',
        body: `Tu solicitud de alquiler para ${request.vehicle?.brand} ${request.vehicle?.model} ha sido aceptada. ¡Prepárate para tu aventura!`,
        relatedId: request.id,
        relatedType: 'rental',
        read: false,
        actionUrl: `/rental/my-rentals`,
        actionLabel: 'Ver mis alquileres',
        metadata: {
          rentalId: request.id,
          vehicleId: request.vehicleId,
          ownerId: userStore.currentUser.value?.id
        },
        createdAt: new Date().toISOString(),
        readAt: null
      }
      
      await apiClient.post('/notifications', notification)
      console.log('🔔 Notificación creada para renter:', request.renterId)
    } catch (err) {
      console.error('Error creando notificación:', err)
    }
    
    // Actualizar localmente
    const idx = requests.value.findIndex(r => r.id === request.id)
    if (idx !== -1) {
      requests.value[idx].status = newStatus
      requests.value[idx].acceptedAt = new Date().toISOString()
    }
    
    const statusMessage = newStatus === 'active' ? 'activado' : 'confirmado'
    alert(`✅ Solicitud aceptada y alquiler ${statusMessage} exitosamente`)
  } catch (error) {
    console.error('Error accepting request:', error)
    alert('Error al aceptar la solicitud')
  } finally {
    processingId.value = null
  }
}

async function handleReject(request) {
  if (!confirm(`¿Rechazar la solicitud de ${request.renter?.firstName}?`)) return
  
  try {
    processingId.value = request.id
    
    await apiClient.patch(`/rentals/${request.id}`, {
      status: 'rejected',
      respondedAt: new Date().toISOString()
    })
    
    // Actualizar localmente
    const idx = requests.value.findIndex(r => r.id === request.id)
    if (idx !== -1) {
      requests.value[idx].status = 'rejected'
      requests.value[idx].respondedAt = new Date().toISOString()
    }
    
    alert('Solicitud rechazada')
  } catch (error) {
    console.error('Error rejecting request:', error)
    alert('Error al rechazar la solicitud')
  } finally {
    processingId.value = null
  }
}

async function loadRequests() {
  try {
    loading.value = true
    
    // Obtener todos los rentals
    const allRentals = await apiClient.get('/rentals')
    
    // Obtener vehículos del propietario
    const vehicles = await apiClient.get('/vehicles')
    const myVehicles = vehicles.filter(v => 
      Number(v.ownerId) === Number(userStore.currentUser.value?.id)
    )
    const myVehicleIds = new Set(myVehicles.map(v => v.id))
    
    // Obtener rutas de aventura del propietario
    const adventures = await apiClient.get('/adventure-routes')
    const myAdventures = adventures.filter(a => 
      Number(a.ownerId) === Number(userStore.currentUser.value?.id)
    )
    const myAdventureIds = new Set(myAdventures.map(a => a.id))
    
    // Filtrar rentals: de mis vehículos O de mis aventuras O donde soy el ownerId
    const myRentals = allRentals.filter(r => {
      // Rental de mi vehículo
      if (r.vehicleId && myVehicleIds.has(String(r.vehicleId))) return true
      // Rental de mi aventura
      if (r.adventureRouteId && myAdventureIds.has(Number(r.adventureRouteId))) return true
      // Soy el owner directamente
      if (Number(r.ownerId) === Number(userStore.currentUser.value?.id)) return true
      return false
    })
    
    // Obtener información completa de usuarios
    const users = await apiClient.get('/users')
    
    // Enriquecer los datos
    requests.value = myRentals.map(rental => {
      const vehicle = myVehicles.find(v => String(v.id) === String(rental.vehicleId))
      const renter = users.find(u => u.id === Number(rental.renterId))
      const adventure = myAdventures.find(a => a.id === Number(rental.adventureRouteId))
      
      // Si es rental de aventura y no tiene vehículo, crear info del vehículo desde la aventura
      let vehicleInfo = vehicle
      if (!vehicleInfo && adventure) {
        vehicleInfo = {
          brand: adventure.vehicleName?.split(' ')[0] || 'Aventura',
          model: adventure.vehicleName?.split(' ').slice(1).join(' ') || adventure.name,
          licensePlate: adventure.destination || '',
          images: adventure.imageUrl ? [adventure.imageUrl] : []
        }
      }
      
      return {
        ...rental,
        vehicle: vehicleInfo,
        renter,
        adventure
      }
    })
    
    // Ordenar por fecha (más recientes primero)
    requests.value.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.startDate)
      const dateB = new Date(b.createdAt || b.startDate)
      return dateB - dateA
    })
    
  } catch (error) {
    console.error('Error loading rental requests:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadRequests()
})
</script>

<style scoped>
.rental-requests-page {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  min-height: 100vh;
}

.page-header {
  margin-bottom: 3rem;
  text-align: center;
  animation: fadeInDown 0.6s ease;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #FF6F00 0%, #FF8F00 100%);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(255, 111, 0, 0.3);
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { 
    transform: translateY(0); 
  }
  50% { 
    transform: translateY(-10px); 
  }
}

.icon-wrapper i {
  font-size: 2.5rem;
  color: white;
}

.page-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary-dark);
  margin: 0;
  background: linear-gradient(135deg, #2C3E50 0%, #FF6F00 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  color: var(--neutral-gray);
  font-size: 1.125rem;
  margin: 0;
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

.content-container {
  background: white;
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  animation: fadeInUp 0.6s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.filter-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e0e0e0;
  flex-wrap: wrap;
}

.tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-weight: 600;
  color: var(--neutral-gray);
  transition: all 0.3s;
  position: relative;
}

.tab:hover {
  color: var(--accent-orange);
  background: rgba(255, 111, 0, 0.05);
}

.tab.active {
  color: var(--accent-orange);
  border-bottom-color: var(--accent-orange);
}

.tab .badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 0 0.5rem;
  background: var(--accent-orange);
  color: white;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.empty-state i {
  font-size: 5rem;
  color: #e0e0e0;
  margin-bottom: 1.5rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary-dark);
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  color: var(--neutral-gray);
  margin: 0;
}

.requests-grid {
  display: grid;
  gap: 1.5rem;
}

.request-card {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.request-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.request-card.status-pending {
  border-left: 4px solid #FFA726;
}

.request-card.status-accepted {
  border-left: 4px solid #66BB6A;
}

.request-card.status-rejected {
  border-left: 4px solid #EF5350;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f5f5f5;
}

.vehicle-info {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.vehicle-thumbnail {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 12px;
  border: 2px solid #e0e0e0;
}

.vehicle-info h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary-dark);
  margin: 0 0 0.25rem 0;
}

.plate {
  font-size: 0.875rem;
  color: var(--neutral-gray);
  font-weight: 600;
  margin: 0;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
}

.badges-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-end;
}

.adventure-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.4rem 0.875rem;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
}

.adventure-badge i {
  font-size: 0.875rem;
}

.status-badge.status-pending {
  background: #FFF3E0;
  color: #F57C00;
}

.status-badge.status-confirmed {
  background: #E3F2FD;
  color: #1565C0;
}

.status-badge.status-active {
  background: #E8F5E9;
  color: #2E7D32;
}

.status-badge.status-completed {
  background: #F3E5F5;
  color: #6A1B9A;
}

.status-badge.status-rejected {
  background: #FFEBEE;
  color: #C62828;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.info-row {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.info-row i {
  font-size: 1.25rem;
  color: var(--accent-orange);
  margin-top: 0.125rem;
  flex-shrink: 0;
}

.info-row .label {
  font-weight: 600;
  color: var(--neutral-gray);
  font-size: 0.875rem;
  display: block;
  margin-bottom: 0.25rem;
}

.info-row .value {
  color: var(--primary-dark);
  font-size: 1rem;
}

.info-row .value.price {
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--accent-orange);
}

.info-row.message {
  background: #f5f7fa;
  padding: 1rem;
  border-radius: 8px;
}

.info-row.message p {
  margin: 0;
  line-height: 1.5;
}

.card-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.card-footer {
  padding-top: 1rem;
  border-top: 2px solid #f5f5f5;
  text-align: center;
}

.card-footer small {
  color: var(--neutral-gray);
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

/* Responsive */
@media (max-width: 768px) {
  .rental-requests-page {
    padding: 1rem;
  }

  .content-container {
    padding: 1.5rem;
  }

  .page-header h1 {
    font-size: 1.75rem;
  }

  .icon-wrapper {
    width: 60px;
    height: 60px;
  }

  .icon-wrapper i {
    font-size: 2rem;
  }

  .filter-tabs {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .card-header {
    flex-direction: column;
    gap: 1rem;
  }

  .vehicle-info {
    width: 100%;
  }

  .card-actions {
    flex-direction: column;
  }

  .card-actions button {
    width: 100%;
  }
}

/* PrimeVue Overrides */
:deep(.p-button) {
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s;
}

:deep(.p-button:not(:disabled):hover) {
  transform: translateY(-2px);
}

/* Renter Row with View Profile Button */
.renter-row {
  display: flex;
  align-items: center;
}

.renter-info {
  flex: 1;
}

.btn-view-user {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #FF6F00 0%, #FF8F00 100%);
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(255, 111, 0, 0.3);
}

.btn-view-user:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 111, 0, 0.4);
}

.btn-view-user i {
  font-size: 0.875rem;
}

/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.btn-close-modal {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: #f5f5f5;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
}

.btn-close-modal:hover {
  background: #FF6F00;
  color: white;
  transform: rotate(90deg);
}

/* User Profile Modal */
.user-profile-modal {
  background: white;
  border-radius: 20px;
  max-width: 500px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  padding: 2rem;
  position: relative;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.profile-header {
  text-align: center;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #f5f5f5;
  margin-bottom: 1.5rem;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF6F00 0%, #FF8F00 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  box-shadow: 0 8px 24px rgba(255, 111, 0, 0.3);
}

.profile-avatar i {
  font-size: 2.5rem;
  color: white;
}

.profile-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2C3E50;
  margin: 0 0 0.25rem 0;
}

.profile-email {
  color: #999;
  font-size: 0.875rem;
  margin: 0 0 1rem 0;
}

.profile-rating-summary {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.rating-big {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.rating-big i {
  color: #FFB800;
  font-size: 1.5rem;
}

.rating-big span {
  font-size: 2rem;
  font-weight: 800;
  color: #2C3E50;
}

.rating-text {
  font-size: 0.875rem;
  color: #666;
}

.profile-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 12px;
}

.stat-item i {
  font-size: 1.25rem;
  color: #FF6F00;
}

.stat-value {
  display: block;
  font-size: 1.25rem;
  font-weight: 700;
  color: #2C3E50;
}

.stat-label {
  font-size: 0.7rem;
  color: #999;
  text-transform: uppercase;
}

/* User Rating Bars */
.user-rating-bars {
  margin-bottom: 1.5rem;
}

.user-rating-bars h4 {
  font-size: 0.9rem;
  font-weight: 600;
  color: #2C3E50;
  margin: 0 0 1rem 0;
}

.rating-bars-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.rating-bar-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.star-num {
  font-size: 0.8rem;
  font-weight: 600;
  color: #666;
  width: 12px;
}

.rating-bar-row .pi-star-fill {
  color: #FFB800;
  font-size: 0.875rem;
}

.bar-bg {
  flex: 1;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #FF6F00, #FFB800);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.bar-count {
  font-size: 0.75rem;
  color: #999;
  width: 24px;
  text-align: right;
}

/* User Reviews Section */
.user-reviews-section {
  margin-bottom: 1.5rem;
}

.user-reviews-section h4 {
  font-size: 0.9rem;
  font-weight: 600;
  color: #2C3E50;
  margin: 0 0 1rem 0;
}

.no-user-reviews {
  text-align: center;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 12px;
}

.no-user-reviews i {
  font-size: 2rem;
  color: #ddd;
  margin-bottom: 0.5rem;
}

.no-user-reviews p {
  color: #999;
  margin: 0;
  font-size: 0.875rem;
}

.user-reviews-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 200px;
  overflow-y: auto;
}

.user-review-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1rem;
}

.review-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.reviewer-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.reviewer-avatar-small {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2C3E50 0%, #34495E 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.reviewer-avatar-small i {
  color: white;
  font-size: 0.875rem;
}

.reviewer-name {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #2C3E50;
}

.review-date {
  display: block;
  font-size: 0.7rem;
  color: #999;
}

.review-rating {
  display: flex;
  gap: 2px;
}

.review-rating i {
  font-size: 0.75rem;
  color: #FFB800;
}

.review-rating .pi-star {
  color: #ddd;
}

.review-text {
  font-size: 0.85rem;
  color: #444;
  margin: 0;
  line-height: 1.5;
}

.review-text.no-comment {
  color: #999;
  font-style: italic;
}

.profile-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

/* Rate User Modal */
.rate-user-modal {
  background: white;
  border-radius: 20px;
  max-width: 450px;
  width: 100%;
  padding: 2rem;
  position: relative;
  animation: slideUp 0.3s ease;
}

.rate-header {
  text-align: center;
  margin-bottom: 2rem;
}

.rate-avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF6F00 0%, #FF8F00 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.rate-avatar i {
  font-size: 2rem;
  color: white;
}

.rate-header h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2C3E50;
  margin: 0 0 0.5rem 0;
}

.rate-header p {
  color: #666;
  margin: 0;
  font-size: 0.9rem;
}

.star-rating-input {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.star-btn {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.star-btn:hover {
  transform: scale(1.2);
}

.star-btn i {
  font-size: 2rem;
  color: #ddd;
  transition: color 0.2s ease;
}

.star-btn.active i,
.star-btn:hover i {
  color: #FFB800;
}

.star-btn i.pi-star-fill {
  color: #FFB800;
}

.rating-label {
  width: 100%;
  text-align: center;
  font-size: 0.9rem;
  font-weight: 600;
  color: #666;
  margin-top: 0.5rem;
}

.rating-comment-input {
  margin-bottom: 1.5rem;
}

.rating-comment-input label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #2C3E50;
  margin-bottom: 0.5rem;
}

.rating-comment-input textarea {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 0.9rem;
  font-family: inherit;
  resize: none;
  transition: border-color 0.3s ease;
}

.rating-comment-input textarea:focus {
  outline: none;
  border-color: #FF6F00;
}

.rate-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

/* Responsive */
@media (max-width: 768px) {
  .user-profile-modal,
  .rate-user-modal {
    margin: 1rem;
    padding: 1.5rem;
    max-height: 90vh;
  }

  .profile-stats {
    grid-template-columns: 1fr;
  }

  .profile-actions,
  .rate-actions {
    flex-direction: column;
  }

  .profile-actions button,
  .rate-actions button {
    width: 100%;
  }
}
</style>
