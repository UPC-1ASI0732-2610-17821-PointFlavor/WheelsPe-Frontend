<template>
  <div class="page-enter">
    <!-- HERO -->
    <section class="home-hero">
      <div class="wrap home-hero__grid">
        <div>
          <span class="eyebrow" style="margin-bottom:18px;display:block">· Guía gastronómica · Lima 2026</span>
          <h1 class="home-title">
            Comer rico,<br/>
            <em style="color:var(--accent);font-style:italic">sin atajos</em>.
          </h1>
          <p class="home-lead">
            Una selección honesta de huariques, mercados y mesas de barrio.
            Curada por gente que come, no por algoritmos.
          </p>
          <form class="searchbox" @submit.prevent="submit">
            <PfIcon name="search" :size="18" style="color:var(--ink-3); margin-left:14px"/>
            <input v-model="q" placeholder="¿Antojo de pollo, ceviche, anticucho?"/>
            <button type="submit" class="btn btn--accent">Buscar</button>
          </form>
          <div class="home-quick">
            <span class="home-quick__label">prueba</span>
            <button v-for="t in ['Pollo a la brasa','Ceviche','Chifa','Anticucho','Postres']"
              :key="t" class="chip" @click="quick(t)">{{ t }}</button>
          </div>
        </div>

        <div class="hero-collage">
          <div class="hero-collage__a"><PfSmartImg :src="featured[0]?.img" alt="Pollo a la brasa"/></div>
          <div class="hero-collage__b"><PfSmartImg :src="featured[2]?.img || featured[1]?.img" alt="Marina"/></div>
          <div class="hero-collage__c"><PfSmartImg :src="pastryImg" alt="Postres"/></div>
          <span class="hero-collage__pill">
            <span class="dot"></span> 184 personas comieron aquí esta semana
          </span>
        </div>
      </div>
    </section>

    <!-- STATS BAND -->
    <section class="stats-band">
      <div class="wrap stats-band__grid">
        <div><div class="stat-num">1,840+</div><div class="stat-label">Huariques verificados</div></div>
        <div><div class="stat-num">38</div><div class="stat-label">Distritos cubiertos</div></div>
        <div><div class="stat-num">92k</div><div class="stat-label">Reseñas reales</div></div>
        <div><div class="stat-num">14</div><div class="stat-label">Categorías de cocina</div></div>
      </div>
    </section>

    <!-- CATEGORIES -->
    <section class="section">
      <div class="wrap">
        <div class="section-head">
          <div>
            <span class="eyebrow" style="margin-bottom:10px;display:block">01 — Categorías</span>
            <h2>Empieza por el antojo.</h2>
            <p>Filtra por lo que te apetece hoy. Cada categoría es una puerta a varios barrios.</p>
          </div>
          <RouterLink class="btn btn--ghost btn--sm" to="/categories">Ver todas <PfIcon name="arrow"/></RouterLink>
        </div>
        <div class="grid-cats">
          <RouterLink v-for="(c,i) in cats" :key="c.id" class="card cat-tile"
            :class="{ 'cat-tile--feature': i === 0 }"
            :to="{ path:'/results', query:{ q: c.name } }">
            <PfSmartImg :src="c.img" :alt="c.name" :label="c.id"/>
            <div class="cat-tile__overlay"></div>
            <div class="cat-tile__body">
              <h3 :style="{ fontSize: i===0 ? '26px':'19px' }">{{ c.name }}</h3>
              <span class="cat-tile__count">{{ c.count }} lugares</span>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- FEATURED EDITORIAL -->
    <section class="section" style="padding-top:24px">
      <div class="wrap">
        <div class="section-head">
          <div>
            <span class="eyebrow" style="margin-bottom:10px;display:block">02 — Selección de la semana</span>
            <h2>Tres mesas que valen el viaje.</h2>
            <p>Visitamos, probamos, escuchamos. Esta semana destacamos:</p>
          </div>
        </div>
        <div class="featured-grid">
          <article v-for="(h,i) in featured" :key="h.id" class="card featured-card"
            :style="{ minHeight: i===0 ? '520px' : 'auto' }"
            @click="goDetail(h.id)">
            <div class="featured-card__media" :style="{ aspectRatio: i===0 ? '4/5' : '4/3' }">
              <PfSmartImg :src="h.img" :alt="h.name"/>
              <div class="featured-card__grad"></div>
              <span class="badge" style="position:absolute;top:16px;left:16px;background:rgba(255,255,255,.96);color:var(--ink)">Nº 0{{ i+1 }}</span>
              <div class="featured-card__caption">
                <span class="eyebrow" style="color:rgba(255,255,255,.75)">{{ h.category }}</span>
                <h3 :style="{ fontSize: i===0 ? '36px':'26px', color:'#fff', marginTop:'6px' }">{{ h.name }}</h3>
                <div class="featured-card__meta">
                  <span><PfIcon name="pin"/> {{ h.district }}</span>
                  <span>★ {{ h.rating }}</span>
                  <span>S/ {{ h.price }}</span>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- PROMO BANNER -->
    <section class="section" style="padding-top:0">
      <div class="wrap">
        <article class="promo-banner">
          <div class="promo-banner__body">
            <span class="eyebrow" style="color:rgba(255,255,255,.7)">Promo activa</span>
            <h2>{{ promo.title }}</h2>
            <p>{{ promo.note }} Aplica en sucursales seleccionadas hasta agotar stock.</p>
            <div class="promo-banner__actions">
              <RouterLink class="btn" style="background:#fff;color:var(--accent)" to="/promos">Ver todas las promos</RouterLink>
              <button class="btn btn--ghost" style="border-color:rgba(255,255,255,.3);color:#fff"
                @click="goDetail(promo.huariqueId)">Ver el huarique</button>
            </div>
          </div>
          <div class="promo-banner__img"><PfSmartImg :src="promo.img" :alt="promo.title"/></div>
        </article>
      </div>
    </section>

    <!-- TRENDING -->
    <section class="section">
      <div class="wrap">
        <div class="section-head">
          <div>
            <span class="eyebrow" style="margin-bottom:10px;display:block">03 — Cerca de ti</span>
            <h2>Los más visitados hoy.</h2>
          </div>
          <RouterLink class="btn btn--ghost btn--sm" to="/results">Ver todos <PfIcon name="arrow"/></RouterLink>
        </div>
        <div class="trending-grid">
          <PfHuariqueCard v-for="h in trending" :key="h.id" :h="h"
            :is-fav="favIds.includes(h.id)"
            @open="goDetail(h.id)"
            @toggle-fav="toggleFav"/>
        </div>
      </div>
    </section>

    <!-- MANIFESTO -->
    <section class="section">
      <div class="wrap-narrow" style="text-align:center">
        <span class="eyebrow">— Manifiesto</span>
        <p class="manifesto">
          "Una buena mesa no se mide por su decoración, sino por la cantidad de
          historias que se cuentan en ella. Buscamos esas mesas, una por una."
        </p>
        <div class="manifesto__sig">EQUIPO POINTFLAVOR — LIMA, 2026</div>
      </div>
    </section>
  </div>
