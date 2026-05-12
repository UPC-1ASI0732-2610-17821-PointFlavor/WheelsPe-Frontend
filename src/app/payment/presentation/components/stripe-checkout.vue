<template>
  <div class="stripe-checkout">
    <form @submit.prevent="handleSubmit">
      <div class="form-row">
        <label for="card-element">
          Tarjeta de Crédito o Débito
        </label>
        <div id="card-element" class="card-element">
          <!-- A Stripe Element will be inserted here. -->
        </div>
        <!-- Used to display form errors. -->
        <div id="card-errors" role="alert" v-if="errorMessage">{{ errorMessage }}</div>
      </div>

      <button type="submit" :disabled="loading || !stripe" class="pay-button">
        {{ loading ? 'Procesando...' : `Pagar S/. ${amount}` }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { loadStripe } from '@stripe/stripe-js'

const props = defineProps({
  amount: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['success', 'error'])

const stripe = ref(null)
const elements = ref(null)
const card = ref(null)
const errorMessage = ref('')
const loading = ref(false)

// Use the key from environment variables
const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

onMounted(async () => {
  if (!stripeKey) {
    errorMessage.value = 'Error de configuración: Falta la clave de Stripe.'
    return
  }

  stripe.value = await loadStripe(stripeKey)
  elements.value = stripe.value.elements()

  const style = {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  }

  card.value = elements.value.create('card', { style })
  card.value.mount('#card-element')

  card.value.on('change', (event) => {
    if (event.error) {
      errorMessage.value = event.error.message
    } else {
      errorMessage.value = ''
    }
  })
})

const handleSubmit = async () => {
  if (!stripe.value || !elements.value) return

  loading.value = true
  errorMessage.value = ''

  // In a real app, you would create a PaymentIntent on the server and confirm it here.
  // For this demo/mock, we'll create a token or just simulate success if in test mode.
  
  try {
    const { token, error } = await stripe.value.createToken(card.value)

    if (error) {
      errorMessage.value = error.message
      loading.value = false
      emit('error', error)
    } else {
      // Send the token to your server
      loading.value = false
      emit('success', token)
    }
  } catch (e) {
    errorMessage.value = 'Ocurrió un error inesperado.'
    loading.value = false
    emit('error', e)
  }
}
</script>

<style scoped>
.stripe-checkout {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #e6ebf1;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.form-row {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  color: #32325d;
}

.card-element {
  padding: 12px;
  border: 1px solid #e6ebf1;
  border-radius: 4px;
  background: white;
  transition: box-shadow 150ms ease;
}

.card-element:focus-within {
  box-shadow: 0 1px 3px 0 #cfd7df;
}

#card-errors {
  color: #fa755a;
  margin-top: 8px;
  font-size: 14px;
}

.pay-button {
  width: 100%;
  padding: 12px;
  background: #5469d4;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.pay-button:hover {
  background: #4353ac;
}

.pay-button:disabled {
  background: #aab7c4;
  cursor: not-allowed;
}
</style>
