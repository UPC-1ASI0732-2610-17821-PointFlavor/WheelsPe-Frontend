<template>
  <AuthLayout>
    <div class="auth-card">
      <div class="register-content">
        <h1 class="page-title">Crear Cuenta</h1>
        <p class="page-subtitle">Únete a MOVEO y comienza a alquilar o publicar vehículos</p>
        <user-register-form />
      </div>
    </div>
  </AuthLayout>
</template>

<script setup>
import AuthLayout from '../components/AuthLayout.vue'
import UserRegisterForm from '../components/user-register-form.vue'
</script>

<style scoped>
.auth-card {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 111, 0, 0.1);
  border: 2px solid transparent;
  background-clip: padding-box;
  position: relative;
  max-width: 600px;
  width: 100%;
  animation: cardEntry 0.6s ease;
}

@keyframes cardEntry {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.auth-card::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(135deg, #FF6F00 0%, #FF8F00 50%, #FFA726 100%);
  border-radius: 20px;
  z-index: -1;
  opacity: 0.5;
  animation: borderGlow 3s ease-in-out infinite;
}

@keyframes borderGlow {
  0%, 100% {
    opacity: 0.5;
    filter: blur(0px);
  }
  50% {
    opacity: 0.8;
    filter: blur(2px);
  }
}

.auth-card::after {
  content: '';
  position: absolute;
  inset: -10px;
  background: radial-gradient(circle at top right, rgba(255, 111, 0, 0.15), transparent 70%);
  border-radius: 30px;
  z-index: -2;
  animation: halo 4s ease-in-out infinite;
}

@keyframes halo {
  0%, 100% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.6;
  }
}

.register-content {
  width: 100%;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2C3E50;
  margin: 0 0 0.5rem 0;
  text-align: center;
  background: linear-gradient(135deg, #2C3E50 0%, #FF6F00 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  color: #666;
  text-align: center;
  margin: 0 0 2rem 0;
  font-size: 1rem;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .auth-card {
    padding: 2rem 1.5rem;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .page-subtitle {
    font-size: 0.9rem;
  }
}
</style>

