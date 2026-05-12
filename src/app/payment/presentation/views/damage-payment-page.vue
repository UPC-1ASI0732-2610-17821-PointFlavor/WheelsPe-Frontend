<template>
  <div class="damage-payment-page">
    <div class="payment-container">
      <!-- Header -->
      <div class="page-header">
        <button class="btn-back" @click="goBack">
          <i class="pi pi-arrow-left"></i>
          Volver
        </button>
        <h1>
          <i class="pi pi-exclamation-triangle"></i>
          Pago de Daños
        </h1>
        <p class="subtitle">Complete el pago para resolver el ticket de soporte</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <i class="pi pi-spin pi-spinner"></i>
        <p>Cargando información del ticket...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <i class="pi pi-exclamation-circle"></i>
        <h3>Error</h3>
        <p>{{ error }}</p>
        <button class="btn-primary" @click="loadTicket">Reintentar</button>
      </div>

      <!-- Payment Content -->
      <div v-else-if="ticket" class="payment-content">
        <!-- Ticket Summary Card -->
        <div class="ticket-summary-card">
          <div class="card-header">
            <i class="pi pi-ticket"></i>
            <span>Ticket #{{ ticket.id }}</span>
          </div>
          
          <div class="ticket-info">
            <h3>{{ ticket.subject }}</h3>
            <p class="description">{{ ticket.description }}</p>
            
            <div class="info-grid">
              <div class="info-item">
                <span class="label">Vehículo:</span>
                <span class="value">{{ ticket.vehicleName || 'No especificado' }}</span>
              </div>
              <div class="info-item">
                <span class="label">Tipo:</span>
                <span class="value">{{ getTypeLabel(ticket.type) }}</span>
              </div>
              <div class="info-item">
                <span class="label">Prioridad:</span>
                <span :class="['priority-badge', `priority-${ticket.priority}`]">
                  {{ getPriorityLabel(ticket.priority) }}
                </span>
              </div>
            </div>
          </div>
          
          <div class="cost-section">
            <div class="cost-label">
              <i class="pi pi-dollar"></i>
              Monto a Pagar
            </div>
            <div class="cost-value">S/. {{ ticket.estimatedCost?.toFixed(2) || '0.00' }}</div>
          </div>
        </div>

        <!-- Payment Method Selection -->
        <div class="payment-method-section">
          <h2>
            <i class="pi pi-credit-card"></i>
            Selecciona un método de pago
          </h2>
          
          <div class="payment-methods">
            <div 
              class="method-card"
              :class="{ selected: selectedMethod === 'card' }"
              @click="selectedMethod = 'card'"
            >
              <div class="method-icon">
                <i class="pi pi-credit-card"></i>
              </div>
              <div class="method-info">
                <h4>Tarjeta de Crédito/Débito</h4>
                <p>Pago seguro con Stripe</p>
              </div>
              <div class="method-check">
                <i v-if="selectedMethod === 'card'" class="pi pi-check-circle"></i>
              </div>
            </div>

            <div 
              class="method-card"
              :class="{ selected: selectedMethod === 'yape' }"
              @click="selectedMethod = 'yape'"
            >
              <div class="method-icon yape">
                <i class="pi pi-mobile"></i>
              </div>
              <div class="method-info">
                <h4>Yape</h4>
                <p>Transferencia instantánea</p>
              </div>
              <div class="method-check">
                <i v-if="selectedMethod === 'yape'" class="pi pi-check-circle"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Stripe Payment Form -->
        <div v-if="selectedMethod === 'card'" class="stripe-section">
          <StripeCheckout 
            :amount="ticket.estimatedCost || 0"
            @success="handlePaymentSuccess"
            @error="handlePaymentError"
          />
        </div>

        <!-- Yape Instructions -->
        <div v-if="selectedMethod === 'yape'" class="yape-section">
          <div class="yape-instructions">
            <h3>Instrucciones para pagar con Yape</h3>
            <ol>
              <li>Abre tu app de Yape</li>
              <li>Escanea el código QR o transfiere al número indicado</li>
              <li>Ingresa el monto: <strong>S/. {{ ticket.estimatedCost?.toFixed(2) }}</strong></li>
              <li>Sube el comprobante de pago</li>
            </ol>
          </div>

          <div class="yape-qr">
            <div class="qr-placeholder">
              <i class="pi pi-qrcode"></i>
              <p>Código QR de Yape</p>
              <span class="amount">S/. {{ ticket.estimatedCost?.toFixed(2) }}</span>
            </div>
          </div>

          <div class="upload-section">
            <label class="upload-label">
              <i class="pi pi-upload"></i>
              <span>{{ receiptFileName || 'Subir comprobante de pago' }}</span>
              <input type="file" accept="image/*" @change="handleFileUpload" />
            </label>
          </div>

          <button 
            class="btn-confirm"
            :disabled="!receiptFile"
            @click="handleYapePayment"
          >
            <i class="pi pi-check"></i>
            Confirmar Pago
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import StripeCheckout from '@/app/payment/presentation/components/stripe-checkout.vue'
import { apiClient } from '@/app/shared/infrastructure/apiClient.js'
import { useUserStore } from '@/app/iam/application/user.store.js'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const loading = ref(true)
const error = ref(null)
const ticket = ref(null)
const selectedMethod = ref(null)
const receiptFile = ref(null)
const receiptFileName = ref('')
const processing = ref(false)

