<template>
  <div class="page-enter">
    <AuthLayout
      subtitle="Cuenta personal"
      title="Bienvenido de vuelta."
      aside-title="Comer rico es un acto cotidiano. Hagámoslo bien."
      aside-text="Guarda tus favoritos, descubre promos exclusivas y sigue a los curadores que te gustan."
      :aside-img="asideImg">
      <form @submit.prevent="submit" style="display:grid;gap:16px">
        <div>
          <label class="field-label">Correo electrónico</label>
          <input class="input input--lg" type="email" v-model="email" placeholder="tucorreo@ejemplo.com" required/>
        </div>
        <div>
          <label class="field-label" style="display:flex;justify-content:space-between">
            <span>Contraseña</span>
            <RouterLink to="/auth/password-recovery" style="color:var(--accent);font-weight:500">¿Olvidaste tu contraseña?</RouterLink>
          </label>
          <input class="input input--lg" type="password" v-model="pass" required/>
        </div>
        <p v-if="error" style="color:var(--danger);font-size:13px">{{ error }}</p>
        <button type="submit" class="btn btn--accent btn--lg" style="width:100%;margin-top:8px" :disabled="busy">
          {{ busy ? 'Ingresando…' : 'Ingresar' }}
        </button>
        <div class="auth-divider"><hr/><span>o continúa con</span><hr/></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <button type="button" class="btn btn--ghost">Google</button>
          <button type="button" class="btn btn--ghost">Apple</button>
        </div>
        <p style="font-size:14px;color:var(--ink-2);text-align:center;margin-top:16px">
          ¿Aún no tienes cuenta?
          <RouterLink to="/register" style="color:var(--accent);font-weight:500">Crear una</RouterLink>
        </p>
      </form>
    </AuthLayout>
  </div>
</template>
<script>
import AuthLayout from '../components/auth-layout.vue';
import { loginUseCase } from '@/auth/application/login.usecase.js';

const imgMap = import.meta.glob('/src/assets/*.{png,jpg,jpeg,webp}', { eager: true, query: '?url', import: 'default' });
const IMG = Object.fromEntries(Object.entries(imgMap).map(([p, url]) => [p.split('/').pop().toLowerCase(), url]));

export default {
  name: 'LoginView',
  components: { AuthLayout },
  data: () => ({
    email: '',
    pass: '',
    busy: false,
    error: '',
    asideImg: IMG['h-brasero.jpg'] || IMG['elbrasero.jpg']
  }),
  methods: {
    async submit() {
      this.error = '';
      this.busy = true;
      try {
        await loginUseCase(this.email);
        window.dispatchEvent(new CustomEvent('ps-session-updated'));
        this.$router.push('/role');
      } catch (e) {
        this.error = e?.message || 'No se pudo iniciar sesión';
      } finally {
        this.busy = false;
      }
    }
  }
};
</script>
<style scoped>
.auth-divider {
  display:grid; grid-template-columns: 1fr auto 1fr; gap:16px; align-items:center; margin: 12px 0;
  color: var(--ink-3); font-size: 12px;
  font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.1em;
}
.auth-divider hr { border:none; border-top:1px solid var(--line); }
</style>