</template>

<script>
import PfIcon from '@/shared/presentations/components/pf-icon.vue';
import PfSmartImg from '@/shared/presentations/components/pf-smart-img.vue';
import PfHuariqueCard from '@/shared/presentations/components/pf-huarique-card.vue';
import { listCategoriesQuery } from '@/discovery/application/list-categories.query.js';
import { listHuariquesQuery } from '@/discovery/application/list-huariques.query.js';
import { listPromosQuery } from '@/promotions/application/list-promos.query.js';
import { getFavIdsQuery, toggleFavoriteUseCase } from '@/discovery/application/favorites.queries.js';

export default {
  name: 'HomeView',
  components: { PfIcon, PfSmartImg, PfHuariqueCard },
  data: () => ({
    q: '',
    cats: [],
    featured: [],
    trending: [],
    promo: { title:'', note:'', img:'', huariqueId: null },
    pastryImg: '',
    favIds: [],
    loading: true
  }),
  async mounted() {
    try {
      const [cats, huariques, promos, favIds] = await Promise.all([
        listCategoriesQuery(),
        listHuariquesQuery(),
        listPromosQuery(),
        getFavIdsQuery().catch(() => [])
      ]);
      this.cats = cats.slice(0, 8);
      this.featured = huariques.slice(0, 3);
      this.trending = huariques.slice(3, 7);
      this.pastryImg = huariques.find(h => h.cat === 'postres')?.img || huariques[11]?.img || '';
      if (promos[0]) this.promo = promos[0];
      this.favIds = favIds;
    } finally {
      this.loading = false;
    }
  },
  methods: {
    submit() { this.$router.push({ path: '/results', query: { q: this.q } }); },
    quick(term) { this.$router.push({ path: '/results', query: { q: term } }); },
    goDetail(id) { this.$router.push({ name: 'huarique-detail', params: { id } }); },
    async toggleFav(h) {
      try { this.favIds = await toggleFavoriteUseCase(h); }
      catch (e) { console.warn('Toggle fav falló:', e.message); }
    }
  }
};
</script>

<style scoped>
.home-hero { padding: 72px 0 80px; }
.home-hero__grid { display:grid; grid-template-columns: 1.4fr 1fr; gap: 56px; align-items: center; }
.home-title { font-size: clamp(48px, 6vw, 84px); line-height: 0.95; letter-spacing: -0.025em; margin-bottom: 20px; }
.home-lead { font-size: 18px; line-height: 1.55; color: var(--ink-2); max-width: 480px; margin-bottom: 36px; }
.searchbox {
  display:flex; align-items:center; gap:8px; max-width: 560px;
  background: var(--bg-elev); border:1px solid var(--line);
  border-radius: var(--r-pill); padding: 6px 6px 6px 8px;
  box-shadow: var(--shadow-sm); margin-bottom: 18px;
}
.searchbox input { flex:1; border:none; outline:none; background:transparent; padding: 14px 6px; font-size: 16px; }
.home-quick { display:flex; gap:8px; flex-wrap:wrap; align-items:center; }
.home-quick__label {
  font-size: 12px; color: var(--ink-3); margin-right:6px;
  font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.08em;
}

