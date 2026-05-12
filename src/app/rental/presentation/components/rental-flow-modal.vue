<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-container">
      <!-- Botón cerrar -->
      <button class="btn-close" @click="close">
        <i class="pi pi-times"></i>
      </button>

      <div class="modal-layout">
        <!-- Contenido principal (izquierda) -->
        <div class="modal-main">
          <!-- Paso 1: Calendario -->
          <div v-if="currentStep === 'calendar'" class="step-content">
            <h2 class="step-title">
              <i class="pi pi-calendar"></i>
              Selecciona las fechas
            </h2>

            <div class="vehicle-summary">
              <div class="vehicle-summary-image">
                <i class="pi pi-car"></i>
              </div>
              <div class="vehicle-summary-info">
                <h3>{{ vehicle.brand }} {{ vehicle.model }}</h3>
                <p>{{ vehicle.year }} • {{ vehicle.color }}</p>
                <span class="price-tag">${{ vehicle.dailyPrice }}/día</span>
              </div>
            </div>

            <div class="date-selector">
              <div class="date-input-group">
                <label>
                  <i class="pi pi-calendar-plus"></i>
                  Fecha de inicio
                </label>
                <input 
                  type="date" 
                  v-model="startDate"
                  :min="today"
                  class="date-input"
                />
              </div>

              <div class="date-input-group">
                <label>
                  <i class="pi pi-calendar-minus"></i>
                  Fecha de fin
                </label>
                <input 
                  type="date" 
                  v-model="endDate"
                  :min="minEndDate"
                  :disabled="!startDate"
                  class="date-input"
                />
              </div>
            </div>

            <!-- Advertencia de conflicto de fechas -->
            <div v-if="hasDateConflict" class="date-conflict-warning">
              <i class="pi pi-exclamation-triangle"></i>
              <p>Las fechas seleccionadas ya están reservadas por otro usuario. Por favor, elige otras fechas.</p>
            </div>

            <!-- Información de reservas existentes -->
            <div v-if="existingRentals.length > 0" class="existing-rentals-info">
              <h4><i class="pi pi-info-circle"></i> Fechas no disponibles:</h4>
              <div class="reserved-dates">
                <div v-for="rental in existingRentals" :key="rental.id" class="reserved-date">
                  <i class="pi pi-calendar-times"></i>
                  {{ formatDateShort(rental.startDate) }} - {{ formatDateShort(rental.endDate) }}
                </div>
              </div>
            </div>

            <div v-if="rentalDays > 0 && !hasDateConflict" class="rental-summary">
              <div class="rental-detail">
                <i class="pi pi-clock"></i>
                <span>{{ rentalDays }} día{{ rentalDays > 1 ? 's' : '' }} de alquiler</span>
              </div>
              <div class="rental-detail highlight">
                <i class="pi pi-money-bill"></i>
                <span>Total estimado: S/ {{ totalPrice }}</span>
              </div>
            </div>

            <button 
              class="btn-primary btn-full"
              :disabled="!isDateValid"
              @click="goToPayment"
            >
              Continuar al pago
              <i class="pi pi-arrow-right"></i>
            </button>

            <!-- Sección de Calificaciones del Vehículo -->
            <div class="reviews-section">
              <div class="reviews-header">
                <div class="reviews-rating-badge">
                  <i class="pi pi-star-fill"></i>
                  <span class="rating-value">{{ averageRating.toFixed(1) }}</span>
                  <span class="rating-count">({{ vehicleReviews.length }} reseñas)</span>
                </div>
                <button 
                  v-if="vehicleReviews.length > 0" 
                  class="btn-toggle-reviews"
                  @click="showReviews = !showReviews"
                >
                  {{ showReviews ? 'Ocultar' : 'Ver comentarios' }}
                  <i :class="showReviews ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"></i>
                </button>
              </div>
              
              <!-- Rating bars -->
              <div class="rating-bars">
                <div v-for="star in 5" :key="star" class="rating-bar-row">
                  <span class="star-label">{{ 6 - star }}</span>
                  <i class="pi pi-star-fill star-icon"></i>
                  <div class="bar-container">
                    <div class="bar-fill" :style="{ width: getRatingPercentage(6 - star) + '%' }"></div>
                  </div>
                  <span class="bar-count">{{ getRatingCount(6 - star) }}</span>
                </div>
              </div>

              <!-- Lista de comentarios -->
              <transition name="slide">
                <div v-if="showReviews && vehicleReviews.length > 0" class="reviews-list">
                  <div v-for="review in vehicleReviews.slice(0, 3)" :key="review.id" class="review-card">
                    <div class="review-header">
                      <div class="reviewer-avatar">
                        <i class="pi pi-user"></i>
                      </div>
                      <div class="reviewer-info">
                        <span class="reviewer-name">Usuario verificado</span>
                        <span class="review-date">{{ formatReviewDate(review.createdAt) }}</span>
                      </div>
                      <div class="review-stars">
                        <i v-for="s in 5" :key="s" 
                           :class="s <= review.rating ? 'pi pi-star-fill' : 'pi pi-star'" 
                           class="star"></i>
                      </div>
                    </div>
                    <p v-if="review.comment" class="review-comment">{{ review.comment }}</p>
                    <p v-else class="review-comment no-comment">Sin comentario</p>
                  </div>
                  <p v-if="vehicleReviews.length > 3" class="more-reviews">
                    +{{ vehicleReviews.length - 3 }} reseñas más
                  </p>
                </div>
              </transition>

              <!-- Sin reseñas -->
              <div v-if="vehicleReviews.length === 0" class="no-reviews">
                <i class="pi pi-inbox"></i>
                <span>Este vehículo aún no tiene reseñas</span>
              </div>
            </div>
          </div>

          <!-- Paso 2: Método de pago -->
          <div v-if="currentStep === 'payment'" class="step-content">
            <button class="btn-back" @click="currentStep = 'calendar'">
              <i class="pi pi-arrow-left"></i>
              Volver
            </button>

            <h2 class="step-title">
              <i class="pi pi-credit-card"></i>
              Método de pago
            </h2>

            <PaymentManagement
              :amount="totalPrice"
              :description="`Alquiler de ${vehicle.brand} ${vehicle.model} por ${rentalDays} día${rentalDays > 1 ? 's' : ''}`"
              @payment-confirmed="handlePaymentConfirmed"
              @payment-cancelled="currentStep = 'calendar'"
            />
          </div>

          <!-- Paso 3: Confirmación -->
          <div v-if="currentStep === 'confirmation'" class="step-content">
            <button class="btn-back" @click="currentStep = 'payment'">
              <i class="pi pi-arrow-left"></i>
              Volver
            </button>

            <h2 class="step-title">
              <i class="pi pi-check-circle"></i>
              Confirmar alquiler
            </h2>

            <div class="confirmation-card">
              <div class="confirmation-section">
                <h4><i class="pi pi-car"></i> Vehículo</h4>
                <p class="detail-text">
                  {{ vehicle.brand }} {{ vehicle.model }} ({{ vehicle.year }})
                </p>
                <p class="detail-subtext">{{ vehicle.color }} • {{ vehicle.location?.district }}</p>
              </div>

              <div class="confirmation-section">
                <h4><i class="pi pi-calendar"></i> Fechas</h4>
                <p class="detail-text">{{ formatDate(startDate) }} → {{ formatDate(endDate) }}</p>
                <p class="detail-subtext">{{ rentalDays }} día{{ rentalDays > 1 ? 's' : '' }}</p>
              </div>

              <div class="confirmation-section">
                <h4><i class="pi pi-credit-card"></i> Pago</h4>
                <p class="detail-text">{{ selectedPaymentMethodName }}</p>
              </div>

              <div class="confirmation-section total">
                <h4>Total a pagar</h4>
                <p class="price-large">S/ {{ totalPrice }}</p>
              </div>
            </div>

            <div class="terms-checkbox">
              <input type="checkbox" id="terms" v-model="acceptedTerms" />
              <label for="terms">
                Acepto los <a href="#">términos y condiciones</a> de MOVEO
              </label>
            </div>

            <button 
              class="btn-primary btn-full"
              :class="{ 'loading': isConfirming }"
              :disabled="!acceptedTerms || isConfirming"
              @click="confirmRental"
            >
              <span v-if="!isConfirming">
                Confirmar y pagar
                <i class="pi pi-check"></i>
              </span>
              <span v-else>
                <i class="pi pi-spin pi-spinner"></i>
                Procesando...
              </span>
            </button>
          </div>
        </div>

        <!-- Panel lateral con resumen (derecha) -->
        <aside class="modal-sidebar">
          <div class="sidebar-content">
            <h3>Resumen</h3>
            
            <div class="summary-vehicle">
              <div class="summary-vehicle-image">
                <i class="pi pi-car"></i>
              </div>
              <div>
                <h4>{{ vehicle.brand }} {{ vehicle.model }}</h4>
                <p>{{ vehicle.year }} • {{ vehicle.transmission }}</p>
              </div>
            </div>

            <div class="summary-details">
              <div v-if="startDate && endDate" class="summary-item">
                <span class="label">Fechas</span>
                <span class="value">{{ formatDateShort(startDate) }} - {{ formatDateShort(endDate) }}</span>
              </div>

              <div v-if="rentalDays > 0" class="summary-item">
                <span class="label">Días</span>
                <span class="value">{{ rentalDays }}</span>
              </div>

              <div class="summary-item">
                <span class="label">Precio por día</span>
                <span class="value">S/ {{ vehicle.dailyPrice }}</span>
              </div>

              <div v-if="rentalDays > 0" class="summary-item subtotal">
                <span class="label">Subtotal</span>
                <span class="value">S/ {{ subtotal }}</span>
              </div>

              <div v-if="selectedPaymentMethod" class="summary-item">
                <span class="label">Método de pago</span>
                <span class="value small">{{ selectedPaymentMethodName }}</span>
              </div>
            </div>

            <div v-if="rentalDays > 0" class="summary-total">
              <span class="label">Total</span>
              <span class="value">S/ {{ totalPrice }}</span>
            </div>

            <div class="summary-features">
              <h4>Incluye</h4>
              <ul>
                <li><i class="pi pi-check"></i> Seguro básico</li>
                <li><i class="pi pi-check"></i> Asistencia 24/7</li>
                <li><i class="pi pi-check"></i> Kilometraje ilimitado</li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import usePaymentsStore from '@/app/payment/application/payment.store.js'
