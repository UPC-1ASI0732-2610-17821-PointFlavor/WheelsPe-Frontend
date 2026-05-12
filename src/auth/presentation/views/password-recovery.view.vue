<template>
  <div class="page-enter">
    <AuthLayout
      subtitle="Recuperación"
      title="Te enviaremos un enlace seguro."
      aside-title="Olvidar la contraseña pasa. No es problema."
      aside-text="Recibirás un correo con un enlace de un solo uso. Si no lo ves, revisa el spam."
      :aside-img="asideImg">
      <div v-if="sent" class="recovery-success">
        <div class="recovery-success__icon"><PfIcon name="check"/></div>
        <div>
          <h3 style="font-size:18px;color:var(--ink)">Correo enviado</h3>
          <p style="color:var(--ink-2);font-size:14px;margin-top:6px">
            Revisa tu bandeja en <strong>{{ email }}</strong>. El enlace caduca en 30 minutos.
          </p>
          <RouterLink class="btn btn--ghost btn--sm" to="/auth" style="margin-top:16px">Volver a ingresar</RouterLink>
        </div>
      </div>
      <form v-else @submit.prevent="submit" style="display:grid;gap:16px">
        <div>
          <label class="field-label">Correo registrado</label>
          <input class="input input--lg" type="email" v-model="email" placeholder="tu@correo.com" required/>
        </div>
        <p v-if="error" style="color:var(--danger);font-size:13px">{{ error }}</p>
        <button class="btn btn--accent btn--lg" style="width:100%" :disabled="busy">{{ busy ? 'Enviando…' : 'Enviar enlace' }}</button>
        <RouterLink to="/auth" style="text-align:center;color:var(--ink-2);font-size:14px">← Volver</RouterLink>
      </form>
    </AuthLayout>
  </div>
</template>
<script>
import AuthLayout from '../components/auth-layout.vue';
import PfIcon from '@/shared/presentations/components/pf-icon.vue';
import { requestPasswordRecoveryUseCase } from '@/auth/application/request-password-recovery.usecase.js';

const imgMap = import.meta.glob('/src/assets/*.{png,jpg,jpeg,webp}', { eager: true, query: '?url', import: 'default' });
const IMG = Object.fromEntries(Object.entries(imgMap).map(([p, url]) => [p.split('/').pop().toLowerCase(), url]));

export default {
  name: 'PasswordRecoveryView',
  components: { AuthLayout, PfIcon },
  data: () => ({ email: '', sent: false, busy: false, error: '', asideImg: IMG['cafe.jpg'] || IMG['caferef.jpeg'] }),
  methods: {
    async submit() {
      this.error = '';
      this.busy = true;
      try {
        await requestPasswordRecoveryUseCase(this.email);
        this.sent = true;
      } catch (e) {
        this.error = e?.message || 'No se pudo enviar el correo';
      } finally { this.busy = false; }
    }
  }
};
</script>
<style scoped>
.recovery-success {
  padding: 24px; border-radius: var(--r-md);
  background: var(--accent-soft);
  display: flex; gap: 14px; align-items: flex-start;
}
.recovery-success__icon {
  width:36px; height:36px; border-radius:50%;
  background: var(--accent); color:#fff;
  display:grid; place-items:center; flex-shrink:0;
}
</style>
