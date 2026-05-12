<template>
  <AuthLayout>
    <div class="auth-card">
      <div class="register-form">
        <div class="register-form__header">
          <h1 class="register-form__title">Regístrate como Propietario</h1>
          <p class="register-form__subtitle">Empieza a ganar dinero con tus vehículos</p>
        </div>

      <form @submit.prevent="handleSubmit" class="form">
        <!-- Personal Information -->
        <div class="form__section">
          <h3 class="form__section-title">Información Personal</h3>
          
          <div class="form__row">
            <div class="form__field">
              <label for="firstName" class="form__label">Nombre *</label>
              <input
                id="firstName"
                v-model="formData.firstName"
                type="text"
                class="form__input"
                :class="{ 'form__input--error': errors.firstName }"
                placeholder="Ej: Carlos"
                required
              />
              <span v-if="errors.firstName" class="form__error">{{ errors.firstName }}</span>
            </div>

            <div class="form__field">
              <label for="lastName" class="form__label">Apellido *</label>
              <input
                id="lastName"
                v-model="formData.lastName"
                type="text"
                class="form__input"
                :class="{ 'form__input--error': errors.lastName }"
                placeholder="Ej: Mendoza"
                required
              />
              <span v-if="errors.lastName" class="form__error">{{ errors.lastName }}</span>
            </div>
          </div>

          <div class="form__field">
            <label for="email" class="form__label">Correo Electrónico *</label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              class="form__input"
              :class="{ 'form__input--error': errors.email }"
              placeholder="tu@email.com"
              required
            />
            <span v-if="errors.email" class="form__error">{{ errors.email }}</span>
          </div>

          <div class="form__field">
            <label for="phone" class="form__label">Teléfono *</label>
            <input
              id="phone"
              v-model="formData.phone"
              type="tel"
              class="form__input"
              :class="{ 'form__input--error': errors.phone }"
              placeholder="+51 999 999 999"
              required
            />
            <span v-if="errors.phone" class="form__error">{{ errors.phone }}</span>
          </div>
        </div>

        <!-- Security -->
        <div class="form__section">
          <h3 class="form__section-title">Seguridad</h3>
          
          <div class="form__field">
            <label for="password" class="form__label">Contraseña *</label>
            <div class="form__input-wrapper">
              <input
                id="password"
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                class="form__input"
                :class="{ 'form__input--error': errors.password }"
                placeholder="Mínimo 8 caracteres"
                required
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="form__input-icon"
              >
                <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                  <line x1="2" x2="22" y1="2" y2="22"></line>
                </svg>
              </button>
            </div>
            <span v-if="errors.password" class="form__error">{{ errors.password }}</span>
          </div>

          <div class="form__field">
            <label for="confirmPassword" class="form__label">Confirmar Contraseña *</label>
            <div class="form__input-wrapper">
              <input
                id="confirmPassword"
                v-model="formData.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                class="form__input"
                :class="{ 'form__input--error': errors.confirmPassword }"
                placeholder="Repite tu contraseña"
                required
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="form__input-icon"
              >
                <svg v-if="!showConfirmPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                  <line x1="2" x2="22" y1="2" y2="22"></line>
                </svg>
              </button>
            </div>
            <span v-if="errors.confirmPassword" class="form__error">{{ errors.confirmPassword }}</span>
          </div>
        </div>

        <!-- Identification -->
        <div class="form__section">
          <h3 class="form__section-title">Identificación</h3>
          
          <div class="form__row">
            <div class="form__field">
              <label for="dni" class="form__label">DNI *</label>
              <input
                id="dni"
                v-model="formData.dni"
                type="text"
                class="form__input"
                :class="{ 'form__input--error': errors.dni }"
                placeholder="12345678"
                maxlength="8"
                required
              />
              <span v-if="errors.dni" class="form__error">{{ errors.dni }}</span>
            </div>

            <div class="form__field">
              <label for="licenseNumber" class="form__label">Licencia de Conducir *</label>
              <input
                id="licenseNumber"
                v-model="formData.licenseNumber"
                type="text"
                class="form__input"
                :class="{ 'form__input--error': errors.licenseNumber }"
                placeholder="Q12345678"
                required
              />
              <span v-if="errors.licenseNumber" class="form__error">{{ errors.licenseNumber }}</span>
            </div>
          </div>
        </div>

        <!-- Bank Information -->
        <div class="form__section">
          <h3 class="form__section-title">Información Bancaria</h3>
          <p class="form__section-description">
            Necesitamos esta información para transferir tus ganancias por los alquileres.
          </p>
          
          <div class="form__field">
            <label for="bankName" class="form__label">Banco *</label>
            <select
              id="bankName"
              v-model="formData.bankName"
              class="form__input"
              :class="{ 'form__input--error': errors.bankName }"
              required
            >
              <option value="">Selecciona tu banco</option>
              <option value="BCP">BCP - Banco de Crédito del Perú</option>
              <option value="BBVA">BBVA</option>
              <option value="Interbank">Interbank</option>
              <option value="Scotiabank">Scotiabank</option>
              <option value="BanBif">BanBif</option>
              <option value="Pichincha">Banco Pichincha</option>
              <option value="GNB">GNB</option>
              <option value="Falabella">Banco Falabella</option>
              <option value="Ripley">Banco Ripley</option>
              <option value="otro">Otro</option>
            </select>
            <span v-if="errors.bankName" class="form__error">{{ errors.bankName }}</span>
          </div>

          <div class="form__row">
            <div class="form__field">
              <label for="accountType" class="form__label">Tipo de Cuenta *</label>
              <select
                id="accountType"
                v-model="formData.accountType"
                class="form__input"
                :class="{ 'form__input--error': errors.accountType }"
                required
              >
                <option value="">Selecciona el tipo</option>
                <option value="ahorro">Cuenta de Ahorro</option>
                <option value="corriente">Cuenta Corriente</option>
                <option value="cci">Cuenta CCI</option>
              </select>
              <span v-if="errors.accountType" class="form__error">{{ errors.accountType }}</span>
            </div>

            <div class="form__field">
              <label for="accountNumber" class="form__label">Número de Cuenta *</label>
              <input
                id="accountNumber"
                v-model="formData.accountNumber"
                type="text"
                class="form__input"
                :class="{ 'form__input--error': errors.accountNumber }"
                placeholder="123456789012345678"
                required
              />
              <span v-if="errors.accountNumber" class="form__error">{{ errors.accountNumber }}</span>
            </div>
          </div>

          <div class="form__info">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 16v-4"></path>
              <path d="M12 8h.01"></path>
            </svg>
            <p>Tu información bancaria está protegida y será utilizada únicamente para procesamiento de pagos.</p>
          </div>
        </div>

        <!-- Terms -->
        <div class="form__terms">
          <label class="form__checkbox">
            <input
              v-model="formData.acceptTerms"
              type="checkbox"
              required
            />
            <span>
              Acepto los <a href="#" class="link">Términos y Condiciones</a>, 
              <a href="#" class="link">Política de Privacidad</a> y 
              <a href="#" class="link">Términos de Servicio para Propietarios</a>
            </span>
          </label>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="form__submit"
          :disabled="isSubmitting"
        >
          <span v-if="!isSubmitting">Crear mi cuenta de propietario</span>
          <span v-else>Creando cuenta...</span>
        </button>

        <!-- Login Link -->
        <div class="form__footer">
          <p>¿Ya tienes una cuenta? <router-link to="/login" class="link">Inicia sesión</router-link></p>
        </div>
      </form>
    </div>
    </div>
  </AuthLayout>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import AuthLayout from '../components/AuthLayout.vue'
