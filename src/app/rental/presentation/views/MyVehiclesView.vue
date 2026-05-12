<!-- src/app/rental/presentation/views/MyVehiclesView.vue -->
<template>
  <div class="px-4 py-8">
    <h2 class="text-3xl font-bold mb-8 text-center">Mis Vehículos</h2>

    <div v-if="loading" class="text-gray-500 text-center">Cargando vehículos...</div>
    <div v-else-if="error" class="text-red-500 text-center">Error al cargar los vehículos.</div>

    <div v-else>
      <div v-if="vehicles.length === 0" class="text-gray-400 text-center">
        No tienes vehículos registrados.
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <VehicleItem
            v-for="vehicle in vehicles"
            :key="vehicle.id"
            :vehicle="vehicle"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RentalApi } from '@/app/rental/infrastructure/rental-api.js'
import VehicleItem from '../components/vehicle-item.vue'

const vehicles = ref([])
const loading = ref(true)
const error = ref(false)

onMounted(async () => {
  loading.value = true
  error.value = false
  try {
    vehicles.value = await RentalApi.getVehiclesByOwner(1)
    console.log("Vehículos cargados:", vehicles.value)
  } catch (e) {
    console.error("Error:", e)
    error.value = true
  } finally {
    loading.value = false
  }
})
</script>
