<template>
  <div class="page-enter">
    <section class="section">
      <div class="wrap">
        <button class="btn btn--ghost btn--sm" @click="$router.push('/plans')" style="margin-bottom:24px">
          <PfIcon name="back"/> Volver a planes
        </button>
        <div class="payment-grid">
          <div>
            <span class="eyebrow">Pago seguro</span>
            <h1 style="font-size:clamp(36px,4vw,52px);margin-top:12px;margin-bottom:24px;line-height:1.05">
              Confirma tu suscripción.
            </h1>
            <div class="payment-tabs">
              <button v-for="t in tabs" :key="t.id" :class="{ on: tab===t.id }" @click="tab=t.id">{{ t.label }}</button>
            </div>

            <form v-if="tab==='card'" @submit.prevent="submit" style="display:grid;gap:16px">
              <div class="card-preview">
                <span class="eyebrow" style="color:rgba(255,255,255,.55)">PointFlavor — {{ planLabel }}</span>
                <div class="card-preview__num">{{ number }}</div>
                <div class="card-preview__foot">
                  <div>
                    <div class="card-preview__l">Titular</div>
                    <div style="margin-top:4px;font-weight:500">{{ name }}</div>
                  </div>
                  <div>
                    <div class="card-preview__l">Vence</div>
                    <div style="margin-top:4px;font-family:var(--font-mono)">{{ expiry }}</div>
                  </div>
                </div>
                <div class="card-preview__chip"/>
              </div>
              <div>
                <label class="field-label">Número de tarjeta</label>
                <input class="input input--lg" v-model="number" maxlength="19"/>
              </div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
                <div><label class="field-label">Vencimiento</label><input class="input input--lg" v-model="expiry" maxlength="5"/></div>
                <div><label class="field-label">CVC</label><input class="input input--lg" v-model="cvc" maxlength="4"/></div>
              </div>
              <div>
                <label class="field-label">Nombre del titular</label>
                <input class="input input--lg" :value="name" @input="name = $event.target.value.toUpperCase()"/>
              </div>
              <button type="submit" class="btn btn--accent btn--lg" style="margin-top:16px">
                Confirmar pago · S/{{ price }}
              </button>
              <p style="font-size:12px;color:var(--ink-3);text-align:center">
                🔒 Procesado por Stripe. PointFlavor no almacena tus datos de tarjeta.
              </p>
            </form>

            <div v-else-if="tab==='yape'" class="alt-pay">
              <div class="alt-pay__qr"/>
              <p style="margin-top:24px;color:var(--ink-2)">Escanea el código con la app de Yape o Plin</p>
              <p style="font-family:var(--font-mono);font-size:22px;margin-top:8px">S/ {{ price }}.00</p>
            </div>

            <div v-else class="alt-pay">
              <p style="color:var(--ink-2)">Te redirigiremos a PayPal para confirmar el pago.</p>
              <button class="btn btn--accent btn--lg" style="margin-top:24px" @click="submit">Continuar con PayPal</button>
            </div>
          </div>

          <aside class="payment-summary">
            <span class="eyebrow">Tu compra</span>
            <h3 style="font-size:24px;margin-top:8px;margin-bottom:24px">Plan {{ planLabel }}</h3>
            <div style="display:grid;gap:12px;font-size:14px;margin-bottom:20px">
              <div class="row"><span>Plan</span><span>{{ planLabel }}</span></div>
              <div class="row"><span>Facturación</span><span>{{ billing==='yearly'?'Anual':'Mensual' }}</span></div>
              <div class="row"><span>Próximo cobro</span><span>15 de junio, 2026</span></div>
              <div class="row"><span>Subtotal</span><span>S/ {{ price }}.00</span></div>
              <div v-if="billing==='yearly'" class="row accent"><span>Descuento anual</span><span>-20%</span></div>
              <div class="row"><span>Impuestos</span><span>Incluidos</span></div>
            </div>
            <div class="payment-summary__total">
              <span style="font-size:15px;font-weight:500">Total hoy</span>
              <span style="font-family:var(--font-display);font-size:32px">S/ {{ price }}</span>
            </div>
            <ul class="payment-summary__perks">
              <li v-for="p in ['Cancela cuando quieras','Garantía 14 días','Soporte humano vía chat']" :key="p">
                <PfIcon name="check" :style="{ color: 'var(--success)' }"/> {{ p }}
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import PfIcon from '@/shared/presentations/components/pf-icon.vue';
export default {
  name: 'PaymentView',
  components: { PfIcon },
  data: () => ({
    tab: 'card',
    number: '4242 4242 4242 4242',
    expiry: '12/27', cvc: '123',
    name: 'CAMILA TORRES',
    tabs: [{id:'card',label:'Tarjeta'},{id:'yape',label:'Yape / Plin'},{id:'paypal',label:'PayPal'}]
  }),
  computed: {
    planId() { return this.$route.params.planId; },
    billing() { return this.$route.query.billing || 'monthly'; },
    planLabel() { return this.planId === 'foodie' ? 'Foodie Pro' : 'Sibarita'; },
    price() {
      if (this.planId === 'foodie') return this.billing === 'yearly' ? 39 : 49;
      return this.billing === 'yearly' ? 19 : 24;
    }
  },
  methods: { submit() { this.$router.push('/'); } }
};
</script>
<style scoped>
.payment-grid { display:grid; grid-template-columns: 1.4fr 1fr; gap: 56px; align-items: start; }
.payment-tabs {
  display:flex; gap:6px; margin-bottom: 24px; padding: 4px;
  background: var(--bg-soft); border-radius: var(--r-md); width: fit-content;
}
.payment-tabs button {
  padding: 8px 14px; border: none; border-radius: var(--r-sm);
  background: transparent; font-size: 13px; font-weight: 500; cursor: pointer;
}
.payment-tabs button.on { background: var(--bg-elev); box-shadow: var(--shadow-sm); }

