import { apiClient } from '@/app/shared/infrastructure/apiClient.js'
import { ProfileAssembler } from './profile.assembler.js'

/**
 * API para gestionar perfiles de usuario
 */
export const ProfileApi = {
  /**
   * Obtener perfil de usuario por ID
   */
  async getProfile(userId) {
    try {
      const data = await apiClient.get(`/users/${userId}`)
      return ProfileAssembler.toEntity(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
      throw error
    }
  },

  /**
   * Actualizar perfil de usuario
   */
  async updateProfile(userId, updates) {
    try {
      const data = await apiClient.patch(`/users/${userId}`, {
        ...updates,
        lastActive: new Date().toISOString()
      })
      return ProfileAssembler.toEntity(data)
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  },

  /**
   * Actualizar estadísticas del usuario
   */
  async updateStats(userId, stats) {
    try {
      const data = await apiClient.patch(`/users/${userId}`, {
        stats: {
          ...stats
        }
      })
      return ProfileAssembler.toEntity(data)
    } catch (error) {
      console.error('Error updating stats:', error)
      throw error
    }
  },

  /**
   * Actualizar verificaciones del usuario
   */
  async updateVerification(userId, verificationField, value) {
    try {
      const user = await this.getProfile(userId)
      const updatedVerified = {
        ...user.verified,
        [verificationField]: value
      }
      
      const data = await apiClient.patch(`/users/${userId}`, {
        verified: updatedVerified
      })
      return ProfileAssembler.toEntity(data)
    } catch (error) {
      console.error('Error updating verification:', error)
      throw error
    }
  },

  /**
   * Actualizar preferencias del usuario
   */
  async updatePreferences(userId, preferences) {
    try {
      const user = await this.getProfile(userId)
      const updatedPreferences = {
        ...user.preferences,
        ...preferences
      }
      
      const data = await apiClient.patch(`/users/${userId}`, {
        preferences: updatedPreferences
      })
      return ProfileAssembler.toEntity(data)
    } catch (error) {
      console.error('Error updating preferences:', error)
      throw error
    }
  },

  /**
   * Actualizar cuenta bancaria
   */
  async updateBankAccount(userId, bankAccount) {
    try {
      const data = await apiClient.patch(`/users/${userId}`, {
        bankAccount: {
          ...bankAccount,
          verified: bankAccount.verified || false
        }
      })
      return ProfileAssembler.toEntity(data)
    } catch (error) {
      console.error('Error updating bank account:', error)
      throw error
    }
  },

  /**
   * Obtener estadísticas del perfil
   */
  async getProfileStats(userId) {
    try {
      const profile = await this.getProfile(userId)
      return profile.stats
    } catch (error) {
      console.error('Error fetching profile stats:', error)
      throw error
    }
  }
}
