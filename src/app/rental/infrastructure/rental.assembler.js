// Assembler / Mapper para DTOs de rental
import { Vehicle } from '../domain/model/Vehicle.entity.js'
import { Rental } from '../domain/model/Rental.entity.js'

export function toVehicleEntity(dto) { 
  return new Vehicle(dto) 
}

export function toRentalEntity(dto) { 
  return new Rental(dto) 
}

export function toVehicleCollection(list) { 
  return Array.isArray(list) ? list.map(toVehicleEntity) : [] 
}

export function toRentalCollection(list) { 
  return Array.isArray(list) ? list.map(toRentalEntity) : [] 
}
