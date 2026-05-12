<template>
  <div v-if="err || !src" class="placeholder" :style="$attrs.style">{{ label || alt || 'imagen' }}</div>
  <img v-else :src="src" :alt="alt" loading="lazy"
    style="width:100%;height:100%;object-fit:cover;"
    @error="err = true"/>
</template>
<script>
export default {
  name: 'PfSmartImg',
  inheritAttrs: false,
  props: {
    src: { type: String, default: '' },
    alt: { type: String, default: '' },
    label: { type: String, default: '' }
  },
  data: () => ({ err: false }),
  watch: { src() { this.err = false; } }
};
</script>
