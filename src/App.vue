<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import HeaderContent from '@/app/shared/components/header-content.vue'
import Sidebar from '@/app/shared/components/sidebar.vue'
import FooterContent from '@/app/shared/components/footer-content.vue'

const route = useRoute()

// Check if current route should hide the main layout
const shouldHideLayout = computed(() => route.meta.hideLayout === true)
</script>

<template>
  <div class="app-shell" :class="{ 'auth-mode': shouldHideLayout }">
    <!-- Only show main layout components if hideLayout is false -->
    <template v-if="!shouldHideLayout">
      <Sidebar />
      <div class="app-content">
        <HeaderContent />
        <main class="app-main">
          <router-view />
        </main>
        <FooterContent />
      </div>
    </template>
    
    <!-- Auth pages without layout (fullscreen) -->
    <template v-else>
      <div class="auth-container">
        <router-view />
      </div>
    </template>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  background: #f5f7fa;
  color: #222;
}

/* Auth mode - fullscreen */
.app-shell.auth-mode {
  background: transparent;
}

.auth-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-content {
  flex: 1;
  margin-left: 260px; /* Sidebar width */
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

@media (max-width: 768px) {
  .app-content {
    margin-left: 0;
  }
}
</style>