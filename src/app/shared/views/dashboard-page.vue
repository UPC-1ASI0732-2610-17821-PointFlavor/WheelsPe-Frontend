<template>
  <div class="dashboard-page">
    <!-- Dashboard para Renters -->
    <RenterDashboard v-if="isRenter" />
    
    <!-- Dashboard para Owners -->
    <OwnerDashboard v-if="isOwner" />
    
    <!-- Fallback si no hay rol detectado -->
    <div v-if="!isRenter && !isOwner" class="no-role">
      <div class="icon">⚠️</div>
      <h2>No se detectó tu rol de usuario</h2>
      <p>Por favor, inicia sesión nuevamente</p>
      <router-link to="/login" class="btn-primary">Ir a Login</router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/app/iam/application/user.store'
import RenterDashboard from './renter-dashboard.vue'
import OwnerDashboard from './owner-dashboard.vue'

const userStore = useUserStore()
const isRenter = computed(() => userStore.isRenter.value)
const isOwner = computed(() => userStore.isOwner.value)
</script>

<style scoped>
.dashboard-page {
  min-height: 100%;
}

.no-role {
  min-height: calc(100vh - 300px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
}

.no-role .icon {
  font-size: 5rem;
  margin-bottom: 1.5rem;
}

.no-role h2 {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--primary-dark);
  margin-bottom: 0.75rem;
}

.no-role p {
  color: var(--neutral-gray);
  margin-bottom: 2rem;
  font-size: 1rem;
}

.btn-primary {
  display: inline-block;
  padding: 0.875rem 1.75rem;
  background: var(--accent-orange);
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: #e65100;
  transform: translateY(-2px);
}
</style>
