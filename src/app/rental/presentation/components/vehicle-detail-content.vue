<template>
  <aside class="vehicle-detail" v-if="vehicle">
    <h2 class="title">{{ vehicle.fullName }}</h2>
    <p class="row"><strong>Marca:</strong> {{ vehicle.brand }} · <strong>Modelo:</strong> {{ vehicle.model }} · <strong>Año:</strong> {{ vehicle.year }}</p>
    <p class="row"><strong>Color:</strong> {{ vehicle.color }} · <strong>Asientos:</strong> {{ vehicle.seats }}</p>
    <p class="row"><strong>Transmisión:</strong> {{ vehicle.transmission }} · <strong>Combustible:</strong> {{ vehicle.fuelType }}</p>
    <p class="row"><strong>Precio/día:</strong> S/ {{ vehicle.dailyPrice }} · <strong>Precio/hora:</strong> S/ {{ vehicle.hourlyPrice }}</p>
    <p class="row"><strong>Depósito:</strong> S/ {{ vehicle.depositAmount }}</p>
    <p class="row"><strong>Ubicación:</strong> {{ vehicle.location?.address || 'No especificada' }}</p>
    <p class="row" v-if="vehicle.features && vehicle.features.length">
      <strong>Características:</strong> {{ vehicle.features.join(', ') }}
    </p>
    <p class="row">
      <strong>Restricciones:</strong> 
      <span v-if="vehicle.restrictions && vehicle.restrictions.length">{{ vehicle.restrictions.join(', ') }}</span>
      <span v-else>Sin restricciones</span>
    </p>
    <p class="row">
      <strong>Disponible:</strong> 
      <span :class="vehicle.isAvailable ? 'available' : 'unavailable'">
        {{ vehicle.isAvailable ? 'Sí' : 'No' }}
      </span>
    </p>
    <slot name="actions" />
  </aside>
</template>

<script setup>
const props = defineProps({ 
  vehicle: {
    type: Object,
    required: false,
    default: null
  }
})
</script>
<style scoped>
.vehicle-detail { 
  border: 1px solid #ddd; 
  border-radius: 12px; 
  padding: 1rem 1.25rem; 
  background: #fafafa; 
  animation: fade 0.3s ease; 
}
.title { 
  margin-top: 0; 
  font-size: 1.5rem; 
  color: #333;
  margin-bottom: 1rem;
}
.row { 
  margin: 0.5rem 0; 
  font-size: 0.95rem; 
  line-height: 1.6;
}
.available {
  color: #22c55e;
  font-weight: 600;
}
.unavailable {
  color: #ef4444;
  font-weight: 600;
}
@keyframes fade { 
  from { 
    opacity: 0; 
    transform: translateY(6px);
  } 
  to { 
    opacity: 1; 
    transform: translateY(0);
  } 
}
</style>

