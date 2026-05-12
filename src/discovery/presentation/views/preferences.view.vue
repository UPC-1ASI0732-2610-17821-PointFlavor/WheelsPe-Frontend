<template>
  <div class="page-enter">
    <section class="section">
      <div class="wrap-narrow">
        <span class="eyebrow">Configuración</span>
        <h1 style="font-size:clamp(36px,4vw,52px);margin-top:12px;margin-bottom:16px;line-height:1.05">Tus preferencias.</h1>
        <p style="color:var(--ink-2);font-size:16px;margin-bottom:48px;max-width:520px">
          Cuanto mejor te conozcamos, mejor afinaremos las recomendaciones. Esto solo lo usamos nosotros.
        </p>

        <div style="display:grid;gap:40px">
          <section class="pref-block">
            <div class="pref-block__head">
              <div><h3 style="font-size:24px">Cocinas favoritas</h3><p>Marca al menos tres.</p></div>
              <span class="pref-block__count">{{ selected.length }} seleccionadas</span>
            </div>
            <div class="chips-row">
              <button v-for="c in cuisines" :key="c" :class="['chip', selected.includes(c) && 'chip--on']" @click="toggle(selected, c)">
                <PfIcon v-if="selected.includes(c)" name="check"/> {{ c }}
              </button>
            </div>
          </section>

          <section class="pref-block">
            <div class="pref-block__head">
              <div><h3 style="font-size:24px">Ocasión</h3><p>¿Para qué tipo de salidas usas PointFlavor?</p></div>
            </div>
            <div class="chips-row">
              <button v-for="c in occasions" :key="c" :class="['chip', occ.includes(c) && 'chip--on']" @click="toggle(occ, c)">
                <PfIcon v-if="occ.includes(c)" name="check"/> {{ c }}
              </button>
            </div>
          </section>

          <section class="pref-block">
            <div class="pref-block__head"><div><h3 style="font-size:24px">Rango de precio típico</h3></div></div>
            <div class="price-grid">
              <button v-for="(p,i) in prices" :key="p.l" :class="['card price-card', i===priceIdx && 'on']" @click="priceIdx=i">
                <div style="font-family:var(--font-display);font-size:22px">{{ p.l }}</div>
                <div class="price-card__s">{{ p.s }}</div>
              </button>
            </div>
          </section>

          <section class="pref-block">
            <div class="pref-block__head"><div><h3 style="font-size:24px">Notificaciones</h3></div></div>
            <div style="display:grid;gap:14px">
              <div v-for="n in notifications" :key="n.id" class="notif-row">
                <div>
                  <div style="font-weight:500">{{ n.label }}</div>
                  <div style="font-size:13px;color:var(--ink-3);margin-top:2px">{{ n.desc }}</div>
                </div>
                <button :class="['toggle-switch', n.on && 'on']" @click="n.on = !n.on">
                  <span class="toggle-switch__knob"/>
                </button>
              </div>
            </div>
          </section>
        </div>

        <div style="display:flex;gap:12px;margin-top:48px">
          <button class="btn btn--accent" @click="$router.push('/')">Guardar cambios</button>
          <button class="btn btn--ghost" @click="$router.push('/')">Descartar</button>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import PfIcon from '@/shared/presentations/components/pf-icon.vue';
export default {
  name: 'PreferencesView',
  components: { PfIcon },
  data: () => ({
    cuisines: ['Pollo a la brasa','Comida criolla','Comida marina','Chifa','Parrillas','Postres','Café','Italiana','Mexicana','Vegana','Sushi','Anticuchos'],
    occasions: ['Familiar','Romántico','Trabajo','Solo','Amigos','Niños'],
    selected: ['Pollo a la brasa','Comida criolla','Comida marina'],
    occ: ['Familiar','Amigos'],
    prices: [
      { l:'Económico', s:'Hasta S/25' },
      { l:'Moderado', s:'S/25-50' },
      { l:'Generoso', s:'S/50-90' },
      { l:'Sin límite', s:'+ S/90' },
    ],
    priceIdx: 1,
    notifications: [
      { id:1, label:'Promos en mis cocinas favoritas', desc:'Te avisamos cuando un huarique top lance una promo.', on: true },
      { id:2, label:'Newsletter mensual', desc:'Curaduría de la editora, primer viernes de cada mes.', on: true },
      { id:3, label:'Reseñas respondidas', desc:'Cuando un dueño responde tu reseña.', on: false },
    ]
  }),
  methods: {
    toggle(set, val) {
      const i = set.indexOf(val);
      if (i >= 0) set.splice(i, 1); else set.push(val);
    }
  }
};
</script>
<style scoped>
.pref-block__head { display:flex; justify-content:space-between; align-items:baseline; margin-bottom: 16px; }
.pref-block__head p { color: var(--ink-3); font-size: 14px; margin-top: 4px; }
.pref-block__count { font-size: 12px; color: var(--ink-3); font-family: var(--font-mono); }
.chips-row { display:flex; gap:8px; flex-wrap:wrap; }
.price-grid { display:grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
.price-card { padding: 18px; text-align:left; cursor:pointer; }
.price-card.on { background: var(--ink); color: var(--ink-inv); border-color: var(--ink); }
.price-card__s { font-size:12px; color: var(--ink-3); font-family: var(--font-mono); margin-top:4px; }
.price-card.on .price-card__s { color: rgba(255,255,255,.6); }

.notif-row {
  display:flex; justify-content:space-between; align-items:center; gap:16px;
  padding: 14px 16px; border-radius: var(--r-md); border: 1px solid var(--line-soft);
}
.toggle-switch {
  width:44px; height:24px; border-radius: 24px;
  background: var(--line); border:none; position:relative;
  cursor:pointer; transition: background .2s ease;
}
.toggle-switch.on { background: var(--accent); }
.toggle-switch__knob {
  position:absolute; top:3px; left:3px;
  width:18px; height:18px; border-radius:50%; background:#fff;
  transition: left .2s ease; box-shadow: 0 1px 2px rgba(0,0,0,.2);
}
.toggle-switch.on .toggle-switch__knob { left: 23px; }
@media (max-width: 720px) { .price-grid { grid-template-columns: repeat(2, 1fr); } }
</style>