import { useUserStore } from '@/app/iam/application/user.store.js'
import PaymentManagement from '@/app/payment/components/views/payment-management.vue'
import { apiClient } from '@/app/shared/infrastructure/apiClient.js'

const props = defineProps({
  vehicle: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'rental-confirmed'])
const router = useRouter()
const { addPayment } = usePaymentsStore()
const userStore = useUserStore()

// Estado del formulario
const currentStep = ref('calendar')
const startDate = ref('')
const endDate = ref('')
const selectedPaymentMethod = ref('')
const acceptedTerms = ref(false)
const isConfirming = ref(false)
const existingRentals = ref([])
const vehicleReviews = ref([])
const showReviews = ref(false)

// Estados de renta que bloquean fechas (excluye cancelled y completed)
const activeRentalStatuses = new Set(['pending', 'confirmed', 'active', 'accepted'])

// Cargar reservas existentes y reseñas al montar
onMounted(async () => {
  try {
    // ✅ Cargar rentals y reviews por separado para manejar errores individuales
    const rentalsData = await apiClient.get('/rentals')
    
    // Solo considerar rentas activas - excluir cancelled y completed
    existingRentals.value = rentalsData.filter(
      rental => String(rental.vehicleId) === String(props.vehicle.id) && 
               activeRentalStatuses.has(rental.status)
    )
    
    // ✅ Intentar cargar reviews pero no fallar si la tabla no existe
    try {
      const reviewsData = await apiClient.get('/reviews')
      // Filtrar reseñas del vehículo actual
      vehicleReviews.value = reviewsData.filter(
        review => String(review.vehicleId) === String(props.vehicle.id)
      ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    } catch (reviewError) {
      console.warn('⚠️ Reviews API no disponible (tabla reviews no existe):', reviewError.message)
      vehicleReviews.value = [] // Continuar sin reviews
    }
  } catch (error) {
    console.error('Error loading data:', error)
    existingRentals.value = []
    vehicleReviews.value = []
  }
})

// Calcular rating promedio
const averageRating = computed(() => {
  if (vehicleReviews.value.length === 0) return 0
  const sum = vehicleReviews.value.reduce((acc, review) => acc + review.rating, 0)
  return sum / vehicleReviews.value.length
})

// Obtener conteo de ratings por estrella
function getRatingCount(stars) {
  return vehicleReviews.value.filter(r => r.rating === stars).length
}

// Obtener porcentaje de ratings por estrella
function getRatingPercentage(stars) {
  if (vehicleReviews.value.length === 0) return 0
  return (getRatingCount(stars) / vehicleReviews.value.length) * 100
}

// Formatear fecha de reseña
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

// Fecha mínima (hoy)
const today = computed(() => {
  return new Date().toISOString().split('T')[0]
})

// Verificar si una fecha está reservada
function isDateReserved(dateString) {
  if (!dateString) return false
  const checkDate = new Date(dateString)
  
  return existingRentals.value.some(rental => {
    const start = new Date(rental.startDate)
    const end = new Date(rental.endDate)
    return checkDate >= start && checkDate <= end
  })
}

// Validar que el rango de fechas no tenga conflictos
const hasDateConflict = computed(() => {
  if (!startDate.value || !endDate.value) return false
  
  const start = new Date(startDate.value)
  const end = new Date(endDate.value)
  
  return existingRentals.value.some(rental => {
    const rentalStart = new Date(rental.startDate)
    const rentalEnd = new Date(rental.endDate)
    
    // Verificar si hay solapamiento
    return (start <= rentalEnd && end >= rentalStart)
  })
})

// Fecha mínima para end date (start date + 1 día)
const minEndDate = computed(() => {
  if (!startDate.value) return today.value
  const date = new Date(startDate.value)
  date.setDate(date.getDate() + 1)
  return date.toISOString().split('T')[0]
})

// Cálculo de días
const rentalDays = computed(() => {
  if (!startDate.value || !endDate.value) return 0
  const start = new Date(startDate.value)
  const end = new Date(endDate.value)
  const diff = end.getTime() - start.getTime()
  return Math.ceil(diff / (1000 * 3600 * 24))
})

// Cálculos de precio
const subtotal = computed(() => {
  return rentalDays.value * props.vehicle.dailyPrice
})

const totalPrice = computed(() => {
  return subtotal.value
})

// Validaciones
const isDateValid = computed(() => {
  return startDate.value && endDate.value && rentalDays.value > 0 && !hasDateConflict.value
})

// Métodos de pago
const paymentMethods = ref([
  {
    id: 'credit_card',
    name: 'Tarjeta de crédito/débito',
    description: 'Visa, Mastercard, American Express',
    icon: 'pi pi-credit-card'
  },
  {
    id: 'yape',
    name: 'Yape',
    description: 'Pago instantáneo',
    icon: 'pi pi-mobile'
  },
  {
    id: 'bank_transfer',
    name: 'Transferencia bancaria',
    description: 'BCP, Interbank, BBVA',
    icon: 'pi pi-building'
  }
])

const selectedPaymentMethodName = computed(() => {
  if (!selectedPaymentMethod.value) return ''
  
  const methodNames = {
    'card': 'Tarjeta de crédito/débito',
    'yape': 'Yape',
    'cash': 'Efectivo'
  }
  
  return methodNames[selectedPaymentMethod.value] || selectedPaymentMethod.value
})

// Funciones de navegación
function goToPayment() {
  if (isDateValid.value) {
    currentStep.value = 'payment'
  }
}

function handlePaymentConfirmed(paymentData) {
  // Guardar los datos del pago para usarlos en la confirmación
  selectedPaymentMethod.value = paymentData.method
  // Pasar a confirmación
  currentStep.value = 'confirmation'
}

function close() {
  emit('close')
}

// Confirmar alquiler
async function confirmRental() {
  if (!acceptedTerms.value || isConfirming.value) return
  
  isConfirming.value = true
  
  try {
    // Guardar el rental en db.json con estado "pending"
    const currentUser = userStore.currentUser.value
    if (!currentUser || !currentUser.id) {
      throw new Error('Usuario no autenticado')
    }

    const renterId = currentUser.id

    const rentalData = {
      vehicleId: props.vehicle.id,
      renterId: renterId,
      ownerId: props.vehicle.ownerId,
      startDate: startDate.value,
      endDate: endDate.value,
      totalPrice: totalPrice.value,
      status: 'pending', // Estado inicial: pendiente
      pickupLocation: props.vehicle.location?.address || 'No especificado',
      returnLocation: props.vehicle.location?.address || 'No especificado',
      notes: `Reserva realizada. Método de pago: ${selectedPaymentMethod.value}`,
      createdAt: new Date().toISOString()
    }
    
    // Guardar en la base de datos
    const created = await apiClient.post('/rentals', rentalData)
    console.log('Rental guardado exitosamente:', created)
    
    // Guardar el pago usando payment.store.js con los campos correctos
    const paymentData = {
      rentalId: created.id, // ID del rental recién creado
      payerId: renterId, // ID del inquilino que hace el pago
      recipientId: props.vehicle.ownerId, // ID del propietario que recibe el pago
      amount: totalPrice.value,
      currency: 'PEN',
      paymentMethod: selectedPaymentMethod.value || 'card', // ✅ Backend espera 'paymentMethod'
      status: 'pending', // Estado inicial: pendiente
      transactionId: `txn_${Date.now()}`,
      description: `Alquiler de ${props.vehicle.brand} ${props.vehicle.model} - ${rentalDays.value} día(s)`,
      createdAt: new Date().toISOString()
    }
    
    console.log('💰 Creando pago:', paymentData);
    await addPayment(paymentData)
    console.log('✅ Pago creado exitosamente');

    // Crear notificación para el owner indicando que hay una nueva solicitud pendiente
    try {
      const notification = {
        userId: props.vehicle.ownerId,
        type: 'rental_requested',
        title: 'Nueva solicitud de alquiler',
        body: `El usuario ${currentUser.firstName || ''} ${currentUser.lastName || ''} ha solicitado alquilar ${props.vehicle.brand} ${props.vehicle.model}. Alquiler #${created.id}`,
        relatedId: created.id,
        relatedType: 'rental',
        read: false,
        actionUrl: `/rental/rental-requests`,
        actionLabel: 'Ver solicitud',
        metadata: {
          rentalId: created.id,
          vehicleId: props.vehicle.id,
          renterId: renterId
        },
        createdAt: new Date().toISOString(),
        readAt: null
      }

      await apiClient.post('/notifications', notification)
      console.log('🔔 Notificación creada para owner:', props.vehicle.ownerId)
    } catch (err) {
      console.error('Error creando notificación para owner:', err)
    }

    emit('rental-confirmed', created)
    // Redirigir al usuario a Mis Alquileres para que vea la reserva
    router.push('/rental/my-rentals')
  } catch (error) {
    console.error('Error al confirmar el alquiler:', error)
    alert('Hubo un error al procesar tu reserva. Por favor intenta nuevamente.')
  } finally {
    isConfirming.value = false
  }
}

// Formateo de fechas
function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

function formatDateShort(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', { 
    month: 'short', 
    day: 'numeric' 
  })
}

