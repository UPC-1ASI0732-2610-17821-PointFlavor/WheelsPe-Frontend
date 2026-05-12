<template>
  <div class="profile-page">
    <div class="container">
      <!-- Header del perfil -->
      <div class="profile-header">
        <div class="profile-avatar">
          <div class="avatar-circle">
            {{ userInitials }}
          </div>
          <button class="avatar-edit-btn" title="Cambiar foto">
            📷
          </button>
        </div>
        
        <div class="profile-info">
          <h1 class="profile-name">{{ userName }}</h1>
          <p class="profile-email">{{ currentUser?.email }}</p>
          <div class="profile-badges">
            <span class="badge" :class="currentUser?.role">
              {{ currentUser?.role === 'renter' ? '👤 Cliente' : '🚗 Propietario' }}
            </span>
            <span v-if="currentUser?.isVerified" class="badge verified">
              ✓ Verificado
            </span>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="profile-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          @click="activeTab = tab.value"
          class="tab-btn"
          :class="{ active: activeTab === tab.value }"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          <span class="tab-label">{{ tab.label }}</span>
        </button>
      </div>

      <!-- Contenido de tabs -->
      <div class="tab-content">
        <!-- Tab: Información Personal -->
        <div v-if="activeTab === 'personal'" class="tab-panel">
          <div class="info-grid">
            <div class="info-card">
              <h3 class="card-title">📋 Información Personal</h3>
              <div class="info-list">
                <div class="info-item">
                  <span class="info-label">Nombre completo:</span>
                  <span class="info-value">{{ userName }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Correo electrónico:</span>
                  <span class="info-value">{{ currentUser?.email }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Teléfono:</span>
                  <span class="info-value">{{ currentUser?.phone }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">DNI:</span>
                  <span class="info-value">{{ currentUser?.dni }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Licencia de conducir:</span>
                  <span class="info-value">{{ currentUser?.licenseNumber }}</span>
                </div>
              </div>
              <button class="btn btn-secondary">
                <span class="icon">✏️</span>
                Editar información
              </button>
            </div>

            <div class="info-card">
              <h3 class="card-title">🔐 Verificación</h3>
              <div class="verification-status">
                <div class="verification-item" :class="{ verified: currentUser?.isVerified }">
                  <span class="verification-icon">{{ currentUser?.isVerified ? '✅' : '⏳' }}</span>
                  <div class="verification-info">
                    <p class="verification-title">Identidad verificada</p>
                    <p class="verification-desc">
                      {{ currentUser?.isVerified ? 'Tu identidad ha sido verificada' : 'Verifica tu identidad para mayor confianza' }}
                    </p>
                  </div>
                </div>
                <div class="verification-item verified">
                  <span class="verification-icon">✅</span>
                  <div class="verification-info">
                    <p class="verification-title">Email verificado</p>
                    <p class="verification-desc">{{ currentUser?.email }}</p>
                  </div>
                </div>
                <div class="verification-item verified">
                  <span class="verification-icon">✅</span>
                  <div class="verification-info">
                    <p class="verification-title">Teléfono verificado</p>
                    <p class="verification-desc">{{ currentUser?.phone }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab: Preferencias -->
        <div v-if="activeTab === 'preferences'" class="tab-panel">
          <user-preferences />
        </div>

        <!-- Tab: Seguridad -->
        <div v-if="activeTab === 'security'" class="tab-panel">
          <div class="info-card">
            <h3 class="card-title">🔒 Seguridad de la cuenta</h3>
            <div class="security-options">
              <div class="security-option">
                <div class="security-option-info">
                  <p class="security-option-title">Cambiar contraseña</p>
                  <p class="security-option-desc">Actualiza tu contraseña periódicamente para mayor seguridad</p>
                </div>
                <button class="btn btn-secondary">Cambiar</button>
              </div>
              
              <!-- 2FA Section - Modern Minimal Design -->
              <div class="security-option twofa-section" :class="{ 'enabled': twoFAEnabled }">
                <div class="security-option-info">
                  <div class="twofa-header">
                    <p class="security-option-title">
                      Autenticación de dos factores
                      <span v-if="twoFAEnabled" class="twofa-badge enabled">
                        <i class="pi pi-check-circle"></i> Activo
                      </span>
                      <span v-else class="twofa-badge disabled">
                        <i class="pi pi-shield"></i> Inactivo
                      </span>
                    </p>
                  </div>
                  <p class="security-option-desc">
                    {{ twoFAEnabled 
                      ? `Protegido con el número: ${maskedPhone}` 
                      : 'Agrega una capa extra de seguridad a tu cuenta con SMS' 
                    }}
                  </p>
                </div>
                <button 
                  v-if="!twoFAEnabled"
                  @click="openTwoFAModal" 
                  class="btn btn-primary-2fa"
                >
                  <i class="pi pi-shield"></i>
                  Activar
                </button>
                <button 
                  v-else 
                  @click="confirmDisable2FA"
                  class="btn btn-danger-outline"
                >
                  <i class="pi pi-times"></i>
                  Desactivar
                </button>
              </div>
              
              <div class="security-option">
                <div class="security-option-info">
                  <p class="security-option-title">Sesiones activas</p>
                  <p class="security-option-desc">Revisa y cierra sesiones en otros dispositivos</p>
                </div>
                <button class="btn btn-secondary">Ver sesiones</button>
              </div>
            </div>
          </div>
        </div>

        <!-- demo tab removed -->
      </div>
    </div>

    <!-- 2FA Setup Modal - Modern Minimal Design -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showTwoFAModal" class="twofa-modal-overlay" @click="closeTwoFAModal">
          <div class="twofa-modal" @click.stop>
            <!-- Close Button -->
            <button @click="closeTwoFAModal" class="modal-close-btn">
              <i class="pi pi-times"></i>
            </button>
            
            <!-- Step Indicator -->
            <div class="step-indicator">
              <div class="step" :class="{ active: twoFAStep === 1, completed: twoFAStep > 1 }">
                <span class="step-number">1</span>
                <span class="step-label">Teléfono</span>
              </div>
              <div class="step-line" :class="{ active: twoFAStep > 1 }"></div>
              <div class="step" :class="{ active: twoFAStep === 2, completed: twoFAStep > 2 }">
                <span class="step-number">2</span>
                <span class="step-label">Verificar</span>
              </div>
              <div class="step-line" :class="{ active: twoFAStep > 2 }"></div>
              <div class="step" :class="{ active: twoFAStep === 3 }">
                <span class="step-number">3</span>
                <span class="step-label">Listo</span>
              </div>
            </div>
            
            <!-- Step 1: Phone Number -->
            <div v-if="twoFAStep === 1" class="twofa-step">
              <div class="step-icon">
                <i class="pi pi-mobile"></i>
              </div>
              <h2>Ingresa tu número de teléfono</h2>
              <p class="step-description">
                Te enviaremos un código de verificación por SMS
              </p>
              
              <div class="phone-input-container">
                <div class="country-code">
                  <span>🇵🇪</span>
                  <span>+51</span>
                </div>
                <input 
                  v-model="phoneNumber"
                  type="tel"
                  placeholder="999 888 777"
                  maxlength="12"
                  class="phone-input"
                  @input="formatPhone"
                />
              </div>
              
              <p v-if="twoFAError" class="error-message">
                <i class="pi pi-exclamation-circle"></i>
                {{ twoFAError }}
              </p>
              
              <button 
                @click="sendVerificationCode" 
                class="btn-2fa-primary"
                :disabled="!isValidPhone || sendingCode"
              >
                <i v-if="sendingCode" class="pi pi-spin pi-spinner"></i>
                <i v-else class="pi pi-send"></i>
                {{ sendingCode ? 'Enviando...' : 'Enviar código' }}
              </button>
            </div>
            
            <!-- Step 2: Verify Code -->
            <div v-if="twoFAStep === 2" class="twofa-step">
              <div class="step-icon verify">
                <i class="pi pi-key"></i>
              </div>
              <h2>Ingresa el código</h2>
              <p class="step-description">
                Enviamos un código de 6 dígitos a<br>
                <strong>+51 {{ phoneNumber }}</strong>
              </p>
              
              <div class="code-input-container">
                <input 
                  v-for="(digit, index) in 6" 
                  :key="index"
                  :ref="el => codeInputs[index] = el"
                  v-model="verificationCode[index]"
                  type="text"
                  maxlength="1"
                  class="code-digit"
                  @input="handleCodeInput(index, $event)"
                  @keydown="handleCodeKeydown(index, $event)"
                  @paste="handleCodePaste"
                />
              </div>
              
              <p v-if="twoFAError" class="error-message">
                <i class="pi pi-exclamation-circle"></i>
                {{ twoFAError }}
              </p>
              
              <button 
                @click="verifyCode" 
                class="btn-2fa-primary"
                :disabled="!isCodeComplete || verifyingCode"
              >
                <i v-if="verifyingCode" class="pi pi-spin pi-spinner"></i>
                <i v-else class="pi pi-check"></i>
                {{ verifyingCode ? 'Verificando...' : 'Verificar' }}
              </button>
              
              <button @click="resendCode" class="btn-resend" :disabled="resendCooldown > 0">
                {{ resendCooldown > 0 ? `Reenviar en ${resendCooldown}s` : 'Reenviar código' }}
              </button>
            </div>
            
            <!-- Step 3: Success -->
            <div v-if="twoFAStep === 3" class="twofa-step success">
              <div class="step-icon success">
                <i class="pi pi-check"></i>
              </div>
              <h2>¡2FA Activado!</h2>
              <p class="step-description">
                Tu cuenta ahora está protegida con<br>autenticación de dos factores
              </p>
              
              <div class="success-info">
                <div class="info-row">
                  <i class="pi pi-phone"></i>
                  <span>+51 {{ phoneNumber }}</span>
                </div>
                <p class="info-note">
                  Recibirás un código SMS cada vez que inicies sesión
                </p>
              </div>
              
              <button @click="closeTwoFAModal" class="btn-2fa-primary">
                <i class="pi pi-check"></i>
                Entendido
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '@/app/iam/application/user.store.js'
import { useProfileStore } from '@/app/profile/application/profile.store.js'
import UserPreferences from '@/app/iam/components/user-preferences.vue'
import { sendVerificationSMS, verifyCode as verifySMSCode } from '@/app/iam/infrastructure/twilio.service.js'

const { currentUser, userName, userInitials } = useUserStore()
const profileStore = useProfileStore()

const activeTab = ref('personal')

const tabs = [
  { value: 'personal', label: 'Información Personal', icon: '👤' },
  { value: 'preferences', label: 'Preferencias', icon: '⚙️' },
  { value: 'security', label: 'Seguridad', icon: '🔒' }
]

const joinedDate = computed(() => {
  if (!currentUser.value?.joinedAt) return ''
  const date = new Date(currentUser.value.joinedAt)
  return date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })
})

const profileData = computed(() => profileStore.profile)
const verificationProgress = computed(() => profileStore.verificationLevel)
const profileStats = computed(() => profileData.value?.stats || {})

// ==================
// 2FA STATE & LOGIC
// ==================

// 2FA State
const twoFAEnabled = ref(false)
const twoFAPhone = ref('')
const showTwoFAModal = ref(false)
const twoFAStep = ref(1)
const phoneNumber = ref('')
const verificationCode = ref(['', '', '', '', '', ''])
const codeInputs = ref([])
const twoFAError = ref('')
const sendingCode = ref(false)
const verifyingCode = ref(false)
const resendCooldown = ref(0)
let cooldownInterval = null

// Computed
const maskedPhone = computed(() => {
  if (!twoFAPhone.value) return ''
  const phone = twoFAPhone.value.replaceAll(' ', '')
  return `+51 *** *** ${phone.slice(-3)}`
})

const isValidPhone = computed(() => {
  const cleaned = phoneNumber.value.replaceAll(' ', '')
  return cleaned.length >= 9
})

const isCodeComplete = computed(() => {
  return verificationCode.value.every(digit => digit !== '')
})

// Methods
function formatPhone(event) {
  let value = event.target.value.replaceAll(/\D/g, '')
  if (value.length > 9) value = value.slice(0, 9)
  
  // Format: XXX XXX XXX
  if (value.length > 6) {
    value = `${value.slice(0, 3)} ${value.slice(3, 6)} ${value.slice(6)}`
  } else if (value.length > 3) {
    value = `${value.slice(0, 3)} ${value.slice(3)}`
  }
  
  phoneNumber.value = value
}

function openTwoFAModal() {
  showTwoFAModal.value = true
  twoFAStep.value = 1
  phoneNumber.value = ''
  verificationCode.value = ['', '', '', '', '', '']
  twoFAError.value = ''
}

function closeTwoFAModal() {
  showTwoFAModal.value = false
  if (cooldownInterval) {
    clearInterval(cooldownInterval)
    cooldownInterval = null
  }
}

async function sendVerificationCode() {
  if (!isValidPhone.value) return
  
  twoFAError.value = ''
  sendingCode.value = true
  
  try {
    // Send SMS via Twilio Verify API
    const result = await sendVerificationSMS(phoneNumber.value)
    
    if (result.success) {
      // Move to step 2
      twoFAStep.value = 2
      startResendCooldown()
      
      // Focus first code input after transition
      setTimeout(() => {
        if (codeInputs.value[0]) {
          codeInputs.value[0].focus()
        }
      }, 100)
    } else {
      twoFAError.value = result.error || 'Error al enviar el código'
    }
    
  } catch (error) {
    console.error('Error sending 2FA code:', error)
    twoFAError.value = 'Error al enviar el código. Intenta de nuevo.'
  } finally {
    sendingCode.value = false
  }
}

function startResendCooldown() {
  resendCooldown.value = 60
  cooldownInterval = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0) {
      clearInterval(cooldownInterval)
      cooldownInterval = null
    }
  }, 1000)
}

