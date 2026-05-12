<template>
  <div class="page-enter">
    <section class="section">
      <div class="wrap-narrow">
        <div style="text-align:center;margin-bottom:56px">
          <span class="eyebrow">Paso 2 de 2</span>
          <h1 style="font-size:clamp(40px,5vw,64px);margin-top:16px;line-height:1.05">
            ¿Cómo vas a usar PointFlavor?
          </h1>
          <p style="color:var(--ink-2);font-size:16px;margin-top:16px;max-width:480px;margin-inline:auto">
            Podrás cambiar esto después. Solo nos ayuda a personalizar tu experiencia.
          </p>
        </div>
        <div class="role-grid">
          <button v-for="r in roles" :key="r.id" :class="['role-card', role===r.id && 'on']" @click="role=r.id">
            <div class="role-card__head">
              <span class="eyebrow" :style="{ color: role===r.id ? 'rgba(255,255,255,.65)' : undefined }">{{ r.label }}</span>
              <span class="role-card__check" :class="{ on: role===r.id }"><PfIcon v-if="role===r.id" name="check"/></span>
            </div>
            <h3 :style="{ fontSize:'28px', lineHeight:1.15, color: role===r.id ? '#fff' : 'var(--ink)' }">{{ r.title }}</h3>
            <p :style="{ color: role===r.id ? 'rgba(255,255,255,.7)' : 'var(--ink-2)', fontSize:'15px', marginTop:'12px', marginBottom:'24px' }">{{ r.desc }}</p>
            <ul class="role-card__perks">
              <li v-for="p in r.perks" :key="p" :style="{ color: role===r.id ? 'rgba(255,255,255,.85)' : 'var(--ink-2)' }">
                <PfIcon name="check" :style="{ color: role===r.id ? '#fff' : 'var(--accent)' }"/>
                {{ p }}
              </li>
            </ul>
          </button>
        </div>
        <div style="display:flex;gap:12px;justify-content:center">
          <button class="btn btn--ghost" @click="$router.push('/')">Saltar por ahora</button>
          <button class="btn btn--accent" @click="continueWith">
            Continuar como {{ role === 'user' ? 'comensal' : 'dueño' }}
          </button>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import PfIcon from '@/shared/presentations/components/pf-icon.vue';
import { getSession, setSession } from '@/auth/application/get-session.query.js';

export default {
  name: 'RoleSelectView',
  components: { PfIcon },
  data: () => ({
    role: 'user',
    roles: [
      { id:'user', label:'Como comensal', title:'Quiero descubrir lugares.',
        desc:'Buscar, guardar favoritos, ver reseñas, conseguir promos.',
        perks:['Acceso a +1.800 huariques','Reseñas de la comunidad','Listas curadas mensuales'] },
      { id:'owner', label:'Como dueño', title:'Tengo un lugar para registrar.',
        desc:'Publica tu local, gestiona promociones y responde reseñas.',
        perks:['Página de tu negocio','Crea promociones','Estadísticas de visitas'] },
    ]
  }),
  methods: {
    continueWith() {
      const s = getSession();
      if (s && typeof setSession === 'function') {
        setSession({ ...s, role: this.role === 'owner' ? 'owner' : 'explorer' });
        window.dispatchEvent(new CustomEvent('ps-session-updated'));
      }
      this.$router.push('/');
    }
  }
};
</script>
<style scoped>
.role-grid { display:grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 32px; }
.role-card {
  text-align: left; cursor:pointer;
  padding: 32px; border-radius: var(--r-xl);
  background: var(--bg-elev); color: var(--ink);
  border: 1px solid var(--line); transition: all .2s ease;
  box-shadow: var(--shadow-sm);
}
.role-card.on { background: var(--ink); color: var(--ink-inv); border-color: var(--ink); box-shadow: var(--shadow-lg); }
.role-card__head { display:flex; justify-content:space-between; align-items:center; margin-bottom: 24px; }
.role-card__check {
  width:22px; height:22px; border-radius:50%;
  border:1px solid var(--line); display:grid; place-items:center;
  background: transparent; color: transparent;
}
.role-card__check.on { background: #fff; color: var(--ink); border-color: rgba(255,255,255,.4); }
.role-card__perks { list-style:none; padding:0; margin:0; display:grid; gap:8px; }
.role-card__perks li { display:flex; gap:10px; align-items:center; font-size:14px; }
@media (max-width: 720px) { .role-grid { grid-template-columns: 1fr; } }
</style>
