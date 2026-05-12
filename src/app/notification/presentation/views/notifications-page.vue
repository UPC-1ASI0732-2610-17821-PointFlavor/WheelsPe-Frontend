<template>
  <div class="notifications-page">
    <!-- Header -->
    <header class="page-header">
      <div class="header-content">
        <button class="btn-back" @click="goBack">
          <i class="pi pi-arrow-left"></i>
        </button>
        <div class="header-text">
          <h1>Notificaciones</h1>
          <p v-if="notifications.length > 0">{{ notifications.length }} notificaciones</p>
        </div>
      </div>
      <div class="header-actions">
        <button 
          v-if="unreadCount > 0"
          class="btn-action"
          @click="handleMarkAllRead"
        >
          <i class="pi pi-check-circle"></i>
          <span>Marcar todas leídas</span>
        </button>
      </div>
    </header>

    <!-- Filters -->
    <div class="filters-bar">
      <button 
        v-for="filter in filters" 
        :key="filter.value"
        :class="['filter-chip', { active: activeFilter === filter.value }]"
        @click="activeFilter = filter.value"
      >
        {{ filter.label }}
        <span v-if="filter.count > 0" class="chip-count">{{ filter.count }}</span>
      </button>
    </div>

    <!-- Content -->
    <main class="page-content">
      <!-- Loading -->
      <div v-if="loading" class="state-container">
        <div class="loading-spinner"></div>
        <p>Cargando notificaciones...</p>
      </div>

      <!-- Empty -->
      <div v-else-if="filteredNotifications.length === 0" class="state-container empty">
        <div class="empty-illustration">
          <i class="pi pi-bell-slash"></i>
        </div>
        <h2>{{ activeFilter === 'all' ? 'Sin notificaciones' : 'No hay notificaciones en esta categoría' }}</h2>
        <p>{{ activeFilter === 'all' ? 'Cuando tengas actividad, aparecerá aquí.' : 'Prueba con otro filtro.' }}</p>
      </div>

      <!-- List -->
      <div v-else class="notifications-list">
        <TransitionGroup name="list">
          <article 
            v-for="notification in filteredNotifications" 
            :key="notification.id"
            :class="['notification-card', { unread: !notification.read }]"
            @click="handleNotificationClick(notification)"
          >
            <!-- Icon -->
            <div :class="['notification-icon', getTypeClass(notification.type)]">
              <i :class="getTypeIcon(notification.type)"></i>
            </div>

            <!-- Content -->
            <div class="notification-body">
              <div class="notification-header">
                <h3>{{ notification.title }}</h3>
                <time>{{ formatDate(notification.createdAt) }}</time>
              </div>
              <p class="notification-message">{{ notification.message }}</p>
              
              <!-- Action Button -->
              <button 
                v-if="notification.actionUrl" 
                class="btn-action-link"
                @click.stop="goToAction(notification)"
              >
                {{ notification.actionLabel || 'Ver detalles' }}
                <i class="pi pi-arrow-right"></i>
              </button>
            </div>

            <!-- Status & Actions -->
            <div class="notification-end">
              <div v-if="!notification.read" class="unread-indicator"></div>
              <button 
                class="btn-delete"
                @click.stop="handleDelete(notification.id)"
                title="Eliminar"
              >
                <i class="pi pi-trash"></i>
              </button>
            </div>
          </article>
        </TransitionGroup>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationStore } from '../../application/notification.store'
import { useUserStore } from '@/app/iam/application/user.store'

const router = useRouter()
const notificationStore = useNotificationStore()
const userStore = useUserStore()

const { 
  notifications, 
  loading, 
  unreadCount,
  fetchNotifications, 
  markAsRead, 
  markAllAsRead, 
  deleteNotification 
} = notificationStore

const activeFilter = ref('all')

const filters = computed(() => [
  { label: 'Todas', value: 'all', count: notifications.value.length },
  { label: 'No leídas', value: 'unread', count: unreadCount.value },
  { label: 'Alquileres', value: 'rental', count: notifications.value.filter(n => n.type?.includes('rental')).length },
  { label: 'Pagos', value: 'payment', count: notifications.value.filter(n => n.type?.includes('payment')).length },
  { label: 'Sistema', value: 'system', count: notifications.value.filter(n => ['info', 'success', 'system'].includes(n.type)).length }
])

const filteredNotifications = computed(() => {
  if (activeFilter.value === 'all') return notifications.value
  if (activeFilter.value === 'unread') return notifications.value.filter(n => !n.read)
  if (activeFilter.value === 'rental') return notifications.value.filter(n => n.type?.includes('rental'))
  if (activeFilter.value === 'payment') return notifications.value.filter(n => n.type?.includes('payment'))
  if (activeFilter.value === 'system') return notifications.value.filter(n => ['info', 'success', 'system'].includes(n.type))
  return notifications.value
})

onMounted(() => {
  const user = userStore.currentUser.value
  if (user?.id) {
    fetchNotifications(user.id)
  }
})

const goBack = () => {
  router.back()
}

const handleNotificationClick = (notification) => {
  if (!notification.read) {
    markAsRead(notification.id)
  }
}

const handleMarkAllRead = () => {
  const user = userStore.currentUser.value
  if (user?.id) {
    markAllAsRead(user.id)
  }
}

const handleDelete = (id) => {
  deleteNotification(id)
}

const goToAction = (notification) => {
  if (notification.actionUrl) {
    if (!notification.read) {
      markAsRead(notification.id)
    }
    router.push(notification.actionUrl)
  }
}

