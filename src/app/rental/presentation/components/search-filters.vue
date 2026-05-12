<template>
  <div class="search-filters">
    <div class="filters-header">
      <h2 class="heading-3">Filtros de búsqueda</h2>
      <button 
        v-if="hasActiveFilters" 
        class="btn-clear" 
        @click="clearFilters"
      >
        Limpiar filtros
      </button>
    </div>

    <div class="filters-grid">
      <!-- Filtro de Distrito -->
      <div class="filter-group">
        <label for="district" class="filter-label">📍 Distrito</label>
        <select 
          id="district" 
          v-model="localFilters.district" 
          class="filter-input"
          @change="emitFilters"
        >
          <option value="">Todos los distritos</option>
          <option value="Miraflores">Miraflores</option>
          <option value="San Isidro">San Isidro</option>
          <option value="Surco">Surco</option>
          <option value="Barranco">Barranco</option>
          <option value="San Miguel">San Miguel</option>
          <option value="Jesús María">Jesús María</option>
        </select>
      </div>

      <!-- Filtro de Fecha Inicio -->
      <div class="filter-group">
        <label for="startDate" class="filter-label">📅 Fecha de inicio</label>
        <input 
          id="startDate"
          type="date" 
          v-model="localFilters.startDate" 
          class="filter-input"
          :min="today"
          @change="emitFilters"
        />
      </div>

      <!-- Filtro de Fecha Fin -->
      <div class="filter-group">
        <label for="endDate" class="filter-label">📅 Fecha de fin</label>
        <input 
          id="endDate"
          type="date" 
          v-model="localFilters.endDate" 
          class="filter-input"
          :min="localFilters.startDate || today"
          :disabled="!localFilters.startDate"
          @change="emitFilters"
        />
      </div>

      <!-- Filtro de Precio Mínimo -->
      <div class="filter-group">
        <label for="minPrice" class="filter-label">
          💰 Precio mín. (S/ {{ localFilters.minPrice }}/día)
        </label>
        <input 
          id="minPrice"
          type="range" 
          v-model.number="localFilters.minPrice" 
          min="0" 
          :max="1000" 
          step="10"
          class="filter-range"
          @input="emitFilters"
        />
      </div>

      <!-- Filtro de Precio Máximo -->
      <div class="filter-group">
        <label for="maxPrice" class="filter-label">
          💰 Precio máx. (S/ {{ localFilters.maxPrice }}/día)
        </label>
        <input 
          id="maxPrice"
          type="range" 
          v-model.number="localFilters.maxPrice" 
          min="0" 
          :max="1000" 
          step="10"
          class="filter-range"
          @input="emitFilters"
        />
      </div>

      <!-- Filtro de Transmisión -->
      <div class="filter-group">
        <label for="transmission" class="filter-label">⚙️ Transmisión</label>
        <select 
          id="transmission" 
          v-model="localFilters.transmission" 
          class="filter-input"
          @change="emitFilters"
        >
          <option value="">Todas</option>
          <option value="automático">Automático</option>
          <option value="manual">Manual</option>
        </select>
      </div>

      <!-- Filtro de Asientos -->
      <div class="filter-group">
        <label for="seats" class="filter-label">👥 Asientos mínimos</label>
        <select 
          id="seats" 
          v-model.number="localFilters.minSeats" 
          class="filter-input"
          @change="emitFilters"
        >
          <option :value="0">Cualquiera</option>
          <option :value="4">4+</option>
          <option :value="5">5+</option>
          <option :value="7">7+</option>
        </select>
      </div>

      <!-- Filtro de Tipo de Combustible -->
      <div class="filter-group">
        <label for="fuelType" class="filter-label">⛽ Combustible</label>
        <select 
          id="fuelType" 
          v-model="localFilters.fuelType" 
          class="filter-input"
          @change="emitFilters"
        >
          <option value="">Todos</option>
          <option value="gasolina">Gasolina</option>
          <option value="diesel">Diesel</option>
          <option value="eléctrico">Eléctrico</option>
          <option value="híbrido">Híbrido</option>
        </select>
      </div>
    </div>

    <!-- Contador de resultados -->
    <div v-if="resultCount !== null" class="results-count">
      <span class="text-body">{{ resultCount }} vehículos encontrados</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  resultCount: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['filter-change'])

