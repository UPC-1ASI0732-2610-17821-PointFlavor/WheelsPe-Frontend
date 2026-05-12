<template>
  <span :class="['stars', size === 'lg' && 'stars--lg']" :aria-label="`${value} de ${max}`">
    <PfIcon v-for="i in max" :key="i" name="star" :size="size === 'lg' ? 18 : 14"
      :style="{ opacity: i <= Math.round(value) ? 1 : 0.18 }"/>
  </span>
</template>
<script>
import PfIcon from './pf-icon.vue';
export default {
  name: 'PfStars',
  components: { PfIcon },
  props: {
    value: { type: Number, default: 0 },
    max: { type: Number, default: 5 },
    size: { type: String, default: '' }
  }
};
</script>
