<template>
  <div class="page-enter" style="padding-top:48px;padding-bottom:48px">
    <div class="wrap">
      <div class="results-toolbar">
        <form class="searchbox" @submit.prevent>
          <PfIcon name="search" :size="18" style="color:var(--ink-3); margin-left:14px"/>
          <input v-model="q" placeholder="Buscar por nombre, plato, distrito…"/>
          <button type="submit" class="btn btn--accent btn--sm">Buscar</button>
        </form>
        <div class="results-toolbar__layout">
          <button :class="['btn btn--ghost btn--sm', layout==='grid' && 'chip--on']" @click="layout='grid'">Grid</button>
          <button :class="['btn btn--ghost btn--sm', layout==='row' && 'chip--on']" @click="layout='row'">Lista</button>
        </div>
      </div>

      <div class="results-layout">
        <aside class="results-sidebar">
          <h4 class="results-sidebar__h">Categorías</h4>
          <div class="results-sidebar__list">
            <button class="filter-chip" :class="{ on: cat==='all' }" @click="cat='all'">
              <span><span v-if="cat==='all'" class="dot"/> Todas</span>
            </button>
            <button v-for="c in cats" :key="c.id" class="filter-chip" :class="{ on: cat===c.id }" @click="cat=c.id">
              <span><span v-if="cat===c.id" class="dot"/> {{ c.name }}</span>
              <span class="count">{{ c.count }}</span>
            </button>
          </div>

          <h4 class="results-sidebar__h">Distrito</h4>
          <select v-model="district" class="select" style="margin-bottom:24px">
            <option v-for="d in districts" :key="d" :value="d">{{ d === 'all' ? 'Todos' : d }}</option>
          </select>

          <h4 class="results-sidebar__h">Precio máximo</h4>
          <input type="range" min="15" max="80" step="1" v-model.number="priceMax" style="width:100%;accent-color:var(--accent)"/>
          <div class="price-scale">
            <span>S/15</span><span style="color:var(--ink);font-weight:600">S/{{ priceMax }}</span><span>S/80</span>
          </div>
        </aside>

        <div>
          <div class="results-head">
            <h2 style="font-size:32px">
              <template v-if="q">Resultados para <em style="color:var(--accent)">"{{ q }}"</em></template>
              <template v-else>Todos los huariques</template>
              <span class="results-count">{{ results.length }}</span>
            </h2>
            <select v-model="sort" class="select" style="width:auto">
              <option value="rating">Mejor calificados</option>
              <option value="price">Precio menor</option>
              <option value="reviews">Más reseñas</option>
            </select>
          </div>

          <div v-if="results.length === 0" class="empty-state">
            <h3 style="font-size:24px;margin-bottom:8px">Nada coincide aún</h3>
            <p style="color:var(--ink-2);margin-bottom:20px">Probá con otro término o ajusta los filtros.</p>
            <button class="btn btn--accent" @click="clearFilters">Limpiar filtros</button>
          </div>

          <div v-else class="results-grid" :class="`results-grid--${layout}`">
            <PfHuariqueCard v-for="h in results" :key="h.id" :h="h" :layout="layout"
              :is-fav="favIds.includes(h.id)"
              @open="goDetail(h.id)"
              @toggle-fav="toggleFav"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import PfIcon from '@/shared/presentations/components/pf-icon.vue';
import PfHuariqueCard from '@/shared/presentations/components/pf-huarique-card.vue';
import { listHuariquesQuery } from '@/discovery/application/list-huariques.query.js';
import { listCategoriesQuery } from '@/discovery/application/list-categories.query.js';
import { getFavIdsQuery, toggleFavoriteUseCase } from '@/discovery/application/favorites.queries.js';

