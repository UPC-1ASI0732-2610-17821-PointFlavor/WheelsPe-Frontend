<template>
  <div class="page-enter">
    <section style="padding:40px 0;border-bottom:1px solid var(--line-soft);background:var(--bg-soft)">
      <div class="wrap" style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:16px">
        <div>
          <span class="eyebrow">Panel de dueño</span>
          <h1 style="font-size:clamp(32px,4vw,44px);margin-top:8px;line-height:1.05">El Brasero del Maestro</h1>
          <p style="color:var(--ink-2);font-size:15px;margin-top:8px">
            Av. Comandante Espinar 410, Miraflores · Verificado
          </p>
        </div>
        <div style="display:flex;gap:10px">
          <RouterLink class="btn btn--ghost" to="/owner/promos">Mis promos</RouterLink>
          <RouterLink class="btn btn--accent" to="/owner/promos/new">
            <PfIcon name="plus"/> Nueva promo
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="stats-grid">
          <article v-for="s in stats" :key="s.k" class="stat-card">
            <span class="eyebrow">{{ s.k }}</span>
            <div class="stat-card__n">{{ s.v }}</div>
            <div class="stat-card__d" :style="{ color: s.up ? 'var(--success)' : 'var(--warm)' }">
              {{ s.up ? '↑ ' : '· ' }}{{ s.d }}
            </div>
          </article>
        </div>

        <div class="owner-grid">
          <div>
            <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:16px">
              <h2 style="font-size:26px">Reseñas por responder</h2>
              <a href="#" style="color:var(--accent);font-size:14px;font-weight:500">Ver todas →</a>
            </div>
            <div style="display:grid;gap:12px">
              <article v-for="r in reviewsPending" :key="r.id" class="rev-card">
                <header class="rev-card__head">
                  <div><strong>{{ r.who }}</strong>
                    <span style="color:var(--ink-3);font-size:13px;margin-left:8px">· {{ r.when }}</span>
                  </div>
                  <PfStars :value="r.stars"/>
                </header>
                <p style="color:var(--ink-2);font-size:14px;margin-bottom:14px">{{ r.text }}</p>
                <div style="display:flex;gap:8px">
                  <button class="btn btn--soft btn--sm">Responder</button>
                  <button class="btn btn--ghost btn--sm">Marcar como vista</button>
                </div>
              </article>
            </div>
          </div>

          <aside>
            <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:16px">
              <h3 style="font-size:20px">Tus promos</h3>
              <RouterLink class="btn btn--ghost btn--sm" to="/owner/promos">Gestionar</RouterLink>
            </div>
            <div style="display:grid;gap:8px">
              <div v-for="p in promos" :key="p.id" class="op-quick">
                <div style="display:flex;justify-content:space-between;align-items:baseline">
                  <strong style="font-size:14px">{{ p.title }}</strong>
                  <span :class="['badge', p.state==='activa' && 'badge--accent']">{{ p.state }}</span>
                </div>
                <div style="font-size:12px;color:var(--ink-3);margin-top:6px;display:flex;justify-content:space-between">
                  <span>{{ p.end }}</span>
                  <span style="font-family:var(--font-mono)">{{ p.uses }} usos</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import PfIcon from '@/shared/presentations/components/pf-icon.vue';
import PfStars from '@/shared/presentations/components/pf-stars.vue';
export default {
  name: 'OwnerDashboardView',
  components: { PfIcon, PfStars },
  data: () => ({
    stats: [
      { k:'Visitas', v:'1,284', d:'+12% vs sem. pasada', up: true },
      { k:'Reservas', v:'46', d:'+4 esta semana', up: true },
      { k:'Reseñas nuevas', v:'8', d:'2 sin responder', up: false },
      { k:'Rating', v:'4.7', d:'estable', up: true },
    ],
    reviewsPending: [
      { id:1, who:'Diego F.', when:'hace 2 días', stars:4, text:'Buen pollo, pero la atención fue muy lenta un sábado. Volveré entre semana.' },
      { id:2, who:'María Q.', when:'hace 5 días', stars:5, text:'¡La mejor brasa de Lima! El brasero le da un sabor único.' },
    ],
    promos: [
      { id:1, title:'2x1 en cuartos los martes', state:'activa', end:'Vence 28 jun', uses:38 },
      { id:2, title:'10% off para grupos +6', state:'activa', end:'Sin vencimiento', uses:14 },
      { id:3, title:'Combo familia', state:'borrador', end:'—', uses:0 },
    ]
  })
};
</script>
<style scoped>
.stats-grid { display:grid; grid-template-columns: repeat(4, 1fr); gap:16px; margin-bottom: 48px; }
.stat-card { padding: 24px; border-radius: var(--r-lg); background: var(--bg-elev); border: 1px solid var(--line-soft); }
.stat-card__n { font-family: var(--font-display); font-size: 44px; line-height: 1; margin-top: 8px; }
.stat-card__d { margin-top: 10px; font-size: 12px; font-family: var(--font-mono); letter-spacing: 0.05em; }
.owner-grid { display:grid; grid-template-columns: 2fr 1fr; gap: 32px; align-items: start; }
.rev-card { padding: 20px; border-radius: var(--r-lg); border: 1px solid var(--line-soft); background: var(--bg-elev); }
.rev-card__head { display:flex; justify-content:space-between; align-items:center; margin-bottom: 10px; }
.op-quick { padding: 16px; border-radius: var(--r-md); border: 1px solid var(--line-soft); background: var(--bg-elev); }
@media (max-width: 960px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .owner-grid { grid-template-columns: 1fr; }
}
</style>