import { register } from '../application/user.store.js'

const router = useRouter()
const isSubmitting = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const formData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  dni: '',
  licenseNumber: '',
  bankName: '',
  accountType: '',
  accountNumber: '',
  acceptTerms: false
})

const errors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  dni: '',
  licenseNumber: '',
  bankName: '',
  accountType: '',
  accountNumber: ''
})

const validateForm = () => {
  let isValid = true
  
  // Reset errors
  Object.keys(errors).forEach(key => errors[key] = '')

  // Validate firstName
  if (formData.firstName.trim().length < 2) {
    errors.firstName = 'El nombre debe tener al menos 2 caracteres'
    isValid = false
  }

  // Validate lastName
  if (formData.lastName.trim().length < 2) {
    errors.lastName = 'El apellido debe tener al menos 2 caracteres'
    isValid = false
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(formData.email)) {
    errors.email = 'Ingresa un correo electrónico válido'
    isValid = false
  }

  // Validate phone
  const phoneRegex = /^\+?[\d\s-]{9,}$/
  if (!phoneRegex.test(formData.phone)) {
    errors.phone = 'Ingresa un número de teléfono válido'
    isValid = false
  }

  // Validate password
  if (formData.password.length < 8) {
    errors.password = 'La contraseña debe tener al menos 8 caracteres'
    isValid = false
  }

  // Validate password confirmation
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden'
    isValid = false
  }

  // Validate DNI
  const dniRegex = /^\d{8}$/
  if (!dniRegex.test(formData.dni)) {
    errors.dni = 'El DNI debe tener 8 dígitos'
    isValid = false
  }

  // Validate license
  if (formData.licenseNumber.trim().length < 5) {
    errors.licenseNumber = 'Ingresa un número de licencia válido'
    isValid = false
  }

  // Validate bank name
  if (!formData.bankName) {
    errors.bankName = 'Selecciona tu banco'
    isValid = false
  }

  // Validate account type
  if (!formData.accountType) {
    errors.accountType = 'Selecciona el tipo de cuenta'
    isValid = false
  }

  // Validate account number
  if (formData.accountNumber.trim().length < 10) {
    errors.accountNumber = 'Ingresa un número de cuenta válido'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    // Create new user using the register function from store
    const userData = {
      role: 'owner',
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.toLowerCase().trim(),
      password: formData.password,
      phone: formData.phone.trim(),
      dni: formData.dni,
      licenseNumber: formData.licenseNumber.trim(),
      bankAccount: {
        bankName: formData.bankName,
        accountType: formData.accountType,
        accountNumber: formData.accountNumber,
        verified: false
      },
      preferences: {
        language: 'es',
        notifications: {
          email: true,
          push: true,
          sms: false
        }
      }
    }

    const user = await register(userData)

    // Show success message
    alert('✅ Cuenta creada exitosamente! Bienvenido a MOVEO')

    // Redirect based on role (user is already authenticated with JWT)
    setTimeout(() => {
      if (user.role === 'owner') {
        router.push('/rental/my-vehicles')
      } else {
        router.push('/dashboard')
      }
    }, 500)
  } catch (error) {
    console.error('Error creating account:', error)
    alert('Hubo un error al crear tu cuenta. Por favor intenta nuevamente.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.auth-card {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 111, 0, 0.1);
  border: 2px solid transparent;
  background-clip: padding-box;
  position: relative;
  max-width: 600px;
  width: 100%;
  animation: cardEntry 0.6s ease;
}

@keyframes cardEntry {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.auth-card::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(135deg, #FF6F00 0%, #FF8F00 50%, #FF6F00 100%);
  border-radius: 20px;
  z-index: -1;
  opacity: 0.5;
  animation: borderGlow 3s ease-in-out infinite;
}

@keyframes borderGlow {
  0%, 100% {
    opacity: 0.5;
    filter: blur(0px);
  }
  50% {
    opacity: 0.8;
    filter: blur(2px);
  }
}

.auth-card::after {
  content: '';
  position: absolute;
  inset: -10px;
  background: radial-gradient(circle at top right, rgba(255, 111, 0, 0.15), transparent 70%);
  border-radius: 30px;
  z-index: -2;
  animation: halo 4s ease-in-out infinite;
}

@keyframes halo {
  0%, 100% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.6;
  }
}

.register-form {
  width: 100%;
}

.register-form__header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.register-form__title {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #FF6F00 0%, #FF8F00 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
}

.register-form__subtitle {
  font-size: 1rem;
  color: #666;
}

.form__section {
  margin-bottom: 2rem;
}

.form__section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #2C3E50;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #FF6F00;
}