async function resendCode() {
  if (resendCooldown.value > 0) return
  
  twoFAError.value = ''
  sendingCode.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    startResendCooldown()
    verificationCode.value = ['', '', '', '', '', '']
    if (codeInputs.value[0]) {
      codeInputs.value[0].focus()
    }
  } catch (error) {
    console.error('Error resending 2FA code:', error)
    twoFAError.value = 'Error al reenviar el código.'
  } finally {
    sendingCode.value = false
  }
}

function handleCodeInput(index, event) {
  const value = event.target.value
  
  // Only allow digits
  if (!/^\d*$/.test(value)) {
    verificationCode.value[index] = ''
    return
  }
  
  // Move to next input
  if (value && index < 5) {
    codeInputs.value[index + 1]?.focus()
  }
  
  // Auto-verify when complete
  if (isCodeComplete.value) {
    verifyCode()
  }
}

function handleCodeKeydown(index, event) {
  // Handle backspace
  if (event.key === 'Backspace' && !verificationCode.value[index] && index > 0) {
    codeInputs.value[index - 1]?.focus()
  }
}

function handleCodePaste(event) {
  event.preventDefault()
  const pastedData = event.clipboardData.getData('text').replaceAll(/\D/g, '').slice(0, 6)
  
  for (let i = 0; i < 6; i++) {
    verificationCode.value[i] = pastedData[i] || ''
  }
  
  if (pastedData.length === 6) {
    verifyCode()
  }
}

