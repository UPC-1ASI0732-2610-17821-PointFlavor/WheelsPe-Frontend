<template>
  <div class="page-enter">
    <section class="section">
      <div class="wrap">
        <RouterLink class="btn btn--ghost btn--sm" to="/owner/promos" style="margin-bottom:16px">
          <PfIcon name="back"/> Volver a promociones
        </RouterLink>
        <span class="eyebrow">Nueva promoción</span>
        <h1 style="font-size:clamp(32px,4vw,48px);margin-top:12px;margin-bottom:32px;line-height:1.05">
          Crea una promo que enganche.
        </h1>

        <div class="new-promo-grid">
          <form style="display:grid;gap:28px" @submit.prevent="publish">
            <section class="pref-block">
              <div class="pref-block__head"><div><h3 style="font-size:24px">Lo básico</h3></div></div>
              <div style="display:grid;gap:14px">
                <div>
                  <label class="field-label">Título</label>
                  <input class="input input--lg" v-model="title" placeholder='Ej. "2x1 en cuartos los martes"'/>
                </div>
                <div>
                  <label class="field-label">Tipo</label>
                  <div style="display:flex;gap:6px;flex-wrap:wrap">
                    <button v-for="t in types" :key="t" type="button"
                      :class="['chip', type===t && 'chip--on']" @click="type=t">
                      <PfIcon v-if="type===t" name="check"/> {{ t }}
                    </button>
                  </div>
                </div>
                <div>
                  <label class="field-label">Descuento ({{ discount }}%)</label>
                  <input type="range" min="5" max="50" step="5" v-model.number="discount" style="width:100%;accent-color:var(--accent)"/>
                  <div class="range-scale"><span>5%</span><span>25%</span><span>50%</span></div>
                </div>
              </div>
            </section>

            <section class="pref-block">
              <div class="pref-block__head"><div><h3 style="font-size:24px">Disponibilidad</h3></div></div>
              <div style="display:grid;gap:14px">
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
                  <div><label class="field-label">Inicia</label><input class="input" type="date" v-model="start"/></div>
                  <div><label class="field-label">Termina</label><input class="input" type="date" v-model="end"/></div>
                </div>
                <div>
                  <label class="field-label">Días aplicables</label>
                  <div style="display:flex;gap:6px;flex-wrap:wrap">
                    <button v-for="[d, lbl] in dayList" :key="d" type="button"
                      :class="['chip', days.includes(d) && 'chip--on']" @click="toggleDay(d)">{{ lbl }}</button>
                  </div>
                </div>
              </div>
            </section>

            <section class="pref-block">
              <div class="pref-block__head"><div><h3 style="font-size:24px">Código de canje</h3></div></div>
              <div>
                <label class="field-label">Código</label>
                <input class="input input--lg" :value="code" @input="code = $event.target.value.toUpperCase()"
                  style="font-family:var(--font-mono);letter-spacing:0.1em;font-size:16px"/>
                <p style="font-size:12px;color:var(--ink-3);margin-top:6px">
                  Los usuarios deberán mostrar este código al pedir.
                </p>
              </div>
            </section>

            <div style="display:flex;gap:12px;padding-top:20px;border-top:1px solid var(--line-soft)">
              <button type="submit" class="btn btn--accent btn--lg">Publicar promoción</button>
              <button type="button" class="btn btn--ghost btn--lg">Guardar borrador</button>
            </div>
          </form>

          <aside style="position:sticky;top:96px">
            <span class="eyebrow">Vista previa</span>
            <article class="card" style="margin-top:12px">
              <div class="preview-media">
                <div class="placeholder" style="width:100%;height:100%">{{ type }}</div>
                <span class="badge badge--accent" style="position:absolute;top:14px;left:14px">{{ type }}</span>
                <div class="preview-disk">
                  <div>
                    <div style="font-family:var(--font-display);font-size:22px;color:var(--accent)">{{ discount }}%</div>
                    <div style="font-size:9px;color:var(--ink-3);font-family:var(--font-mono);text-transform:uppercase;margin-top:2px">off</div>
                  </div>
                </div>
              </div>
              <div style="padding:18px">
                <span class="eyebrow">El Brasero del Maestro · Miraflores</span>
                <h3 style="font-size:18px;margin-top:6px">{{ title || 'Título de tu promoción' }}</h3>
                <div class="preview-foot">
                  <span>{{ code }}</span>
                  <span>{{ days.length }} días/sem</span>
                </div>
              </div>
            </article>
            <div class="tip-box">
              <strong style="color:var(--ink-2);display:block;margin-bottom:6px">Tip</strong>
              Las promos con foto generan 3x más clics. Asegúrate de tener una imagen del plato en alta calidad.
            </div>
          </aside>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import PfIcon from '@/shared/presentations/components/pf-icon.vue';
export default {
  name: 'OwnerPromoNewView',
  components: { PfIcon },
  data: () => ({
    title: '', type: 'descuento', discount: 20,
    start: '2026-05-15', end: '2026-06-30',
    days: ['mar','mie','jue'], code: 'BRASA20',
    types: ['descuento','2x1','menú','happy hour','combo'],
    dayList: [['lun','Lun'],['mar','Mar'],['mie','Mié'],['jue','Jue'],['vie','Vie'],['sab','Sáb'],['dom','Dom']]
  }),
  methods: {
    toggleDay(d) {
      const i = this.days.indexOf(d);
      if (i >= 0) this.days.splice(i, 1); else this.days.push(d);
    },
    publish() { this.$router.push('/owner/promos'); }
  }
};
</script>
<style scoped>
.new-promo-grid { display:grid; grid-template-columns: 1.4fr 1fr; gap: 48px; align-items: start; }
.pref-block__head { display:flex; justify-content:space-between; align-items:baseline; margin-bottom: 16px; }
.range-scale { display:flex; justify-content:space-between; font-size:11px; color:var(--ink-3); font-family: var(--font-mono); }
.preview-media { position:relative; aspect-ratio: 4/3; overflow: hidden; }
.preview-disk {
  position:absolute; bottom:14px; right:14px;
  width:70px; height:70px; border-radius:50%;
  background: var(--bg-elev); display:grid; place-items:center;
  box-shadow: var(--shadow-md); text-align:center; line-height: 1;
}
.preview-foot {
  display:flex; justify-content:space-between; align-items:center;
  padding-top: 12px; border-top: 1px dashed var(--line); margin-top: 12px;
  font-size:12px; color: var(--ink-3);
  font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.06em;
}
.tip-box {
  margin-top: 16px; padding: 16px; border-radius: var(--r-md);
  background: var(--bg-soft); border: 1px dashed var(--line);
  font-size: 12px; color: var(--ink-3); line-height: 1.5;
}
@media (max-width: 960px) { .new-promo-grid { grid-template-columns: 1fr; } }
</style>
