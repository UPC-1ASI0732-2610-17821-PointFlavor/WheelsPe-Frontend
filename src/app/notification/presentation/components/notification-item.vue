<template>
  <div 
    :class="['notification-item', { 'unread': !notification.read }]"
    @click="handleClick"
  >
    <!-- Icono con fondo según tipo -->
    <div class="notification-icon" :class="getTypeClass(notification.type)">
      <i :class="['pi', getIcon(notification.type)]"></i>
    </div>
    
    <!-- Contenido -->
    <div class="notification-content">
      <div class="notification-header">
        <span class="notification-title">{{ notification.title }}</span>
        <span class="notification-time">{{ formatDate(notification.createdAt) }}</span>
      </div>
      <p class="notification-message">{{ notification.message }}</p>
      
      <!-- Botón de acción si existe actionUrl -->
      <button 
        v-if="notification.actionUrl && notification.actionLabel" 
        class="action-link-btn"
        @click.stop="navigateToAction"
      >
        {{ notification.actionLabel }}
        <i class="pi pi-arrow-right"></i>
      </button>
    </div>
    
    <!-- Indicador de no leído + acciones al hover -->
    <div class="notification-end">
      <div v-if="!notification.read" class="unread-dot"></div>
      <div class="notification-actions">
        <button 
          class="action-btn delete"
          @click.stop="deleteNotification"
          title="Eliminar"
        >
          <i class="pi pi-trash"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import { useNotificationStore } from '@/app/notification/application/notification.store.js'

const props = defineProps({
  notification: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['action', 'read', 'delete'])

const router = useRouter()
const notificationStore = useNotificationStore()

const getIcon = (type) => {
  const icons = {
    'damage_report': 'pi-exclamation-triangle',
    'payment_required': 'pi-wallet',
    'rental_confirmed': 'pi-check-circle',
    'rental_request': 'pi-calendar',
    'rental_cancelled': 'pi-times-circle',
    'system': 'pi-info-circle',
    'booking': 'pi-calendar',
    'payment': 'pi-wallet',
    'alert': 'pi-exclamation-triangle'
  }
  return icons[type] || 'pi-bell'
}

const getTypeClass = (type) => {
  const classes = {
    'damage_report': 'type-warning',
    'payment_required': 'type-danger',
    'rental_confirmed': 'type-success',
    'rental_request': 'type-info',
    'rental_cancelled': 'type-muted',
    'system': 'type-muted',
    'booking': 'type-info',
    'payment': 'type-success',
    'alert': 'type-warning'
  }
  return classes[type] || 'type-default'
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return 'Ahora'
  if (minutes < 60) return `Hace ${minutes}min`
  if (hours < 24) return `Hace ${hours}h`
  if (days < 7) return `Hace ${days}d`
  
  return date.toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: 'short',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  })
}

const handleClick = () => {
  if (!props.notification.read) {
    markAsRead()
  }
}

const navigateToAction = () => {
  if (!props.notification.read) {
    markAsRead()
  }
  if (props.notification.actionUrl) {
    router.push(props.notification.actionUrl)
  }
}

const handleAction = () => {
  if (props.notification.actionUrl) {
    router.push(props.notification.actionUrl)
  }
  emit('action', props.notification)
}

const markAsRead = async () => {
  try {
    await notificationStore.markAsRead(props.notification.id)
    emit('read', props.notification)
  } catch (error) {
    console.error('Error marking notification as read:', error)
  }
}

const deleteNotification = async () => {
  try {
    await notificationStore.deleteNotification(props.notification.id)
    emit('delete', props.notification)
  } catch (error) {
    console.error('Error deleting notification:', error)
  }
}
</script>

<style scoped>
.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  padding: 1rem 1.25rem;
  cursor: pointer;
  transition: background 0.15s ease;
  position: relative;
}

.notification-item:not(:last-child)::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 1.25rem;
  right: 1.25rem;
  height: 1px;
  background: #f0f0f0;
}

.notification-item:hover {
  background: #fafafa;
}

.notification-item.unread {
  background: #f8fffe;
}

.notification-item.unread:hover {
  background: #f0fdfa;
}

/* Icon */
.notification-icon {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
}

.notification-icon i {
  font-size: 1rem;
}

.notification-icon.type-info {
  background: #e0f2fe;
  color: #0284c7;
}

.notification-icon.type-success {
  background: #dcfce7;
  color: #16a34a;
}

.notification-icon.type-warning {
  background: #fff7ed;
  color: #ea580c;
}

.notification-icon.type-danger {
  background: #fee2e2;
  color: #dc2626;
}

.notification-icon.type-muted,
.notification-icon.type-default {
  background: #f3f4f6;
  color: #6b7280;
}

/* Content */
.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.25rem;
}

.notification-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.3;
}

.unread .notification-title {
  font-weight: 700;
  color: #0f172a;
}

.notification-time {
  font-size: 0.7rem;
  color: #94a3b8;
  white-space: nowrap;
  flex-shrink: 0;
}

.notification-message {
  margin: 0;
  font-size: 0.8rem;
  color: #64748b;
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.unread .notification-message {
  color: #475569;
}

/* End section */
.notification-end {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  min-height: 36px;
  padding-left: 0.25rem;
}

.unread-dot {
  width: 8px;
  height: 8px;
  background: #FF6F00;
  border-radius: 50%;
  flex-shrink: 0;
}

.notification-actions {
  opacity: 0;
  transition: opacity 0.15s;
}

.notification-item:hover .notification-actions {
  opacity: 1;
}

.action-btn {
  background: none;
  border: none;
  padding: 0.35rem;
  cursor: pointer;
  border-radius: 6px;
  color: #94a3b8;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background: #fee2e2;
  color: #dc2626;
}

.action-btn i {
  font-size: 0.8rem;
}

/* Action Link Button */
.action-link-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 0.5rem;
  padding: 0.5rem 0.875rem;
  background: linear-gradient(135deg, #FF6F00 0%, #FF8F00 100%);
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-link-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 111, 0, 0.35);
}

.action-link-btn i {
  font-size: 0.65rem;
  transition: transform 0.2s;
}

.action-link-btn:hover i {
  transform: translateX(2px);
}
</style>
