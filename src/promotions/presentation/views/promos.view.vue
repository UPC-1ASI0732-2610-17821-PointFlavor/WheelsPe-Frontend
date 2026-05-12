<template>
  <div class="page-enter">
    <section class="section" style="padding-bottom:32px">
      <div class="wrap">
        <div class="section-head">
          <div>
            <span class="eyebrow" style="margin-bottom:10px;display:block">Promociones activas</span>
            <h2>Comer rico, pagar menos.</h2>
            <p>Las promos cambian cada semana. Te mostramos las verificadas, sin letras chiquitas.</p>
          </div>
        </div>
        <article class="featured-promo" @click="$router.push({ name:'huarique-detail', params:{ id: featured.huariqueId } })">
          <div class="featured-promo__img">
            <PfSmartImg :src="featured.img" :alt="featured.title"/>
            <div class="featured-promo__badge">★ Promo destacada</div>
          </div>
          <div class="featured-promo__body">
            <span class="eyebrow" style="color:rgba(255,255,255,.5)">{{ featured.type }}</span>
            <h2 class="featured-promo__title">{{ featured.title }}</h2>
            <p>{{ featured.note }}</p>
            <div class="featured-promo__meta">
              <div><div class="eyebrow">Lugar</div><div>{{ fHuar?.name }}</div></div>
              <div><div class="eyebrow">Vence</div><div>{{ featured.expires }}</div></div>
              <div><div class="eyebrow">Código</div><div style="font-family:var(--font-mono)">{{ featured.code }}</div></div>
            </div>
            <button class="btn btn--accent" style="justify-self:flex-start">Ver el lugar <PfIcon name="arrow"/></button>
          </div>
        </article>
      </div>
    </section>

    <section class="section" style="padding-top:24px">
      <div class="wrap">
        <div class="promos-filters">
          <button v-for="f in filters" :key="f" :class="['chip', filter===f && 'chip--on']" @click="filter=f">
            <PfIcon v-if="filter===f" name="check"/> {{ f === 'all' ? 'Todas' : f }}
          </button>
          <span class="promos-filters__count">{{ filteredPromos.length }} activas</span>
        </div>
        <div class="promos-grid">
          <article v-for="p in filteredPromos" :key="p.id" class="card promo-card" @click="$router.push({ name:'huarique-detail', params:{ id: p.huariqueId } })">
            <div class="promo-card__media">
              <PfSmartImg :src="p.img" :alt="p.title"/>
              <span class="badge badge--accent" style="position:absolute;top:14px;left:14px">{{ p.type }}</span>
              <div class="promo-card__disk">
                <div>
                  <div style="font-family:var(--font-display);font-size:22px;color:var(--accent)">{{ p.discount }}%</div>
                  <div style="font-size:9px;color:var(--ink-3);font-family:var(--font-mono);text-transform:uppercase;margin-top:2px">off</div>
                </div>
              </div>
            </div>
            <div style="padding:20px">
              <span class="eyebrow">{{ huariqueOf(p)?.name }} · {{ huariqueOf(p)?.district }}</span>
              <h3 style="font-size:20px;margin-top:6px;margin-bottom:8px">{{ p.title }}</h3>
              <p style="font-size:13px;color:var(--ink-2);margin-bottom:14px;min-height:36px">{{ p.note }}</p>
              <div class="promo-card__foot">
                <span>{{ p.code }}</span>
                <span>vence {{ p.expires }}</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import { PROMOS, HUARIQUES } from '@/shared/data/mock-data.js';
import PfIcon from '@/shared/presentations/components/pf-icon.vue';
import PfSmartImg from '@/shared/presentations/components/pf-smart-img.vue';
export default {
  name: 'PromosView',
  components: { PfIcon, PfSmartImg },
  data: () => ({
    filter: 'all',
    filters: ['all','2x1','descuento','menú','happy hour'],
    featured: PROMOS[0],
    fHuar: HUARIQUES.find(h => h.id === PROMOS[0].huariqueId)
  }),
  computed: {
    filteredPromos() {
      return this.filter === 'all' ? PROMOS : PROMOS.filter(p => p.type === this.filter);
    }
  },
  methods: {
    huariqueOf(p) { return HUARIQUES.find(h => h.id === p.huariqueId); }
  }
};
</script>
<style scoped>
.featured-promo {
  display:grid; grid-template-columns: 1.2fr 1fr;
  background: var(--ink); color:#fff;
  border-radius: var(--r-xl); overflow:hidden; min-height: 380px; cursor:pointer;
}
.featured-promo__img { position:relative; }
.featured-promo__badge {
  position:absolute; top:24px; left:24px;
  padding: 8px 14px; border-radius: var(--r-pill);
  background: var(--accent); color: #fff;
  font-size: 12px; font-family: var(--font-mono);
  text-transform: uppercase; letter-spacing: 0.08em;
}
.featured-promo__body { padding: 56px; display:flex; flex-direction:column; justify-content:center; }
.featured-promo__title { font-size: 42px; color: #fff; margin-top:12px; line-height: 1.05; }
.featured-promo__body p { color: rgba(255,255,255,.7); font-size: 16px; margin-top: 14px; margin-bottom: 28px; }
.featured-promo__meta { display:grid; grid-template-columns: auto auto auto; gap:24px; font-size:13px; color:rgba(255,255,255,.7); margin-bottom: 28px; }
.featured-promo__meta div > div:last-child { color:#fff; font-size:15px; margin-top:2px; }
.featured-promo .eyebrow { color: rgba(255,255,255,.5); }

.promos-filters { display:flex; gap:8px; margin-bottom: 32px; flex-wrap:wrap; align-items:center; }
.promos-filters__count {
  margin-left:auto; font-size: 12px; color: var(--ink-3);
  font-family: var(--font-mono); letter-spacing: 0.08em; text-transform: uppercase;
}
.promos-grid { display:grid; grid-template-columns: repeat(3, 1fr); gap:20px; }
.promo-card { cursor: pointer; }
.promo-card__media { position:relative; aspect-ratio: 4/3; overflow:hidden; }
.promo-card__disk {
  position:absolute; bottom:14px; right:14px;
  width:70px; height:70px; border-radius:50%;
  background: var(--bg-elev); display:grid; place-items:center;
  box-shadow: var(--shadow-md); text-align:center; line-height: 1;
}
.promo-card__foot {
  display:flex; justify-content:space-between; align-items:center;
  padding-top:14px; border-top:1px dashed var(--line);
  font-size:12px; color: var(--ink-3);
  font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.06em;
}
@media (max-width: 960px) {
  .featured-promo { grid-template-columns: 1fr; }
  .featured-promo__body { padding: 32px; }
  .promos-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
