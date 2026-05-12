<template>
  <div class="page-enter">
    <div class="wrap" style="padding-top:24px;padding-bottom:16px">
      <button class="btn btn--ghost btn--sm" @click="$router.back()">
        <PfIcon name="back"/> Volver
      </button>
    </div>

    <section class="wrap" style="padding-bottom:40px">
      <div class="gallery">
        <div class="gallery__main"><PfSmartImg :src="h.img" :alt="h.name"/></div>
        <div class="gallery__cell"><PfSmartImg :src="img('cafe')" alt="ambiente" label="ambiente"/></div>
        <div class="gallery__cell"><PfSmartImg :src="img('criolla')" alt="plato" label="plato"/></div>
        <div class="gallery__cell"><PfSmartImg :src="img('parrillas')" alt="cocina" label="cocina"/></div>
        <div class="placeholder gallery__more">+ 12 fotos</div>
      </div>

      <div class="detail-header">
        <div>
          <span class="eyebrow">{{ h.category }} · {{ h.district }}</span>
          <h1 class="detail-title">{{ h.name }}</h1>
          <div class="detail-meta">
            <span style="display:flex;align-items:center;gap:8px">
              <PfStars :value="h.rating" size="lg"/>
              <strong style="font-size:18px">{{ h.rating }}</strong>
              <span style="color:var(--ink-3)">· {{ h.reviews }} reseñas</span>
            </span>
            <span style="color:var(--line)">|</span>
            <span class="meta-line"><PfIcon name="pin"/> {{ h.address }}</span>
            <span style="color:var(--line)">|</span>
            <span class="meta-line"><PfIcon name="clock"/> {{ h.hours }}</span>
          </div>
        </div>
        <div style="display:flex;gap:8px">
          <button class="btn btn--ghost" @click="toggleFav">
            <PfIcon name="heart" :filled="isFav" :style="{ color: isFav ? 'var(--warm)' : 'currentColor' }"/>
            {{ isFav ? 'Guardado' : 'Guardar' }}
          </button>
          <RouterLink class="btn btn--accent" :to="{ name:'review-new', params:{ huariqueId: h.id } }">
            Escribir reseña
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="wrap" style="padding-bottom:80px">
      <div class="detail-body">
        <div>
          <div class="tabs">
            <button v-for="t in tabs" :key="t.id" :class="['tab', tab===t.id && 'tab--on']" @click="tab=t.id">{{ t.label }}</button>
          </div>

          <div v-if="tab==='about'" style="display:grid;gap:32px">
            <div>
              <span class="eyebrow">Historia</span>
              <p class="bio">{{ h.bio }}</p>
            </div>
            <div class="tag-grid">
              <div v-for="t in h.tags" :key="t" class="tag-card">
                <div class="eyebrow">Característica</div>
                <div style="font-size:16px;font-weight:500;margin-top:4px">{{ t }}</div>
              </div>
            </div>
            <div>
              <span class="eyebrow">Ratings detallados</span>
              <div style="display:grid;gap:12px;margin-top:16px">
                <div v-for="r in detailRatings" :key="r.k" class="rating-row">
                  <span style="color:var(--ink-2)">{{ r.k }}</span>
                  <div class="rating-bar"><div :style="{ width: (r.v/5)*100 + '%' }"/></div>
                  <span style="font-family:var(--font-mono);font-weight:600">{{ r.v }}</span>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="tab==='menu'" style="display:grid;gap:14px">
            <div v-for="m in menu" :key="m.name" class="menu-item">
              <div>
                <div style="font-size:16px;font-weight:500">{{ m.name }}</div>
                <div style="font-size:13px;color:var(--ink-3);margin-top:2px">{{ m.note }}</div>
              </div>
              <span style="font-family:var(--font-display);font-size:22px;white-space:nowrap">{{ m.price }}</span>
            </div>
          </div>

          <div v-else-if="tab==='reviews'">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px">
              <span class="eyebrow">{{ reviews.length }} reseñas reales</span>
              <RouterLink class="btn btn--soft btn--sm" :to="{ name:'review-new', params:{ huariqueId: h.id } }">
                <PfIcon name="plus"/> Aportar
              </RouterLink>
            </div>
            <div style="display:grid;gap:20px">
              <article v-for="r in reviews" :key="r.id" class="review-card">
                <header class="review-card__head">
                  <span class="review-avatar">{{ r.initials }}</span>
                  <div style="flex:1">
                    <div style="font-weight:500">{{ r.author }}</div>
                    <div style="font-size:12px;color:var(--ink-3)">{{ r.when }}</div>
                  </div>
                  <PfStars :value="r.rating"/>
                </header>
                <p style="font-size:15px;line-height:1.6;color:var(--ink-2);margin-bottom:14px">{{ r.text }}</p>
                <div style="display:flex;gap:6px;flex-wrap:wrap">
                  <span v-for="t in r.tags" :key="t" class="badge">{{ t }}</span>
                </div>
              </article>
            </div>
          </div>

          <div v-else-if="tab==='photos'" class="photos-grid">
            <div v-for="(src, i) in photos" :key="i" class="photo-cell">
              <PfSmartImg :src="src" :alt="`foto ${i+1}`"/>
            </div>
          </div>
        </div>

        <aside class="detail-aside">
          <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:20px">
            <div>
              <span class="eyebrow">Precio promedio</span>
              <div style="font-family:var(--font-display);font-size:38px;line-height:1;margin-top:4px">S/ {{ h.price }}</div>
              <div style="font-size:12px;color:var(--ink-3);margin-top:4px">por persona</div>
            </div>
          </div>
          <div v-if="h.promo" class="promo-card">
            <div class="eyebrow" style="color:rgba(255,255,255,.75)">Promo activa</div>
            <div style="font-size:18px;font-weight:500;margin-top:4px">{{ h.promo.discount }}% off · {{ h.promo.label }}</div>
          </div>
          <div style="display:grid;gap:12px;font-size:14px;margin-bottom:20px">
            <div class="sidebar-line"><PfIcon name="pin"/><div><div class="eyebrow">Dirección</div><div>{{ h.address }}</div></div></div>
            <div class="sidebar-line"><PfIcon name="clock"/><div><div class="eyebrow">Horario</div><div>{{ h.hours }}</div></div></div>
            <div class="sidebar-line"><PfIcon name="phone"/><div><div class="eyebrow">Teléfono</div><div>{{ h.phone }}</div></div></div>
          </div>
          <RouterLink class="btn btn--accent" style="width:100%;margin-bottom:8px" :to="{ name:'review-new', params:{ huariqueId: h.id } }">
            Reservar mesa
          </RouterLink>
          <RouterLink class="btn btn--ghost" style="width:100%" to="/map">Ver en el mapa</RouterLink>
          <div style="margin-top:24px;padding-top:20px;border-top:1px solid var(--line-soft);font-size:13px;color:var(--ink-3);text-align:center">
            Verificado por PointFlavor · Última visita: hace 2 semanas
          </div>
        </aside>
      </div>
    </section>
  </div>
