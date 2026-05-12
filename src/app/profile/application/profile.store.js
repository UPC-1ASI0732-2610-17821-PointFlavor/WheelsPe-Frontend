import { ref, computed } from 'vue'
import { ProfileApi } from '@/app/profile/infrastructure/profile-api.js'

// Module-level singleton state
const profile = ref(null)
const loading = ref(false)
const error = ref(null)

/**
 * Store para gestionar el perfil del usuario
 */
export function useProfileStore() {

  async function fetchProfile(userId) {
    if (!userId) return
    loading.value = true
    error.value = null
    try {
      const result = await ProfileApi.getProfile(userId)
      profile.value = result || null
      return profile.value
    } catch (err) {
      console.error('Error fetching profile:', err)
      error.value = err?.message || String(err)
      profile.value = null
    } finally {
      loading.value = false
    }
  }

  async function updateProfile(userId, updates) {
    if (!userId) return
    try {
      const updated = await ProfileApi.updateProfile(userId, updates)
      profile.value = updated
      return updated
    } catch (err) {
      console.error('Error updating profile:', err)
      throw err
    }
  }

  async function updateStats(userId, stats) {
    if (!userId) return
    try {
      const updated = await ProfileApi.updateStats(userId, stats)
      if (profile.value) {
        profile.value.stats = updated.stats
      }
      return updated
    } catch (err) {
      console.error('Error updating stats:', err)
      throw err
    }
  }

  async function updateVerification(userId, field, value) {
    if (!userId) return
    try {
      const updated = await ProfileApi.updateVerification(userId, field, value)
      if (profile.value) {
        profile.value.verified = updated.verified
      }
      return updated
    } catch (err) {
      console.error('Error updating verification:', err)
      throw err
    }
  }

  async function updatePreferences(userId, preferences) {
    if (!userId) return
    try {
      const updated = await ProfileApi.updatePreferences(userId, preferences)
      if (profile.value) {
        profile.value.preferences = updated.preferences
      }
      return updated
    } catch (err) {
      console.error('Error updating preferences:', err)
      throw err
    }
  }

  async function updateBankAccount(userId, bankAccount) {
    if (!userId) return
    try {
      const updated = await ProfileApi.updateBankAccount(userId, bankAccount)
      if (profile.value) {
        profile.value.bankAccount = updated.bankAccount
      }
      return updated
    } catch (err) {
      console.error('Error updating bank account:', err)
      throw err
    }
  }

  async function fetchStats(userId) {
    if (!userId) return
    try {
      const stats = await ProfileApi.getProfileStats(userId)
      return stats
    } catch (err) {
      console.error('Error fetching stats:', err)
      throw err
    }
  }

  // Computed properties
  const verificationLevel = computed(() => {
    return profile.value?.verificationLevel || 0
  })

  const isFullyVerified = computed(() => {
    return profile.value?.isFullyVerified || false
  })

  const totalTransactions = computed(() => {
    return profile.value?.totalTransactions || 0
  })

  const averageRating = computed(() => {
    return profile.value?.averageRating || 0
  })

  return {
    // State
    profile,
    loading,
    error,
    // Computed
    verificationLevel,
    isFullyVerified,
    totalTransactions,
    averageRating,
    // Actions
    fetchProfile,
    updateProfile,
    updateStats,
    updateVerification,
    updatePreferences,
    updateBankAccount,
    fetchStats
  }
}