async function verifyCode() {
  if (!isCodeComplete.value) return
  
  twoFAError.value = ''
  verifyingCode.value = true
  
  try {
    const code = verificationCode.value.join('')
    
    // Verify code using Twilio Verify API
    const result = await verifySMSCode(phoneNumber.value, code)
    
    if (result.success) {
      // Success!
      twoFAEnabled.value = true
      twoFAPhone.value = phoneNumber.value
      twoFAStep.value = 3
      
      // Save to user profile (in real app, save to backend)
      localStorage.setItem('2fa_enabled', 'true')
      localStorage.setItem('2fa_phone', phoneNumber.value)
    } else {
      twoFAError.value = result.error || 'Código incorrecto. Intenta de nuevo.'
    }
    
  } catch (error) {
    console.error('Error verifying 2FA code:', error)
    twoFAError.value = 'Error al verificar el código.'
  } finally {
    verifyingCode.value = false
  }
}

function confirmDisable2FA() {
  if (confirm('¿Estás seguro de que deseas desactivar la autenticación de dos factores? Tu cuenta será menos segura.')) {
    twoFAEnabled.value = false
    twoFAPhone.value = ''
    localStorage.removeItem('2fa_enabled')
    localStorage.removeItem('2fa_phone')
  }
}

// Load 2FA status on mount
onMounted(async () => {
  if (currentUser.value?.id) {
    await profileStore.fetchProfile(currentUser.value.id)
  }
  
  // Load 2FA status from localStorage (in real app, from backend)
  const savedEnabled = localStorage.getItem('2fa_enabled')
  const savedPhone = localStorage.getItem('2fa_phone')
  if (savedEnabled === 'true' && savedPhone) {
    twoFAEnabled.value = true
    twoFAPhone.value = savedPhone
  }
})

