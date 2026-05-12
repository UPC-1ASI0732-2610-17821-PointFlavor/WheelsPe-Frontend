
export class Vehicle {
    constructor({
                    id,
                    ownerId,
                    brand,
                    model,
                    year,
                    color,
                    transmission,
                    fuelType,
                    seats,
                    dailyPrice,
                    depositAmount,
                    location,
                    features,
                    restrictions,
                    photos,
                    status,
                }) {
        this.id = id
        this.ownerId = ownerId
        this.brand = brand
        this.model = model
        this.year = year
        this.color = color
        this.transmission = transmission
        this.fuelType = fuelType
        this.seats = seats
        this.dailyPrice = dailyPrice
        this.depositAmount = depositAmount
        this.location = location
        this.features = features
        this.restrictions = restrictions
        this.photos = photos
        this.status = status
    }

    static fromJson(json) {
        return new Vehicle(json)
    }
}
