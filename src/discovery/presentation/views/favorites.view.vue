<template>
  <div class="page-enter">
    <section class="section">
      <div class="wrap">
        <div class="section-head">
          <div>
            <span class="eyebrow" style="margin-bottom:10px;display:block">Tu colección</span>
            <h2>Favoritos.</h2>
            <p v-if="favs.length === 0">Aún no has guardado ningún huarique. Toca el corazón para empezar.</p>
            <p v-else>{{ favs.length }} {{ favs.length === 1 ? 'lugar guardado' : 'lugares guardados' }}.</p>
          </div>
        </div>

        <div v-if="favs.length === 0" class="empty-state">
          <h3 style="font-size:24px;margin-bottom:8px">Tu lista está esperando</h3>
          <p style="color:var(--ink-2);margin-bottom:20px">Guarda los lugares que quieras visitar y los tendrás siempre a mano.</p>
          <RouterLink class="btn btn--accent" to="/results">Explorar huariques</RouterLink>
        </div>

        <div v-else class="favs-grid">
          <PfHuariqueCard v-for="h in favs" :key="h.id" :h="h" :is-fav="true"
            @open="$router.push({ name:'huarique-detail', params:{ id: h.id } })"
            @toggle-fav="onToggle"/>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import PfHuariqueCard from '@/shared/presentations/components/pf-huarique-card.vue';
import { getFavorites, toggleFavorite } from '@/shared/data/favorites.js';

export default {
  name: 'FavoritesView',
  components: { PfHuariqueCard },
  data: () => ({ favs: [] }),
  mounted() {
    this.favs = getFavorites();
    window.addEventListener('pf-favs-updated', this.refresh);
  },
  beforeUnmount() { window.removeEventListener('pf-favs-updated', this.refresh); },
  methods: {
    refresh() { this.favs = getFavorites(); },
    onToggle(h) { toggleFavorite(h); this.refresh(); }
  }
};
</script>
<style scoped>
.favs-grid { display:grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.empty-state { text-align:center; padding: 80px 24px; border:1px dashed var(--line); border-radius: var(--r-lg); background: var(--bg-soft); }
@media (max-width: 960px) { .favs-grid { grid-template-columns: repeat(2, 1fr); } }
</style>