onUnmounted(() => {
  if (cooldownInterval) {
    clearInterval(cooldownInterval)
  }
})
</script>

<style scoped>
.profile-page {
  min-height: calc(100vh - 200px);
  background: var(--bg-base);
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Profile Header */
.profile-header {
  display: flex;
  gap: 2rem;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.profile-avatar {
  position: relative;
  flex-shrink: 0;
}

.avatar-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--bg-moveo-green) 0%, var(--brand-green) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-family-primary);
  font-size: 3rem;
  font-weight: 700;
  color: var(--text-secondary-2);
}

.avatar-edit-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--bg-moveo-orange);
  border: 3px solid white;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.avatar-edit-btn:hover {
  transform: scale(1.1);
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-family: var(--font-family-primary);
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
}

.profile-email {
  font-family: var(--font-family-primary);
  color: var(--text-secondary);
  margin: 0 0 1rem 0;
}

.profile-badges {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.badge {
  padding: 0.4rem 0.75rem;
  border-radius: 20px;
  font-family: var(--font-family-primary);
  font-size: 0.85rem;
  font-weight: 600;
}

.badge.renter {
  background: var(--bg-moveo-green);
  color: var(--text-secondary-2);
}

.badge.owner {
  background: var(--bg-moveo-orange);
  color: var(--text-secondary-2);
}

.badge.verified {
  background: #10b981;
  color: white;
}

.profile-stats {
  display: flex;
  gap: 2rem;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.stat-icon {
  font-size: 1.5rem;
}

.stat-value {
  font-family: var(--font-family-primary);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-label {
  font-family: var(--font-family-primary);
  font-size: 0.75rem;
  color: var(--text-secondary);
}

/* Tabs */
.profile-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid var(--bg-muted);
  overflow-x: auto;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  font-family: var(--font-family-primary);
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.tab-btn:hover {
  color: var(--text-primary);
  background: var(--bg-base);
}

.tab-btn.active {
  color: var(--brand-green);
  border-bottom-color: var(--brand-green);
}

.tab-icon {
  font-size: 1.2rem;
}

/* Tab Content */
.tab-panel {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.info-grid {
  display: grid;
  gap: 2rem;
}

.info-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.card-title {
  font-family: var(--font-family-primary);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 1.5rem 0;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--bg-muted);
}

.info-label {
  font-family: var(--font-family-primary);
  font-weight: 600;
  color: var(--text-secondary);
}

.info-value {
  font-family: var(--font-family-primary);
  color: var(--text-primary);
  font-weight: 500;
}

/* Verification */
.verification-status {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.verification-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  background: var(--bg-base);
}

.verification-item.verified {
  background: #ecfdf5;
}

.verification-icon {
  font-size: 2rem;
}

.verification-title {
  font-family: var(--font-family-primary);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
}

.verification-desc {
  font-family: var(--font-family-primary);
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin: 0;
}

/* Security */
.security-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.security-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border: 1px solid var(--bg-muted);
  border-radius: 8px;
}

.security-option-title {
  font-family: var(--font-family-primary);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
}

.security-option-desc {
  font-family: var(--font-family-primary);
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin: 0;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-family: var(--font-family-primary);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary {
  background: var(--bg-moveo-green);
  color: var(--text-secondary-2);
}

.btn-secondary:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

/* Demo Section */
.demo-card {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 2px dashed #f59e0b;
}

.demo-warning {
  font-family: var(--font-family-primary);
  color: #92400e;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
}

.demo-users {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.demo-user-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border: 2px solid var(--bg-muted);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.demo-user-card:hover {
  border-color: var(--brand-green);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.demo-user-card.active {
  border-color: var(--brand-green);
  background: #ecfdf5;
}

.demo-user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--bg-moveo-green) 0%, var(--brand-green) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-family-primary);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-secondary-2);
  flex-shrink: 0;
}

.demo-user-info {
  flex: 1;
}

.demo-user-name {
  font-family: var(--font-family-primary);
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
}

.demo-user-role {
  font-family: var(--font-family-primary);
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin: 0 0 0.25rem 0;
}

.demo-user-email {
  font-family: var(--font-family-primary);
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin: 0;
}

.demo-user-active {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: #10b981;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-family: var(--font-family-primary);
  font-size: 0.75rem;
  font-weight: 700;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, var(--bg-moveo-green) 0%, var(--brand-green) 100%);
  border-radius: 12px;
  text-align: center;
}

