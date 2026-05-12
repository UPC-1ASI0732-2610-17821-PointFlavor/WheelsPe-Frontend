<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiClient } from '@/app/shared/infrastructure/apiClient.js'
import { useUserStore } from '@/app/iam/application/user.store.js'
import StripeCheckout from '@/app/payment/presentation/components/stripe-checkout.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const loading = ref(true)
const error = ref(null)
const ticket = ref(null)
const processing = ref(false)

// Modal states
const showPaymentModal = ref(false)
const showDisputeModal = ref(false)
const selectedPaymentMethod = ref(null)
const disputeReason = ref('')
const disputeDescription = ref('')

// Yape
const receiptFile = ref(null)
const receiptFileName = ref('')

const ticketId = computed(() => route.params.ticketId)

// Estado del ticket para el renter
const ticketStatus = computed(() => {
  if (!ticket.value) return 'loading'
  
  if (ticket.value.status === 'resolved' || ticket.value.paymentStatus === 'paid') {
    return 'paid'
  }
  
  if (ticket.value.disputeStatus === 'owner_proof_sent') {
    return 'owner_proof_sent' // Owner envió más pruebas, renter ya no puede refutar
  }
  
  if (ticket.value.disputeStatus === 'disputed') {
    return 'disputed' // Renter refutó, esperando respuesta del owner
  }
  
  if (ticket.value.disputeStatus === 'rejected') {
    return 'dispute_rejected' // Disputa rechazada, debe pagar
  }
  
  return 'pending_action' // Puede pagar o refutar
})

// Labels
const priorityLabels = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
  urgent: 'Urgente'
}

const statusLabels = {
  open: 'Abierto',
  'in-progress': 'En Proceso',
  resolved: 'Resuelto',
  closed: 'Cerrado'
}

onMounted(async () => {
  await loadTicket()
})

