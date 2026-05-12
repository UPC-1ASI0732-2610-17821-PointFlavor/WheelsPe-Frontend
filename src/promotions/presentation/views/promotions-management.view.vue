<template>
  <div class="page-enter">
    <section class="section">
      <div class="wrap">
        <div class="op-head">
          <div>
            <span class="eyebrow">Promociones</span>
            <h1 style="font-size:clamp(32px,4vw,48px);margin-top:12px;line-height:1.05">Tus promociones</h1>
          </div>
          <RouterLink class="btn btn--accent" to="/owner/promos/new">
            <PfIcon name="plus"/> Nueva promo
          </RouterLink>
        </div>
        <div class="op-table">
          <header class="op-row op-row--head">
            <span>Promo</span><span>Tipo</span><span>Estado</span><span>Vence</span><span>Usos</span><span></span>
          </header>
          <div v-for="p in promos" :key="p.id" class="op-row">
            <strong>{{ p.title }}</strong>
            <span style="color:var(--ink-2)">{{ p.type }}</span>
            <span><span :class="['badge', p.state==='activa' && 'badge--accent']">{{ p.state }}</span></span>
            <span style="color:var(--ink-2);font-family:var(--font-mono);font-size:13px">{{ p.end }}</span>
            <span style="display:flex;align-items:center;gap:8px">
              <span style="font-family:var(--font-mono);font-size:13px">{{ p.uses }}</span>
              <span v-if="p.max > 0 && p.max < 999" class="op-progress">
                <span :style="{ width: (p.uses/p.max)*100 + '%' }"/>
              </span>
            </span>
            <span style="display:flex;gap:6px;justify-content:flex-end">
              <button class="btn btn--ghost btn--sm">Editar</button>
              <button class="btn btn--ghost btn--sm">···</button>
            </span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import PfIcon from '@/shared/presentations/components/pf-icon.vue';
export default {
  name: 'PromotionsManagementView',
  components: { PfIcon },
  data: () => ({
    promos: [
      { id:1, title:'2x1 en cuartos', type:'2x1', state:'activa', end:'28 jun', uses: 38, max: 50 },
      { id:2, title:'10% off para grupos +6', type:'descuento', state:'activa', end:'sin vencer', uses: 14, max: 999 },
      { id:3, title:'Combo familia (4 pers.)', type:'menú', state:'borrador', end:'—', uses: 0, max: 0 },
      { id:4, title:'Happy hour anticuchos', type:'happy hour', state:'pausada', end:'15 may', uses: 92, max: 100 },
    ]
  })
};
</script>
<style scoped>
.op-head { display:flex; justify-content:space-between; align-items:flex-end; margin-bottom: 32px; }
.op-table {
  border: 1px solid var(--line-soft); border-radius: var(--r-lg);
  background: var(--bg-elev); overflow: hidden;
}
.op-row {
  display:grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
  padding: 18px 20px;
  border-bottom: 1px solid var(--line-soft);
  align-items: center; font-size: 14px;
}
.op-row:last-child { border-bottom: none; }
.op-row--head {
  padding: 14px 20px; background: var(--bg-soft);
  font-size: 11px; color: var(--ink-3);
  font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.08em;
}
.op-progress { flex: 1; height: 4px; background: var(--bg-soft); border-radius: 4px; max-width: 60px; display:inline-block; }
.op-progress > span { display: block; height: 100%; background: var(--accent); border-radius: 4px; }
</style>
