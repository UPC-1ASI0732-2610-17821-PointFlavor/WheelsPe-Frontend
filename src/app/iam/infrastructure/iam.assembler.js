// Assembler: DTO (JSON API) → User entity
import { apiClient } from '@/app/shared/infrastructure/apiClient.js'
import { User } from '../domain/model/User.entity.js'

/**
 * Converts a user DTO from the API to a User entity
 */
export function toUserEntity(dto) {
  if (!dto) return null
  
  return new User({
    id: dto.id,
    role: dto.role,
    firstName: dto.firstName,
    lastName: dto.lastName,
    email: dto.email,
    phone: dto.phone,
    dni: dto.dni,
    licenseNumber: dto.licenseNumber,
    avatar: dto.avatar,
    verified: dto.verified,
    stats: dto.stats,
    preferences: dto.preferences,
    bankAccount: dto.bankAccount
  })
}

/**
 * Converts an array of user DTOs to an array of User entities
 */
export function toUserCollection(dtos) {
  if (!Array.isArray(dtos)) return []
  return dtos.map(toUserEntity)
}

/**
 * Converts a User entity to a DTO for the API
 */
export function toUserDto(user) {
  if (!user) return null
  
  return {
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    dni: user.dni,
    licenseNumber: user.licenseNumber,
    avatar: user.avatar,
    verified: user.verified,
    stats: user.stats,
    preferences: user.preferences,
    bankAccount: user.bankAccount
  }
}