async function loadTicket() {
  loading.value = true
  error.value = null
  
  try {
    const response = await apiClient.get(`/support-tickets/${ticketId.value}`)
    if (!response) {
      throw new Error('Ticket no encontrado')
    }
    ticket.value = response
  } catch (err) {
    console.error('Error loading ticket:', err)
    error.value = err.message || 'Error al cargar el ticket'
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.back()
}

function formatDate(dateString) {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// ===== PAGAR =====
function openPaymentModal() {
  showPaymentModal.value = true
  selectedPaymentMethod.value = null
}

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (file) {
    receiptFile.value = file
    receiptFileName.value = file.name
  }
}

async function handleStripePaymentSuccess(token) {
  processing.value = true
  
  try {
    // Crear pago
    const paymentData = {
      ticketId: ticket.value.id,
      payerId: userStore.currentUser.value.id,
      amount: ticket.value.estimatedCost,
      currency: 'PEN',
      method: 'card',
      status: 'completed',
      stripeToken: token.id,
      type: 'damage_payment',
      description: `Pago de daños - Ticket #${ticket.value.id}`,
      createdAt: new Date().toISOString()
    }
    
    await apiClient.post('/payments', paymentData)
    
    // Actualizar ticket
    await apiClient.patch(`/support-tickets/${ticket.value.id}`, {
      status: 'resolved',
      paymentStatus: 'paid',
      paidAt: new Date().toISOString(),
      resolvedAt: new Date().toISOString()
    })
    
    // Notificar al owner
    await createPaymentNotification()
    
    showPaymentModal.value = false
    alert('✅ Pago procesado exitosamente. El ticket ha sido resuelto.')
    await loadTicket()
  } catch (err) {
    console.error('Error procesando pago:', err)
    alert('Error al procesar el pago. Por favor intente nuevamente.')
  } finally {
    processing.value = false
  }
}

function handleStripePaymentError(err) {
  console.error('Error de Stripe:', err)
  alert('Error en el pago: ' + (err.message || 'Error desconocido'))
}

async function handleYapePayment() {
  if (!receiptFile.value) {
    alert('Por favor sube el comprobante de pago')
    return
  }
  
  processing.value = true
  
  try {
    const paymentData = {
      ticketId: ticket.value.id,
      payerId: userStore.currentUser.value.id,
      amount: ticket.value.estimatedCost,
      currency: 'PEN',
      method: 'yape',
      status: 'pending_verification',
      type: 'damage_payment',
      description: `Pago de daños - Ticket #${ticket.value.id}`,
      receiptUploaded: true,
      createdAt: new Date().toISOString()
    }
    
    await apiClient.post('/payments', paymentData)
    
    await apiClient.patch(`/support-tickets/${ticket.value.id}`, {
      paymentStatus: 'pending_verification',
      paidAt: new Date().toISOString()
    })
    
    showPaymentModal.value = false
    alert('✅ Comprobante enviado. El pago está pendiente de verificación.')
    await loadTicket()
  } catch (err) {
    console.error('Error procesando pago:', err)
    alert('Error al procesar el pago.')
  } finally {
    processing.value = false
  }
}

async function createPaymentNotification() {
  try {
    const notification = {
      userId: ticket.value.userId,
      type: 'payment_completed',
      title: '💳 Pago de Daños Recibido',
      message: `El renter ha pagado S/. ${ticket.value.estimatedCost?.toFixed(2)} por el ticket #${ticket.value.id}. El caso ha sido resuelto.`,
      relatedId: ticket.value.id,
      relatedType: 'ticket',
      read: false,
      actionUrl: `/support/tickets/${ticket.value.id}`,
      actionLabel: 'Ver Ticket',
      createdAt: new Date().toISOString()
    }
    
    await apiClient.post('/notifications', notification)
  } catch (err) {
    console.error('Error creating notification:', err)
  }
}

// ===== REFUTAR =====
function openDisputeModal() {
  showDisputeModal.value = true
  disputeReason.value = ''
  disputeDescription.value = ''
}

async function submitDispute() {
  if (!disputeReason.value || !disputeDescription.value) {
    alert('Por favor completa todos los campos')
    return
  }
  
  processing.value = true
  
  try {
    // Actualizar ticket con la disputa
    await apiClient.patch(`/support-tickets/${ticket.value.id}`, {
      disputeStatus: 'disputed',
      disputeReason: disputeReason.value,
      disputeDescription: disputeDescription.value,
      disputedAt: new Date().toISOString(),
      disputedBy: userStore.currentUser.value.id,
      updatedAt: new Date().toISOString()
    })
    
    // Notificar al owner
    await createDisputeNotification()
    
    showDisputeModal.value = false
    alert('✅ Tu disputa ha sido enviada. El propietario será notificado y podrá responder con más pruebas.')
    await loadTicket()
  } catch (err) {
    console.error('Error submitting dispute:', err)
    alert('Error al enviar la disputa.')
  } finally {
    processing.value = false
  }
}

async function createDisputeNotification() {
  try {
    const renterName = `${userStore.currentUser.value.firstName} ${userStore.currentUser.value.lastName}`
    
    const notification = {
      userId: ticket.value.userId,
      type: 'dispute_received',
      title: '⚠️ Disputa Recibida - Ticket #' + ticket.value.id,
      body: `${renterName} ha disputado el reporte de daño. Motivo: "${disputeReason.value}". Puedes enviar pruebas adicionales para respaldar tu reclamo.`,
      relatedId: ticket.value.id,
      relatedType: 'ticket',
      read: false,
      actionUrl: `/support/tickets/${ticket.value.id}`,
      actionLabel: 'Ver y Responder',
      metadata: {
        disputeReason: disputeReason.value,
        disputeDescription: disputeDescription.value,
        renterName: renterName
      },
      createdAt: new Date().toISOString()
    }
    
    await apiClient.post('/notifications', notification)
  } catch (err) {
    console.error('Error creating dispute notification:', err)
  }
}

// Aceptar pago después de que owner envía más pruebas
async function acceptAndPay() {
  openPaymentModal()
}
</script>

<template>
  <div class="damage-ticket-page">
    <div class="page-container">
      <!-- Header -->
      <div class="page-header">
        <button class="btn-back" @click="goBack">
          <i class="pi pi-arrow-left"></i>
          Volver
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="loading-state">
        <i class="pi pi-spin pi-spinner"></i>
        <p>Cargando información del ticket...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="error-state">
        <i class="pi pi-exclamation-circle"></i>
        <h3>Error</h3>
        <p>{{ error }}</p>
        <button class="btn-primary" @click="loadTicket">Reintentar</button>
      </div>

      <!-- Ticket Content -->
      <div v-else-if="ticket" class="ticket-content">
        <!-- Status Banner -->
        <div class="status-banner" :class="ticketStatus">
          <template v-if="ticketStatus === 'paid'">
            <i class="pi pi-check-circle"></i>
            <div>
              <h3>Ticket Resuelto</h3>
              <p>El pago fue procesado exitosamente</p>
            </div>
          </template>
          <template v-else-if="ticketStatus === 'disputed'">
            <i class="pi pi-clock"></i>
            <div>
              <h3>Disputa en Proceso</h3>
              <p>Esperando respuesta del propietario</p>
            </div>
          </template>
          <template v-else-if="ticketStatus === 'owner_proof_sent'">
            <i class="pi pi-exclamation-triangle"></i>
            <div>
              <h3>Pruebas Adicionales Recibidas</h3>
              <p>El propietario ha enviado más evidencia. Debes proceder con el pago.</p>
            </div>
          </template>
          <template v-else-if="ticketStatus === 'dispute_rejected'">
            <i class="pi pi-times-circle"></i>
            <div>
              <h3>Disputa Rechazada</h3>
              <p>Tu disputa fue revisada y rechazada. Debes proceder con el pago.</p>
            </div>
          </template>
          <template v-else>
            <i class="pi pi-info-circle"></i>
            <div>
              <h3>Acción Requerida</h3>
              <p>Revisa el reporte y decide: pagar o disputar</p>
            </div>
          </template>
        </div>

        <!-- Ticket Info Card -->
        <div class="ticket-card">
          <div class="card-header">
            <div class="ticket-id">
              <i class="pi pi-ticket"></i>
              Ticket #{{ ticket.id }}
            </div>
            <div class="ticket-badges">
              <span class="badge priority" :class="ticket.priority">
                {{ priorityLabels[ticket.priority] || ticket.priority }}
              </span>
              <span class="badge status" :class="ticket.status">
                {{ statusLabels[ticket.status] || ticket.status }}
              </span>
            </div>
          </div>

          <div class="card-body">
            <h2 class="ticket-subject">{{ ticket.subject }}</h2>
            
            <div class="ticket-meta">
              <div class="meta-item">
                <i class="pi pi-user"></i>
                <span>Reportado por: <strong>{{ ticket.userName }}</strong></span>
              </div>
              <div class="meta-item" v-if="ticket.vehicleName">
                <i class="pi pi-car"></i>
                <span>Vehículo: <strong>{{ ticket.vehicleName }}</strong></span>
              </div>
              <div class="meta-item">
                <i class="pi pi-calendar"></i>
                <span>{{ formatDate(ticket.createdAt) }}</span>
              </div>
            </div>

            <div class="description-section">
              <h4>Descripción del Daño</h4>
              <p>{{ ticket.description }}</p>
            </div>

            <!-- Evidencias del Owner -->
            <div class="evidence-section" v-if="ticket.attachments && ticket.attachments.length > 0">
              <h4>
                <i class="pi pi-images"></i>
                Evidencia del Propietario
              </h4>
              <div class="evidence-grid">
                <div 
                  v-for="(attachment, index) in ticket.attachments" 
                  :key="index" 
                  class="evidence-item"
                >
                  <img :src="attachment" :alt="`Evidencia ${index + 1}`" />
                </div>
              </div>
            </div>

            <!-- Pruebas adicionales del owner después de disputa -->
            <div class="additional-proof-section" v-if="ticket.additionalProof && ticket.additionalProof.length > 0">
              <h4>
                <i class="pi pi-folder-open"></i>
                Pruebas Adicionales (Respuesta a tu disputa)
              </h4>
              <p class="proof-message" v-if="ticket.additionalProofMessage">
                "{{ ticket.additionalProofMessage }}"
              </p>
              <div class="evidence-grid">
                <div 
                  v-for="(proof, index) in ticket.additionalProof" 
                  :key="index" 
                  class="evidence-item"
                >
                  <img :src="proof" :alt="`Prueba adicional ${index + 1}`" />
                </div>
              </div>
            </div>

            <!-- Monto a pagar -->
            <div class="cost-section">
              <div class="cost-label">
                <i class="pi pi-wallet"></i>
                Monto del Daño
              </div>
              <div class="cost-value">S/. {{ (ticket.estimatedCost || 0).toFixed(2) }}</div>
            </div>

            <!-- Tu disputa (si existe) -->
            <div class="my-dispute-section" v-if="ticket.disputeStatus === 'disputed' || ticket.disputeStatus === 'owner_proof_sent'">
              <h4>
                <i class="pi pi-comment"></i>
                Tu Disputa
              </h4>
              <div class="dispute-content">
                <p class="dispute-reason"><strong>Motivo:</strong> {{ ticket.disputeReason }}</p>
                <p class="dispute-description">{{ ticket.disputeDescription }}</p>
                <span class="dispute-date">Enviada el {{ formatDate(ticket.disputedAt) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons" v-if="ticketStatus === 'pending_action'">
          <button class="btn-pay" @click="openPaymentModal">
            <i class="pi pi-credit-card"></i>
            Aceptar y Pagar
          </button>
          <button class="btn-dispute" @click="openDisputeModal">
            <i class="pi pi-exclamation-circle"></i>
            Disputar Reporte
          </button>
        </div>

        <!-- Si owner envió más pruebas, solo puede pagar -->
        <div class="action-buttons" v-else-if="ticketStatus === 'owner_proof_sent' || ticketStatus === 'dispute_rejected'">
          <button class="btn-pay" @click="acceptAndPay">
            <i class="pi pi-credit-card"></i>
            Proceder al Pago
          </button>
          <p class="dispute-blocked-msg">
            <i class="pi pi-lock"></i>
            Ya no es posible disputar este ticket
          </p>
        </div>
      </div>
    </div>

    <!-- Payment Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showPaymentModal" class="modal-overlay" @click="showPaymentModal = false">
          <div class="modal-content payment-modal" @click.stop>
            <button class="modal-close" @click="showPaymentModal = false">
              <i class="pi pi-times"></i>
            </button>

            <div class="modal-header">
              <i class="pi pi-credit-card"></i>
              <h2>Pagar Daños</h2>
              <p class="amount-display">S/. {{ (ticket?.estimatedCost || 0).toFixed(2) }}</p>
            </div>

            <!-- Payment Methods -->
            <div class="payment-methods">
              <div 
                class="method-option"
                :class="{ selected: selectedPaymentMethod === 'card' }"
                @click="selectedPaymentMethod = 'card'"
              >
                <div class="method-icon card">
                  <i class="pi pi-credit-card"></i>
                </div>
                <div class="method-info">
                  <h4>Tarjeta de Crédito/Débito</h4>
                  <p>Pago seguro con Stripe</p>
                </div>
                <i v-if="selectedPaymentMethod === 'card'" class="pi pi-check-circle check-icon"></i>
              </div>

              <div 
                class="method-option"
                :class="{ selected: selectedPaymentMethod === 'yape' }"
                @click="selectedPaymentMethod = 'yape'"
              >
                <div class="method-icon yape">
                  <i class="pi pi-mobile"></i>
                </div>
                <div class="method-info">
                  <h4>Yape</h4>
                  <p>Transferencia instantánea</p>
                </div>
                <i v-if="selectedPaymentMethod === 'yape'" class="pi pi-check-circle check-icon"></i>
              </div>
            </div>

            <!-- Stripe Form -->
            <div v-if="selectedPaymentMethod === 'card'" class="stripe-form">
              <StripeCheckout 
                :amount="ticket?.estimatedCost || 0"
                @success="handleStripePaymentSuccess"
                @error="handleStripePaymentError"
              />
            </div>

            <!-- Yape Form -->
            <div v-if="selectedPaymentMethod === 'yape'" class="yape-form">
              <div class="yape-qr">
                <div class="qr-box">
                  <i class="pi pi-qrcode"></i>
                  <p>Escanea con Yape</p>
                  <span class="yape-amount">S/. {{ (ticket?.estimatedCost || 0).toFixed(2) }}</span>
                </div>
              </div>

              <div class="upload-receipt">
                <label>
                  <i class="pi pi-upload"></i>
                  <span>{{ receiptFileName || 'Subir comprobante de pago' }}</span>
                  <input type="file" accept="image/*" @change="handleFileUpload" />
                </label>
              </div>

              <button 
                class="btn-confirm-yape"
                :disabled="!receiptFile || processing"
                @click="handleYapePayment"
              >
                <i v-if="processing" class="pi pi-spin pi-spinner"></i>
                <i v-else class="pi pi-check"></i>
                {{ processing ? 'Procesando...' : 'Confirmar Pago' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Dispute Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showDisputeModal" class="modal-overlay" @click="showDisputeModal = false">
          <div class="modal-content dispute-modal" @click.stop>
            <button class="modal-close" @click="showDisputeModal = false">
              <i class="pi pi-times"></i>
            </button>

            <div class="modal-header dispute-header">
              <i class="pi pi-exclamation-triangle"></i>
              <h2>Disputar Reporte de Daño</h2>
              <p>Explica por qué no estás de acuerdo con este reporte</p>
            </div>

            <div class="dispute-form">
              <div class="form-group">
                <label>Motivo de la disputa *</label>
                <select v-model="disputeReason">
                  <option value="">Selecciona un motivo</option>
                  <option value="damage_preexisting">El daño ya existía antes de mi alquiler</option>
                  <option value="not_caused_by_me">No fui responsable del daño</option>
                  <option value="exaggerated_cost">El costo está exagerado</option>
                  <option value="false_report">El reporte es falso</option>
                  <option value="other">Otro motivo</option>
                </select>
              </div>

              <div class="form-group">
                <label>Describe tu versión de los hechos *</label>
                <textarea 
                  v-model="disputeDescription"
                  rows="4"
                  placeholder="Proporciona todos los detalles relevantes para respaldar tu disputa..."
                ></textarea>
              </div>

              <div class="dispute-warning">
                <i class="pi pi-info-circle"></i>
                <p>Al enviar esta disputa, el propietario será notificado y podrá responder con pruebas adicionales. Si el propietario envía más evidencia, ya no podrás disputar nuevamente y deberás proceder con el pago.</p>
              </div>

              <div class="dispute-actions">
                <button class="btn-cancel" @click="showDisputeModal = false">
                  Cancelar
                </button>
                <button 
                  class="btn-submit-dispute"
                  :disabled="!disputeReason || !disputeDescription || processing"
                  @click="submitDispute"
                >
                  <i v-if="processing" class="pi pi-spin pi-spinner"></i>
                  <i v-else class="pi pi-send"></i>
                  {{ processing ? 'Enviando...' : 'Enviar Disputa' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.damage-ticket-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 2rem;
}

.page-container {
  max-width: 900px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 1.5rem;
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-back:hover {
  border-color: #FF6F00;
  color: #FF6F00;
}

/* Loading & Error States */
.loading-state,
.error-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.loading-state i,
.error-state i {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.loading-state i {
  color: #FF6F00;
}

.error-state i {
  color: #ef4444;
}

/* Status Banner */
.status-banner {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
}

.status-banner i {
  font-size: 2rem;
}

.status-banner h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  font-weight: 700;
}

.status-banner p {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.9;
}

.status-banner.paid {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  color: #166534;
}

.status-banner.disputed {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
}

.status-banner.owner_proof_sent,
.status-banner.dispute_rejected {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #991b1b;
}

.status-banner.pending_action {
  background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
  color: #0c4a6e;
}

/* Ticket Card */
.ticket-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  color: white;
}

.ticket-id {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 1.1rem;
}

.ticket-badges {
  display: flex;
  gap: 0.5rem;
}

.badge {
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge.priority.low { background: #e0f2fe; color: #0369a1; }
.badge.priority.medium { background: #fef3c7; color: #b45309; }
.badge.priority.high { background: #fee2e2; color: #dc2626; }
.badge.priority.urgent { background: #dc2626; color: white; }

.badge.status.open { background: #dbeafe; color: #1d4ed8; }
.badge.status.resolved { background: #dcfce7; color: #16a34a; }

.card-body {
  padding: 1.5rem;
}

.ticket-subject {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 1.25rem 0;
}

.ticket-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #64748b;
}

.meta-item i {
  color: #FF6F00;
}

.description-section {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 10px;
}

.description-section h4 {
  font-size: 0.9rem;
  font-weight: 600;
  color: #475569;
  margin: 0 0 0.5rem 0;
}

.description-section p {
  margin: 0;
  color: #1e293b;
  line-height: 1.6;
}

/* Evidence Section */
.evidence-section,
.additional-proof-section {
  margin-bottom: 1.5rem;
}

.evidence-section h4,
.additional-proof-section h4 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 1rem 0;
}

.evidence-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.75rem;
}

.evidence-item {
  aspect-ratio: 4/3;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.evidence-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.additional-proof-section {
  padding: 1rem;
  background: #fef2f2;
  border-radius: 10px;
  border-left: 4px solid #ef4444;
}

.proof-message {
  font-style: italic;
  color: #7f1d1d;
  margin: 0 0 1rem 0;
  padding: 0.75rem;
  background: rgba(255,255,255,0.5);
  border-radius: 8px;
}

/* Cost Section */
.cost-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
  border-radius: 12px;
  margin-bottom: 1.5rem;
}

.cost-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #1e293b;
}

.cost-label i {
  font-size: 1.5rem;
  color: #ea580c;
}

.cost-value {
  font-size: 2rem;
  font-weight: 800;
  color: #ea580c;
}

/* My Dispute Section */
.my-dispute-section {
  padding: 1rem;
  background: #fefce8;
  border-radius: 10px;
  border-left: 4px solid #eab308;
}

.my-dispute-section h4 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #713f12;
  margin: 0 0 0.75rem 0;
}

.dispute-content {
  color: #854d0e;
}

.dispute-reason {
  margin: 0 0 0.5rem 0;
}

.dispute-description {
  margin: 0 0 0.5rem 0;
  line-height: 1.5;
}

.dispute-date {
  font-size: 0.8rem;
  color: #a16207;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
}

.btn-pay {
  flex: 1;
  min-width: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1.25rem 2rem;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-pay:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(34, 197, 94, 0.4);
}

.btn-dispute {
  flex: 1;
  min-width: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1.25rem 2rem;
  background: white;
  color: #dc2626;
  border: 2px solid #dc2626;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-dispute:hover {
  background: #dc2626;
  color: white;
}

.dispute-blocked-msg {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-size: 0.9rem;
  margin: 0;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
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

.modal-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.modal-header i {
  font-size: 2.5rem;
  color: #22c55e;
  margin-bottom: 0.75rem;
}

.modal-header h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

.amount-display {
  font-size: 2rem;
  font-weight: 800;
  color: #FF6F00;
  margin: 0;
}

.dispute-header i {
  color: #f59e0b;
}

.dispute-header p {
  color: #64748b;
  margin: 0;
}

/* Payment Methods */
.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.method-option {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.method-option:hover {
  border-color: #FF6F00;
}

.method-option.selected {
  border-color: #FF6F00;
  background: #fff7ed;
}

.method-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.method-icon.card {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
}

.method-icon.yape {
  background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
}

.method-icon i {
  font-size: 1.5rem;
  color: white;
}

.method-info {
  flex: 1;
}

.method-info h4 {
  margin: 0 0 0.25rem 0;
  font-weight: 600;
  color: #1e293b;
}

.method-info p {
  margin: 0;
  font-size: 0.85rem;
  color: #64748b;
}

.check-icon {
  font-size: 1.5rem;
  color: #FF6F00;
}

/* Yape Form */
.yape-form {
  text-align: center;
}

.yape-qr {
  margin-bottom: 1.5rem;
}

.qr-box {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 2rem;
  background: #f8fafc;
  border: 2px dashed #e2e8f0;
  border-radius: 16px;
}

.qr-box i {
  font-size: 5rem;
  color: #7c3aed;
}

.qr-box p {
  margin: 0;
  color: #64748b;
}

.yape-amount {
  font-size: 1.5rem;
  font-weight: 700;
  color: #7c3aed;
}

.upload-receipt {
  margin-bottom: 1rem;
}

.upload-receipt label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #f8fafc;
  border: 2px dashed #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  color: #64748b;
  transition: all 0.2s;
}

.upload-receipt label:hover {
  border-color: #7c3aed;
  color: #7c3aed;
}

.upload-receipt input {
  display: none;
}

.btn-confirm-yape {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-confirm-yape:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
}

.btn-confirm-yape:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Dispute Form */
.dispute-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #475569;
  font-size: 0.9rem;
}

.form-group select,
.form-group textarea {
  padding: 0.875rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-family: inherit;
  font-size: 0.95rem;
  transition: border-color 0.2s;
}

.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #f59e0b;
}

.dispute-warning {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  background: #fffbeb;
  border-radius: 10px;
  border-left: 4px solid #f59e0b;
}

.dispute-warning i {
  color: #f59e0b;
  flex-shrink: 0;
  margin-top: 2px;
}

.dispute-warning p {
  margin: 0;
  font-size: 0.85rem;
  color: #92400e;
  line-height: 1.5;
}

.dispute-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.btn-cancel {
  flex: 1;
  padding: 0.875rem;
  background: #f1f5f9;
  color: #475569;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background: #e2e8f0;
}

.btn-submit-dispute {
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-submit-dispute:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
}

.btn-submit-dispute:disabled {
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

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9) translateY(20px);
}

/* Responsive */
@media (max-width: 640px) {
  .damage-ticket-page {
    padding: 1rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .btn-pay,
  .btn-dispute {
    min-width: 100%;
  }
  
  .cost-section {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
}
</style>