.stat-card-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.stat-card-value {
  font-family: var(--font-family-primary);
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-secondary-2);
  margin-bottom: 0.25rem;
}

.stat-card-label {
  font-family: var(--font-family-primary);
  font-size: 0.875rem;
  color: var(--text-secondary-2);
  opacity: 0.9;
}

.financial-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.financial-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--bg-base);
  border-radius: 8px;
}

.financial-label {
  font-family: var(--font-family-primary);
  font-weight: 600;
  color: var(--text-secondary);
}

.financial-value {
  font-family: var(--font-family-primary);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--brand-green);
}

.verification-progress {
  margin: 1.5rem 0;
}

.progress-bar-container {
  width: 100%;
  height: 12px;
  background: var(--bg-muted);
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--brand-green) 0%, #10b981 100%);
  transition: width 0.5s ease;
}

.progress-text {
  font-family: var(--font-family-primary);
  text-align: center;
  color: var(--text-secondary);
  margin: 0;
}

.verification-checklist {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.checklist-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--bg-base);
  border-radius: 8px;
  font-family: var(--font-family-primary);
  color: var(--text-secondary);
}

.checklist-item.completed {
  background: #ecfdf5;
  color: #10b981;
}

.checklist-item i {
  font-size: 1.25rem;
}

/* ======================== */
/* 2FA STYLES - MINIMAL */
/* ======================== */