// Reset end date if start date changes
watch(startDate, (newStart) => {
  if (endDate.value && newStart > endDate.value) {
    endDate.value = ''
  }
})
</script>

<style scoped>
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
  overflow-y: auto;
}

.modal-container {
  background: white;
  border-radius: 20px;
  max-width: 1400px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  display: flex;
  flex-direction: column;
}

.btn-close {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: #f5f5f5;
  color: #2C3E50;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
}

.btn-close:hover {
  background: #FF6F00;
  color: white;
  transform: rotate(90deg);
}

.modal-layout {
  display: grid;
  grid-template-columns: 1fr 400px;
  height: 100%;
  overflow: hidden;
}

/* Contenido principal */
.modal-main {
  padding: 3rem;
  overflow-y: auto;
  max-height: 90vh;
}

.step-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.btn-back {
  background: transparent;
  border: none;
  color: #FF6F00;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.btn-back:hover {
  background: #FFF3E0;
}

.step-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2C3E50;
  margin: 0 0 2rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.step-title i {
  color: #FF6F00;
}

/* Reviews Section */
.reviews-section {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 1.25rem;
  margin-top: 2rem;
  border-top: 2px dashed #e0e0e0;
  padding-top: 1.5rem;
}

.reviews-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.reviews-rating-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.reviews-rating-badge i {
  color: #FFB800;
  font-size: 1.25rem;
}

