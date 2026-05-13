import { describe, expect, it } from 'vitest'

import { normalizePreferences, normalizeUser } from '@/app/iam/infrastructure/local-auth.js'

describe('local-auth normalization', () => {
  it('normalizes preferences with defaults and types', () => {
    const prefs = normalizePreferences({
      notifications: { email: false },
      favoriteDistricts: 'not-array',
      priceRange: { min: '5', max: '20' },
      minimumRentalDays: '3',
      preferredTransmission: 'automatic',
      instantBooking: true
    })

    expect(prefs.notifications.email).toBe(false)
    expect(prefs.notifications.push).toBe(true)
    expect(prefs.notifications.sms).toBe(false)
    expect(prefs.favoriteDistricts).toEqual([])
    expect(prefs.priceRange).toEqual({ min: 5, max: 20 })
    expect(prefs.minimumRentalDays).toBe(3)
    expect(prefs.preferredTransmission).toBe('automatic')
    expect(prefs.instantBooking).toBe(true)
  })

  it('normalizes user and removes password field', () => {
    const user = normalizeUser({
      id: 7,
      role: 'renter',
      firstName: 'Ana',
      lastName: 'Lopez',
      email: 'ana@example.com',
      password: 'secret',
      verified: { email: true }
    })

    expect(user).toBeTruthy()
    expect(user.password).toBeUndefined()
    expect(user.isVerified).toBe(true)
    expect(user.verified.email).toBe(true)
    expect(user.verified.dni).toBe(false)
    expect(user.preferences).toBeTruthy()
    expect(typeof user.stats.memberSince).toBe('string')
  })
})