const typeLabels = {
  damage: 'Daños',
  complaint: 'Queja',
  question: 'Pregunta',
  other: 'Otro'
}

const priorityLabels = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
  urgent: 'Urgente'
}

function getTypeLabel(type) {
  return typeLabels[type] || type
}

function getPriorityLabel(priority) {
  return priorityLabels[priority] || priority
}

function goBack() {
  router.back()
}

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (file) {
    receiptFile.value = file
    receiptFileName.value = file.name
  }
}

async function handlePaymentSuccess(token) {
  console.log('✅ Pago con Stripe exitoso:', token)
  processing.value = true
  
  try {
    // Crear registro de pago
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
    
    // Actualizar estado del ticket
    await apiClient.patch(`/support-tickets/${ticket.value.id}`, {
      status: 'resolved',
      paymentStatus: 'paid',
      paidAt: new Date().toISOString(),
      resolvedAt: new Date().toISOString()
    })
    
    // Crear notificación
    await createPaymentNotification()
    
    alert('✅ Pago procesado exitosamente. El ticket ha sido resuelto.')
    router.push('/support/tickets')
  } catch (err) {
    console.error('Error procesando pago:', err)
    alert('Error al procesar el pago. Por favor intente nuevamente.')
  } finally {
    processing.value = false
  }
}

function handlePaymentError(err) {
  console.error('❌ Error de Stripe:', err)
  alert('Error en el pago: ' + (err.message || 'Error desconocido'))
}

async function handleYapePayment() {
  if (!receiptFile.value) {
    alert('Por favor sube el comprobante de pago')
    return
  }
  
  processing.value = true
  
  try {
    // Crear registro de pago
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
    
    // Actualizar estado del ticket a pendiente de verificación
    await apiClient.patch(`/support-tickets/${ticket.value.id}`, {
      paymentStatus: 'pending_verification',
      paidAt: new Date().toISOString()
    })
    
    alert('✅ Comprobante enviado. El pago está pendiente de verificación.')
    router.push('/support/tickets')
  } catch (err) {
    console.error('Error procesando pago:', err)
    alert('Error al procesar el pago. Por favor intente nuevamente.')
  } finally {
    processing.value = false
  }
}