.rating-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #2C3E50;
}

.rating-count {
  font-size: 0.875rem;
  color: #666;
}

.btn-toggle-reviews {
  background: transparent;
  border: 1px solid #e0e0e0;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  transition: all 0.2s ease;
}

.btn-toggle-reviews:hover {
  border-color: #FF6F00;
  color: #FF6F00;
}

.rating-bars {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.rating-bar-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.star-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #666;
  width: 12px;
}

.star-icon {
  color: #FFB800;
  font-size: 0.75rem;
}

.bar-container {
  flex: 1;
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #FF6F00, #FFB800);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.bar-count {
  font-size: 0.7rem;
  color: #999;
  width: 20px;
  text-align: right;
}

/* Reviews List */
.reviews-list {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
}

.review-card {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.review-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.reviewer-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF6F00 0%, #FF8F00 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.reviewer-avatar i {
  color: white;
  font-size: 1rem;
}

.reviewer-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.reviewer-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: #2C3E50;
}

.review-date {
  font-size: 0.75rem;
  color: #999;
}

.review-stars {
  display: flex;
  gap: 2px;
}

.review-stars .star {
  font-size: 0.75rem;
  color: #FFB800;
}

.review-stars .pi-star {
  color: #ddd;
}

.review-comment {
  font-size: 0.875rem;
  color: #444;
  margin: 0;
  line-height: 1.5;
}

