<template>
  <div class="page-enter map-screen">
    <aside class="map-side">
      <div class="map-side__head">
        <span class="eyebrow">Explorar</span>
        <h2 style="font-size:28px;margin-top:4px;margin-bottom:14px">Mapa de huariques</h2>
        <form class="searchbox" @submit.prevent>
          <PfIcon name="search" :size="18" style="color:var(--ink-3); margin-left:14px"/>
          <input v-model="q" placeholder="Buscar barrio o plato…"/>
        </form>
        <div class="map-side__cats">
          <button :class="['chip', cat==='all' && 'chip--on']" @click="cat='all'">Todo</button>
          <button v-for="c in cats" :key="c.id" :class="['chip', cat===c.id && 'chip--on']" @click="cat=c.id">{{ c.name }}</button>
        </div>
      </div>
      <div class="map-side__list">
        <div class="map-side__list-head">
          <span>{{ pins.length }} en la vista</span>
          <span>Ordenar: cercanos</span>
        </div>
        <button v-for="p in pins" :key="p.id" :class="['map-pin-row', selected===p.id && 'on']" @click="selected=p.id">
          <div class="map-pin-row__thumb"><PfSmartImg :src="p.img" :alt="p.name"/></div>
          <div style="min-width:0;flex:1">
            <div class="eyebrow">{{ p.category }}</div>
            <div class="map-pin-row__name">{{ p.name }}</div>
            <div class="map-pin-row__meta">
              <span>★ {{ p.rating }}</span><span style="color:var(--ink-3)">·</span>
              <span>{{ p.district }}</span><span style="color:var(--ink-3)">·</span>
              <span>S/{{ p.price }}</span>
            </div>
          </div>
        </button>
      </div>
    </aside>

    <div class="map-canvas">
      <svg class="map-canvas__roads" preserveAspectRatio="none">
        <path d="M 0,180 Q 250,250 500,200 T 1000,260 T 1600,300" stroke="var(--line)" stroke-width="14" fill="none" opacity=".6"/>
        <path d="M 0,180 Q 250,250 500,200 T 1000,260 T 1600,300" stroke="var(--bg-elev)" stroke-width="8" fill="none"/>
        <path d="M 200,0 Q 280,300 360,500 T 500,1000" stroke="var(--line)" stroke-width="10" fill="none" opacity=".5"/>
        <path d="M 200,0 Q 280,300 360,500 T 500,1000" stroke="var(--bg-elev)" stroke-width="6" fill="none"/>
        <path d="M 800,0 L 820,600 L 900,1000" stroke="var(--line)" stroke-width="10" fill="none" opacity=".5"/>
        <path d="M 800,0 L 820,600 L 900,1000" stroke="var(--bg-elev)" stroke-width="6" fill="none"/>
        <path d="M 0,500 L 1600,540" stroke="var(--line)" stroke-width="8" fill="none" opacity=".5"/>
        <path d="M 0,500 L 1600,540" stroke="var(--bg-elev)" stroke-width="5" fill="none"/>
      </svg>

      <div class="park park--1"></div>
      <div class="park park--2"></div>
      <div class="map-label" style="left:18%;top:24%">Miraflores</div>
      <div class="map-label" style="left:58%;top:52%">Surco</div>
      <div class="map-label" style="left:30%;top:78%">Barranco</div>

      <button v-for="p in pins" :key="p.id" class="map-pin"
        :class="{ on: selected===p.id }"
        :style="{ left: p.x + '%', top: p.y + '%' }"
        @click="selected=p.id">
        <span class="map-pin__chip">
          <span class="map-pin__dot"></span>
          S/{{ p.price }}
        </span>
      </button>

      <article v-if="sel" class="map-preview">
        <div class="map-preview__img"><PfSmartImg :src="sel.img" :alt="sel.name"/></div>
        <div class="map-preview__body">
          <span class="eyebrow">{{ sel.category }}</span>
          <h3 style="font-size:22px;margin-top:4px">{{ sel.name }}</h3>
          <div class="map-preview__meta">
            <span>★ {{ sel.rating }}</span><span>·</span>
            <span>{{ sel.district }}</span><span>·</span>
            <span>S/ {{ sel.price }}</span>
          </div>
          <div style="display:flex;gap:8px;margin-top:14px">
            <RouterLink class="btn btn--accent btn--sm" :to="{ name:'huarique-detail', params:{ id: sel.id } }">Ver detalles</RouterLink>
            <button class="btn btn--ghost btn--sm" @click="toggleFav(sel)">
              <PfIcon name="heart" :filled="favIds.includes(sel.id)"
                :style="{ color: favIds.includes(sel.id) ? 'var(--warm)' : 'currentColor' }"/>
            </button>
          </div>
        </div>
      </article>

      <div class="map-controls">
        <button class="btn btn--icon btn--ghost"><PfIcon name="plus"/></button>
        <div style="height:1px;background:var(--line-soft)"></div>
        <button class="btn btn--icon btn--ghost">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M5 12h14"/></svg>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { MAP_PINS, CATEGORIES } from '@/shared/data/mock-data.js';
import PfIcon from '@/shared/presentations/components/pf-icon.vue';
import PfSmartImg from '@/shared/presentations/components/pf-smart-img.vue';
import { getFavIds, toggleFavorite } from '@/shared/data/favorites.js';