// Fecha de hoy en formato YYYY-MM-DD
const today = computed(() => {
  const date = new Date()
  return date.toISOString().split('T')[0]
})

// Estado local de filtros
const localFilters = ref({
  district: '',
  startDate: '',
  endDate: '',
  minPrice: 0,
  maxPrice: 1000,
  transmission: '',
  minSeats: 0,
  fuelType: ''
})

// Verifica si hay filtros activos
const hasActiveFilters = computed(() => {
  return localFilters.value.district !== '' ||
         localFilters.value.startDate !== '' ||
         localFilters.value.endDate !== '' ||
         localFilters.value.minPrice > 0 ||
         localFilters.value.maxPrice < 1000 ||
         localFilters.value.transmission !== '' ||
         localFilters.value.minSeats > 0 ||
         localFilters.value.fuelType !== ''
})

// Emitir cambios de filtros al padre
function emitFilters() {
  emit('filter-change', { ...localFilters.value })
}

// Limpiar todos los filtros
function clearFilters() {
  localFilters.value = {
    district: '',
    startDate: '',
    endDate: '',
    minPrice: 0,
    maxPrice: 1000,
    transmission: '',
    minSeats: 0,
    fuelType: ''
  }
  emitFilters()
}

// Watch para validar que endDate sea mayor que startDate
watch(() => localFilters.value.startDate, (newStartDate) => {
  if (localFilters.value.endDate && newStartDate > localFilters.value.endDate) {
    localFilters.value.endDate = ''
  }
})
</script>

<style scoped>
.search-filters {
  background: var(--bg-base);
  border: 1px solid var(--bg-muted);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.heading-3 {
  font-family: var(--font-family-primary);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.btn-clear {
  background: var(--bg-moveo-pink);
  color: var(--text-secondary-2);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-family: var(--font-family-primary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-clear:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.25rem;
  margin-bottom: 0.5rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  font-family: var(--font-family-primary);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
  display: block;
}

.filter-input,
.filter-range {
  font-family: var(--font-family-primary);
  padding: 0.75rem;
  border: 1px solid var(--bg-muted);
  border-radius: 8px;
  background: white;
  color: var(--text-primary);
  font-size: 0.9rem;
  transition: border-color 0.3s ease;
  width: 100%;
}

.filter-input:focus {
  outline: none;
  border-color: var(--brand-green);
}

.filter-input:disabled {
  background: var(--bg-base);
  cursor: not-allowed;
  opacity: 0.6;
}

.filter-range {
  cursor: pointer;
  padding: 0;
  border: none;
  background: transparent;
}

.filter-range::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  background: var(--brand-green);
  cursor: pointer;
  border-radius: 50%;
}

.filter-range::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: var(--brand-green);
  cursor: pointer;
  border-radius: 50%;
  border: none;
}

.filter-range::-webkit-slider-runnable-track {
  width: 100%;
  height: 6px;
  background: var(--bg-muted);
  border-radius: 3px;
}

.filter-range::-moz-range-track {
  width: 100%;
  height: 6px;
  background: var(--bg-muted);
  border-radius: 3px;
}

.results-count {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--bg-muted);
  text-align: center;
}

.text-body {
  font-family: var(--font-family-primary);
  color: var(--text-secondary);
  font-weight: 500;
}

/* Responsive */
@media (max-width: 768px) {
  .search-filters {
    padding: 1.25rem;
  }
  
  .filters-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .filters-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .btn-clear {
    width: 100%;
  }
}

@media (min-width: 769px) and (max-width: 1200px) {
  .filters-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
