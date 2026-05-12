/**
 * Entidad UserProfile
 * Representa el perfil extendido del usuario con estadísticas y verificaciones
 */
export class UserProfile {
  constructor({
    id = 0,
    firstName = '',
    lastName = '',
    email = '',
    phone = '',
    dni = '',
    licenseNumber = '',
    avatar = '',
    role = 'renter', // renter, owner
    verified = {
      email: false,
      phone: false,
      dni: false,
      license: false
    },
    stats = {
      totalRentals: 0,
      totalSpent: 0,
      totalEarned: 0,
      activeRentals: 0,
      completedRentals: 0,
      canceledRentals: 0,
      averageRating: 0,
      totalReviews: 0
    },
    preferences = {
      language: 'es',
      notifications: {
        email: true,
        push: true,
        sms: false
      },
      autoAcceptRentals: false,
      minimumRentalDays: 1,
      instantBooking: false
    },
    bankAccount = null,
    address = null,
    bio = '',
    joinedAt = null,
    lastActive = null
  } = {}) {
    this.id = id
    this.firstName = firstName
    this.lastName = lastName
    this.email = email
    this.phone = phone
    this.dni = dni
    this.licenseNumber = licenseNumber
    this.avatar = avatar
    this.role = role
    this.verified = verified || {}
    this.stats = stats || {}
    this.preferences = preferences || {}
    this.bankAccount = bankAccount
    this.address = address
    this.bio = bio
    this.joinedAt = joinedAt
    this.lastActive = lastActive
  }

  // Computed properties
  get fullName() {
    return `${this.firstName} ${this.lastName}`.trim()
  }

  get initials() {
    const first = this.firstName?.charAt(0)?.toUpperCase() || ''
    const last = this.lastName?.charAt(0)?.toUpperCase() || ''
    return `${first}${last}` || '??'
  }

  get isOwner() {
    return this.role === 'owner'
  }

  get isRenter() {
    return this.role === 'renter'
  }

  get roleLabel() {
    return this.role === 'owner' ? 'Propietario' : 'Cliente'
  }

  get verificationLevel() {
    const checks = Object.values(this.verified || {})
    const verified = checks.filter(v => v === true).length
    const total = checks.length
    return Math.round((verified / total) * 100)
  }

  get isFullyVerified() {
    return this.verificationLevel === 100
  }

  get verificationStatus() {
    const level = this.verificationLevel
    if (level === 100) return 'Verificado'
    if (level >= 75) return 'Casi Verificado'
    if (level >= 50) return 'Parcialmente Verificado'
    if (level > 0) return 'Sin Verificar'
    return 'No Verificado'
  }

  get totalTransactions() {
    return this.isOwner ? this.stats.totalEarned : this.stats.totalSpent
  }

  get formattedTotalTransactions() {
    return `S/. ${this.totalTransactions.toFixed(2)}`
  }

  get averageRating() {
    return this.stats.averageRating || 0
  }

  get ratingStars() {
    return Math.round(this.averageRating)
  }

  get hasReviews() {
    return (this.stats.totalReviews || 0) > 0
  }

  get memberSince() {
    if (!this.joinedAt) return ''
    const date = new Date(this.joinedAt)
    return date.toLocaleDateString('es-ES', {
      month: 'long',
      year: 'numeric'
    })
  }

  get hasBankAccount() {
    return !!this.bankAccount && !!this.bankAccount.accountNumber
  }

  // Methods
  updateVerification(field, value) {
    if (this.verified) {
      this.verified[field] = value
    }
  }

  updateStats(statField, value) {
    if (this.stats) {
      this.stats[statField] = value
    }
  }

  updatePreferences(preferences) {
    this.preferences = { ...this.preferences, ...preferences }
  }

  static fromJson(json) {
    return new UserProfile(json)
  }

  toJson() {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
      dni: this.dni,
      licenseNumber: this.licenseNumber,
      avatar: this.avatar,
      role: this.role,
      verified: this.verified,
      stats: this.stats,
      preferences: this.preferences,
      bankAccount: this.bankAccount,
      address: this.address,
      bio: this.bio,
      joinedAt: this.joinedAt,
      lastActive: this.lastActive
    }
  }
}
