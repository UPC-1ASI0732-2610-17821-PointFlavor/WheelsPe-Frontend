// Entidad Rental
export class Rental {
  constructor({ id, vehicleId, renterId, ownerId, startDate, endDate, totalPrice, status, pickupLocation, returnLocation, notes, createdAt, acceptedAt }) {
    this.id = id
    this.vehicleId = vehicleId
    this.renterId = renterId
    this.ownerId = ownerId
    this.startDate = startDate
    this.endDate = endDate
    this.totalPrice = totalPrice
    this.status = status
    this.pickupLocation = pickupLocation
    this.returnLocation = returnLocation
    this.notes = notes
    this.createdAt = createdAt
    this.acceptedAt = acceptedAt
  }

  get durationHours() {
    try {
      const start = new Date(this.startDate)
      const end = new Date(this.endDate)
      return Math.max(1, Math.round((end - start) / 36e5))
    } catch { return null }
  }
}
