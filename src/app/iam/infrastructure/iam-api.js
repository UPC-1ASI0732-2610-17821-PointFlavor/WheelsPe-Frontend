// Repositorio / gateway API para IAM (users) con JWT Authentication
import { apiClient, tokenManager } from '@/app/shared/infrastructure/apiClient.js'
import { toUserEntity, toUserCollection } from './iam.assembler.js'
import {
  IS_LOCAL_TEST_MODE,
  clearStoredUser,
  getStoredUser,
  normalizePreferences,
  normalizeUser
} from './local-auth.js'

function buildAuthError(message, status) {
  const error = new Error(message)
  error.status = status
  return error
}

function buildLocalSessionResponse(user) {
  return {
    user: normalizeUser(user)
  }
}

function buildLocalRegisterPayload(userData) {
  return {
    role: userData.role || 'renter',
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    password: userData.password,
    phone: userData.phone || null,
    dni: userData.dni || null,
    licenseNumber: userData.licenseNumber || null,
    avatar: userData.avatar || null,
    verified: {
      email: false,
      phone: false,
      dni: false,
      license: false,
      bankAccount: false
    },
    stats: {
      rating: 0,
      reviewsCount: 0,
      rentalsCount: 0,
      vehiclesCount: 0,
      memberSince: new Date().toISOString()
    },
    preferences: normalizePreferences(userData.preferences || {}),
    bankAccount: userData.bankAccount || null
  }
}

export const IamApi = {
  // ==================== AUTH ENDPOINTS ====================
  
  /**
   * Login with email and password
   * POST /api/v1/auth/login
   * @returns {{ token, refreshToken, expiresAt, user }}
   */
  async login(email, password) {
    if (IS_LOCAL_TEST_MODE) {
      const users = await IamApi.getUserByEmail(email.toLowerCase().trim())
      const rawUser = Array.isArray(users) ? users[0] : users

      if (!rawUser || rawUser.password !== password) {
        throw buildAuthError('Email o contraseña incorrectos', 401)
      }

      return buildLocalSessionResponse(rawUser)
    }

    const response = await apiClient.post('/auth/login', { email, password })
    
    // Store tokens
    if (response.token) {
      tokenManager.setTokens(response.token, response.refreshToken, response.expiresAt)
    }
    
    return response
  },

  /**
   * Register new user
   * POST /api/v1/auth/register
   * @returns {{ token, refreshToken, expiresAt, user }}
   */
  async register(userData) {
    if (IS_LOCAL_TEST_MODE) {
      const normalizedEmail = userData.email.toLowerCase().trim()
      const users = await IamApi.getUserByEmail(normalizedEmail)
      const existingUser = Array.isArray(users) ? users[0] : users

      if (existingUser) {
        throw buildAuthError('Ya existe una cuenta con este email', 409)
      }

      const createdUser = await apiClient.post('/users', buildLocalRegisterPayload({
        ...userData,
        email: normalizedEmail
      }))

      return buildLocalSessionResponse(createdUser)
    }

    const response = await apiClient.post('/auth/register', userData)
    
    // Store tokens
    if (response.token) {
      tokenManager.setTokens(response.token, response.refreshToken, response.expiresAt)
    }
    
    return response
  },

  /**
   * Refresh access token
   * POST /api/v1/auth/refresh-token
   * @returns {{ token, refreshToken, expiresAt, user }}
   */
  async refreshToken() {
    if (IS_LOCAL_TEST_MODE) {
      const storedUser = getStoredUser()
      if (!storedUser) {
        throw buildAuthError('No authenticated user', 401)
      }

      return buildLocalSessionResponse(storedUser)
    }

    const accessToken = tokenManager.getAccessToken()
    const refreshToken = tokenManager.getRefreshToken()
    
    if (!accessToken || !refreshToken) {
      throw new Error('No tokens available')
    }
    
    const response = await apiClient.post('/auth/refresh-token', { 
      accessToken, 
      refreshToken 
    })
    
    // Store new tokens
    if (response.token) {
      tokenManager.setTokens(response.token, response.refreshToken, response.expiresAt)
    }
    
    return response
  },

  /**
   * Logout - invalidate refresh token
   * POST /api/v1/auth/logout
   */
  async logout() {
    if (IS_LOCAL_TEST_MODE) {
      tokenManager.clearTokens()
      clearStoredUser()
      return
    }

    try {
      await apiClient.post('/auth/logout', {})
    } finally {
      // Always clear tokens locally, even if API call fails
      tokenManager.clearTokens()
    }
  },

  /**
   * Get current authenticated user
   * GET /api/v1/auth/me
   * @returns {User}
   */
  async getCurrentUser() {
    if (IS_LOCAL_TEST_MODE) {
      return getStoredUser()
    }

    const data = await apiClient.get('/auth/me')
    return data
  },

  /**
   * Change password
   * POST /api/v1/auth/change-password
   */
  async changePassword(currentPassword, newPassword) {
    if (IS_LOCAL_TEST_MODE) {
      const storedUser = getStoredUser()

      if (!storedUser) {
        throw buildAuthError('No authenticated user', 401)
      }

      const rawUser = await apiClient.get(`/users/${storedUser.id}`)

      if (rawUser?.password && rawUser.password !== currentPassword) {
        throw buildAuthError('Current password is incorrect', 400)
      }

      const updatedUser = await apiClient.patch(`/users/${storedUser.id}`, {
        password: newPassword
      })

      return normalizeUser(updatedUser)
    }

    return await apiClient.post('/auth/change-password', {
      currentPassword,
      newPassword
    })
  },

  // ==================== USER CRUD ENDPOINTS ====================

  /**
   * Get all users
   */
  async listUsers() {
    const data = await apiClient.get('/users')
    return toUserCollection(data)
  },

  /**
   * Get user by ID
   */
  async getUser(id) {
    const data = await apiClient.get(`/users/${id}`)
    return toUserEntity(data)
  },

  /**
   * Get user by email (returns raw data for authentication)
   * @deprecated Use login() instead for authentication
   */
  async getUserByEmail(email) {
    const users = await apiClient.get(`/users?email=${encodeURIComponent(email)}`)
    // Return raw user data (including password) for authentication
    return users.length > 0 ? users[0] : null
  },

  /**
   * Get user by email as entity (without sensitive data)
   */
  async getUserByEmailAsEntity(email) {
    const users = await apiClient.get(`/users?email=${encodeURIComponent(email)}`)
    return users.length > 0 ? toUserEntity(users[0]) : null
  },

  /**
   * Create new user
   * @deprecated Use register() instead for new user creation
   */
  async createUser(payload) {
    const data = await apiClient.post('/users', payload)
    return toUserEntity(data)
  },

  /**
   * Update user
   */
  async updateUser(id, payload) {
    const data = await apiClient.patch(`/users/${id}`, payload)
    return toUserEntity(data)
  },

  /**
   * Delete user
   */
  async deleteUser(id) {
    await apiClient.delete(`/users/${id}`)
  },

  // ==================== TOKEN UTILITIES ====================

  /**
   * Check if user is authenticated with valid token
   */
  isAuthenticated() {
    if (IS_LOCAL_TEST_MODE) {
      return Boolean(getStoredUser())
    }

    return tokenManager.hasValidToken()
  },

  /**
   * Clear all auth data
   */
  clearAuth() {
    tokenManager.clearTokens()
    if (IS_LOCAL_TEST_MODE) {
      clearStoredUser()
    }
  }
}
