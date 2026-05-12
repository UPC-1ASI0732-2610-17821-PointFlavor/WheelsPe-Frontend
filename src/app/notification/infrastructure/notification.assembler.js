import { Notification } from '../domain/model/Notification.entity.js'

/**
 * Assembler para transformar datos de API a entidades Notification
 */
export class NotificationAssembler {
  /**
   * Transforma datos de API a entidad Notification
   */
  static toEntity(data) {
    if (!data) return null
    return new Notification(data)
  }

  /**
   * Transforma array de datos a colección de entidades
   */
  static toEntityCollection(dataArray) {
    if (!Array.isArray(dataArray)) return []
    return dataArray.map(item => this.toEntity(item))
  }

  /**
   * Transforma entidad Notification a DTO para API
   */
  static toDto(entity) {
    if (!entity) return null
    return entity.toJson()
  }
}
