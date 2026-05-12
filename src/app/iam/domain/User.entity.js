// Entidad User
export class User {
  constructor({ 
    id, 
    role, 
    firstName, 
    lastName, 
    email, 
    phone, 
    dni, 
    licenseNumber,
    avatar,
    verified,
    stats,
    preferences,
    bankAccount
  }) {
    this.id = id
    this.role = role // 'renter' | 'owner'
    this.firstName = firstName
    this.lastName = lastName
    this.email = email
    this.phone = phone
    this.dni = dni
    this.licenseNumber = licenseNumber
    this.avatar = avatar
    this.verified = verified || {
      email: false,
      phone: false,
      identity: false,
      license: false,
      bankAccount: false
    }
    this.stats = stats || {
      rating: 0,
      reviewsCount: 0,
      rentalsCount: 0,
      vehiclesCount: 0,
      memberSince: new Date().toISOString()
    }
    this.preferences = preferences || {
      language: 'es',
      notifications: {
        email: true,
        push: true,
        sms: false
      }
    }
    this.bankAccount = bankAccount || null
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`
  }

  get initials() {
    return `${this.firstName.charAt(0)}${this.lastName.charAt(0)}`.toUpperCase()
  }

  get isRenter() {
    return this.role === 'renter'
  }

  get isOwner() {
    return this.role === 'owner'
  }
}