async function createPaymentNotification() {
  try {
    const notification = {
      userId: ticket.value.userId,
      type: 'payment_completed',
      title: '💳 Pago Procesado',
      message: `Tu pago de S/. ${ticket.value.estimatedCost?.toFixed(2)} por el ticket #${ticket.value.id} ha sido procesado exitosamente.`,
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

async function loadTicket() {
  loading.value = true
  error.value = null
  
  try {
    const ticketId = route.params.ticketId
    const response = await apiClient.get(`/support-tickets/${ticketId}`)
    
    if (!response) {
      throw new Error('Ticket no encontrado')
    }
    
    ticket.value = response
    
    if (!ticket.value.estimatedCost || ticket.value.estimatedCost <= 0) {
      error.value = 'Este ticket no tiene un monto de pago definido'
    }
  } catch (err) {
    console.error('Error loading ticket:', err)
    error.value = err.message || 'Error al cargar el ticket'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadTicket()
})
</script>

<style scoped>
.damage-payment-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  padding: 2rem;
}

.payment-container {
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 1.5rem;
}

.btn-back:hover {
  border-color: #FF6F00;
  color: #FF6F00;
}

.page-header h1 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-size: 2rem;
  font-weight: 700;
  color: #2C3E50;
  margin: 0 0 0.5rem 0;
}

.page-header h1 i {
  color: #f44336;
}

.subtitle {
  color: #666;
  margin: 0;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.loading-state i,
.error-state i {
  font-size: 4rem;
  color: #FF6F00;
  margin-bottom: 1rem;
}

.error-state i {
  color: #f44336;
}

.payment-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.ticket-summary-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #2C3E50 0%, #34495E 100%);
  color: white;
  font-weight: 600;
}

.card-header i {
  font-size: 1.25rem;
}

.ticket-info {
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.ticket-info h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2C3E50;
  margin: 0 0 0.75rem 0;
}

.description {
  color: #666;
  line-height: 1.6;
  margin: 0 0 1rem 0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-item .label {
  font-size: 0.85rem;
  color: #999;
}

.info-item .value {
  font-weight: 600;
  color: #2C3E50;
}

.priority-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
}

.priority-low {
  background: #e3f2fd;
  color: #1976d2;
}

.priority-medium {
  background: #fff3e0;
  color: #f57c00;
}

.priority-high {
  background: #ffebee;
  color: #e53935;
}

.priority-urgent {
  background: #f44336;
  color: white;
}

.cost-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, #ffebee 0%, #fff3e0 100%);
}

.cost-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #2C3E50;
}

.cost-label i {
  font-size: 1.25rem;
  color: #f44336;
}

.cost-value {
  font-size: 2rem;
  font-weight: 800;
  color: #f44336;
}

.payment-method-section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.payment-method-section h2 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #2C3E50;
  margin: 0 0 1.5rem 0;
}

.payment-method-section h2 i {
  color: #FF6F00;
}

.payment-methods {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.method-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: #f8f9fa;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.method-card:hover {
  border-color: #FF6F00;
  background: #fff;
}

.method-card.selected {
  border-color: #FF6F00;
  background: linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%);
  box-shadow: 0 4px 12px rgba(255, 111, 0, 0.2);
}

.method-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: linear-gradient(135deg, #635BFF 0%, #7B73FF 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.method-icon.yape {
  background: linear-gradient(135deg, #6B21A8 0%, #9333EA 100%);
}

.method-icon i {
  font-size: 1.5rem;
  color: white;
}

.method-info h4 {
  font-weight: 600;
  color: #2C3E50;
  margin: 0 0 0.25rem 0;
}

.method-info p {
  font-size: 0.85rem;
  color: #666;
  margin: 0;
}

.method-check {
  margin-left: auto;
}

.method-check i {
  font-size: 1.5rem;
  color: #FF6F00;
}

.stripe-section,
.yape-section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.yape-instructions {
  background: #f3e5f5;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.yape-instructions h3 {
  margin: 0 0 1rem 0;
  color: #6B21A8;
}

.yape-instructions ol {
  margin: 0;
  padding-left: 1.25rem;
  color: #4a4a4a;
  line-height: 1.8;
}

.yape-qr {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.qr-placeholder {
  width: 200px;
  height: 200px;
  background: white;
  border: 2px dashed #e0e0e0;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #999;
}

.qr-placeholder i {
  font-size: 4rem;
  color: #6B21A8;
}

.qr-placeholder .amount {
  font-size: 1.5rem;
  font-weight: 700;
  color: #6B21A8;
}

.upload-section {
  margin-bottom: 1.5rem;
}

.upload-label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1.25rem;
  background: #f8f9fa;
  border: 2px dashed #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
  color: #666;
}

.upload-label:hover {
  border-color: #6B21A8;
  background: #f3e5f5;
  color: #6B21A8;
}

.upload-label input {
  display: none;
}

.upload-label i {
  font-size: 1.25rem;
}

.btn-confirm,
.btn-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #6B21A8 0%, #9333EA 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-confirm:hover:not(:disabled),
.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(107, 33, 168, 0.4);
}

.btn-confirm:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .damage-payment-page {
    padding: 1rem;
  }
  
  .page-header h1 {
    font-size: 1.5rem;
  }
  
  .payment-methods {
    grid-template-columns: 1fr;
  }
}
</style>
