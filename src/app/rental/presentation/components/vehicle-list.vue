<template>
  <div class="vehicle-list">
    <vehicle-item
      v-for="v in vehicles"
      :key="v.id"
      :vehicle="v"
      :selected="v.id === selectedId"
      @select="$emit('select', $event)"
    />
  </div>
</template>
<script setup>
import VehicleItem from './vehicle-item.vue'
const props = defineProps({ vehicles: { type: Array, default: () => [] }, selectedId: Number })
</script>
<style scoped>
.vehicle-list { display:grid; gap:1rem; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); }
</style>

