<template>
  <div class="coming-soon-page">
    <div class="content">
      <div class="icon">🚧</div>
      <h1 class="title">{{ t('shared.comingSoon.title') }}</h1>
      <p class="message">{{ t('shared.comingSoon.message') }}</p>
      <p class="hint">Estamos trabajando para ofrecerte la mejor experiencia.</p>
      <div class="actions">
        <router-link to="/" class="btn btn-primary">
          <span class="icon">🏠</span>
          {{ t('shared.comingSoon.backHome') }}
        </router-link>
        <button @click="$router.back()" class="btn btn-secondary">
          <span class="icon">⬅️</span>
          Regresar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped>
.coming-soon-page {
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, var(--bg-moveo-green) 0%, var(--brand-green) 100%);
}

.content {
  text-align: center;
  max-width: 500px;
  background: white;
  padding: 3rem 2rem;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: fadeIn 0.5s ease;
}

.icon {
  font-size: 5rem;
  margin-bottom: 1rem;
  animation: bounce 2s infinite;
}

.title {
  font-family: var(--font-family-primary);
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  color: var(--text-primary);
}

.message {
  font-family: var(--font-family-primary);
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin: 0 0 0.5rem 0;
}

.hint {
  font-family: var(--font-family-primary);
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0 0 2rem 0;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-family: var(--font-family-primary);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  font-size: 1rem;
}

.btn-primary {
  background: linear-gradient(135deg, var(--bg-moveo-green) 0%, var(--brand-green) 100%);
  color: var(--text-secondary-2);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(58, 94, 94, 0.4);
}

.btn-secondary {
  background: var(--bg-muted);
  color: var(--text-primary);
}

.btn-secondary:hover {
  background: var(--bg-moveo-green);
  color: var(--text-secondary-2);
  transform: translateY(-2px);
}

.btn .icon {
  font-size: 1.2rem;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@media (max-width: 480px) {
  .content {
    padding: 2rem 1.5rem;
  }

  .title {
    font-size: 2rem;
  }

  .icon {
    font-size: 4rem;
  }

  .actions {
    flex-direction: column;
    width: 100%;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
