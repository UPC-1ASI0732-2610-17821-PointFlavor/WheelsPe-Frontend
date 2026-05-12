<template>
  <AuthLayout>
    <div class="auth-card">
      <!-- Language Selector -->
      <div class="language-selector">
        <button 
          @click="changeLanguage('es')" 
          :class="['language-btn', { active: currentLocale === 'es' }]"
        >
          🇪🇸 ES
        </button>
        <button 
          @click="changeLanguage('en')" 
          :class="['language-btn', { active: currentLocale === 'en' }]"
        >
          🇺🇸 EN
        </button>
      </div>
      
      <div class="login-form">
      <div class="login-form__header">
        <h1 class="login-form__title">{{ t('iam.login.title') }}</h1>
        <p class="login-form__subtitle">{{ t('iam.login.subtitle') }}</p>
      </div>

      <form @submit.prevent="handleSubmit" class="form">
        <div class="form__field">
          <label for="email" class="form__label">{{ t('iam.login.email') }}</label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            class="form__input"
            :class="{ 'form__input--error': errors.email }"
            :placeholder="t('iam.login.emailPlaceholder')"
            required
          />
          <span v-if="errors.email" class="form__error">{{ errors.email }}</span>
        </div>

        <div class="form__field">
          <label for="password" class="form__label">{{ t('iam.login.password') }}</label>
          <div class="form__input-wrapper">
            <input
              id="password"
              v-model="formData.password"
              :type="showPassword ? 'text' : 'password'"
              class="form__input"
              :class="{ 'form__input--error': errors.password }"
              :placeholder="t('iam.login.passwordPlaceholder')"
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

        <div class="form__options">
          <label class="form__checkbox">
            <input v-model="formData.rememberMe" type="checkbox" />
            <span>{{ t('iam.login.rememberMe') }}</span>
          </label>
          <a href="#" class="link">{{ t('iam.login.forgotPassword') }}</a>
        </div>

        <button
          type="submit"
          class="form__submit"
          :disabled="isSubmitting"
        >
          <span v-if="!isSubmitting">{{ t('iam.login.submit') }}</span>
          <span v-else>{{ t('iam.login.submitting') }}</span>
        </button>

        <!-- demo users removed -->

        <div class="form__divider">
          <span>o</span>
        </div>

        <router-link to="/auth/register/select-role" class="form__register-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <line x1="19" x2="19" y1="8" y2="14"></line>
            <line x1="22" x2="16" y1="11" y2="11"></line>
          </svg>
          {{ t('iam.login.createAccount') }}
        </router-link>
      </form>
    </div>
    </div>
  </AuthLayout>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AuthLayout from '../components/AuthLayout.vue'
import { login } from '../application/user.store.js'

const router = useRouter()
const { t, locale } = useI18n()
const isSubmitting = ref(false)
const showPassword = ref(false)
// demo users removed

const currentLocale = computed(() => locale.value)

const changeLanguage = (lang) => {
  locale.value = lang
  localStorage.setItem('user-locale', lang)
}

const formData = reactive({
  email: '',
  password: '',
  rememberMe: false
})

const errors = reactive({
  email: '',
  password: ''
})

onMounted(() => {
  // no-op: demo users removed
})

