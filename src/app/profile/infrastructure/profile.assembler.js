import { UserProfile } from '../domain/model/UserProfile.entity.js'

/**
 * Assembler para transformar datos de API a entidades UserProfile
 */
export class ProfileAssembler {
  /**
   * Transforma datos de API a entidad UserProfile
   */
  static toEntity(data) {
    if (!data) return null
    return new UserProfile(data)
  }

  /**
   * Transforma entidad UserProfile a DTO para API
   */
  static toDto(entity) {
    if (!entity) return null
    return entity.toJson()
  }

  /**
   * Transforma array de datos a colección de entidades
   */
  static toEntityCollection(dataArray) {
    if (!Array.isArray(dataArray)) return []
    return dataArray.map(item => this.toEntity(item))
  }
}
