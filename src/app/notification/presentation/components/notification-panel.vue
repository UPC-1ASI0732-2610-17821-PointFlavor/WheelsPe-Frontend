<template>
  <div class="notification-panel-wrapper">
    <Button
      icon="pi pi-bell"
      class="notification-bell-button"
      :class="{ 'bell-active': panel?.visible }"
      text
      rounded
      @click="togglePanel"
      :badge="unreadCount > 0 ? String(unreadCount) : null"
      badgeSeverity="danger"
      v-tooltip.bottom="$t('notification.notifications')"
    />
    
    <OverlayPanel ref="panel" class="notification-overlay">
      <div class="notification-panel">
        <!-- Header minimalista -->
        <div class="notification-header">
          <div class="header-left">
            <span class="header-title">Notificaciones</span>
            <span v-if="unreadCount > 0" class="unread-badge">{{ unreadCount }}</span>
          </div>
          <button 
            v-if="unreadCount > 0"
            class="btn-mark-all"
            @click="markAllAsRead"
          >
            Marcar leídas
          </button>
        </div>
        
        <!-- Loading -->
        <div v-if="loading" class="notification-state">
          <div class="loading-spinner"></div>
          <span>Cargando...</span>
        </div>
        
        <!-- Error -->
        <div v-else-if="error" class="notification-state error">
          <i class="pi pi-exclamation-circle"></i>
          <span>Error al cargar</span>
        </div>
        
        <!-- Empty -->
        <div v-else-if="notifications.length === 0" class="notification-state empty">
          <div class="empty-icon">
            <i class="pi pi-bell-slash"></i>
          </div>
          <span class="empty-title">Sin notificaciones</span>
          <span class="empty-desc">Estás al día</span>
        </div>
        
        <!-- List -->
        <div v-else class="notification-list">
          <NotificationItem
            v-for="notification in notifications"
            :key="notification.id"
            :notification="notification"
            @action="handleAction"
            @read="handleRead"
            @delete="handleDelete"
          />
        </div>
        
        <!-- Footer -->
        <div v-if="notifications.length > 0" class="notification-footer">
          <button class="btn-view-all" @click="viewAllNotifications">
            Ver todas
            <i class="pi pi-arrow-right"></i>
          </button>
        </div>
      </div>
    </OverlayPanel>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import OverlayPanel from 'primevue/overlaypanel'
import ProgressSpinner from 'primevue/progressspinner'
import Message from 'primevue/message'
import { useNotificationStore } from '@/app/notification/application/notification.store.js'
import { useUserStore } from '@/app/iam/application/user.store.js'
import NotificationItem from './notification-item.vue'

const router = useRouter()
const notificationStore = useNotificationStore()
const userStore = useUserStore()
const panel = ref()

// The store already exposes computed refs. Use them directly so we don't wrap
// a computed inside another computed (which caused `notifications.value` to
// be a ComputedRef object instead of an array).
const notifications = notificationStore.recentNotifications
const unreadCount = notificationStore.unreadCount
const loading = notificationStore.loading
const error = notificationStore.error

const togglePanel = async (event) => {
  panel.value.toggle(event)
  
  // Cargar notificaciones al abrir el panel
  if (panel.value.visible) {
    await loadNotifications()
  }
}

const loadNotifications = async () => {
  // Obtener userId del user store - necesitamos el .value porque es un computed
  const currentUser = userStore.currentUser.value
  console.log('🔔 Usuario actual:', currentUser)
  if (currentUser && currentUser.id) {
    console.log('🔔 Cargando notificaciones para usuario ID:', currentUser.id)
    await notificationStore.fetchNotifications(currentUser.id)
    console.log('🔔 Notificaciones cargadas:', notifications.value.length)
  } else {
    console.error('❌ No hay usuario autenticado o falta el ID')
    console.error('currentUser:', currentUser)
  }
}

const markAllAsRead = async () => {
  const currentUser = userStore.currentUser.value
  if (currentUser && currentUser.id) {
    await notificationStore.markAllAsRead(currentUser.id)
  }
}

const handleAction = (notification) => {
  panel.value.hide()
}

const handleRead = () => {
  // La notificación ya fue marcada como leída
}

const handleDelete = () => {
  // La notificación ya fue eliminada
}

const viewAllNotifications = () => {
  router.push('/notifications')
  panel.value.hide()
}

onMounted(() => {
  loadNotifications()
})
</script>

<style scoped>
.notification-panel-wrapper {
  position: relative;
}

/* Override del OverlayPanel para bordes redondeados */
:deep(.notification-overlay) {
  border-radius: 16px !important;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12) !important;
  border: none !important;
}

:deep(.notification-overlay .p-overlaypanel-content) {
  padding: 0 !important;
}

.notification-panel {
  display: flex;
  flex-direction: column;
  width: 380px;
  max-width: 90vw;
  max-height: 520px;
  background: #fff;
}

/* Header */
.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f0f0f0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: -0.02em;
}

.unread-badge {
  background: #FF6F00;
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
}

.btn-mark-all {
  background: none;
  border: none;
  color: #3A5E5E;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  transition: background 0.2s;
}

.btn-mark-all:hover {
  background: #f0fdfa;
}

/* States */
.notification-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  gap: 0.75rem;
  color: #94a3b8;
}

.notification-state.error {
  color: #ef4444;
}

.notification-state i {
  font-size: 1.5rem;
}

.loading-spinner {
  width: 28px;
  height: 28px;
  border: 2.5px solid #f0f0f0;
  border-top-color: #3A5E5E;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-icon {
  width: 56px;
  height: 56px;
  background: #f8f9fa;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.empty-icon i {
  font-size: 1.5rem;
  color: #cbd5e1;
}

.empty-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #64748b;
}

.empty-desc {
  font-size: 0.8rem;
  color: #94a3b8;
}

/* List */
.notification-list {
  overflow-y: auto;
  max-height: 380px;
}

.notification-list::-webkit-scrollbar {
  width: 4px;
}

.notification-list::-webkit-scrollbar-track {
  background: transparent;
}

.notification-list::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 4px;
}

/* Footer */
.notification-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #f0f0f0;
}

.btn-view-all {
  width: 100%;
  background: #f8f9fa;
  border: none;
  color: #3A5E5E;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.75rem;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.btn-view-all:hover {
  background: #f0fdfa;
}

.btn-view-all i {
  font-size: 0.75rem;
}

/* Bell Button */
.notification-bell-button {
  color: white !important;
  background: transparent !important;
  border: 2px solid transparent !important;
  transition: all 0.3s ease !important;
}

.notification-bell-button:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  border-color: white !important;
}

.notification-bell-button.bell-active {
  background: white !important;
  color: #1a1a1a !important;
  border-color: white !important;
}

.notification-bell-button.bell-active :deep(.pi-bell) {
  color: #FF6F00 !important;
}
</style>
