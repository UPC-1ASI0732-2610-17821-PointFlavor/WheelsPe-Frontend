<template>
  <nav class="role-toolbar" v-if="userRole">
    <div class="container">
      <div class="toolbar-content">
        <div class="role-indicator">
          <span class="role-badge" :class="userRole">
            {{ roleLabel }}
          </span>
          <span class="user-name">{{ userName }}</span>
        </div>
        
        <div class="toolbar-nav">
          <router-link 
            v-for="link in currentLinks" 
            :key="link.path"
            :to="link.path"
            class="toolbar-link"
            active-class="active"
          >
            <span class="link-icon">{{ link.icon }}</span>
            <span class="link-text">{{ link.label }}</span>
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/app/iam/application/user.store.js'

const { t } = useI18n()
const { currentUser, userRole, userName } = useUserStore()

const roleLabel = computed(() => {
  return userRole.value === 'renter' ? '👤 ' + t('iam.register.roleSelection.roles.renter') : '🚗 ' + t('iam.register.roleSelection.roles.owner')
})

// Links para clientes (renters)
const renterLinks = computed(() => [
  { path: '/rentals', label: t('shared.sidebar.renter.explore'), icon: '🔍' },
  { path: '/my-rentals', label: t('shared.sidebar.renter.myRentals'), icon: '📋' },
  { path: '/adventure', label: t('adventure.routes'), icon: '🗺️' },
  { path: '/profile', label: t('shared.sidebar.renter.profile'), icon: '👤' }
])

// Links para propietarios (owners)
const ownerLinks = computed(() => [
  { path: '/my-vehicles', label: t('shared.sidebar.owner.myVehicles'), icon: '🚗' },
  { path: '/add-vehicle', label: t('rental.myVehicles.addVehicle'), icon: '➕' },
  { path: '/adventure/my-adventures', label: 'Mis Aventuras', icon: '🗺️' },
  { path: '/support/tickets', label: t('support.tickets'), icon: '🎫' },
  { path: '/profile', label: t('shared.sidebar.owner.profile'), icon: '👤' }
])

const currentLinks = computed(() => {
  return userRole.value === 'renter' ? renterLinks.value : ownerLinks.value
})
</script>

<style scoped>
.role-toolbar {
  background: linear-gradient(135deg, var(--bg-moveo-green) 0%, var(--brand-green) 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.toolbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0;
  gap: 1rem;
}

/* Role Indicator */
.role-indicator {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.role-badge {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  color: var(--text-secondary-2);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-family: var(--font-family-primary);
  font-weight: 600;
  font-size: 0.9rem;
  white-space: nowrap;
}

.role-badge.owner {
  background: var(--bg-moveo-orange);
  color: var(--text-secondary-2);
}

.user-name {
  color: var(--text-secondary-2);
  font-family: var(--font-family-primary);
  font-weight: 600;
  font-size: 0.95rem;
  white-space: nowrap;
}

/* Toolbar Navigation */
.toolbar-nav {
  display: flex;
  gap: 0.5rem;
  flex: 1;
  justify-content: center;
  flex-wrap: wrap;
}

.toolbar-link {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  border-radius: 8px;
  font-family: var(--font-family-primary);
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
  white-space: nowrap;
}

.toolbar-link:hover {
  background: rgba(255, 255, 255, 0.25);
  color: var(--text-secondary-2);
  transform: translateY(-2px);
}

.toolbar-link.active {
  background: var(--bg-moveo-orange);
  color: var(--text-secondary-2);
  font-weight: 600;
}

.link-icon {
  font-size: 1.1rem;
}

.link-text {
  display: inline;
}

/* Responsive */
@media (max-width: 968px) {
  .toolbar-content {
    flex-direction: column;
    gap: 0.75rem;
  }

  .toolbar-nav {
    width: 100%;
    justify-content: flex-start;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }

  .toolbar-nav::-webkit-scrollbar {
    display: none;
  }
}

@media (max-width: 640px) {
  .link-text {
    display: none;
  }

  .toolbar-link {
    padding: 0.5rem 0.75rem;
  }
  
  .user-name {
    display: none;
  }
}
</style>
