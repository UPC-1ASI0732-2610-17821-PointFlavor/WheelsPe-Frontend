<template>
  <div class="page-enter">
    <section class="section">
      <div class="wrap">
        <div class="section-head">
          <div>
            <span class="eyebrow" style="margin-bottom:10px;display:block">Categorías</span>
            <h2>¿Qué te provoca hoy?</h2>
            <p>Cada categoría agrupa locales que comparten oficio, no solo ingredientes.</p>
          </div>
        </div>
        <div class="cats-grid">
          <article v-for="c in cats" :key="c.id" class="card cat-card"
            @click="$router.push({ path:'/results', query:{ q: c.name } })">
            <div class="cat-card__media"><PfSmartImg :src="c.img" :alt="c.name" :label="c.id"/></div>
            <div class="cat-card__body">
              <span class="eyebrow">{{ c.count }} lugares</span>
              <h3 style="font-size:24px;margin-top:6px;margin-bottom:8px">{{ c.name }}</h3>
              <p style="color:var(--ink-2);font-size:14px;margin-bottom:16px">{{ c.blurb }}</p>
              <span style="display:inline-flex;align-items:center;gap:6px;font-size:13px;color:var(--accent);font-weight:500">
                Explorar <PfIcon name="arrow"/>
              </span>
            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import { listCategoriesQuery } from '@/discovery/application/list-categories.query.js';
import PfIcon from '@/shared/presentations/components/pf-icon.vue';
import PfSmartImg from '@/shared/presentations/components/pf-smart-img.vue';
export default {
  name: 'CategoriesView',
  components: { PfIcon, PfSmartImg },
  data: () => ({ cats: [] }),
  async mounted() { this.cats = await listCategoriesQuery(); }
};
</script>
<style scoped>
.cats-grid { display:grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.cat-card { cursor:pointer; }
.cat-card__media { aspect-ratio: 4/3; overflow: hidden; }
.cat-card__body { padding: 20px; }
@media (max-width: 960px) { .cats-grid { grid-template-columns: repeat(2, 1fr); } }
</style>