.twofa-section {
  position: relative;
  transition: all 0.3s ease;
}

.twofa-section.enabled {
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  border-color: #10b981;
}

.twofa-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.twofa-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.6rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 700;
}

.twofa-badge.enabled {
  background: #10b981;
  color: white;
}

.twofa-badge.disabled {
  background: #f1f5f9;
  color: #64748b;
}

.btn-primary-2fa {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary-2fa:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.btn-danger-outline {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: transparent;
  color: #ef4444;
  border: 2px solid #ef4444;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-danger-outline:hover {
  background: #fef2f2;
}

/* 2FA Modal Overlay */
.twofa-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

/* 2FA Modal */
.twofa-modal {
  background: white;
  border-radius: 24px;
  padding: 2.5rem;
  max-width: 420px;
  width: 100%;
  position: relative;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
}

.modal-close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f1f5f9;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: #64748b;
}

.modal-close-btn:hover {
  background: #e2e8f0;
  color: #1e293b;
}

/* Step Indicator */
.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
}

.step-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e2e8f0;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
  transition: all 0.3s;
}

.step.active .step-number {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.step.completed .step-number {
  background: #10b981;
  color: white;
}

.step-label {
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 500;
}

.step.active .step-label {
  color: #10b981;
  font-weight: 600;
}

.step-line {
  width: 60px;
  height: 2px;
  background: #e2e8f0;
  margin: 0 0.5rem;
  margin-bottom: 1rem;
  transition: all 0.3s;
}

.step-line.active {
  background: #10b981;
}

/* 2FA Steps Content */
.twofa-step {
  text-align: center;
}

.twofa-step h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.step-description {
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0 0 1.5rem 0;
}

.step-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.step-icon i {
  font-size: 2rem;
  color: #10b981;
}

.step-icon.verify {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
}

.step-icon.verify i {
  color: #f59e0b;
}

.step-icon.success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  animation: pulse 2s infinite;
}

