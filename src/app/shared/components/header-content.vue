<template>
  <header class="app-header">
    <div class="header-container">
      <!-- Hero Section Dinámico -->
      <div class="hero-section" v-if="isAuthenticated">
        <div class="hero-content">
          <!-- Para Renters -->
          <div v-if="isRenter" class="hero-text">
            <h1 class="hero-title">
              <i class="pi pi-compass"></i>
              {{ t('shared.header.renter.title') }}
            </h1>
          </div>

          <!-- Para Owners -->
          <div v-if="isOwner" class="hero-text">
            <h1 class="hero-title">
              <i class="pi pi-briefcase"></i>
              {{ t('shared.header.owner.title') }}
            </h1>
          </div>

          <!-- Language Selector & Notifications -->
          <div class="hero-actions">
            <NotificationPanel v-if="isAuthenticated" />
            <LanguageSelector />
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/app/iam/application/user.store'
import { useI18n } from 'vue-i18n'
import LanguageSelector from './language-selector.vue'
import NotificationPanel from '@/app/notification/presentation/components/notification-panel.vue'

const { t } = useI18n()
const userStore = useUserStore()
const isAuthenticated = computed(() => userStore.isAuthenticated.value)
const isRenter = computed(() => userStore.isRenter.value)
const isOwner = computed(() => userStore.isOwner.value)
</script>

<style scoped>
.app-header {
  background: linear-gradient(135deg, #FF6F00 0%, #FF8F00 50%, #FFA726 100%);
  box-shadow: 0 4px 20px rgba(255, 111, 0, 0.3);
  position: relative;
  overflow: hidden;
}

.app-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.1;
  z-index: 0;
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0;
  position: relative;
  z-index: 1;
}

.hero-section {
  padding: 1.5rem 2rem;
  color: white;
}

.hero-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.hero-text {
  flex: 1;
}

.hero-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.hero-title i {
  font-size: 2rem;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}

@media (max-width: 968px) {
  .hero-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .hero-title {
    font-size: 1.5rem;
  }

  .hero-title i {
    font-size: 1.75rem;
  }
}

@media (max-width: 640px) {
  .hero-section {
    padding: 1rem;
  }

  .hero-title {
    font-size: 1.25rem;
  }

  .hero-title i {
    font-size: 1.5rem;
  }
}
</style>