.hero-collage { position: relative; aspect-ratio: 4/5; max-width: 460px; margin-left: auto; }
.hero-collage__a, .hero-collage__b, .hero-collage__c { position: absolute; border-radius: var(--r-lg); overflow:hidden; }
.hero-collage__a { top:0; right:0; width:72%; aspect-ratio: 3/4; box-shadow: var(--shadow-lg); }
.hero-collage__b { bottom:8%; left:0; width:52%; aspect-ratio: 1/1; box-shadow: var(--shadow-lg); border: 4px solid var(--bg); }
.hero-collage__c { bottom:0; right:8%; width:34%; aspect-ratio: 1/1; box-shadow: var(--shadow-md); border: 4px solid var(--bg); }
.hero-collage__pill {
  position:absolute; top:40%; left:-8%;
  background: var(--bg-elev); border: 1px solid var(--line);
  border-radius: var(--r-pill); padding: 10px 16px;
  box-shadow: var(--shadow-md); font-size: 13px;
  display:flex; align-items:center; gap: 8px; white-space: nowrap;
}
.hero-collage__pill .dot {
  width:8px; height:8px; border-radius:50%; background: var(--success);
  box-shadow: 0 0 0 4px color-mix(in oklch, var(--success) 25%, transparent);
}

.stats-band { padding: 32px 0; border-top:1px solid var(--line-soft); border-bottom:1px solid var(--line-soft); }
.stats-band__grid { display:grid; grid-template-columns: repeat(4, 1fr); gap: 32px; }
.stat-num { font-family: var(--font-display); font-size: 36px; line-height: 1; }
.stat-label {
  font-size: 12px; color: var(--ink-3); margin-top:6px;
  font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.08em;
}

.grid-cats { display:grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.cat-tile { position:relative; aspect-ratio: 1/1; overflow:hidden; display:block; text-decoration:none; }
.cat-tile--feature { aspect-ratio: 1/1.4; grid-row: span 2; }
.cat-tile__overlay { position:absolute; inset:0; background: linear-gradient(to top, rgba(20,15,10,.7), rgba(20,15,10,.1) 60%); }
.cat-tile__body { position:absolute; bottom:0; left:0; right:0; padding: 18px; color: #fff; }
.cat-tile__body h3 { color:#fff; }
.cat-tile__count { font-size: 12px; color: rgba(255,255,255,.78); font-family: var(--font-mono); }

.featured-grid { display:grid; grid-template-columns: 1.2fr 1fr 1fr; gap: 20px; }
.featured-card { cursor:pointer; }
.featured-card__media { position: relative; overflow:hidden; height: 100%; }
.featured-card__grad { position:absolute; inset:0; background: linear-gradient(to top, rgba(20,15,10,.6), transparent 50%); }
.featured-card__caption { position:absolute; bottom:0; left:0; right:0; padding: 24px; color: #fff; }
.featured-card__meta { display:flex; gap:14px; margin-top:8px; font-size: 13px; opacity:.92; color: #fff; }

.promo-banner {
  display:grid; grid-template-columns: 1fr 1fr;
  background: var(--accent); color: #fff;
  border-radius: var(--r-xl); overflow:hidden; min-height: 320px;
}
.promo-banner__body { padding: 56px; display:flex; flex-direction:column; justify-content:center; }
.promo-banner__body h2 { font-size: 40px; color:#fff; margin-top: 12px; margin-bottom: 16px; }
.promo-banner__body p { color: rgba(255,255,255,.85); font-size: 16px; margin-bottom: 24px; max-width: 380px; }
.promo-banner__actions { display:flex; gap:12px; }

.trending-grid { display:grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }

.manifesto {
  font-family: var(--font-display);
  font-size: clamp(28px, 3.5vw, 44px);
  line-height: 1.25; margin-top: 24px; letter-spacing: -0.01em;
}
.manifesto__sig {
  margin-top: 32px; color: var(--ink-3);
  font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.08em;
}

@media (max-width: 960px) {
  .home-hero__grid { grid-template-columns: 1fr; }
  .hero-collage { margin: 0 auto; }
  .stats-band__grid { grid-template-columns: repeat(2, 1fr); }
  .grid-cats { grid-template-columns: repeat(2, 1fr); }
  .featured-grid { grid-template-columns: 1fr; }
  .promo-banner { grid-template-columns: 1fr; }
  .trending-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