const getTypeClass = (type) => {
  const map = {
    'rental_request': 'type-info',
    'rental_confirmed': 'type-success',
    'rental_cancelled': 'type-muted',
    'rental_completed': 'type-success',
    'payment_required': 'type-danger',
    'payment_received': 'type-success',
    'damage_report': 'type-warning',
    'success': 'type-success',
    'info': 'type-info',
    'system': 'type-muted'
  }
  return map[type] || 'type-default'
}

const getTypeIcon = (type) => {
  const map = {
    'rental_request': 'pi pi-car',
    'rental_confirmed': 'pi pi-check-circle',
    'rental_cancelled': 'pi pi-times-circle',
    'rental_completed': 'pi pi-flag',
    'payment_required': 'pi pi-wallet',
    'payment_received': 'pi pi-dollar',
    'damage_report': 'pi pi-exclamation-triangle',
    'success': 'pi pi-check',
    'info': 'pi pi-info-circle',
    'system': 'pi pi-cog'
  }
  return map[type] || 'pi pi-bell'
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return 'Ahora'
  if (minutes < 60) return `Hace ${minutes} min`
  if (hours < 24) return `Hace ${hours}h`
  if (days < 7) return `Hace ${days} días`
  
  return date.toLocaleDateString('es-PE', { 
    day: 'numeric',
    month: 'short'
  })
}
</script>

<style scoped>
.notifications-page {
  min-height: 100vh;
  background: #f8f9fa;
}

/* Header */
.page-header {
  background: linear-gradient(135deg, #3A5E5E 0%, #2C5050 100%);
  color: white;
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-back {
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: white;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.btn-back:hover {
  background: rgba(255, 255, 255, 0.25);
}

.btn-back i {
  font-size: 1.1rem;
}

.header-text h1 {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.header-text p {
  margin: 0.25rem 0 0 0;
  opacity: 0.8;
  font-size: 0.9rem;
}

.header-actions .btn-action {
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: white;
  padding: 0.75rem 1.25rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.2s;
}

.header-actions .btn-action:hover {
  background: rgba(255, 255, 255, 0.25);
}

/* Filters */
.filters-bar {
  background: white;
  padding: 1rem 2rem;
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  border-bottom: 1px solid #eee;
  -webkit-overflow-scrolling: touch;
}

.filters-bar::-webkit-scrollbar {
  display: none;
}

.filter-chip {
  background: #f0f0f0;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.filter-chip:hover {
  background: #e5e5e5;
}

.filter-chip.active {
  background: #3A5E5E;
  color: white;
}

.chip-count {
  background: rgba(0, 0, 0, 0.1);
  padding: 0.125rem 0.5rem;
  border-radius: 10px;
  font-size: 0.75rem;
}

.filter-chip.active .chip-count {
  background: rgba(255, 255, 255, 0.2);
}

/* Content */
.page-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 1.5rem;
}

/* States */
.state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  color: #64748b;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e5e5;
  border-top-color: #3A5E5E;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-illustration {
  width: 100px;
  height: 100px;
  background: #f0f0f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.empty-illustration i {
  font-size: 2.5rem;
  color: #cbd5e1;
}

.state-container h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  color: #334155;
}

.state-container p {
  margin: 0;
  font-size: 0.95rem;
}

/* Notifications List */
.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.notification-card {
  background: white;
  border-radius: 16px;
  padding: 1.25rem;
  display: flex;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  border: 1px solid transparent;
}

.notification-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.notification-card.unread {
  background: linear-gradient(135deg, #f0fdfa 0%, #f8fffe 100%);
  border-color: #ccfbf1;
}

/* Icon */
.notification-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notification-icon i {
  font-size: 1.25rem;
}

.type-info { background: #e0f2fe; color: #0369a1; }
.type-success { background: #dcfce7; color: #15803d; }
.type-warning { background: #fff7ed; color: #c2410c; }
.type-danger { background: #fee2e2; color: #b91c1c; }
.type-muted, .type-default { background: #f3f4f6; color: #4b5563; }

/* Body */
.notification-body {
  flex: 1;
  min-width: 0;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 0.375rem;
}

.notification-header h3 {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.4;
}

.unread .notification-header h3 {
  font-weight: 700;
  color: #0f172a;
}

.notification-header time {
  font-size: 0.75rem;
  color: #94a3b8;
  white-space: nowrap;
  flex-shrink: 0;
}

.notification-message {
  margin: 0 0 0.75rem 0;
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.unread .notification-message {
  color: #475569;
}

.btn-action-link {
  background: none;
  border: none;
  color: #3A5E5E;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  transition: color 0.2s;
}

.btn-action-link:hover {
  color: #2C5050;
}

.btn-action-link i {
  font-size: 0.7rem;
}

/* End */
.notification-end {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  min-height: 48px;
}

.unread-indicator {
  width: 10px;
  height: 10px;
  background: #FF6F00;
  border-radius: 50%;
}

.btn-delete {
  background: none;
  border: none;
  color: #94a3b8;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s;
}

.notification-card:hover .btn-delete {
  opacity: 1;
}

.btn-delete:hover {
  background: #fee2e2;
  color: #dc2626;
}

/* Transitions */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* Responsive */
@media (max-width: 640px) {
  .page-header {
    padding: 1.5rem;
  }
  
  .header-text h1 {
    font-size: 1.5rem;
  }
  
  .header-actions .btn-action span {
    display: none;
  }
  
  .filters-bar {
    padding: 1rem;
  }
  
  .page-content {
    padding: 1rem;
  }
  
  .notification-card {
    padding: 1rem;
  }
  
  .notification-icon {
    width: 40px;
    height: 40px;
  }
}
</style>