</template>
<script>
import { findHuarique, REVIEWS } from '@/shared/data/mock-data.js';
import PfIcon from '@/shared/presentations/components/pf-icon.vue';
import PfStars from '@/shared/presentations/components/pf-stars.vue';
import PfSmartImg from '@/shared/presentations/components/pf-smart-img.vue';
import { getFavIds, toggleFavorite } from '@/shared/data/favorites.js';

const imgMap = import.meta.glob('/src/assets/*.{png,jpg,jpeg,webp}', { eager: true, query: '?url', import: 'default' });
const IMG = Object.fromEntries(Object.entries(imgMap).map(([p, url]) => [p.split('/').pop().toLowerCase(), url]));
const pick = (...names) => {
  for (const n of names) if (IMG[n.toLowerCase()]) return IMG[n.toLowerCase()];
  return '';
};

export default {
  name: 'HuariqueDetailView',
  components: { PfIcon, PfStars, PfSmartImg },
  data() {
    return {
      tab: 'about',
      favIds: [],
      detailRatings: [
        { k:'Comida', v: 4.8 },
        { k:'Servicio', v: 4.5 },
        { k:'Ambiente', v: 4.6 },
        { k:'Relación precio/calidad', v: 4.7 },
      ],
      menu: [
        { name:'Cuarto de pollo + papas + ensalada', price:'S/ 32', note:'Lo clásico, hecho bien.' },
        { name:'Pollo entero + 4 papas + 2 cremas',  price:'S/ 78', note:'Para 3-4 personas.' },
        { name:'Anticuchos de la casa (4u)',          price:'S/ 24', note:'Maíz y papa golden incluidos.' },
        { name:'Ensalada Brasero',                    price:'S/ 18', note:'Palta, tomate, queso fresco.' },
      ],
      tabs: [
        { id:'about', label:'Sobre el lugar' },
        { id:'menu', label:'Lo recomendado' },
        { id:'reviews', label:'Reseñas' },
        { id:'photos', label:'Fotos' },
      ]
    };
  },
  computed: {
    h() { return findHuarique(this.$route.params.id); },
    isFav() { return this.favIds.includes(this.h.id); },
    reviews() { return REVIEWS[this.h.id] || REVIEWS[1] || []; },
    photos() { return [this.h.img, this.img('parrillas'), this.img('criolla'), this.img('cafe'), this.img('marina'), this.img('postres')]; }
  },
  mounted() { this.favIds = getFavIds(); },
  methods: {
    img(slug) { return pick(`${slug}.jpg`, `${slug}.jpeg`, `${slug}ref.jpg`, `${slug}_brasa.jpg`); },
    toggleFav() { this.favIds = toggleFavorite(this.h); }
  }
};
</script>
<style scoped>
.gallery { display:grid; grid-template-columns: 2fr 1fr 1fr; grid-template-rows: 220px 220px; gap:12px; margin-bottom:32px; }
.gallery__main { grid-row: span 2; border-radius: var(--r-lg); overflow:hidden; }
.gallery__cell { border-radius: var(--r-lg); overflow:hidden; }
.gallery__more { border-radius: var(--r-lg); }