.card-preview {
  padding: 24px; border-radius: var(--r-lg);
  background: linear-gradient(135deg, var(--ink), oklch(0.30 0.02 70));
  color: #fff; min-height: 200px; position: relative; overflow: hidden;
  box-shadow: var(--shadow-lg);
}
.card-preview__num { font-family: var(--font-mono); font-size: 22px; letter-spacing: 0.1em; margin-top: 32px; margin-bottom: 24px; }
.card-preview__foot { display:flex; justify-content: space-between; font-size: 13px; }
.card-preview__l { font-size:10px; color: rgba(255,255,255,.5); font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.08em; }
.card-preview__chip {
  position: absolute; top: 24px; right: 24px;
  width: 36px; height: 24px; border-radius: 4px;
  background: linear-gradient(135deg, #f9b234, #f55249);
}

.alt-pay { text-align:center; padding: 40px; border-radius: var(--r-lg); border: 1px solid var(--line-soft); }
.alt-pay__qr {
  width: 200px; height: 200px; margin-inline: auto;
  background: #fff; border: 1px solid var(--line); border-radius: var(--r-md);
  background-image:
    linear-gradient(45deg, var(--ink) 25%, transparent 25%),
    linear-gradient(-45deg, var(--ink) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, var(--ink) 75%),
    linear-gradient(-45deg, transparent 75%, var(--ink) 75%);
  background-size: 12px 12px;
  background-position: 0 0, 0 6px, 6px -6px, -6px 0;
}

.payment-summary {
  position: sticky; top: 96px;
  padding: 28px; border-radius: var(--r-xl);
  background: var(--bg-soft); border: 1px solid var(--line-soft);
}
.payment-summary .row { display:flex; justify-content: space-between; }
.payment-summary .row > span:first-child { color: var(--ink-3); }
.payment-summary .row > span:last-child { font-weight: 500; }
.payment-summary .row.accent > span:last-child { color: var(--accent); }
.payment-summary__total { display:flex; justify-content:space-between; align-items:baseline; padding-top: 16px; border-top: 1px solid var(--line); }
.payment-summary__perks { list-style:none; padding:0; margin: 24px 0 0; display:grid; gap:10px; }
.payment-summary__perks li { display:flex; gap:8px; align-items:center; font-size:13px; color: var(--ink-2); }

@media (max-width: 960px) {
  .payment-grid { grid-template-columns: 1fr; }
  .payment-summary { position: static; }
}
</style>