.review-comment.no-comment {
  color: #999;
  font-style: italic;
}

.more-reviews {
  text-align: center;
  font-size: 0.8rem;
  color: #FF6F00;
  font-weight: 600;
  margin: 0.5rem 0 0;
}

.no-reviews {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  color: #999;
  font-size: 0.875rem;
}

.no-reviews i {
  font-size: 1.25rem;
}

/* Slide transition */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
}

.slide-enter-to,
.slide-leave-from {
  opacity: 1;
  max-height: 500px;
}

/* Vehicle summary */
.vehicle-summary {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%);
  border-radius: 16px;
  margin-bottom: 2rem;
}

.vehicle-summary-image {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  background: linear-gradient(135deg, #FF6F00 0%, #FF8F00 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.vehicle-summary-image i {
  font-size: 3rem;
  color: white;
  opacity: 0.9;
}

.vehicle-summary-info h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2C3E50;
  margin: 0 0 0.5rem 0;
}

.vehicle-summary-info p {
  color: #666;
  margin: 0 0 0.75rem 0;
}

.price-tag {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  background: white;
  border-radius: 8px;
  font-weight: 700;
  color: #FF6F00;
  font-size: 1.1rem;
}

/* Date selector */
.date-selector {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.date-input-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #2C3E50;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
}

