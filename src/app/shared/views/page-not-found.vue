<template>
  <div class="not-found-page">
    <div class="not-found-content">
      <!-- Animated 404 -->
      <div class="error-code">
        <span class="digit">4</span>
        <span class="digit rotating">0</span>
        <span class="digit">4</span>
      </div>

      <!-- Icon -->
      <div class="icon-container">
        <span class="icon">🚗💨</span>
      </div>

      <!-- Message -->
      <h1 class="title">{{ t('shared.pageNotFound.subtitle') }}</h1>
      <p class="message">
        {{ t('shared.pageNotFound.message') }}
      </p>

      <!-- Actions -->
      <div class="actions">
        <router-link to="/" class="btn btn-primary">
          <span class="btn-icon">🏠</span>
          {{ t('shared.pageNotFound.backHome') }}
        </router-link>
        <router-link to="/rentals" class="btn btn-secondary">
          <span class="btn-icon">🚗</span>
          {{ t('shared.pageNotFound.viewVehicles') }}
        </router-link>
      </div>

      <!-- Additional Info -->
      <div class="help-text">
        <p>¿Necesitas ayuda? <a href="mailto:info@moveo.com">Contáctanos</a></p>
      </div>
    </div>

    <!-- Background Animation -->
    <div class="background-animation">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped>
.not-found-page {
  min-height: calc(100vh - 140px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.not-found-content {
  text-align: center;
  z-index: 10;
  position: relative;
  max-width: 600px;
}

/* Error Code */
.error-code {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.digit {
  font-size: 8rem;
  font-weight: 900;
  color: white;
  text-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  animation: bounce 1s ease infinite;
}

.digit:nth-child(1) {
  animation-delay: 0s;
}

.digit:nth-child(2) {
  animation-delay: 0.1s;
}

.digit:nth-child(3) {
  animation-delay: 0.2s;
}

.rotating {
  animation: rotate 3s linear infinite;
}

/* Icon */
.icon-container {
  margin-bottom: 1.5rem;
}

.icon {
  font-size: 4rem;
  animation: float 3s ease-in-out infinite;
}

/* Text */
.title {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin: 0 0 1rem 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.message {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 2rem 0;
  line-height: 1.6;
}

/* Actions */
.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.btn-primary {
  background: white;
  color: #667eea;
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-3px);
}

.btn-icon {
  font-size: 1.2rem;
}

/* Help Text */
.help-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

.help-text a {
  color: white;
  text-decoration: underline;
  font-weight: 600;
}

.help-text a:hover {
  text-decoration: none;
}

/* Background Animation */
.background-animation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float-circle 20s infinite ease-in-out;
}

.circle-1 {
  width: 300px;
  height: 300px;
  top: -150px;
  left: -150px;
  animation-delay: 0s;
}

.circle-2 {
  width: 200px;
  height: 200px;
  bottom: -100px;
  right: -100px;
  animation-delay: 7s;
}

.circle-3 {
  width: 150px;
  height: 150px;
  top: 50%;
  right: 10%;
  animation-delay: 14s;
}

/* Animations */
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes float-circle {
  0%, 100% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(50px, 50px);
  }
  50% {
    transform: translate(100px, -50px);
  }
  75% {
    transform: translate(-50px, 100px);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .digit {
    font-size: 5rem;
  }

  .title {
    font-size: 1.5rem;
  }

  .message {
    font-size: 1rem;
  }

  .actions {
    flex-direction: column;
    align-items: stretch;
  }

  .btn {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .digit {
    font-size: 4rem;
  }

  .error-code {
    gap: 0.5rem;
  }
}
</style>