.form__section-description {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.form__row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.form__field {
  margin-bottom: 1.25rem;
}

.form__label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #2C3E50;
  margin-bottom: 0.5rem;
}

.form__input-wrapper {
  position: relative;
}

.form__input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 0.9375rem;
  color: #2C3E50;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.form__input:focus {
  outline: none;
  border-color: #FF6F00;
  box-shadow: 0 0 0 3px rgba(255, 111, 0, 0.1);
}

.form__input--error {
  border-color: #ef4444;
}

.form__input--error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.form__input-wrapper .form__input {
  padding-right: 3rem;
}

.form__input-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.form__input-icon:hover {
  color: #2C3E50;
}

.form__error {
  display: block;
  font-size: 0.8125rem;
  color: #ef4444;
  margin-top: 0.375rem;
}

.form__info {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: #eff6ff;
  border-left: 3px solid #FF6F00;
  border-radius: 8px;
  margin-top: 1rem;
}

.form__info svg {
  flex-shrink: 0;
  color: #FF6F00;
  margin-top: 0.125rem;
}

.form__info p {
  font-size: 0.875rem;
  color: #666;
  line-height: 1.5;
  margin: 0;
}

.form__terms {
  margin-bottom: 1.5rem;
}

.form__checkbox {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
}

.form__checkbox input[type="checkbox"] {
  margin-top: 0.25rem;
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.form__checkbox span {
  font-size: 0.875rem;
  color: #666;
  line-height: 1.5;
}

.form__submit {
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #FF6F00 0%, #FF8F00 100%);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.form__submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(255, 111, 0, 0.3);
}

.form__submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form__footer {
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e0e0;
}

.form__footer p {
  font-size: 0.9375rem;
  color: #666;
}

.link {
  color: #FF6F00;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

.link:hover {
  color: #3A5E5E;
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 768px) {
  .auth-card {
    padding: 2rem;
  }

  .register-form__title {
    font-size: 1.75rem;
  }

  .form__row {
    grid-template-columns: 1fr;
  }
}
</style>