.step-icon.success i {
  color: white;
  font-size: 2.5rem;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

/* Phone Input */
.phone-input-container {
  display: flex;
  align-items: center;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1rem;
  transition: border-color 0.2s;
}

.phone-input-container:focus-within {
  border-color: #10b981;
}

.country-code {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #f1f5f9;
  border-right: 1px solid #e2e8f0;
  font-weight: 600;
  color: #475569;
}

.phone-input {
  flex: 1;
  padding: 1rem;
  border: none;
  background: transparent;
  font-size: 1.1rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  color: #1e293b;
}

.phone-input::placeholder {
  color: #94a3b8;
}

.phone-input:focus {
  outline: none;
}

/* Code Input */
.code-input-container {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.code-digit {
  width: 48px;
  height: 56px;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: #f8fafc;
  color: #1e293b;
  transition: all 0.2s;
}

.code-digit:focus {
  outline: none;
  border-color: #10b981;
  background: white;
}

/* Error Message */
.error-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #ef4444;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #fef2f2;
  border-radius: 8px;
}

/* 2FA Buttons */
.btn-2fa-primary {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-2fa-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
}

.btn-2fa-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn-resend {
  margin-top: 1rem;
  background: none;
  border: none;
  color: #64748b;
  font-size: 0.875rem;
  cursor: pointer;
  transition: color 0.2s;
}

.btn-resend:hover:not(:disabled) {
  color: #10b981;
}

.btn-resend:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Success Info */
.success-info {
  background: #f0fdf4;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.info-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.info-row i {
  color: #10b981;
}

.info-note {
  font-size: 0.85rem;
  color: #64748b;
  margin: 0;
}

/* Modal Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .twofa-modal,
.modal-fade-leave-to .twofa-modal {
  transform: scale(0.95) translateY(10px);
}

/* Responsive */
@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
    align-items: center;
  }

  .profile-stats {
    justify-content: center;
  }

  .container {
    padding: 0 1rem;
  }

  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .security-option {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .twofa-modal {
    padding: 1.5rem;
    margin: 0.5rem;
  }
  
  .code-digit {
    width: 40px;
    height: 48px;
    font-size: 1.25rem;
  }
  
  .step-line {
    width: 40px;
  }
}
</style>