export default {
  name: 'ResultsView',
  components: { PfIcon, PfHuariqueCard },
  data() {
    return {
      q: this.$route.query.q || '',
      cat: this.$route.query.cat || 'all',
      sort: 'rating',
      layout: 'grid',
      district: 'all',
      priceMax: 80,
      cats: [],
      huariques: [],
      favIds: [],
      loading: true
    };
  },
  computed: {
    districts() {
      return ['all', ...new Set(this.huariques.map(h => h.district))];
    },
    results() {
      let r = this.huariques.slice();
      if (this.q) {
        const qn = this.q.toLowerCase();
        r = r.filter(h =>
          h.name.toLowerCase().includes(qn) ||
          h.category.toLowerCase().includes(qn) ||
          h.district.toLowerCase().includes(qn) ||
          h.tags.some(t => t.toLowerCase().includes(qn))
        );
      }
      if (this.cat !== 'all') r = r.filter(h => h.cat === this.cat);
      if (this.district !== 'all') r = r.filter(h => h.district === this.district);
      r = r.filter(h => h.price <= this.priceMax);
      if (this.sort === 'rating')  r.sort((a,b)=>b.rating - a.rating);
      if (this.sort === 'price')   r.sort((a,b)=>a.price - b.price);
      if (this.sort === 'reviews') r.sort((a,b)=>b.reviews - a.reviews);
      return r;
    }
  },
  watch: {
    '$route.query.q'(v) { this.q = v || ''; },
    '$route.query.cat'(v) { this.cat = v || 'all'; }
  },
  mounted() { this.favIds = getFavIds(); },
  methods: {
    goDetail(id) { this.$router.push({ name: 'huarique-detail', params: { id } }); },
    toggleFav(h) { this.favIds = toggleFavorite(h); },
    clearFilters() { this.q=''; this.cat='all'; this.district='all'; this.priceMax=80; }
  }
};
</script>
<style scoped>
.results-toolbar { display:grid; grid-template-columns: 1fr auto; gap: 16px; align-items: center; margin-bottom: 28px; }
.results-toolbar__layout { display: flex; gap: 8px; }
.searchbox {
  display:flex; align-items:center; gap:8px;
  background: var(--bg-elev); border:1px solid var(--line);
  border-radius: var(--r-pill); padding: 4px 4px 4px 8px;
  box-shadow: var(--shadow-sm);
}
.searchbox input { flex:1; border:none; outline:none; background:transparent; padding: 10px 6px; font-size: 14px; }
.results-layout { display:grid; grid-template-columns: 260px 1fr; gap: 40px; align-items: start; }
.results-sidebar {
  position: sticky; top: 96px;
  padding: 24px; border-radius: var(--r-lg);
  background: var(--bg-elev); border:1px solid var(--line-soft);
}
.results-sidebar__h {
  font-family: var(--font-sans); font-size: 12px; font-weight: 600;
  letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-3);
  margin-bottom: 14px;
}
.results-sidebar__list { display:flex; flex-direction:column; gap: 4px; margin-bottom: 24px; }
.filter-chip {
  display:flex; justify-content:space-between; align-items:center;
  padding: 9px 12px; border-radius: var(--r-sm);
  background: transparent; color: var(--ink-2);
  border:none; text-align:left; font-size: 14px; cursor: pointer;
}
.filter-chip:hover { background: var(--bg-soft); }
.filter-chip.on { background: var(--bg-soft); color: var(--ink); font-weight: 600; }
.filter-chip .dot { display:inline-block; width:6px; height:6px; border-radius:50%; background: var(--accent); margin-right:6px; }
.filter-chip .count { font-size: 11px; color: var(--ink-3); font-family: var(--font-mono); }

.price-scale { display:flex; justify-content:space-between; font-size:12px; color: var(--ink-3); font-family: var(--font-mono); }

.results-head { display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px; }
.results-count { font-family: var(--font-mono); font-size: 13px; color: var(--ink-3); margin-left: 12px; font-style: normal; font-weight: 400; }

.results-grid--grid { display:grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.results-grid--row { display:grid; grid-template-columns: 1fr; gap: 14px; }

.empty-state { text-align:center; padding: 80px 24px; border:1px dashed var(--line); border-radius: var(--r-lg); background: var(--bg-soft); }

@media (max-width: 960px) {
  .results-layout { grid-template-columns: 1fr; }
  .results-sidebar { position: static; }
  .results-grid--grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