export default {
  name: 'MapView',
  components: { PfIcon, PfSmartImg },
  data: () => ({
    q: '',
    cat: 'all',
    selected: MAP_PINS[0].id,
    cats: CATEGORIES.slice(0, 6),
    favIds: []
  }),
  computed: {
    pins() { return this.cat === 'all' ? MAP_PINS : MAP_PINS.filter(p => p.cat === this.cat); },
    sel() { return MAP_PINS.find(p => p.id === this.selected); }
  },
  mounted() { this.favIds = getFavIds(); },
  methods: {
    toggleFav(h) { this.favIds = toggleFavorite(h); }
  }
};
</script>
<style scoped>
.map-screen { height: calc(100vh - 73px); display:grid; grid-template-columns: 380px 1fr; overflow:hidden; }
.map-side { border-right:1px solid var(--line-soft); background: var(--bg-elev); display:flex; flex-direction:column; overflow:hidden; }
.map-side__head { padding: 20px; border-bottom: 1px solid var(--line-soft); }
.searchbox {
  display:flex; align-items:center; gap:8px;
  background: var(--bg-elev); border:1px solid var(--line);
  border-radius: var(--r-pill); padding: 4px 4px 4px 8px;
}
.searchbox input { flex:1; border:none; outline:none; background:transparent; padding: 10px 6px; font-size: 14px; }
.map-side__cats { display:flex; gap:6px; margin-top:14px; overflow-x: auto; padding-bottom: 4px; }
.map-side__list { flex:1; overflow-y:auto; padding: 12px; }
.map-side__list-head {
  padding: 8px 8px 12px; display:flex; justify-content:space-between;
  font-size: 12px; color: var(--ink-3);
  font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.08em;
}
.map-pin-row {
  display:flex; gap:12px; padding: 12px; width:100%;
  background: transparent; border: 1px solid transparent;
  border-radius: var(--r-md); text-align: left; cursor: pointer;
  margin-bottom: 4px;
}
.map-pin-row.on { background: var(--bg-soft); border-color: var(--line); }
.map-pin-row__thumb { width:64px; height:64px; border-radius: var(--r-sm); overflow:hidden; flex-shrink: 0; }
.map-pin-row__name { font-weight: 500; font-size: 15px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.map-pin-row__meta { font-size: 12px; color: var(--ink-2); margin-top: 2px; display:flex; gap:8px; align-items:center; }

.map-canvas {
  position: relative; overflow:hidden;
  background: oklch(0.93 0.012 85);
  background-image:
    linear-gradient(to right, var(--line-soft) 1px, transparent 1px),
    linear-gradient(to bottom, var(--line-soft) 1px, transparent 1px),
    radial-gradient(circle at 30% 40%, color-mix(in oklch, var(--accent) 14%, transparent), transparent 50%),
    radial-gradient(circle at 70% 70%, color-mix(in oklch, var(--warm) 12%, transparent), transparent 50%);
  background-size: 40px 40px, 40px 40px, 100% 100%, 100% 100%;
}
.map-canvas__roads { position:absolute; inset:0; width:100%; height:100%; }
.park { position:absolute; background: color-mix(in oklch, var(--success) 18%, transparent); }
.park--1 { left:12%; top:58%; width:18%; height:22%; border-radius: 40% 60% 50% 50%; }
.park--2 { left:62%; top:18%; width:22%; height:18%; border-radius: 50% 40% 60% 50%; background: color-mix(in oklch, var(--success) 14%, transparent); }
.map-label {
  position:absolute; font-family: var(--font-mono);
  font-size: 11px; color: var(--ink-3);
  letter-spacing: 0.1em; text-transform: uppercase;
}
.map-pin { position:absolute; transform: translate(-50%, -100%); border:none; background: transparent; cursor:pointer; z-index: 10; }
.map-pin.on { z-index: 20; }
.map-pin__chip {
  display:inline-flex; align-items:center; gap:6px;
  padding: 6px 12px; border-radius: var(--r-pill);
  background: var(--bg-elev); color: var(--ink);
  border:1px solid var(--line); box-shadow: var(--shadow-md);
  font-size: 13px; font-weight: 500; white-space: nowrap;
}
.map-pin.on .map-pin__chip { padding: 8px 14px; background: var(--ink); color: var(--ink-inv); border-color: var(--ink); }
.map-pin__dot { width:6px; height:6px; border-radius:50%; background: var(--accent); }
.map-pin.on .map-pin__dot { background: #fff; }

.map-preview {
  position: absolute; bottom: 24px; left: 24px; right: 24px;
  max-width: 480px; margin-inline: auto;
  background: var(--bg-elev); border:1px solid var(--line);
  border-radius: var(--r-xl); box-shadow: var(--shadow-lg);
  display:flex; overflow:hidden; z-index: 30;
}
.map-preview__img { width: 130px; flex-shrink: 0; }
.map-preview__body { padding: 16px; flex: 1; }
.map-preview__meta { display:flex; gap:12px; font-size: 13px; color: var(--ink-2); margin-top: 8px; }

.map-controls {
  position: absolute; top: 16px; right: 16px;
  display:flex; flex-direction:column; gap:4px;
  background: var(--bg-elev); border-radius: var(--r-md);
  border:1px solid var(--line); box-shadow: var(--shadow-md); overflow:hidden;
}
@media (max-width: 880px) {
  .map-screen { grid-template-columns: 1fr; grid-template-rows: auto 1fr; height: calc(100vh - 73px); }
  .map-side { border-right: none; border-bottom: 1px solid var(--line-soft); max-height: 40%; }
}
</style>
