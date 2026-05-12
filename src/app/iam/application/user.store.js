import { reactive, computed } from 'vue'
import { IamApi } from '../infrastructure/iam-api.js'
import {
  IS_LOCAL_TEST_MODE,
  clearStoredUser,
  createDevUser,
  getStoredUser,
  normalizeUser,
  setStoredUser
} from '../infrastructure/local-auth.js'
import { tokenManager } from '@/app/shared/infrastructure/apiClient.js'

// Estado reactivo del usuario
export const userState = reactive({
  currentUser: null,
  isAuthenticated: false,
  loading: false,
  error: null
})

// Inicializar con usuario guardado en localStorage
function initializeUser() {
  if (IS_LOCAL_TEST_MODE) {
    tokenManager.clearTokens()

    const savedUser = getStoredUser()
    if (savedUser) {
      setUser(savedUser)
      return
    }

    setUser(createDevUser())
    return
  }

  // Check if we have valid tokens
  if (!tokenManager.hasValidToken()) {
    clearAuthState()
    return
  }

  // If we have valid token, try to restore user from localStorage
  const savedUser = getStoredUser()
  if (savedUser) {
    setUser(savedUser)
  }
}

// Limpiar estado de autenticación
function clearAuthState() {
  userState.currentUser = null
  userState.isAuthenticated = false
  userState.error = null
  tokenManager.clearTokens()
  clearStoredUser()
}

// Computed properties
export const currentUser = computed(() => userState.currentUser)
export const isAuthenticated = computed(() => userState.isAuthenticated)
export const userRole = computed(() => userState.currentUser?.role || null)
export const isRenter = computed(() => userState.currentUser?.role === 'renter')
export const isOwner = computed(() => userState.currentUser?.role === 'owner')
export const userName = computed(() => {
  const user = userState.currentUser
  return user ? `${user.firstName} ${user.lastName}` : ''
})
export const userInitials = computed(() => {
  const user = userState.currentUser
  if (!user) return '?'
  const first = user.firstName?.[0] || ''
  const last = user.lastName?.[0] || ''
  return `${first}${last}`.toUpperCase() || '?'
})

/**
 * Login con email y password
 * Llama a POST /api/v1/auth/login
 */
export async function login(email, password) {
  userState.loading = true
  userState.error = null
  
  try {
    // Llamar al endpoint de autenticación del backend
    const response = await IamApi.login(email, password)
    
    console.log('✅ Login exitoso para:', response.user?.email)
    
    // Guardar usuario en estado y localStorage
    setUser(response.user)
    
    userState.loading = false
    return response.user
  } catch (error) {
    userState.loading = false
    // Manejar error 401 (credenciales incorrectas)
    if (error.status === 401 || error.message?.includes('401')) {
      userState.error = 'Email o contraseña incorrectos'
    } else {
      userState.error = error.message || 'Error al iniciar sesión'
    }
    throw error
  }
}

/**
 * Registrar nuevo usuario con JWT
 */
export async function register(userData) {
  userState.loading = true
  userState.error = null
  
  try {
    // Crear payload para la API de registro
    const payload = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password,
      phone: userData.phone || null,
      dni: userData.dni || null,
      licenseNumber: userData.licenseNumber || null,
      address: userData.address || null,
      role: userData.role || 'renter',
      preferences: userData.preferences || {
        language: 'es',
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        autoAcceptRentals: false,
        minimumRentalDays: 1,
        instantBooking: false
      }
    }
    
    // Llamar al endpoint de registro
    const response = await IamApi.register(payload)
    
    console.log('✅ Registro exitoso para:', response.user?.email)
    
    // Guardar usuario en estado y localStorage
    setUser(response.user)
    
    userState.loading = false
    return response.user
  } catch (error) {
    userState.loading = false
    if (error.status === 409) {
      userState.error = 'Ya existe una cuenta con este email'
    } else {
      userState.error = error.message || 'Error al registrar usuario'
    }
    throw error
  }
}

/**
 * Obtener usuario actual desde el servidor
 */
export async function fetchCurrentUser() {
  if (IS_LOCAL_TEST_MODE) {
    const savedUser = getStoredUser()
    if (savedUser) {
      setUser(savedUser)
      return savedUser
    }

    return userState.currentUser
  }

  if (!tokenManager.hasValidToken()) {
    return null
  }
  
  try {
    const user = await IamApi.getCurrentUser()
    setUser(user)
    return user
  } catch (error) {
    console.error('Error fetching current user:', error)
    // Si falla, limpiar estado
    clearAuthState()
    throw error
  }
}

/**
 * Verificar autenticación - útil al iniciar la app
 */
export async function checkAuth() {
  if (IS_LOCAL_TEST_MODE) {
    const savedUser = getStoredUser()
    if (savedUser) {
      setUser(savedUser)
      return true
    }

    return Boolean(userState.currentUser)
  }

  if (!tokenManager.hasValidToken()) {
    clearAuthState()
    return false
  }
  
  // Si tenemos usuario en localStorage, estamos autenticados
  const savedUser = getStoredUser()
  if (savedUser) {
    setUser(savedUser)
    return true
  }
  
  // Si no hay usuario guardado, intentar obtenerlo del servidor
  try {
    await fetchCurrentUser()
    return true
  } catch {
    return false
  }
}

/**
 * Setear usuario actual y guardar en localStorage
 */
export function setUser(user) {
  const normalizedUser = setStoredUser(user) || normalizeUser(user)
  userState.currentUser = normalizedUser
  userState.isAuthenticated = true
  userState.error = null
  return normalizedUser
}

/**
 * Logout - limpia tokens y estado
 */
export async function logout() {
  try {
    await IamApi.logout()
  } catch (error) {
    console.error('Error during logout:', error)
  } finally {
    clearAuthState()
  }
}

/**
 * Cambiar contraseña
 */
export async function changePassword(currentPassword, newPassword) {
  userState.loading = true
  try {
    await IamApi.changePassword(currentPassword, newPassword)
  } finally {
    userState.loading = false
  }
}

/**
 * Actualizar preferencias del usuario
 */
export async function updateUserPreferences(preferences) {
  if (!userState.currentUser) return
  
  try {
    const updatedUser = await IamApi.updateUser(userState.currentUser.id, {
      preferences: {
        ...userState.currentUser.preferences,
        ...preferences
      }
    })
    setUser(updatedUser)
    return updatedUser
  } catch (error) {
    console.error('Error updating preferences:', error)
    throw error
  }
}

/**
 * Actualizar información del perfil
 */
export async function updateUserProfile(updates) {
  if (!userState.currentUser) return
  
  try {
    const updatedUser = await IamApi.updateUser(userState.currentUser.id, updates)
    setUser(updatedUser)
    return updatedUser
  } catch (error) {
    console.error('Error updating profile:', error)
    throw error
  }
}

/**
 * Hook para usar el store
 */
export function useUserStore() {
  return {
    state: userState,
    currentUser,
    isAuthenticated,
    userRole,
    isRenter,
    isOwner,
    userName,
    userInitials,
    login,
    register,
    fetchCurrentUser,
    checkAuth,
    setUser,
    logout,
    changePassword,
    updateUserPreferences,
    updateUserProfile
  }
}

// Escuchar evento de logout forzado (cuando token expira)
if (typeof window !== 'undefined') {
  window.addEventListener('auth:logout', (event) => {
    console.warn('🔒 Session expired, logging out...', event.detail?.reason)
    clearAuthState()
  })
}

// Inicializar al cargar
initializeUser()
