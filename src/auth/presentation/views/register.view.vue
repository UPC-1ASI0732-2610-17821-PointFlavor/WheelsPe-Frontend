<template>
  <div class="page-enter">
    <AuthLayout
      subtitle="Únete"
      title="Tu próxima comida memorable empieza aquí."
      aside-title="No es una app de delivery. Es un mapa de cocinas con alma."
      aside-text="Te tomará menos de un minuto. Sin spam, sin promesas vacías."
      :aside-img="asideImg">
      <form @submit.prevent="submit" style="display:grid;gap:14px">
        <div>
          <label class="field-label">Nombre</label>
          <input class="input input--lg" v-model="name" placeholder="¿Cómo te llamas?"/>
        </div>
        <div>
          <label class="field-label">Correo</label>
          <input class="input input--lg" type="email" v-model="email" placeholder="tu@correo.com" required/>
        </div>
        <div>
          <label class="field-label">Contraseña</label>
          <input class="input input--lg" type="password" v-model="pass" placeholder="Mínimo 8 caracteres" required/>
          <div class="pwd-bar"><div :style="{ width: Math.min(pass.length * 12, 100) + '%' }"/></div>
        </div>
        <label style="display:flex;gap:10px;align-items:flex-start;font-size:13px;color:var(--ink-2);margin-top:4px">
          <input type="checkbox" v-model="accept" style="accent-color:var(--accent);margin-top:3px"/>
          Acepto los términos y la política de privacidad. Quiero recibir el newsletter mensual con curaduría.
        </label>
        <p v-if="error" style="color:var(--danger);font-size:13px">{{ error }}</p>
        <button type="submit" class="btn btn--accent btn--lg" style="width:100%;margin-top:8px"
          :disabled="!email || !pass || !accept || busy">
          {{ busy ? 'Creando…' : 'Crear cuenta' }}
        </button>
        <p style="font-size:14px;color:var(--ink-2);text-align:center;margin-top:12px">
          ¿Ya tienes cuenta?
          <RouterLink to="/auth" style="color:var(--accent);font-weight:500">Ingresar</RouterLink>
        </p>
      </form>
    </AuthLayout>
  </div>
</template>
<script>
import AuthLayout from '../components/auth-layout.vue';
import { registerUseCase } from '@/auth/application/register.usecase.js';

const imgMap = import.meta.glob('/src/assets/*.{png,jpg,jpeg,webp}', { eager: true, query: '?url', import: 'default' });
const IMG = Object.fromEntries(Object.entries(imgMap).map(([p, url]) => [p.split('/').pop().toLowerCase(), url]));

export default {
  name: 'RegisterView',
  components: { AuthLayout },
  data: () => ({
    name: '', email: '', pass: '',
    accept: true, busy: false, error: '',
    asideImg: IMG['h-lamarina.jpg'] || IMG['la_marina.jpg']
  }),
  methods: {
    async submit() {
      this.error = '';
      this.busy = true;
      try {
        await registerUseCase({ name: this.name || this.email.split('@')[0], email: this.email });
        window.dispatchEvent(new CustomEvent('ps-session-updated'));
        this.$router.push('/role');
      } catch (e) {
        this.error = e?.message || 'No se pudo crear la cuenta';
      } finally {
        this.busy = false;
      }
    }
  }
};
</script>
<style scoped>
.pwd-bar { height: 4px; background: var(--bg-soft); border-radius: 4px; margin-top: 8px; }
.pwd-bar > div { height: 100%; background: var(--accent); border-radius: 4px; transition: width .2s ease; }
</style>
