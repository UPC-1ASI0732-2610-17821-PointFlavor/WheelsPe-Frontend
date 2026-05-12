/**
 * Entidad Adventure Route
 * Representa una ruta tematizada de aventura
 */
export class AdventureRoute {
  constructor({
    id = 0,
    name = '',
    type = 'beach', // beach, mountain, cultural, gastronomic
    description = '',
    summary = '',
    duration = 0, // en días
    distance = 0, // en km
    difficulty = 'easy', // easy, moderate, hard
    imageUrl = '',
    thumbnailUrl = '',
    keyPoints = [],
    startLocation = '',
    endLocation = '',
    highlights = [],
    recommendedVehicles = [], // IDs de vehículos recomendados
    estimatedCost = 0,
    bestSeason = '',
    tags = [],
    featured = false,
    rating = 0,
    reviewsCount = 0,
    createdAt = null,
    updatedAt = null,
    ownerId = null,
    vehicleName = '',
    title = '',
    price = 0
  } = {}) {
    this.id = id
    this.name = name
    this.type = type
    this.description = description
    this.summary = summary
    this.duration = duration
    this.distance = distance
    this.difficulty = difficulty
    this.imageUrl = imageUrl
    this.thumbnailUrl = thumbnailUrl
    this.keyPoints = keyPoints
    this.startLocation = startLocation
    this.endLocation = endLocation
    this.highlights = highlights
    this.recommendedVehicles = recommendedVehicles
    this.estimatedCost = estimatedCost
    this.bestSeason = bestSeason
    this.tags = tags
    this.featured = featured
    this.rating = rating
    this.reviewsCount = reviewsCount
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.ownerId = ownerId
    this.vehicleName = vehicleName
    this.title = title || name
    this.price = price || estimatedCost
  }

  // Computed properties
  get formattedDuration() {
    if (this.duration === 1) return '1 día'
    return `${this.duration} días`
  }

  get formattedDistance() {
    if (this.distance < 1) return `${Math.round(this.distance * 1000)} m`
    return `${this.distance} km`
  }

  get formattedCost() {
    return `S/. ${this.estimatedCost.toFixed(2)}`
  }

  get difficultyLevel() {
    const levels = {
      easy: 'Fácil',
      moderate: 'Moderado',
      hard: 'Difícil'
    }
    return levels[this.difficulty] || 'Desconocido'
  }

  get typeLabel() {
    const types = {
      beach: 'Ruta Playera',
      mountain: 'Ruta Montañera',
      cultural: 'Ruta Cultural',
      gastronomic: 'Ruta Gastronómica',
      adventure: 'Aventura Extrema',
      scenic: 'Ruta Escénica'
    }
    return types[this.type] || 'Ruta'
  }

  get typeIcon() {
    const icons = {
      beach: '🏖️',
      mountain: '⛰️',
      cultural: '🏛️',
      gastronomic: '🍽️',
      adventure: '🏕️',
      scenic: '🌄'
    }
    return icons[this.type] || '🗺️'
  }

  get fullRoute() {
    return `${this.startLocation} → ${this.endLocation}`
  }

  // Methods
  hasVehicleRecommendations() {
    return this.recommendedVehicles && this.recommendedVehicles.length > 0
  }

  isFeatured() {
    return this.featured === true
  }

  matchesType(type) {
    return !type || type === 'all' || this.type === type
  }

  matchesDifficulty(difficulty) {
    return !difficulty || difficulty === 'all' || this.difficulty === difficulty
  }

  matchesSearch(query) {
    if (!query) return true
    const searchTerm = query.toLowerCase()
    return (
      this.name.toLowerCase().includes(searchTerm) ||
      this.description.toLowerCase().includes(searchTerm) ||
      this.startLocation.toLowerCase().includes(searchTerm) ||
      this.endLocation.toLowerCase().includes(searchTerm) ||
      this.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    )
  }
}