const validateForm = () => {
  let isValid = true
  
  // Reset errors
  Object.keys(errors).forEach(key => errors[key] = '')

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(formData.email)) {
    errors.email = t('iam.login.errors.emailInvalid')
    isValid = false
  }

  // Validate password
  if (formData.password.length < 6) {
    errors.password = t('iam.login.errors.passwordLength')
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
    // Llamar a la función login del store (valida contra la API)
    const user = await login(formData.email.toLowerCase().trim(), formData.password)

    // Redirect based on role
    if (user.role === 'renter') {
      router.push('/rental/browse')
    } else if (user.role === 'owner') {
      router.push('/rental/my-vehicles')
    } else {
      router.push('/dashboard')
    }
  } catch (error) {
    console.error('Error logging in:', error)
    const errorMsg = t('iam.login.errors.invalidCredentials')
    errors.email = errorMsg
    errors.password = errorMsg
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.login-form {
  width: 100%;
  max-width: 450px;
  margin: 0 auto;
}

.login-form__header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.login-form__title {
  font-family: var(--font-primary);
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.login-form__subtitle {
  font-family: var(--font-secondary);
  font-size: 1rem;
  color: var(--text-secondary);
}

.form__field {
  margin-bottom: 1.25rem;
}

.form__label {
  display: block;
  font-family: var(--font-secondary);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.form__input-wrapper {
  position: relative;
}

.form__input {
  width: 100%;
  padding: 0.875rem 1rem;
  font-family: var(--font-secondary);
  font-size: 0.9375rem;
  color: var(--text-primary);
  background: white;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  transition: all 0.2s ease;
}

.form__input:focus {
  outline: none;
  border-color: var(--bg-moveo-green);
  box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.1);
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
  color: var(--text-secondary);
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.form__input-icon:hover {
  color: var(--text-primary);
}

.form__error {
  display: block;
  font-family: var(--font-secondary);
  font-size: 0.8125rem;
  color: #ef4444;
  margin-top: 0.375rem;
}

.form__options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.form__checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.form__checkbox input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.form__checkbox span {
  font-family: var(--font-secondary);
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.form__submit {
  width: 100%;
  padding: 1rem;
  font-family: var(--font-primary);
  font-size: 1rem;
  font-weight: 600;
  color: white;
  background: var(--bg-moveo-green);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1.5rem;
}

.form__submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(74, 222, 128, 0.3);
}

.form__submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.demo-info {
  background: #fef3c7;
  border: 2px solid #fbbf24;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.demo-info__header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-primary);
  font-size: 0.875rem;
  font-weight: 600;
  color: #92400e;
  margin-bottom: 0.75rem;
}

.demo-info__header svg {
  flex-shrink: 0;
  color: #f59e0b;
}

.demo-info__users {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.demo-user {
  font-family: var(--font-secondary);
  font-size: 0.8125rem;
  color: #78350f;
  padding: 0.5rem 0.75rem;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.demo-user:hover {
  background: #fef3c7;
  transform: translateX(4px);
}

.demo-user strong {
  font-weight: 600;
  color: #92400e;
}

.form__divider {
  position: relative;
  text-align: center;
  margin: 1.5rem 0;
}

.form__divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--border-color);
}

.form__divider span {
  position: relative;
  display: inline-block;
  padding: 0 1rem;
  background: white;
  font-family: var(--font-secondary);
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.form__register-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 1rem;
  font-family: var(--font-primary);
  font-size: 1rem;
  font-weight: 600;
  color: var(--bg-moveo-green);
  background: white;
  border: 2px solid var(--bg-moveo-green);
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.form__register-link:hover {
  background: var(--bg-moveo-green);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(74, 222, 128, 0.2);
}

/* Auth Card Wrapper */
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
  max-width: 480px;
  width: 100%;
}

.auth-card::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(135deg, #FF6F00 0%, #FF8F00 100%);
  border-radius: 20px;
  z-index: -1;
  opacity: 0.3;
}

/* Language Selector */
.language-selector {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.language-btn {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  font-family: var(--font-secondary);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
  background: transparent;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.language-btn:hover {
  border-color: var(--bg-moveo-green);
  color: var(--text-primary);
  transform: translateY(-1px);
}

.language-btn.active {
  background: var(--bg-moveo-green);
  border-color: var(--bg-moveo-green);
  color: white;
  box-shadow: 0 4px 12px rgba(74, 222, 128, 0.3);
}

.link {
  font-family: var(--font-secondary);
  font-size: 0.875rem;
  color: var(--bg-moveo-green);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

.link:hover {
  color: var(--bg-moveo-orange);
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 768px) {
  .login-form__title {
    font-size: 1.75rem;
  }

  .form__options {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
}
</style>
