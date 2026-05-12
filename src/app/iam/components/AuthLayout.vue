<template>
  <div class="auth-layout">
    <div class="auth-container">
      <!-- Logo de MOVEO -->
      <router-link to="/" class="auth-logo">
        <span class="logo-icon">🚗</span>
        <span class="logo-text">MOVEO</span>
      </router-link>

      <!-- Contenido de la página (slot) -->
      <div class="auth-content">
        <slot />
      </div>

      <!-- Footer minimalista -->
      <div class="auth-footer">
        <p class="footer-text">
          © {{ currentYear }} MOVEO. Todos los derechos reservados.
        </p>
        <div class="footer-links">
          <a href="#" class="footer-link">Términos</a>
          <span class="separator">•</span>
          <a href="#" class="footer-link">Privacidad</a>
          <span class="separator">•</span>
          <a href="#" class="footer-link">Ayuda</a>
        </div>
      </div>
    </div>

    <!-- Decoración de fondo -->
    <div class="auth-background">
      <div class="bg-circle circle-1"></div>
      <div class="bg-circle circle-2"></div>
      <div class="bg-circle circle-3"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.auth-layout {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2C3E50 0%, #34495E 50%, #2C3E50 100%);
  overflow-y: auto;
  overflow-x: hidden;
  padding: 2rem;
}

.auth-container {
  width: 100%;
  max-width: 100%;
  position: relative;
  z-index: 10;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Logo */
.auth-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  text-decoration: none;
  margin-bottom: 2rem;
  transition: transform 0.3s ease;
}

.auth-logo:hover {
  transform: scale(1.05);
}

.logo-icon {
  font-size: 3rem;
  filter: drop-shadow(0 4px 8px rgba(255, 111, 0, 0.5));
}

.logo-text {
  font-family: var(--font-family-primary);
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  letter-spacing: 2px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

/* Contenido */
.auth-content {
  background: transparent;
  border-radius: 0;
  padding: 0;
  box-shadow: none;
  animation: fadeInUp 0.5s ease;
  border: none;
  background-clip: padding-box;
  position: relative;
  width: 100%;
}

.auth-content::before {
  display: none;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Footer */
.auth-footer {
  margin-top: 2rem;
  text-align: center;
}

.footer-text {
  font-family: var(--font-family-primary);
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.875rem;
  margin: 0 0 0.75rem 0;
}

.footer-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.footer-link {
  font-family: var(--font-family-primary);
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.875rem;
  text-decoration: none;
  transition: all 0.3s ease;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
}

.footer-link:hover {
  color: #FFB74D;
  background: rgba(255, 111, 0, 0.1);
}

.separator {
  color: rgba(255, 255, 255, 0.5);
}

/* Fondo animado */
.auth-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

.bg-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 111, 0, 0.1);
  backdrop-filter: blur(2px);
  animation: float 20s infinite ease-in-out;
}

.circle-1 {
  width: 400px;
  height: 400px;
  top: -200px;
  left: -100px;
  animation-delay: 0s;
}

.circle-2 {
  width: 300px;
  height: 300px;
  bottom: -150px;
  right: -50px;
  animation-delay: 5s;
}

.circle-3 {
  width: 250px;
  height: 250px;
  top: 50%;
  right: -100px;
  animation-delay: 10s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-30px) rotate(180deg);
  }
}

/* Responsive */
@media (max-width: 640px) {
  .auth-layout {
    padding: 1rem;
  }

  .auth-content {
    padding: 2rem 1.5rem;
    border-radius: 16px;
  }

  .logo-text {
    font-size: 2rem;
  }

  .logo-icon {
    font-size: 2.5rem;
  }

  .footer-links {
    flex-direction: column;
    gap: 0.25rem;
  }

  .separator {
    display: none;
  }
}

/* Desktop - asegurar fullscreen */
@media (min-width: 1024px) {
  .auth-container {
    max-width: 520px;
  }

  .auth-content {
    padding: 3rem;
  }
}
</style>
