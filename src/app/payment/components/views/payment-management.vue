<script setup>
import { ref, computed } from "vue";
import { useI18n } from 'vue-i18n'
import StripeCheckout from '@/app/payment/presentation/components/stripe-checkout.vue'

const { t } = useI18n()

// Control para mostrar/ocultar Stripe
const showStripeForm = ref(false)

// Props para recibir datos del modal
const props = defineProps({
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    default: 'Pago de alquiler'
  }
});

// Emits para comunicar con el componente padre
const emit = defineEmits(['payment-confirmed', 'payment-cancelled']);

const selectedMethod = ref(null);
const cardInfo = ref({ 
  number: "", 
  name: "", 
  expiry: "", 
  ccv: "" 
});
const yapeReceipt = ref(null);
const yapeReceiptName = ref('');

// Formatear el número de tarjeta con espacios
const formattedCardNumber = computed(() => {
  if (!cardInfo.value.number) return 'XXXX XXXX XXXX XXXX';
  return cardInfo.value.number.replace(/(.{4})/g, '$1 ').trim();
});

function selectMethod(method) {
  selectedMethod.value = method;
  // Limpiar datos al cambiar de método
  if (method !== 'card') {
    cardInfo.value = { number: "", name: "", expiry: "", ccv: "" };
    showStripeForm.value = false;
  } else {
    // Mostrar formulario de Stripe cuando selecciona tarjeta
    showStripeForm.value = true;
  }
  if (method !== 'yape') {
    yapeReceipt.value = null;
    yapeReceiptName.value = '';
  }
}

function validateCardPayment() {
  if (!cardInfo.value.number || cardInfo.value.number.length < 16) {
    alert(t('payment.management.alerts.invalidCard'))
    return false;
  }
  if (!cardInfo.value.name || cardInfo.value.name.trim().length < 3) {
    alert(t('payment.management.alerts.invalidHolder'))
    return false;
  }
  if (!cardInfo.value.expiry || !/^\d{2}\/\d{2}$/.test(cardInfo.value.expiry)) {
    alert(t('payment.management.alerts.invalidExpiry'))
    return false;
  }
  if (!cardInfo.value.ccv || cardInfo.value.ccv.length < 3) {
    alert(t('payment.management.alerts.invalidCCV'))
    return false;
  }
  return true;
}

function confirmPayment() {
  if (!selectedMethod.value) {
    alert(t('payment.management.alerts.selectMethod'))
    return;
  }

  // Validaciones específicas por método
  if (selectedMethod.value === 'card' && !validateCardPayment()) {
    return;
  }

  if (selectedMethod.value === 'yape' && !yapeReceipt.value) {
    alert(t('payment.management.alerts.uploadReceipt'))
    return;
  }

  // Emitir evento con los datos del pago
  const paymentData = {
    method: selectedMethod.value,
    amount: props.amount,
    description: props.description,
    ...(selectedMethod.value === 'card' && { cardInfo: cardInfo.value }),
    ...(selectedMethod.value === 'yape' && { receipt: yapeReceipt.value })
  };

  emit('payment-confirmed', paymentData);
}

function cancelPayment() {
  emit('payment-cancelled');
}

function handleYapeFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    yapeReceipt.value = file;
    yapeReceiptName.value = file.name;
  }
}

// Formatear input de tarjeta automáticamente
function formatCardNumber(event) {
  let value = event.target.value.replace(/\s/g, '');
  value = value.replace(/\D/g, '').substring(0, 16);
  cardInfo.value.number = value;
}

function formatExpiry(event) {
  let value = event.target.value.replace(/\D/g, '');
  if (value.length >= 2) {
    value = value.substring(0, 2) + '/' + value.substring(2, 4);
  }
  cardInfo.value.expiry = value;
}

function formatCCV(event) {
  cardInfo.value.ccv = event.target.value.replace(/\D/g, '').substring(0, 4);
}

// Manejo de éxito de Stripe
function handleStripeSuccess(token) {
  console.log('✅ Pago con Stripe exitoso:', token);
  // Guardar referencia del token para procesamiento
  cardInfo.value.stripeToken = token;
  
  const paymentData = {
    method: 'card',
    amount: props.amount,
    description: props.description,
    stripeToken: token,
    isStripe: true
  };
  
  emit('payment-confirmed', paymentData);
}

// Manejo de error de Stripe
function handleStripeError(error) {
  console.error('❌ Error de Stripe:', error);
  alert('Error al procesar el pago: ' + (error.message || 'Error desconocido'));
}
</script>

