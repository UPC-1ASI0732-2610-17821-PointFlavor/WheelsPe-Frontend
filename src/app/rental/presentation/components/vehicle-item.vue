<!-- src/app/rental/presentation/components/vehicle-item.vue -->
<template>
  <div class="bg-white rounded-xl shadow-lg p-4 hover:shadow-2xl transition duration-300">
    <img
        :src="vehicle.photos?.[0] || 'https://via.placeholder.com/400x300/FF6F00/ffffff?text=🚗+Vehículo+MOVEO'"
        alt="Foto del vehículo"
        class="w-full h-48 object-cover rounded-md mb-4"
    />

    <h2 class="text-xl font-semibold text-gray-800">
      {{ vehicle.brand }} {{ vehicle.model }}
    </h2>
    <p class="text-gray-600">{{ vehicle.year }} · {{ vehicle.color }}</p>

    <p class="text-sm text-gray-500 mt-2">
      Transmisión: {{ vehicle.transmission }} · Combustible: {{ vehicle.fuelType }}
    </p>

    <p class="text-lg font-bold text-green-600 mt-2">
      S/ {{ vehicle.dailyPrice }} por día
    </p>

    <div class="flex flex-wrap mt-3 gap-2">
      <span
          v-for="feature in vehicle.features"
          :key="feature"
          class="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
      >
        {{ feature }}
      </span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  vehicle: {
    type: Object,
    required: true
  }
})
</script>
