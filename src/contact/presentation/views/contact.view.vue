<template>
  <div class="page-enter">
    <section class="section">
      <div class="wrap">
        <div class="contact-grid">
          <div>
            <span class="eyebrow">Hablemos</span>
            <h1 style="font-size:clamp(40px,5vw,64px);margin-top:12px;line-height:1;letter-spacing:-0.02em">
              Cuéntanos en qué podemos ayudar.
            </h1>
            <p style="color:var(--ink-2);font-size:16px;margin-top:18px;margin-bottom:40px;max-width:380px">
              Respondemos en menos de 24 horas (días hábiles). También puedes escribirnos directo.
            </p>
            <div style="display:grid;gap:18px">
              <div v-for="l in contactLines" :key="l.k" class="contact-line">
                <span class="contact-line__k">{{ l.k }}</span>
                <span style="font-size:16px">{{ l.v }}</span>
              </div>
            </div>
          </div>
          <article class="contact-form-card">
            <div v-if="sent" style="text-align:center;padding:32px 0">
              <div class="contact-success"><PfIcon name="check"/></div>
              <h3 style="font-size:28px">Mensaje recibido</h3>
              <p style="color:var(--ink-2);margin-top:12px;max-width:320px;margin-inline:auto">
                Gracias, {{ name.split(' ')[0] || 'amig@' }}. Te responderemos a {{ email }} cuanto antes.
              </p>
              <RouterLink class="btn btn--ghost" style="margin-top:24px" to="/">Volver al inicio</RouterLink>
            </div>
            <form v-else @submit.prevent="sent = true" style="display:grid;gap:16px">
              <h3 style="font-size:24px;margin-bottom:8px">Escríbenos</h3>
              <div><label class="field-label">Nombre</label><input class="input input--lg" v-model="name" required/></div>
              <div><label class="field-label">Correo</label><input class="input input--lg" type="email" v-model="email" required/></div>
              <div><label class="field-label">Tema</label>
                <select class="select" v-model="topic">
                  <option value="partnership">Quiero registrar mi negocio</option>
                  <option value="press">Prensa / colaboración</option>
                  <option value="bug">Reportar un problema</option>
                  <option value="other">Otro</option>
                </select>
              </div>
              <div><label class="field-label">Mensaje</label>
                <textarea class="textarea" rows="5" v-model="msg" required placeholder="Cuéntanos un poco más…"/>
              </div>
              <button type="submit" class="btn btn--accent btn--lg" style="margin-top:8px"
                :disabled="!name || !email || !msg">Enviar mensaje</button>
            </form>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import PfIcon from '@/shared/presentations/components/pf-icon.vue';
export default {
  name: 'ContactView',
  components: { PfIcon },
  data: () => ({
    name: '', email: '', topic: 'partnership', msg: '', sent: false,
    contactLines: [
      { k:'Email', v:'hola@pointflavor.pe' },
      { k:'Soporte', v:'ayuda@pointflavor.pe' },
      { k:'Prensa', v:'prensa@pointflavor.pe' },
      { k:'Oficina', v:'Calle Berlín 442 · Miraflores, Lima 15074' },
      { k:'Horario', v:'Lun a Vie · 09:00 — 18:00' },
    ]
  })
};
</script>
<style scoped>
.contact-grid { display:grid; grid-template-columns: 1fr 1.2fr; gap: 80px; align-items: start; }
.contact-line {
  display:grid; grid-template-columns: 120px 1fr; align-items: baseline; gap: 16px;
  padding-bottom: 18px; border-bottom: 1px solid var(--line-soft);
}
.contact-line__k {
  font-size: 12px; color: var(--ink-3);
  font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.08em;
}
.contact-form-card {
  padding: 40px; border-radius: var(--r-xl);
  background: var(--bg-elev); border: 1px solid var(--line-soft);
  box-shadow: var(--shadow-md);
}
.contact-success {
  width:56px; height:56px; border-radius:50%;
  background: var(--accent); color:#fff;
  display:grid; place-items:center; margin-inline:auto; margin-bottom: 24px;
}
@media (max-width: 960px) { .contact-grid { grid-template-columns: 1fr; gap: 40px; } }
</style>
