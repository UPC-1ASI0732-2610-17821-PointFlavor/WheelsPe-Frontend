<template>
  <div class="rental-details-page">
    <div class="container">
      <button @click="goBack" class="btn-back">
        <i class="pi pi-arrow-left"></i>
        Volver
      </button>

      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Cargando detalles...</p>
      </div>

      <div v-else-if="rental" class="rental-details">
        <!-- HU36: confirmación clara tras cancelar -->
        <div v-if="cancelSuccess" class="cancel-confirmation">
          <i class="pi pi-check-circle"></i>
          <div>
            <h3>Reserva cancelada correctamente</h3>
            <p>
              Tu reserva #{{ rental.id }} fue cancelada. Se ha enviado la confirmación
              a tu correo y notificaciones. Reembolso estimado:
              <strong>S/ {{ lastRefund.toFixed(2) }}</strong>.
            </p>
          </div>
        </div>

        <!-- Header -->
        <div class="details-header">
          <h1>Detalles del Alquiler #{{ rental.id }}</h1>
          <span :class="['status-badge', getStatusClass(rental.status)]">
            {{ getStatusLabel(rental.status) }}
          </span>
        </div>

        <!-- Vehicle Info -->
        <div class="section">
          <h2>Vehículo</h2>
          <div class="vehicle-info">
            <img 
              src="https://via.placeholder.com/400x250/3A5E5E/FFFFFF?text=Vehiculo" 
              alt="Vehicle"
              class="vehicle-image"
            />
            <div class="vehicle-details">
              <h3>{{ vehicle?.brand }} {{ vehicle?.model }}</h3>
              <p>{{ vehicle?.year }}</p>
              <div class="vehicle-specs">
                <span><i class="pi pi-cog"></i> {{ vehicle?.transmission }}</span>
                <span><i class="pi pi-car"></i> {{ vehicle?.licensePlate }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Rental Info -->
        <div class="section">
          <h2>Información del Alquiler</h2>
          <div class="rental-info-grid">
            <div class="info-card">
              <i class="pi pi-calendar"></i>
              <div>
                <strong>Fecha de Inicio</strong>
                <p>{{ formatDate(rental.startDate) }}</p>
              </div>
            </div>
            <div class="info-card">
              <i class="pi pi-calendar"></i>
              <div>
                <strong>Fecha de Fin</strong>
                <p>{{ formatDate(rental.endDate) }}</p>
              </div>
            </div>
            <div class="info-card">
              <i class="pi pi-clock"></i>
              <div>
                <strong>Duración</strong>
                <p>{{ getRentalDays(rental.startDate, rental.endDate) }} días</p>
              </div>
            </div>
            <div class="info-card">
              <i class="pi pi-dollar"></i>
              <div>
                <strong>Precio Total</strong>
                <p class="price">${{ rental.totalPrice }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Location -->
        <div class="section" v-if="rental.pickupLocation">
          <h2>Ubicación</h2>
          <div class="location-info">
            <i class="pi pi-map-marker"></i>
            <p>{{ rental.pickupLocation }}</p>
          </div>
        </div>

        <!-- Actions -->
        <div class="actions" v-if="canCancel || rental.status === 'active' || rental.status === 'confirmed'">
          <button v-if="canCancel" @click="openCancelModal" class="btn btn-cancel">
            <i class="pi pi-times-circle"></i>
            Cancelar reserva
          </button>
          <button
            v-if="rental.status === 'active' || rental.status === 'confirmed'"
            @click="completeRental"
            class="btn btn-complete"
          >
            <i class="pi pi-check"></i>
            Marcar como Completado
          </button>
        </div>
      </div>

      <div v-else class="error">
        <p>No se encontró el alquiler</p>
      </div>
    </div>

    <!-- HU35: modal de resumen antes de cancelar (reembolso y penalidades) -->
    <div v-if="showCancelModal" class="modal-overlay" @click.self="closeCancelModal">
      <div class="cancel-modal">
        <div class="cancel-modal-header">
          <h2><i class="pi pi-exclamation-triangle"></i> Resumen de cancelación</h2>
          <button class="modal-close" @click="closeCancelModal" aria-label="Cerrar">
            <i class="pi pi-times"></i>
          </button>
        </div>

        <p class="cancel-modal-lead">
          Antes de confirmar, revisa el detalle del reembolso y las penalidades
          según la política de cancelación ({{ refund.policyLabel }}):
        </p>

        <div class="refund-breakdown">
          <div class="refund-row">
            <span>Total pagado</span>
            <strong>S/ {{ refund.total.toFixed(2) }}</strong>
          </div>
          <div class="refund-row penalty">
            <span>Penalidad por cancelación ({{ refund.penaltyPct }}%)</span>
            <strong>- S/ {{ refund.penalty.toFixed(2) }}</strong>
          </div>
          <div class="refund-row total">
            <span>Reembolso estimado</span>
            <strong>S/ {{ refund.amount.toFixed(2) }}</strong>
          </div>
        </div>

        <div class="cancel-modal-actions">
          <button class="btn btn-keep" @click="closeCancelModal" :disabled="cancelling">
            No, mantener reserva
          </button>
          <button class="btn btn-confirm-cancel" @click="confirmCancel" :disabled="cancelling">
            <i class="pi pi-check"></i>
            {{ cancelling ? 'Cancelando...' : 'Confirmar cancelación' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRentalStore } from '../../application/rental.store.js'

const route = useRoute()
const router = useRouter()
const rentalStore = useRentalStore()

const loading = ref(true)
const rentalId = String(route.params.id)

const showCancelModal = ref(false)
const cancelling = ref(false)
const cancelSuccess = ref(false)
const lastRefund = ref(0)

const rental = computed(() => {
  return rentalStore.state.rentals.find(r => String(r.id) === rentalId)
})

// HU35: solo se puede cancelar reservas aún no finalizadas
const canCancel = computed(() => {
  if (!rental.value) return false
  return ['pending', 'confirmed', 'active'].includes(rental.value.status)
})

// HU35: cálculo del reembolso/penalidad según cuánto falta para el inicio
const refund = computed(() => {
  const total = Number(rental.value?.totalPrice || 0)
  const now = new Date()
  const start = new Date(rental.value?.startDate)
  const daysUntilStart = Math.ceil((start - now) / (1000 * 60 * 60 * 24))

  let penaltyPct = 0
  let policyLabel = 'flexible'
  if (daysUntilStart < 2) {
    penaltyPct = 50
    policyLabel = 'menos de 48 h'
  } else if (daysUntilStart < 7) {
    penaltyPct = 20
    policyLabel = '2 a 6 días de anticipación'
  } else {
    penaltyPct = 0
    policyLabel = '7 o más días de anticipación'
  }

  const penalty = Number(((total * penaltyPct) / 100).toFixed(2))
  const amount = Number((total - penalty).toFixed(2))
  return { total, penaltyPct, penalty, amount, daysUntilStart, policyLabel }
})

const vehicle = computed(() => {
  if (!rental.value) return null
  return rentalStore.state.vehicles.find(v => v.id === rental.value.vehicleId)
})

onMounted(async () => {
  loading.value = true
  await rentalStore.loadRentals()
  await rentalStore.loadVehicles()
  loading.value = false
})

const goBack = () => {
  router.back()
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

const getRentalDays = (start, end) => {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const diffTime = Math.abs(endDate - startDate)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

const getStatusClass = (status) => {
  const classes = {
    'pending': 'status-pending',
    'active': 'status-active',
    'confirmed': 'status-confirmed',
    'completed': 'status-completed',
    'cancelled': 'status-cancelled'
  }
  return classes[status] || 'status-pending'
}

const getStatusLabel = (status) => {
  const labels = {
    'pending': 'Pendiente',
    'active': 'Activo',
    'confirmed': 'Confirmado',
    'completed': 'Completado',
    'cancelled': 'Cancelado'
  }
  return labels[status] || status
}

const openCancelModal = () => {
  showCancelModal.value = true
}

const closeCancelModal = () => {
  if (cancelling.value) return
  showCancelModal.value = false
}

// HU36: cancelar y mostrar confirmación clara
const confirmCancel = async () => {
  cancelling.value = true
  try {
    lastRefund.value = refund.value.amount
    await rentalStore.updateRentalStatus(rentalId, 'cancelled')
    await rentalStore.loadRentals()
    showCancelModal.value = false
    cancelSuccess.value = true
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (error) {
    console.error('Error cancelling rental:', error)
  } finally {
    cancelling.value = false
  }
}

const completeRental = async () => {
  try {
    await rentalStore.updateRentalStatus(rentalId, 'completed')
    await rentalStore.loadRentals()
    router.push('/rental/my-rentals')
  } catch (error) {
    console.error('Error completing rental:', error)
  }
}
</script>

<style scoped>
.rental-details-page {
  padding: 2rem 1rem;
  min-height: calc(100vh - 200px);
}

.container {
  max-width: 900px;
  margin: 0 auto;
}

.btn-back {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: white;
  border: 2px solid #3A5E5E;
  border-radius: 8px;
  color: #3A5E5E;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 2rem;
}

.btn-back:hover {
  background: #3A5E5E;
  color: white;
}

.loading {
  text-align: center;
  padding: 4rem 0;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3A5E5E;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.rental-details {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e0e0e0;
}

.details-header h1 {
  margin: 0;
  color: #2C3E50;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
}

.status-pending {
  background: #FFF3CD;
  color: #856404;
}

.status-active,
.status-confirmed {
  background: #D1ECF1;
  color: #0C5460;
}

.status-completed {
  background: #D4EDDA;
  color: #155724;
}

.status-cancelled {
  background: #F8D7DA;
  color: #721C24;
}

.section {
  margin-bottom: 2rem;
}

.section h2 {
  margin: 0 0 1rem 0;
  color: #2C3E50;
  font-size: 1.5rem;
}

.vehicle-info {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 2rem;
}

.vehicle-image {
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.vehicle-details h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.75rem;
  color: #3A5E5E;
}

.vehicle-details p {
  margin: 0 0 1rem 0;
  color: #666;
}

.vehicle-specs {
  display: flex;
  gap: 1.5rem;
}

.vehicle-specs span {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
}

.rental-info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.info-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: #F8F9FA;
  border-radius: 12px;
  border-left: 4px solid #3A5E5E;
}

.info-card i {
  font-size: 1.5rem;
  color: #3A5E5E;
}

.info-card strong {
  display: block;
  margin-bottom: 0.25rem;
  color: #2C3E50;
}

.info-card p {
  margin: 0;
  color: #666;
}

.info-card .price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #3A5E5E;
}

.location-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #F8F9FA;
  border-radius: 12px;
}

.location-info i {
  font-size: 1.5rem;
  color: #3A5E5E;
}

.location-info p {
  margin: 0;
  font-size: 1.1rem;
  color: #666;
}

.actions {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-complete {
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
}

.btn-complete:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.btn-cancel {
  background: white;
  border: 2px solid #dc3545;
  color: #dc3545;
}

.btn-cancel:hover {
  background: #dc3545;
  color: white;
  transform: translateY(-2px);
}

.actions {
  gap: 1rem;
}

/* HU36: banner de confirmación de cancelación */
.cancel-confirmation {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  border-left: 5px solid #22c55e;
  border-radius: 12px;
}

.cancel-confirmation > i {
  font-size: 2rem;
  color: #16a34a;
}

.cancel-confirmation h3 {
  margin: 0 0 0.25rem 0;
  color: #166534;
}

.cancel-confirmation p {
  margin: 0;
  color: #15803d;
  font-size: 0.9rem;
  line-height: 1.5;
}

/* HU35: modal de resumen de cancelación */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 1000;
}

.cancel-modal {
  background: white;
  border-radius: 16px;
  padding: 1.75rem;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
}

.cancel-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.cancel-modal-header h2 {
  margin: 0;
  font-size: 1.35rem;
  color: #b45309;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.1rem;
  color: #666;
  cursor: pointer;
}

.cancel-modal-lead {
  color: #555;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0 0 1.25rem 0;
}

.refund-breakdown {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1rem 1.25rem;
  margin-bottom: 1.5rem;
}

.refund-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  color: #444;
  font-size: 0.95rem;
}

.refund-row.penalty strong {
  color: #dc3545;
}

.refund-row.total {
  border-top: 1px solid #e0e0e0;
  margin-top: 0.25rem;
  padding-top: 0.75rem;
  font-size: 1.1rem;
}

.refund-row.total strong {
  color: #16a34a;
  font-size: 1.25rem;
}

.cancel-modal-actions {
  display: flex;
  gap: 0.75rem;
}

.cancel-modal-actions .btn {
  flex: 1;
  justify-content: center;
}

.btn-keep {
  background: white;
  border: 2px solid #ccc;
  color: #444;
}

.btn-keep:hover {
  background: #f5f5f5;
}

.btn-confirm-cancel {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
}

.btn-confirm-cancel:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  text-align: center;
  padding: 4rem 0;
  color: #666;
}

@media (max-width: 768px) {
  .vehicle-info {
    grid-template-columns: 1fr;
  }

  .rental-info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
