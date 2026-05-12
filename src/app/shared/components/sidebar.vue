<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/app/iam/application/user.store'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const { t } = useI18n()

const user = computed(() => userStore.currentUser.value)
const userInitials = computed(() => userStore.userInitials.value)
const isRenter = computed(() => userStore.isRenter.value)
const isOwner = computed(() => userStore.isOwner.value)

const renterLinks = computed(() => [
  { path: '/dashboard', icon: 'pi-home', label: t('shared.sidebar.renter.dashboard') },
  { path: '/adventure', icon: 'pi-compass', label: 'Aventuras' },
  { path: '/rental/browse', icon: 'pi-car', label: t('shared.sidebar.renter.explore') },
  { path: '/rental/my-rentals', icon: 'pi-list', label: t('shared.sidebar.renter.myRentals') },
  { path: '/payments/my-payments', icon: 'pi-wallet', label: t('payment.history.title') },
  { path: '/notifications', icon: 'pi-bell', label: 'Notificaciones' },
  { path: '/auth/profile', icon: 'pi-user', label: t('shared.sidebar.renter.profile') }
])

const ownerLinks = computed(() => [
  { path: '/dashboard', icon: 'pi-home', label: t('shared.sidebar.owner.dashboard') },
  { path: '/rental/my-vehicles', icon: 'pi-car', label: t('shared.sidebar.owner.myVehicles') },
  { path: '/rental/rental-requests', icon: 'pi-inbox', label: 'Solicitudes' },
  { path: '/adventure/my-adventures', icon: 'pi-compass', label: 'Mis Aventuras' },
  { path: '/notifications', icon: 'pi-bell', label: 'Notificaciones' },
  { path: '/support/tickets', icon: 'pi-ticket', label: 'Soporte', badge: 0 },
  { path: '/auth/profile', icon: 'pi-user', label: t('shared.sidebar.owner.profile') }
])

const currentLinks = computed(() => isRenter.value ? renterLinks.value : ownerLinks.value)

const isActive = (path) => {
  return route.path === path
}

const handleLogout = () => {
  userStore.logout()
  router.push('/auth/login')
}
</script>

<template>
  <aside class="sidebar">
    <!-- Logo/Brand -->
    <div class="sidebar-brand">
      <div class="brand-content">
        <i class="pi pi-car brand-logo"></i>
        <div class="brand-text">
          <h2>MOVEO</h2>
          <span class="role-badge" :class="{ 'renter': isRenter, 'owner': isOwner }">
            <i :class="`pi ${isRenter ? 'pi-user' : 'pi-briefcase'}`"></i>
            {{ isRenter ? 'Cliente' : 'Propietario' }}
          </span>
        </div>
      </div>
    </div>

    <!-- User Info -->
    <div class="user-info">
      <div class="user-avatar">
        {{ userInitials }}
      </div>
      <div class="user-details">
        <p class="user-name">{{ user?.fullName || 'Usuario' }}</p>
        <p class="user-email">{{ user?.email || '' }}</p>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="sidebar-nav">
      <router-link
        v-for="link in currentLinks"
        :key="link.path"
        :to="link.path"
        class="nav-item"
        :class="{ 'active': isActive(link.path) }"
      >
        <i :class="`pi ${link.icon} nav-icon`"></i>
        <span class="nav-label">{{ link.label }}</span>
      </router-link>
    </nav>

    <!-- Logout -->
    <button @click="handleLogout" class="logout-btn">
      <i class="pi pi-sign-out nav-icon"></i>
      <span class="nav-label">{{ t('shared.sidebar.logout') }}</span>
    </button>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 260px;
  height: 100vh;
  background: linear-gradient(180deg, #2C3E50 0%, #34495E 100%);
  border-right: 3px solid #FF6F00;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
}

.sidebar-brand {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(135deg, rgba(255, 111, 0, 0.1) 0%, rgba(255, 143, 0, 0.05) 100%);
}

.brand-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand-logo {
  font-size: 2rem;
  color: #FF6F00;
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.brand-text h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin: 0 0 0.25rem 0;
  letter-spacing: 1px;
}

.role-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.role-badge.renter {
  background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.role-badge.owner {
  background: linear-gradient(135deg, #FF6F00 0%, #F57C00 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(255, 111, 0, 0.3);
}

.role-badge i {
  font-size: 0.875rem;
}

.user-info {
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.1);
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF6F00 0%, #FF8F00 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(255, 111, 0, 0.4);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-weight: 600;
  color: white;
  font-size: 0.875rem;
  margin: 0 0 0.25rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
}

.sidebar-nav::-webkit-scrollbar {
  width: 6px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: rgba(255, 111, 0, 0.5);
  border-radius: 3px;
}

.sidebar-nav::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 111, 0, 0.7);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.5rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.2s;
  position: relative;
}

.nav-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 0;
  background: linear-gradient(90deg, #FF6F00 0%, #FF8F00 100%);
  transition: width 0.2s;
}

.nav-item:hover {
  background: rgba(255, 111, 0, 0.15);
  color: #FFB74D;
}

.nav-item:hover::before {
  width: 4px;
}

.nav-item.active {
  background: linear-gradient(90deg, rgba(255, 111, 0, 0.2) 0%, rgba(255, 143, 0, 0.1) 100%);
  color: #FFB74D;
  font-weight: 600;
}

.nav-item.active::before {
  width: 4px;
}

.nav-icon {
  font-size: 1.125rem;
  line-height: 1;
  color: inherit;
}

.nav-label {
  font-size: 0.875rem;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.5rem;
  border: none;
  background: rgba(220, 38, 38, 0.1);
  color: #EF4444;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  text-align: left;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.875rem;
}

.logout-btn:hover {
  background: rgba(220, 38, 38, 0.2);
  color: #FCA5A5;
}

.logout-btn .nav-icon {
  font-size: 1.125rem;
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s;
  }

  .sidebar.open {
    transform: translateX(0);
  }
}
</style>