.date-input-group label i {
  color: #FF6F00;
}

.date-input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  color: #2C3E50;
  transition: all 0.3s ease;
}

.date-input:focus {
  outline: none;
  border-color: #FF6F00;
  box-shadow: 0 0 0 4px rgba(255, 111, 0, 0.1);
}

.date-input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
  opacity: 0.6;
}

/* Date conflict warning */
.date-conflict-warning {
  background: #ffebee;
  border-left: 4px solid #e53935;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.date-conflict-warning i {
  color: #e53935;
  font-size: 1.5rem;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.date-conflict-warning p {
  color: #c62828;
  font-weight: 600;
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
}

/* Existing rentals info */
.existing-rentals-info {
  background: #e3f2fd;
  border-left: 4px solid #1976d2;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
}

.existing-rentals-info h4 {
  color: #1565c0;
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.existing-rentals-info h4 i {
  font-size: 1.1rem;
}

.reserved-dates {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.reserved-date {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background: white;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1565c0;
}

.reserved-date i {
  color: #e53935;
  font-size: 0.9rem;
}

/* Rental summary */
.rental-summary {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.rental-detail {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0;
  color: #2C3E50;
  font-weight: 600;
}

.rental-detail i {
  color: #FF6F00;
  font-size: 1.2rem;
}

.rental-detail.highlight {
  font-size: 1.2rem;
  color: #FF6F00;
  border-top: 2px solid #e0e0e0;
  margin-top: 0.5rem;
  padding-top: 1rem;
}

/* Payment methods */
.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.payment-method {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.payment-method:hover {
  border-color: #FF6F00;
  background: #FFF3E0;
}

.payment-method.selected {
  border-color: #FF6F00;
  background: linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%);
  box-shadow: 0 4px 12px rgba(255, 111, 0, 0.2);
}

.method-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.method-icon i {
  font-size: 2rem;
  color: #FF6F00;
}

.method-info {
  flex: 1;
}

.method-info h4 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #2C3E50;
  margin: 0 0 0.375rem 0;
}

.method-info p {
  color: #666;
  margin: 0;
  font-size: 0.9rem;
}

.method-radio i {
  font-size: 1.5rem;
  color: #FF6F00;
}

/* Confirmation card */
.confirmation-card {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 16px;
  margin-bottom: 2rem;
}

.confirmation-section {
  padding: 1.5rem 0;
  border-bottom: 1px solid #e0e0e0;
}

.confirmation-section:last-child {
  border-bottom: none;
}

.confirmation-section h4 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #666;
  margin: 0 0 0.75rem 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.confirmation-section h4 i {
  color: #FF6F00;
}

.detail-text {
  font-size: 1.1rem;
  font-weight: 700;
  color: #2C3E50;
  margin: 0 0 0.375rem 0;
}

.detail-subtext {
  color: #666;
  margin: 0;
  font-size: 0.9rem;
}

.confirmation-section.total {
  padding-top: 1.5rem;
}

.price-large {
  font-size: 2rem;
  font-weight: 800;
  color: #FF6F00;
  margin: 0;
}

/* Terms checkbox */
.terms-checkbox {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.terms-checkbox input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.terms-checkbox label {
  font-size: 0.9rem;
  color: #666;
  cursor: pointer;
}

.terms-checkbox a {
  color: #FF6F00;
  text-decoration: none;
  font-weight: 600;
}

.terms-checkbox a:hover {
  text-decoration: underline;
}

/* Buttons */
.btn-primary {
  width: 100%;
  padding: 1.125rem 2rem;
  background: linear-gradient(135deg, #FF6F00 0%, #FF8F00 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.0625rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(255, 111, 0, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255, 111, 0, 0.4);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary.loading {
  pointer-events: none;
}

/* Sidebar */
.modal-sidebar {
  background: linear-gradient(180deg, #2C3E50 0%, #34495E 100%);
  padding: 3rem 2rem;
  overflow-y: auto;
  color: white;
}

.sidebar-content h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 2rem 0;
  color: white;
}

.summary-vehicle {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  margin-bottom: 2rem;
}

.summary-vehicle-image {
  width: 60px;
  height: 60px;
  border-radius: 10px;
  background: linear-gradient(135deg, #FF6F00 0%, #FF8F00 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.summary-vehicle-image i {
  font-size: 2rem;
  color: white;
}

.summary-vehicle h4 {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 0.375rem 0;
}

.summary-vehicle p {
  font-size: 0.875rem;
  opacity: 0.8;
  margin: 0;
}

.summary-details {
  margin-bottom: 2rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.summary-item .label {
  font-size: 0.9rem;
  opacity: 0.8;
}

.summary-item .value {
  font-weight: 700;
  font-size: 1rem;
}

.summary-item .value.small {
  font-size: 0.85rem;
}

.summary-item.subtotal {
  font-weight: 600;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: rgba(255, 111, 0, 0.2);
  border-radius: 12px;
  margin-bottom: 2rem;
}

.summary-total .label {
  font-size: 1rem;
  font-weight: 600;
}

.summary-total .value {
  font-size: 2rem;
  font-weight: 800;
  color: #FFB74D;
}

.summary-features {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
}

.summary-features h4 {
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.8;
}

.summary-features ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.summary-features li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
  font-size: 0.9rem;
}

.summary-features li i {
  color: #4ADE80;
  font-size: 1.1rem;
}

/* Responsive */
@media (max-width: 1024px) {
  .modal-layout {
    grid-template-columns: 1fr;
  }

  .modal-sidebar {
    display: none;
  }

  .modal-main {
    padding: 2rem;
  }

  .date-selector {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .modal-overlay {
    padding: 0;
  }

  .modal-container {
    max-height: 100vh;
    border-radius: 0;
  }

  .modal-main {
    padding: 1.5rem;
  }

  .step-title {
    font-size: 1.5rem;
  }
}
</style>
