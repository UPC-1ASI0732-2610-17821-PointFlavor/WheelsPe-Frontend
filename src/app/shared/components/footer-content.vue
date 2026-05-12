<template>
  <footer class="app-footer">
    <div class="footer-content">
      <div class="footer-left">
        <div class="footer-logo">
          <i class="pi pi-car"></i>
          <span>MOVEO</span>
        </div>
        <p class="copyright">
          © {{ currentYear }} MOVEO. All rights reserved.
        </p>
      </div>
      
      <div class="footer-links">
        <router-link to="/profile" class="footer-link">
          <i class="pi pi-user"></i>
          {{ t('shared.footer.profile') }}
        </router-link>
        <router-link to="/dashboard" class="footer-link">
          <i class="pi pi-home"></i>
          {{ t('shared.footer.dashboard') }}
        </router-link>
        <a href="mailto:contact@moveo.com" class="footer-link">
          <i class="pi pi-envelope"></i>
          {{ t('footer.contact') }}
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.app-footer {
  background: linear-gradient(135deg, #2C3E50 0%, #34495E 100%);
  border-top: 3px solid #FF6F00;
  padding: 1.5rem 0;
  margin-top: auto;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem 0 calc(260px + 2rem);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.footer-left {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 1px;
}

.footer-logo i {
  font-size: 1.5rem;
  color: #FF6F00;
}

.copyright {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  margin: 0;
}

.footer-links {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.footer-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 0.875rem;
  transition: all 0.2s;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
}

.footer-link:hover {
  color: #FFB74D;
  background: rgba(255, 111, 0, 0.1);
  transform: translateY(-2px);
}

.footer-link i {
  font-size: 1rem;
}

@media (max-width: 768px) {
  .footer-content {
    padding: 0 1rem;
    flex-direction: column;
    text-align: center;
  }

  .footer-left {
    align-items: center;
  }

  .footer-links {
    justify-content: center;
  }
}
</style>
