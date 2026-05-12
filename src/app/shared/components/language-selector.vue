<script setup lang="js">
/**
 * @summary Shared language selector component (Composition API)
 * @author Andreow Santiago U202317362
 */
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const options = [
  { label: 'EN', value: 'en', flag: '🇺🇸', fullName: 'English' },
  { label: 'ES', value: 'es', flag: '🇪🇸', fullName: 'Español' }
]

const selectedLanguage = computed({
  get: () => {
    return options.find(option => option.value === locale.value) || options[0]
  },
  set: (selectedOption) => {
    if (selectedOption && selectedOption.value) {
      locale.value = selectedOption.value
    }
  }
})

function selectLanguage(option) {
  selectedLanguage.value = option
}
</script>

<template>
  <div class="language-selector-wrapper">
    <div class="language-buttons">
      <button
        v-for="option in options"
        :key="option.value"
        :class="[
          'lang-button',
          { 'active': selectedLanguage.value === option.value }
        ]"
        @click="selectLanguage(option)"
        :aria-label="`Switch to ${option.fullName}`"
        :title="option.fullName"
      >
        <span class="flag-icon">{{ option.flag }}</span>
        <span class="lang-text">{{ option.label }}</span>
        <div class="button-glow"></div>
      </button>
    </div>
    <div class="selector-bg"></div>
  </div>
</template>

<style scoped>
.language-selector-wrapper {
  position: relative;
  display: inline-flex;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.language-selector-wrapper:hover {
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.language-buttons {
  display: flex;
  gap: 2px;
  position: relative;
  z-index: 2;
}

.lang-button {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: none;
  background: transparent;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 600;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  overflow: hidden;
  min-width: 55px;
  justify-content: center;
}

.lang-button:hover {
  color: white;
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-1px);
}

.lang-button.active {
  background: white;
  color: #FF6F00;
  box-shadow: 0 2px 8px rgba(255, 255, 255, 0.5);
  transform: translateY(-1px);
}

.lang-button.active:hover {
  background: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.6);
}

.flag-icon {
  font-size: 1rem;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.lang-button:hover .flag-icon {
  transform: scale(1.1);
}

.lang-button.active .flag-icon {
  transform: scale(1.05);
}

.lang-text {
  font-weight: 700;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.button-glow {
  display: none;
}

.selector-bg {
  display: none;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .language-selector-wrapper {
    padding: 3px;
    border-radius: 10px;
  }

  .lang-button {
    padding: 5px 10px;
    min-width: 50px;
    gap: 4px;
  }

  .flag-icon {
    font-size: 0.9rem;
  }

  .lang-text {
    font-size: 0.75rem;
  }
}
</style>
