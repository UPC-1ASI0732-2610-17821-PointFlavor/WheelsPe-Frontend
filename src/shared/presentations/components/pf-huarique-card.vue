<template>
  <article v-if="layout === 'row'" class="card hcard hcard--row" @click="$emit('open', h)">
    <div class="hcard__media-row">
      <PfSmartImg :src="h.img" :alt="h.name" :label="h.cat"/>
    </div>
    <div class="hcard__body">
      <div class="hcard__head">
        <div style="min-width:0">
          <span class="eyebrow">{{ h.category }}</span>
          <h3 class="hcard__title">{{ h.name }}</h3>
        </div>
        <button class="btn btn--icon btn--ghost" @click.stop="$emit('toggle-fav', h)" aria-label="Favorito">
          <PfIcon name="heart" :filled="isFav" :style="{ color: isFav ? 'var(--warm)' : 'currentColor' }"/>
        </button>
      </div>
      <p class="hcard__bio">{{ h.bio }}</p>
      <div class="hcard__meta">
        <span class="meta-line"><PfIcon name="pin"/> {{ h.district }}</span>
        <span class="meta-line"><PfStars :value="h.rating"/> <strong>{{ h.rating }}</strong><span style="color:var(--ink-3)">· {{ h.reviews }}</span></span>
        <span class="hcard__price">S/ {{ h.price }}<span style="font-size:12px;color:var(--ink-3)"> /persona</span></span>
      </div>
    </div>
  </article>

  <article v-else class="card hcard" @click="$emit('open', h)">
    <div class="hcard__media">
      <PfSmartImg :src="h.img" :alt="h.name" :label="h.cat"/>
      <span v-if="h.promo" class="badge badge--solid hcard__promo">
        <PfIcon name="zap"/> {{ h.promo.discount }}% off
      </span>
      <button class="btn btn--icon hcard__fav"
        :style="{ background: isFav ? 'var(--ink)' : 'rgba(255,255,255,.92)', color: isFav ? 'var(--ink-inv)' : 'var(--ink)' }"
        @click.stop="$emit('toggle-fav', h)" aria-label="Favorito">
        <PfIcon name="heart" :filled="isFav"/>
      </button>
    </div>
    <div style="padding: var(--pad-card)">
      <span class="eyebrow">{{ h.category }}</span>
      <h3 class="hcard__title">{{ h.name }}</h3>
      <div class="hcard__row">
        <span class="meta-line"><PfIcon name="pin"/> {{ h.district }}</span>
        <span style="color:var(--ink-3)">·</span>
        <span class="meta-line"><PfStars :value="h.rating"/> {{ h.rating }}</span>
      </div>
      <div class="hcard__foot">
        <span class="hcard__price">S/ {{ h.price }}<span style="font-size:12px;color:var(--ink-3);font-family:var(--font-sans)"> · {{ h.reviews }} reseñas</span></span>
        <span style="color:var(--ink-3)"><PfIcon name="arrow"/></span>
      </div>
    </div>
  </article>
</template>
<script>
import PfIcon from './pf-icon.vue';
import PfStars from './pf-stars.vue';
import PfSmartImg from './pf-smart-img.vue';
export default {
  name: 'PfHuariqueCard',
  components: { PfIcon, PfStars, PfSmartImg },
  emits: ['open', 'toggle-fav'],
  props: {
    h: { type: Object, required: true },
    isFav: { type: Boolean, default: false },
    layout: { type: String, default: 'grid' }
  }
};
</script>
<style scoped>
.hcard { cursor: pointer; }
.hcard--row { display:flex; gap: 20px; padding: 16px; align-items: stretch; }
.hcard__media-row { width:180px; height:140px; border-radius: var(--r-md); overflow:hidden; flex-shrink:0; }
.hcard__body { flex: 1; display:flex; flex-direction:column; gap: 8px; min-width: 0; }
.hcard__head { display:flex; justify-content:space-between; gap:12px; align-items:flex-start; }
.hcard__title { font-size: 22px; margin-top:4px; margin-bottom:6px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.hcard__bio { color: var(--ink-2); font-size: 14px; margin: 0;
  display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.hcard__meta { margin-top: auto; display:flex; gap:14px; align-items:center; flex-wrap:wrap; font-size: 13px; }
.meta-line { display:inline-flex; align-items:center; gap:6px; color: var(--ink-2); font-size: 13px; }
.hcard__price { margin-left:auto; font-family: var(--font-display); font-size: 18px; }
.hcard__media { position: relative; aspect-ratio: 5/4; overflow:hidden; }
.hcard__promo { position:absolute; top:14px; left:14px; }
.hcard__fav { position:absolute; top:12px; right:12px; border:none; backdrop-filter: blur(6px); }
.hcard__row { display:flex; gap:10px; align-items:center; color:var(--ink-2); font-size: 13px; margin-bottom: 12px; }
.hcard__foot { display:flex; justify-content:space-between; align-items:center; }
</style>
