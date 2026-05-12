<template>
  <div class="notifications-page">
    <div class="notifications-container">
      <!-- Header -->
      <header class="notifications-header">
        <div class="header-content">
          <h1>Notificaciones</h1>
          <span v-if="unreadCount > 0" class="badge-count">{{ unreadCount }} nuevas</span>
        </div>
        <div class="header-actions">
          <button 
            v-if="unreadCount > 0"
            @click="handleMarkAllRead" 
            class="btn-text"
            :disabled="loading"
          >
            <i class="pi pi-check-circle"></i>
            Marcar todo como leído
          </button>
        </div>
      </header>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando notificaciones...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="notifications.length === 0" class="empty-state">
        <div class="empty-icon">
          <i class="pi pi-bell-slash"></i>
        </div>
        <h3>Sin notificaciones</h3>
        <p>No tienes notificaciones pendientes en este momento.</p>
      </div>

      <!-- Notifications List -->
      <div v-else class="notifications-list">
        <transition-group name="list">
          <div 
            v-for="notification in notifications" 
            :key="notification.id"
            class="notification-item"
            :class="{ 'unread': !notification.read }"
            @click="handleMarkRead(notification)"
          >
            <!-- Icon based on type -->
            <div class="notification-icon" :class="getTypeClass(notification.type)">
              <i :class="getTypeIcon(notification.type)"></i>
            </div>

            <!-- Content -->
            <div class="notification-content">
              <div class="notification-top">
                <h4 class="notification-title">{{ notification.title }}</h4>
                <span class="notification-time">{{ formatDate(notification.createdAt) }}</span>
              </div>
              <p class="notification-message">{{ notification.message }}</p>
            </div>

            <!-- Actions -->
            <div class="notification-actions">
              <button 
                @click.stop="handleDelete(notification.id)" 
                class="btn-icon delete"
                title="Eliminar"
              >
                <i class="pi pi-trash"></i>
              </button>
              <div v-if="!notification.read" class="unread-indicator"></div>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useNotificationStore } from '../application/notification.store'
import { useUserStore } from '../../iam/application/user.store'

const { 
  notifications, 
  loading, 
  unreadCount, 
  fetchNotifications, 
  markAsRead, 
  markAllAsRead, 
  deleteNotification 
} = useNotificationStore()

const { currentUser } = useUserStore()

onMounted(() => {
  if (currentUser.value) {
    fetchNotifications(currentUser.value.id)
  }
})

const handleMarkRead = (notification) => {
  if (!notification.read) {
    markAsRead(notification.id)
  }
}

const handleMarkAllRead = () => {
  if (currentUser.value) {
    markAllAsRead(currentUser.value.id)
  }
}

const handleDelete = (id) => {
  deleteNotification(id)
}

const getTypeClass = (type) => {
  const types = {
    'booking': 'type-booking',
    'payment': 'type-payment',
    'system': 'type-system',
    'alert': 'type-alert'
  }
  return types[type] || 'type-default'
}

const getTypeIcon = (type) => {
  const icons = {
    'booking': 'pi pi-calendar',
    'payment': 'pi pi-wallet',
    'system': 'pi pi-info-circle',
    'alert': 'pi pi-exclamation-triangle'
  }
  return icons[type] || 'pi pi-bell'
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date
  
  // Menos de 24 horas
  if (diff < 86400000) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  // Menos de 7 días
  if (diff < 604800000) {
    return date.toLocaleDateString([], { weekday: 'short' })
  }
  return date.toLocaleDateString()
}
</script>

<style scoped>
.notifications-page {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 2rem 1rem;
}

.notifications-container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  min-height: 600px;
}

/* Header */
.notifications-header {
  padding: 2rem;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.notifications-header h1 {
  font-size: 1.75rem;
  font-weight: 800;
  color: #2C3E50;
  margin: 0;
}

.badge-count {
  background: #FF6F00;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.btn-text {
  background: none;
  border: none;
  color: #3A5E5E;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s;
}

.btn-text:hover {
  background: #f0fdfa;
}

.btn-text:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Loading State */
.loading-state {
  padding: 4rem;
  text-align: center;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3A5E5E;
  border-radius: 50%;
  margin: 0 auto 1rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Empty State */
.empty-state {
  padding: 4rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty-icon {
  width: 80px;
  height: 80px;
  background: #f8f9fa;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.empty-icon i {
  font-size: 2.5rem;
  color: #cbd5e0;
}

.empty-state h3 {
  color: #2C3E50;
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
}

.empty-state p {
  color: #666;
  margin: 0;
}

/* List */
.notifications-list {
  padding: 0;
}

.notification-item {
  display: flex;
  gap: 1.25rem;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.notification-item:hover {
  background: #f8f9fa;
}

.notification-item.unread {
  background: #f0fdfa;
}

.notification-item.unread:hover {
  background: #e6fffa;
}

/* Icons */
.notification-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notification-icon i {
  font-size: 1.25rem;
}

.type-booking { background: #e0f2fe; color: #0284c7; }
.type-payment { background: #dcfce7; color: #16a34a; }
.type-alert { background: #fee2e2; color: #dc2626; }
.type-system { background: #f3f4f6; color: #4b5563; }
.type-default { background: #f3f4f6; color: #4b5563; }

/* Content */
.notification-content {
  flex: 1;
  min-width: 0; /* Prevent text overflow */
}

.notification-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.notification-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #2C3E50;
}

.notification-time {
  font-size: 0.85rem;
  color: #94a3b8;
  white-space: nowrap;
  margin-left: 1rem;
}

.notification-message {
  margin: 0;
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.unread .notification-title {
  font-weight: 700;
  color: #0f172a;
}

.unread .notification-message {
  color: #334155;
}

/* Actions */
.notification-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding-left: 0.5rem;
}

.btn-icon {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s;
  opacity: 0; /* Hidden by default */
}

.notification-item:hover .btn-icon {
  opacity: 1;
}

.btn-icon:hover {
  background: #fee2e2;
  color: #dc2626;
}

.unread-indicator {
  width: 10px;
  height: 10px;
  background: #FF6F00;
  border-radius: 50%;
  margin-top: auto;
  margin-bottom: auto;
}

/* Transitions */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* Responsive */
@media (max-width: 640px) {
  .notifications-header {
    padding: 1.5rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .header-actions {
    width: 100%;
  }
  
  .btn-text {
    width: 100%;
    justify-content: center;
    background: #f8f9fa;
  }

  .notification-item {
    padding: 1.25rem;
  }
}
</style>

