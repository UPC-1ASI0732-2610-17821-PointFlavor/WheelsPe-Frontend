<template>
  <div class="payment-page">
    <div class="payment-container">
      <div class="payment-header">
        <h1>Finalizar Pago</h1>
        <p>Completa tu transacción de forma segura</p>
      </div>

      <div class="order-summary">
        <h3>Resumen del Pedido</h3>
        <div class="summary-item">
          <span>Concepto:</span>
          <span>{{ description }}</span>
        </div>
        <div class="summary-item total">
          <span>Total a Pagar:</span>
          <span>S/. {{ amount }}</span>
        </div>
      </div>

      <div class="payment-method">
        <h3>Método de Pago</h3>
        <StripeCheckout 
          :amount="amount" 
          @success="handlePaymentSuccess" 
          @error="handlePaymentError" 
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import StripeCheckout from '../components/stripe-checkout.vue'
import usePaymentsStore from '../../application/payment.store.js'

const route = useRoute()
const router = useRouter()
const paymentStore = usePaymentsStore()

// Get details from query params or default
const amount = computed(() => Number(route.query.amount) || 100)
const description = computed(() => route.query.description || 'Reserva de Aventura')
const referenceId = computed(() => route.query.ref || 'REF-' + Date.now())

const handlePaymentSuccess = async (token) => {
  try {
    // Here we would send the token to the backend to charge the card
    // For now, we simulate recording the payment in our store
    const paymentData = {
      amount: amount.value,
      currency: 'PEN',
      description: description.value,
      status: 'completed',
      paymentMethod: 'card',
      transactionId: token.id, // Stripe token ID
      referenceId: referenceId.value,
      date: new Date().toISOString()
    }

    await paymentStore.addPayment(paymentData)
    
    alert('¡Pago realizado con éxito!')
    router.push('/dashboard') // Or wherever appropriate
  } catch (error) {
    console.error('Error saving payment:', error)
    alert('El pago se procesó pero hubo un error al guardarlo.')
  }
}

const handlePaymentError = (error) => {
  console.error('Payment error:', error)
  // Error is already displayed in the component
}
</script>

<style scoped>
.payment-page {
  min-height: 100vh;
  background-color: #f4f7fa;
  padding: 40px 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.payment-container {
  background: white;
  width: 100%;
  max-width: 600px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  padding: 30px;
}

.payment-header {
  text-align: center;
  margin-bottom: 30px;
}

.payment-header h1 {
  color: #2c3e50;
  margin-bottom: 8px;
}

.order-summary {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.order-summary h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #2c3e50;
  font-size: 1.1rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  color: #4a5568;
}

.summary-item.total {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #e2e8f0;
  font-weight: bold;
  color: #2c3e50;
  font-size: 1.2rem;
}

.payment-method h3 {
  color: #2c3e50;
  margin-bottom: 15px;
}
</style>
