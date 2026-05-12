<template>
  <div class="page-enter">
    <section class="section">
      <div class="wrap">
        <div style="text-align:center;max-width:720px;margin-inline:auto;margin-bottom:56px">
          <span class="eyebrow">Planes</span>
          <h1 style="font-size:clamp(44px,5vw,72px);margin-top:12px;line-height:1;letter-spacing:-0.02em">
            Elige cómo quieres comer.
          </h1>
          <p style="color:var(--ink-2);font-size:17px;margin-top:18px">
            Sin permanencias. Cancelas cuando quieras. La curaduría es la misma: honesta y hecha por personas.
          </p>
          <div class="billing-toggle">
            <button :class="{ on: billing==='monthly' }" @click="billing='monthly'">Mensual</button>
            <button :class="{ on: billing==='yearly' }" @click="billing='yearly'">
              Anual <span class="badge badge--accent" style="font-size:10px;padding:2px 8px">-20%</span>
            </button>
          </div>
        </div>

        <div class="plans-grid">
          <article v-for="p in plans" :key="p.id" :class="['plan-card', p.highlight && 'highlight']">
            <div v-if="p.highlight" class="plan-card__tag">{{ p.tag }}</div>
            <span v-if="!p.highlight" class="eyebrow">{{ p.tag }}</span>
            <h3>{{ p.name }}</h3>
            <p class="plan-card__desc">{{ p.desc }}</p>
            <div class="plan-card__price">
              <span class="plan-card__num">S/{{ billing==='yearly' ? Math.round(p.price.yearly/12) : p.price.monthly }}</span>
              <span class="plan-card__per">/mes</span>
            </div>
            <div v-if="billing==='yearly' && p.price.yearly > 0" class="plan-card__yearly">
              S/{{ p.price.yearly }} cobrado anualmente
            </div>
            <button class="btn plan-card__cta" :class="{ muted: p.muted, on: p.highlight }"
              :disabled="p.muted" @click="goPay(p)">{{ p.cta }}</button>
            <div class="plan-card__sep"/>
            <span class="eyebrow">Incluye</span>
            <ul class="plan-card__features">
              <li v-for="f in p.features" :key="f">
                <PfIcon name="check"/> <span>{{ f }}</span>
              </li>
            </ul>
          </article>
        </div>

        <div style="margin-top:64px;text-align:center">
          <p style="color:var(--ink-2);font-size:14px">
            ¿Tienes un equipo o empresa?
            <RouterLink to="/contact" style="color:var(--accent);font-weight:500">Hablemos →</RouterLink>
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import PfIcon from '@/shared/presentations/components/pf-icon.vue';
export default {
  name: 'PlansView',
  components: { PfIcon },
  data: () => ({
    billing: 'monthly',
    plans: [
      { id:'free', name:'Curioso', price:{monthly:0,yearly:0}, tag:'Para empezar',
        desc:'Explora el mapa de huariques sin compromisos.',
        features:['+1.800 huariques','Reseñas de la comunidad','Búsqueda por barrio','Listas curadas (1 al mes)'],
        cta:'Plan actual', muted: true },
      { id:'pro', name:'Sibarita', price:{monthly:24,yearly:228}, tag:'Más popular',
        desc:'Para quien come fuera con frecuencia y quiere ahorrar.', highlight: true,
        features:['Todo lo del plan Curioso','Promos exclusivas (hasta 30% off)','Reservas con prioridad','Listas curadas semanales','Sin anuncios'],
        cta:'Suscribirme' },
      { id:'foodie', name:'Foodie Pro', price:{monthly:49,yearly:468}, tag:'Para acompañantes',
        desc:'Beneficios para ti y para una persona acompañante.',
        features:['Todo lo del plan Sibarita','2 cuentas vinculadas','Acceso a eventos exclusivos','Curador personal vía chat','Cancelación gratuita en reservas'],
        cta:'Probar 14 días' }
    ]
  }),
  methods: {
    goPay(p) {
      if (p.muted) return;
      this.$router.push({ name: 'payment', params: { planId: p.id }, query: { billing: this.billing } });
    }
  }
};
</script>
<style scoped>
.billing-toggle {
  display: inline-flex; margin-top: 28px; padding: 4px;
  background: var(--bg-soft); border-radius: var(--r-pill);
}
.billing-toggle button {
  padding: 10px 18px; border-radius: var(--r-pill); border: none;
  font-size: 14px; font-weight: 500; cursor: pointer;
  background: transparent; display:flex; align-items:center; gap: 8px;
}
.billing-toggle button.on { background: var(--bg-elev); box-shadow: var(--shadow-sm); }

.plans-grid { display:grid; grid-template-columns: repeat(3, 1fr); gap:20px; }
.plan-card {
  padding: 32px; border-radius: var(--r-xl);
  background: var(--bg-elev); color: var(--ink);
  border: 1px solid var(--line-soft); position: relative;
}
.plan-card.highlight { background: var(--ink); color: #fff; border-color: var(--ink); box-shadow: var(--shadow-lg); }
.plan-card.highlight h3, .plan-card.highlight .plan-card__num { color: #fff; }
.plan-card.highlight .plan-card__desc { color: rgba(255,255,255,.7); }
.plan-card.highlight .plan-card__per, .plan-card.highlight .plan-card__yearly { color: rgba(255,255,255,.55); }
.plan-card.highlight .eyebrow { color: rgba(255,255,255,.6); }
.plan-card__tag {
  position:absolute; top: -12px; left: 32px;
  padding: 4px 12px; border-radius: var(--r-pill);
  background: var(--accent); color: #fff;
  font-size: 11px; font-family: var(--font-mono);
  text-transform: uppercase; letter-spacing: 0.08em;
}
.plan-card h3 { font-size: 32px; margin-top: 6px; }
.plan-card__desc { color: var(--ink-2); font-size: 14px; margin-top: 8px; margin-bottom: 24px; min-height: 40px; }
.plan-card__price { display:flex; align-items:baseline; gap:6px; margin-bottom: 24px; }
.plan-card__num { font-family: var(--font-display); font-size: 56px; line-height: 1; letter-spacing: -0.02em; }
.plan-card__per { font-size: 13px; color: var(--ink-3); }
.plan-card__yearly { font-size:12px; color: var(--ink-3); font-family: var(--font-mono); margin-bottom: 24px; margin-top: -12px; }
.plan-card__cta { width: 100%; margin-bottom: 28px; background: var(--accent); color: #fff; border:none; }
.plan-card__cta.on { background: #fff; color: var(--ink); }
.plan-card__cta.muted { background: transparent; color: var(--ink-2); border: 1px solid var(--line); }
.plan-card__sep { height:1px; background: var(--line-soft); margin-bottom: 20px; }
.plan-card.highlight .plan-card__sep { background: rgba(255,255,255,.12); }
.plan-card__features { list-style:none; padding:0; margin: 12px 0 0; display:grid; gap: 10px; }
.plan-card__features li { display:flex; gap:10px; align-items:flex-start; font-size: 14px; color: var(--ink-2); }
.plan-card.highlight .plan-card__features li { color: rgba(255,255,255,.85); }
.plan-card.highlight .plan-card__features svg { color: #fff; }
.plan-card__features svg { color: var(--accent); margin-top: 3px; flex-shrink: 0; }
@media (max-width: 960px) { .plans-grid { grid-template-columns: 1fr; } }
</style>
