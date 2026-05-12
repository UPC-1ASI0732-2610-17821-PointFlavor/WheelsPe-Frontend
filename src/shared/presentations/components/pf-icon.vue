<template>
  <svg v-if="name === 'search'" viewBox="0 0 24 24" :width="size" :height="size" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
  <svg v-else-if="name === 'pin'" viewBox="0 0 24 24" :width="size" :height="size" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-7.2 8-12.5A8 8 0 1 0 4 9.5C4 14.8 12 22 12 22Z"/><circle cx="12" cy="10" r="2.5"/></svg>
  <svg v-else-if="name === 'star'" viewBox="0 0 24 24" :width="size" :height="size" fill="currentColor"><path d="M12 2 14.9 9l7.1.6-5.4 4.7L18.2 22 12 18l-6.2 4 1.6-7.7L2 9.6 9.1 9z"/></svg>
  <svg v-else-if="name === 'heart'" viewBox="0 0 24 24" :width="size" :height="size" :fill="filled ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-4.5-9.3-9A5.7 5.7 0 0 1 12 6a5.7 5.7 0 0 1 9.3 6c-2.3 4.5-9.3 9-9.3 9z"/></svg>
  <svg v-else-if="name === 'check'" viewBox="0 0 24 24" :width="size" :height="size" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m4 12 5 5L20 6"/></svg>
  <svg v-else-if="name === 'arrow'" viewBox="0 0 24 24" :width="size" :height="size" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>
  <svg v-else-if="name === 'back'" viewBox="0 0 24 24" :width="size" :height="size" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5m6-6-6 6 6 6"/></svg>
  <svg v-else-if="name === 'clock'" viewBox="0 0 24 24" :width="size" :height="size" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
  <svg v-else-if="name === 'phone'" viewBox="0 0 24 24" :width="size" :height="size" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.7.6 2.5a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.5.6a2 2 0 0 1 1.7 2z"/></svg>
  <svg v-else-if="name === 'plus'" viewBox="0 0 24 24" :width="size" :height="size" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
  <svg v-else-if="name === 'zap'" viewBox="0 0 24 24" :width="size" :height="size" fill="currentColor"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/></svg>
  <svg v-else viewBox="0 0 32 32" :width="size" :height="size" fill="none"><circle cx="16" cy="16" r="15" stroke="currentColor" stroke-width="1.2" opacity="0.25"/><circle cx="16" cy="16" r="5.5" fill="currentColor"/></svg>
</template>
<script>
export default {
  name: 'PfIcon',
  props: {
    name: { type: String, required: true },
    size: { type: [Number, String], default: 16 },
    filled: { type: Boolean, default: false }
  }
};
</script>
