<template>
  <div class="user-preferences">
    <div class="preferences-grid">
      <!-- Preferencias generales -->
      <div class="preference-card">
        <h3 class="card-title">🌐 Preferencias Generales</h3>
        
        <div class="preference-item">
          <label for="language" class="preference-label">Idioma preferido</label>
          <select 
            id="language" 
            v-model="localPreferences.language" 
            class="preference-select"
            @change="savePreferences"
          >
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>

      <!-- Notificaciones -->
      <div class="preference-card">
        <h3 class="card-title">🔔 Notificaciones</h3>
        
        <div class="preference-item">
          <div class="toggle-item">
            <div class="toggle-info">
              <p class="toggle-title">Notificaciones por email</p>
              <p class="toggle-desc">Recibe actualizaciones en tu correo</p>
            </div>
            <label class="toggle-switch">
              <input 
                type="checkbox" 
                v-model="localPreferences.notifications.email"
                @change="savePreferences"
              />
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div class="preference-item">
          <div class="toggle-item">
            <div class="toggle-info">
              <p class="toggle-title">Notificaciones push</p>
              <p class="toggle-desc">Recibe notificaciones en tu dispositivo</p>
            </div>
            <label class="toggle-switch">
              <input 
                type="checkbox" 
                v-model="localPreferences.notifications.push"
                @change="savePreferences"
              />
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div class="preference-item">
          <div class="toggle-item">
            <div class="toggle-info">
              <p class="toggle-title">Notificaciones por SMS</p>
              <p class="toggle-desc">Recibe mensajes de texto importantes</p>
            </div>
            <label class="toggle-switch">
              <input 
                type="checkbox" 
                v-model="localPreferences.notifications.sms"
                @change="savePreferences"
              />
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      <!-- Preferencias de búsqueda (solo para renters) -->
      <div v-if="userRole === 'renter'" class="preference-card">
        <h3 class="card-title">🚗 Preferencias de Búsqueda</h3>
        
        <div class="preference-item">
          <label class="preference-label">Distritos preferidos</label>
          <div class="districts-selector">
            <label 
              v-for="district in availableDistricts" 
              :key="district"
              class="district-checkbox"
            >
              <input 
                type="checkbox" 
                :value="district"
                v-model="localPreferences.favoriteDistricts"
                @change="savePreferences"
              />
              <span class="district-label">{{ district }}</span>
            </label>
          </div>
        </div>

        <div class="preference-item">
          <label class="preference-label">
            Rango de precios preferido (S/ {{ localPreferences.priceRange.min }} - S/ {{ localPreferences.priceRange.max }}/día)
          </label>
          <div class="range-inputs">
            <input 
              type="range" 
              v-model.number="localPreferences.priceRange.min" 
              min="0" 
              max="100" 
              step="5"
              class="range-slider"
              @input="savePreferences"
            />
            <input 
              type="range" 
              v-model.number="localPreferences.priceRange.max" 
              min="0" 
              max="100" 
              step="5"
              class="range-slider"
              @input="savePreferences"
            />
          </div>
        </div>

        <div class="preference-item">
          <label for="transmission" class="preference-label">Transmisión preferida</label>
          <select 
            id="transmission" 
            v-model="localPreferences.preferredTransmission" 
            class="preference-select"
            @change="savePreferences"
          >
            <option value="">Sin preferencia</option>
            <option value="automático">Automático</option>
            <option value="manual">Manual</option>
          </select>
        </div>
      </div>

      <!-- Preferencias de propietario (solo para owners) -->
      <div v-if="userRole === 'owner'" class="preference-card">
        <h3 class="card-title">🏠 Preferencias de Propietario</h3>
        
        <div class="preference-item">
          <div class="toggle-item">
            <div class="toggle-info">
              <p class="toggle-title">Reserva instantánea</p>
              <p class="toggle-desc">Permite que inquilinos reserven sin aprobación previa</p>
            </div>
            <label class="toggle-switch">
              <input 
                type="checkbox" 
                v-model="localPreferences.instantBooking"
                @change="savePreferences"
              />
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div class="preference-item">
          <label for="minDays" class="preference-label">Días mínimos de alquiler</label>
          <input 
            id="minDays"
            type="number" 
            v-model.number="localPreferences.minimumRentalDays" 
            min="1" 
            max="30"
            class="preference-input"
            @change="savePreferences"
          />
        </div>
      </div>
    </div>

    <!-- Mensaje de guardado -->
    <div v-if="showSavedMessage" class="save-message">
      ✓ Preferencias guardadas correctamente
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useUserStore } from '@/app/iam/application/user.store.js'