<template>
  <div class="payment-management">
    <!-- Resumen del pago -->
    <div class="payment-summary">
      <div class="summary-item">
        <span class="summary-label">{{ t('payment.management.summary.totalAmount') }}:</span>
        <span class="summary-value">S/. {{ amount.toFixed(2) }}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">{{ t('payment.management.summary.concept') }}:</span>
        <span class="summary-description">{{ description }}</span>
      </div>
    </div>

    <!-- Selección de método de pago -->
    <div class="payment-methods">
      <h3 class="methods-title">
        <i class="pi pi-credit-card"></i>
        {{ t('payment.management.methods.title') }}
      </h3>
      
      <div class="method-buttons">
        <button
          type="button"
          class="method-btn"
          :class="{ 'method-btn--active': selectedMethod === 'card' }"
          @click="selectMethod('card')"
        >
          <i class="pi pi-credit-card"></i>
          <span>{{ t('payment.management.methods.card') }}</span>
        </button>

        <button
          type="button"
          class="method-btn"
          :class="{ 'method-btn--active': selectedMethod === 'yape' }"
          @click="selectMethod('yape')"
        >
          <i class="pi pi-mobile"></i>
          <span>{{ t('payment.management.methods.yape') }}</span>
        </button>

        <button
          type="button"
          class="method-btn"
          :class="{ 'method-btn--active': selectedMethod === 'cash' }"
          @click="selectMethod('cash')"
        >
          <i class="pi pi-money-bill"></i>
          <span>{{ t('payment.management.methods.cash') }}</span>
        </button>
      </div>
    </div>

    <!-- Formulario de tarjeta con Stripe -->
    <div v-if="selectedMethod === 'card'" class="payment-form card-payment">
      <div class="stripe-container">
        <div class="stripe-header">
          <i class="pi pi-shield"></i>
          <span>Pago seguro con Stripe</span>
        </div>
        <StripeCheckout 
          :amount="amount" 
          @success="handleStripeSuccess" 
          @error="handleStripeError"
        />
        <div class="stripe-info">
          <i class="pi pi-lock"></i>
          <p>Tu información de pago está protegida con encriptación de grado bancario</p>
        </div>
      </div>
    </div>

    <!-- Formulario Yape -->
    <div v-if="selectedMethod === 'yape'" class="payment-form yape-payment">
      <div class="yape-instructions">
        <i class="pi pi-info-circle"></i>
        <p>{{ t('payment.management.yape.instructions') }}</p>
      </div>

      <div class="yape-qr-container">
        <div class="qr-placeholder">
          <i class="pi pi-qrcode"></i>
          <p>{{ t('payment.management.yape.qrCode') }}</p>
          <span class="qr-amount">S/. {{ amount.toFixed(2) }}</span>
        </div>
      </div>

      <div class="form-field">
        <label class="form-label">
          <i class="pi pi-upload"></i>
          {{ t('payment.management.yape.receipt') }}
        </label>
        <div class="file-upload">
          <input
            type="file"
            id="yape-receipt"
            accept="image/*"
            @change="handleYapeFileUpload"
            class="file-input"
          />
          <label for="yape-receipt" class="file-label">
            <i class="pi pi-cloud-upload"></i>
            <span v-if="!yapeReceiptName">{{ t('payment.management.yape.selectFile') }}</span>
            <span v-else class="file-name">{{ yapeReceiptName }}</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Pago en Efectivo -->
    <div v-if="selectedMethod === 'cash'" class="payment-form cash-payment">
      <div class="cash-info">
        <i class="pi pi-info-circle"></i>
        <div>
          <h4>{{ t('payment.management.cash.title') }}</h4>
          <p>{{ t('payment.management.cash.description') }}</p>
          <p class="cash-note">
            <i class="pi pi-exclamation-triangle"></i>
            {{ t('payment.management.cash.note') }}
          </p>
        </div>
      </div>
    </div>

    <!-- Botones de acción -->
    <div class="payment-actions">
      <button
        type="button"
        class="btn-cancel"
        @click="cancelPayment"
      >
        <i class="pi pi-times"></i>
        {{ t('payment.management.actions.cancel') }}
      </button>
      
      <button
        type="button"
        class="btn-confirm"
        @click="confirmPayment"
        :disabled="!selectedMethod"
      >
        <i class="pi pi-check"></i>
        {{ t('payment.management.actions.confirm') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.payment-management {
  width: 100%;
}

/* Resumen del pago */
.payment-summary {
  background: linear-gradient(135deg, #3A5E5E 0%, #2C5050 100%);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  color: white;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.summary-item:last-child {
  margin-bottom: 0;
}

.summary-label {
  font-size: 0.9rem;
  opacity: 0.9;
}

.summary-value {
  font-size: 1.75rem;
  font-weight: 700;
}

.summary-description {
  font-size: 0.95rem;
  opacity: 0.95;
}

/* Métodos de pago */
.payment-methods {
  margin-bottom: 2rem;
}

.methods-title {
  font-size: 1.125rem;
  color: #2C3E50;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.methods-title i {
  color: #3A5E5E;
}

.method-buttons {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.method-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.25rem;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: 600;
  color: #666;
}

.method-btn i {
  font-size: 1.75rem;
  transition: all 0.3s ease;
}

.method-btn:hover {
  border-color: #3A5E5E;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(58, 94, 94, 0.15);
}

.method-btn--active {
  background: linear-gradient(135deg, #3A5E5E 0%, #2C5050 100%);
  border-color: #3A5E5E;
  color: white;
  box-shadow: 0 4px 12px rgba(58, 94, 94, 0.3);
}

.method-btn--active i {
  color: white;
}

/* Formularios de pago */
.payment-form {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

/* Stripe container */
.stripe-container {
  text-align: center;
}

.stripe-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
  background: linear-gradient(135deg, #635BFF 0%, #7B73FF 100%);
  border-radius: 12px 12px 0 0;
  margin: -1.5rem -1.5rem 1.5rem -1.5rem;
  color: white;
  font-weight: 600;
  font-size: 1rem;
}

.stripe-header i {
  font-size: 1.25rem;
}

.stripe-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  padding: 0.75rem 1rem;
  background: #e8f5e9;
  border-radius: 8px;
  color: #2e7d32;
  font-size: 0.85rem;
}

.stripe-info i {
  font-size: 1rem;
  color: #4caf50;
}

.stripe-info p {
  margin: 0;
}

/* Tarjeta de crédito */
.credit-card-preview {
  width: 100%;
  max-width: 380px;
  height: 220px;
  margin: 0 auto 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 1.5rem;
  color: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
}

.credit-card-preview::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-10%, -10%); }
}

.card-chip {
  width: 50px;
  height: 40px;
  background: linear-gradient(135deg, #f0c675 0%, #d4af37 100%);
  border-radius: 8px;
  margin-bottom: 1.5rem;
  position: relative;
}

.card-chip::before {
  content: '';
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  bottom: 8px;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 4px;
}

.card-number {
  font-size: 1.5rem;
  letter-spacing: 3px;
  font-family: 'Courier New', monospace;
  margin-bottom: 1.5rem;
}

.card-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.card-holder {
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.card-expiry {
  font-size: 0.875rem;
  font-family: 'Courier New', monospace;
}

.card-brand {
  position: absolute;
  bottom: 1.5rem;
  right: 1.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  font-style: italic;
  opacity: 0.3;
}

/* Campos del formulario */
.form-fields {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #2C3E50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-label i {
  color: #3A5E5E;
  font-size: 0.875rem;
}

.form-input {
  width: 100%;
  padding: 0.875rem 1rem;
  font-size: 0.9375rem;
  color: #2C3E50;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #3A5E5E;
  box-shadow: 0 0 0 3px rgba(58, 94, 94, 0.1);
}

.form-input::placeholder {
  color: #999;
}

/* Yape */
.yape-payment {
  text-align: center;
}

.yape-instructions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #e3f2fd;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  color: #1976d2;
  font-size: 0.9rem;
}

.yape-instructions i {
  font-size: 1.25rem;
}

.yape-qr-container {
  margin-bottom: 1.5rem;
}

.qr-placeholder {
  width: 220px;
  height: 220px;
  margin: 0 auto;
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
  color: #3A5E5E;
}

.qr-placeholder p {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
}

.qr-amount {
  font-size: 1.5rem;
  font-weight: 700;
  color: #3A5E5E;
}

.file-upload {
  position: relative;
}

.file-input {
  display: none;
}

.file-label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
  background: white;
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #666;
  font-weight: 600;
}

.file-label:hover {
  border-color: #3A5E5E;
  background: #f8f9fa;
}

.file-label i {
  font-size: 1.25rem;
  color: #3A5E5E;
}

.file-name {
  color: #3A5E5E;
  font-weight: 600;
}

/* Efectivo */
.cash-info {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  border-left: 4px solid #3A5E5E;
}

.cash-info > i {
  font-size: 1.5rem;
  color: #3A5E5E;
  flex-shrink: 0;
}

.cash-info h4 {
  margin: 0 0 0.5rem 0;
  color: #2C3E50;
  font-size: 1.125rem;
}

.cash-info p {
  margin: 0 0 0.75rem 0;
  color: #666;
  line-height: 1.6;
}

.cash-info p:last-child {
  margin-bottom: 0;
}

.cash-note {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #fff3cd;
  border-radius: 6px;
  color: #856404;
  font-size: 0.875rem;
}

.cash-note i {
  font-size: 1rem;
}

/* Botones de acción */
.payment-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-cancel,
.btn-confirm {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel {
  background: white;
  color: #666;
  border: 2px solid #e0e0e0;
}

.btn-cancel:hover {
  border-color: #999;
  color: #333;
}

.btn-confirm {
  background: linear-gradient(135deg, #3A5E5E 0%, #2C5050 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(58, 94, 94, 0.3);
}

.btn-confirm:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(58, 94, 94, 0.4);
}

.btn-confirm:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Responsive */
@media (max-width: 768px) {
  .method-buttons {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .credit-card-preview {
    max-width: 100%;
    height: 200px;
  }

  .payment-actions {
    flex-direction: column-reverse;
  }

  .btn-cancel,
  .btn-confirm {
    width: 100%;
    justify-content: center;
  }
}
</style>
