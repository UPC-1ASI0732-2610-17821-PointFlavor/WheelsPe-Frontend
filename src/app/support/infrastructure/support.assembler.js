import { SupportTicket } from '../domain/model/SupportTicket.entity.js'

/**
 * Assembler para transformar datos de API a entidades SupportTicket
 */
export class SupportAssembler {
  /**
   * Transforma datos de API a entidad SupportTicket
   */
  static toEntity(data) {
    if (!data) return null
    return new SupportTicket(data)
  }

  /**
   * Transforma array de datos a colección de entidades
   */
  static toEntityCollection(dataArray) {
    if (!Array.isArray(dataArray)) return []
    return dataArray.map(item => this.toEntity(item))
  }

  /**
   * Transforma entidad SupportTicket a DTO para API
   */
  static toDto(entity) {
    if (!entity) return null
    return entity.toJson()
  }
}