const { currentUser, userRole, updateUserPreferences } = useUserStore()

const availableDistricts = [
  'Miraflores', 'San Isidro', 'Surco', 'Barranco', 
  'San Miguel', 'Jesús María', 'Lince', 'Magdalena'
]

// Preferencias locales (copia para edición)
const localPreferences = ref({
  language: currentUser.value?.preferences?.language || 'es',
  notifications: {
    email: currentUser.value?.preferences?.notifications?.email ?? true,
    push: currentUser.value?.preferences?.notifications?.push ?? true,
    sms: currentUser.value?.preferences?.notifications?.sms ?? false
  },
  favoriteDistricts: currentUser.value?.preferences?.favoriteDistricts || [],
  priceRange: {
    min: currentUser.value?.preferences?.priceRange?.min || 0,
    max: currentUser.value?.preferences?.priceRange?.max || 100
  },
  preferredTransmission: currentUser.value?.preferences?.preferredTransmission || '',
  // Owner preferences
  instantBooking: currentUser.value?.preferences?.instantBooking || false,
  minimumRentalDays: currentUser.value?.preferences?.minimumRentalDays || 1
})

const showSavedMessage = ref(false)

// Guardar preferencias
function savePreferences() {
  updateUserPreferences(localPreferences.value)
  
  // Mostrar mensaje de guardado
  showSavedMessage.value = true
  setTimeout(() => {
    showSavedMessage.value = false
  }, 2000)
}
</script>

<style scoped>
.user-preferences {
  position: relative;
}

.preferences-grid {
  display: grid;
  gap: 2rem;
}

.preference-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.card-title {
  font-family: var(--font-family-primary);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 1.5rem 0;
}

.preference-item {
  margin-bottom: 1.5rem;
}

.preference-item:last-child {
  margin-bottom: 0;
}

.preference-label {
  display: block;
  font-family: var(--font-family-primary);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.preference-select,
.preference-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--bg-muted);
  border-radius: 8px;
  font-family: var(--font-family-primary);
  font-size: 0.95rem;
  color: var(--text-primary);
  background: white;
  transition: border-color 0.3s ease;
}

.preference-select:focus,
.preference-input:focus {
  outline: none;
  border-color: var(--brand-green);
}

/* Toggle Switch */
.toggle-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.toggle-info {
  flex: 1;
}

.toggle-title {
  font-family: var(--font-family-primary);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
}

.toggle-desc {
  font-family: var(--font-family-primary);
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin: 0;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 52px;
  height: 28px;
  flex-shrink: 0;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--bg-muted);
  transition: 0.4s;
  border-radius: 28px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: var(--brand-green);
}

input:checked + .toggle-slider:before {
  transform: translateX(24px);
}

/* Districts Selector */
.districts-selector {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.75rem;
}

.district-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 1px solid var(--bg-muted);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.district-checkbox:hover {
  border-color: var(--brand-green);
  background: var(--bg-base);
}

.district-checkbox input[type="checkbox"] {
  cursor: pointer;
}

.district-label {
  font-family: var(--font-family-primary);
  font-size: 0.9rem;
  color: var(--text-primary);
}

/* Range Inputs */
.range-inputs {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.range-slider {
  width: 100%;
  cursor: pointer;
  -webkit-appearance: none;
  appearance: none;
  height: 6px;
  background: var(--bg-muted);
  border-radius: 3px;
  outline: none;
}

.range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: var(--brand-green);
  cursor: pointer;
  border-radius: 50%;
}

.range-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: var(--brand-green);
  cursor: pointer;
  border-radius: 50%;
  border: none;
}

/* Save Message */
.save-message {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: #10b981;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  font-family: var(--font-family-primary);
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  animation: slideIn 0.3s ease;
  z-index: 1000;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .districts-selector {
    grid-template-columns: 1fr;
  }

  .toggle-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .save-message {
    bottom: 1rem;
    right: 1rem;
    left: 1rem;
  }
}
</style>
