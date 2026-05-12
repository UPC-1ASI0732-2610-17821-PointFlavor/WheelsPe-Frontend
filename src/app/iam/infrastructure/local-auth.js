const USER_STORAGE_KEY = 'moveo_current_user'

const DEFAULT_NOTIFICATIONS = {
  email: true,
  push: true,
  sms: false
}

const DEFAULT_PREFERENCES = {
  language: 'es',
  notifications: DEFAULT_NOTIFICATIONS,
  favoriteDistricts: [],
  priceRange: { min: 0, max: 100 },
  preferredTransmission: '',
  instantBooking: false,
  minimumRentalDays: 1
}

const DEFAULT_VERIFIED = {
  email: false,
  phone: false,
  dni: false,
  license: false,
  bankAccount: false
}

function createDefaultStats() {
  return {
    rating: 0,
    reviewsCount: 0,
    rentalsCount: 0,
    vehiclesCount: 0,
    memberSince: new Date().toISOString()
  }
}

export const IS_LOCAL_TEST_MODE = import.meta.env.DEV || import.meta.env.VITE_USE_LOCAL_AUTH === 'true'

export function normalizePreferences(preferences = {}) {
  const notifications = preferences.notifications || {
    email: preferences.emailNotifications ?? DEFAULT_NOTIFICATIONS.email,
    push: preferences.pushNotifications ?? DEFAULT_NOTIFICATIONS.push,
    sms: preferences.smsNotifications ?? DEFAULT_NOTIFICATIONS.sms
  }

  const minPrice = Number(preferences.priceRange?.min)
  const maxPrice = Number(preferences.priceRange?.max)
  const minimumRentalDays = Number(preferences.minimumRentalDays)

  return {
    language: preferences.language || DEFAULT_PREFERENCES.language,
    notifications: {
      ...DEFAULT_NOTIFICATIONS,
      ...notifications
    },
    favoriteDistricts: Array.isArray(preferences.favoriteDistricts) ? preferences.favoriteDistricts : [],
    priceRange: {
      min: Number.isFinite(minPrice) ? minPrice : DEFAULT_PREFERENCES.priceRange.min,
      max: Number.isFinite(maxPrice) ? maxPrice : DEFAULT_PREFERENCES.priceRange.max
    },
    preferredTransmission: preferences.preferredTransmission || DEFAULT_PREFERENCES.preferredTransmission,
    instantBooking: Boolean(preferences.instantBooking ?? preferences.autoAcceptRentals),
    minimumRentalDays: Number.isFinite(minimumRentalDays) ? minimumRentalDays : DEFAULT_PREFERENCES.minimumRentalDays,
    autoAcceptRentals: Boolean(preferences.autoAcceptRentals)
  }
}

export function normalizeUser(user) {
  if (!user) return null

  const { password, ...safeUser } = user
  const verified = {
    ...DEFAULT_VERIFIED,
    ...(safeUser.verified || {})
  }

  const normalizedUser = {
    ...safeUser,
    verified,
    stats: {
      ...createDefaultStats(),
      ...(safeUser.stats || {})
    },
    preferences: normalizePreferences(safeUser.preferences),
    bankAccount: safeUser.bankAccount ?? null
  }

  normalizedUser.isVerified = typeof safeUser.isVerified === 'boolean'
    ? safeUser.isVerified
    : Boolean(
      verified.email ||
      verified.phone ||
      verified.dni ||
      verified.license ||
      verified.bankAccount
    )

  return normalizedUser
}

export function getStoredUser() {
  if (typeof localStorage === 'undefined') return null

  const savedUser = localStorage.getItem(USER_STORAGE_KEY)
  if (!savedUser) return null

  try {
    return normalizeUser(JSON.parse(savedUser))
  } catch {
    return null
  }
}

export function setStoredUser(user) {
  const normalizedUser = normalizeUser(user)

  if (typeof localStorage !== 'undefined' && normalizedUser) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(normalizedUser))
  }

  return normalizedUser
}

export function clearStoredUser() {
  if (typeof localStorage === 'undefined') return

  localStorage.removeItem(USER_STORAGE_KEY)
}

export function createDevUser() {
  return normalizeUser({
    id: 1,
    role: 'renter',
    firstName: 'andreow',
    lastName: 'santiago',
    email: 'andreow@andreow.com',
    phone: '999999999',
    dni: '87654321',
    licenseNumber: 'A987654321',
    avatar: null,
    verified: {
      email: false,
      phone: false,
      dni: false,
      license: false
    },
    stats: createDefaultStats(),
    preferences: {
      language: 'es',
      notifications: {
        email: true,
        push: true,
        sms: false
      }
    },
    bankAccount: null
  })
}