.detail-header { display:grid; grid-template-columns: 1fr auto; gap: 24px; align-items: flex-start; }
.detail-title { font-size: clamp(40px, 5vw, 64px); margin-top:10px; line-height:1; letter-spacing: -0.02em; }
.detail-meta { display:flex; gap:24px; align-items:center; margin-top:16px; flex-wrap:wrap; }
.meta-line { display:flex; align-items:center; gap:6px; color: var(--ink-2); }

.detail-body { display:grid; grid-template-columns: 1fr 360px; gap: 56px; align-items: start; }

.tabs { display:flex; gap:4px; border-bottom: 1px solid var(--line); margin-bottom: 32px; }
.tab {
  padding: 14px 18px; border:none; background:transparent;
  font-size: 14px; font-weight: 400; color: var(--ink-2);
  border-bottom: 2px solid transparent; margin-bottom: -1px; cursor: pointer;
}
.tab--on { font-weight: 600; color: var(--ink); border-bottom-color: var(--accent); }

.bio { font-family: var(--font-display); font-size: 24px; line-height:1.4; margin-top:12px; letter-spacing: -0.005em; }

.tag-grid { display:grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.tag-card { padding: 16px 18px; border-radius: var(--r-md); background: var(--bg-soft); border: 1px solid var(--line-soft); }

.rating-row { display:grid; grid-template-columns: 160px 1fr 40px; align-items:center; gap:16px; font-size: 14px; }
.rating-bar { height:6px; background: var(--bg-soft); border-radius: var(--r-pill); overflow:hidden; }
.rating-bar > div { height:100%; background: var(--accent); }

.menu-item { display:flex; justify-content:space-between; align-items:baseline; gap:24px; padding: 18px 20px; border-radius: var(--r-md); border: 1px solid var(--line-soft); }

.review-card { padding: 24px; border-radius: var(--r-lg); border: 1px solid var(--line-soft); background: var(--bg-elev); }
.review-card__head { display:flex; align-items:center; gap:12px; margin-bottom:14px; }
.review-avatar {
  width:40px; height:40px; border-radius:50%;
  background: var(--accent-soft); color: var(--accent);
  display:grid; place-items:center;
  font-family: var(--font-mono); font-size: 13px; font-weight: 600;
}

.photos-grid { display:grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.photo-cell { aspect-ratio: 1/1; border-radius: var(--r-md); overflow:hidden; }

.detail-aside {
  position: sticky; top: 96px;
  padding: 24px; border-radius: var(--r-lg);
  background: var(--bg-elev); border: 1px solid var(--line-soft);
  box-shadow: var(--shadow-sm);
}
.promo-card { padding: 14px; border-radius: var(--r-md); background: var(--accent); color: #fff; margin-bottom: 20px; }
.sidebar-line { display:flex; gap:12px; }
.sidebar-line > svg { color: var(--ink-3); margin-top: 2px; }

@media (max-width: 960px) {
  .detail-body { grid-template-columns: 1fr; }
  .detail-aside { position: static; }
  .gallery { grid-template-columns: 1fr 1fr; grid-template-rows: auto; }
  .gallery__main { grid-row: auto; grid-column: span 2; }
  .detail-header { grid-template-columns: 1fr; }
}
</style>
