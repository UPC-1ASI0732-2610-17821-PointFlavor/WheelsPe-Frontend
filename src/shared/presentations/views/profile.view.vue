<template>
  <div class="page-enter">
    <section class="section">
      <div class="wrap">
        <div class="profile-layout">
          <aside class="profile-side">
            <div class="profile-avatar">{{ initials }}</div>
            <h2 style="font-size:26px;line-height:1.1">{{ name }}</h2>
            <p style="color:var(--ink-2);font-size:14px;margin-top:4px">
              <template v-if="isOwner">Dueño · </template>Miembro desde 2024
            </p>
            <div style="display:grid;gap:8px;margin-top:20px">
              <button class="btn btn--soft btn--sm">Editar perfil</button>
              <RouterLink class="btn btn--ghost btn--sm" to="/preferences">Preferencias</RouterLink>
            </div>
          </aside>

          <div style="display:grid;gap:40px">
            <div>
              <span class="eyebrow">Tu actividad este año</span>
              <div class="activity-grid">
                <div class="activity-card"><div class="n">{{ favs.length }}</div><div class="l">Favoritos</div></div>
                <div class="activity-card"><div class="n">14</div><div class="l">Reseñas</div></div>
                <div class="activity-card"><div class="n">38</div><div class="l">Visitas</div></div>
                <div class="activity-card"><div class="n">6</div><div class="l">Distritos</div></div>
              </div>
            </div>

            <div>
              <div class="section-head">
                <div>
                  <span class="eyebrow" style="margin-bottom:10px;display:block">Tu lista</span>
                  <h2>Últimos guardados</h2>
                </div>
                <RouterLink class="btn btn--ghost btn--sm" to="/favorites">Ver todos <PfIcon name="arrow"/></RouterLink>
              </div>
              <div v-if="favs.length" style="display:grid;gap:12px">
                <article v-for="h in favs.slice(0,3)" :key="h.id" class="card profile-fav"
                  @click="$router.push({ name:'huarique-detail', params:{ id: h.id } })">
                  <div class="profile-fav__img"><PfSmartImg :src="h.img" :alt="h.name"/></div>
                  <div style="flex:1">
                    <span class="eyebrow">{{ h.category }}</span>
                    <div style="font-size:18px;font-family:var(--font-display);margin-top:2px">{{ h.name }}</div>
                    <div style="font-size:13px;color:var(--ink-2);margin-top:4px">{{ h.district }} · ★ {{ h.rating }}</div>
                  </div>
                  <PfIcon name="arrow" :style="{ color:'var(--ink-3)' }"/>
                </article>
              </div>
              <p v-else style="color:var(--ink-3);font-size:14px">
                Aún no tienes favoritos.
                <RouterLink to="/results" style="color:var(--accent)">Empezar a explorar →</RouterLink>
              </p>
            </div>

            <div>
              <div class="section-head">
                <div>
                  <span class="eyebrow" style="margin-bottom:10px;display:block">Membresía</span>
                  <h2>Plan actual</h2>
                </div>
              </div>
              <article class="plan-current">
                <div>
                  <span class="badge badge--accent">Sibarita · Premium</span>
                  <h3 style="font-size:24px;margin-top:8px">S/ 24 / mes · Renueva el 15 de junio</h3>
                  <p style="color:var(--ink-2);font-size:14px;margin-top:4px">
                    Acceso a promos exclusivas, reservas prioritarias y curaduría mensual.
                  </p>
                </div>
                <RouterLink class="btn btn--ghost" to="/plans">Cambiar plan</RouterLink>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import { getSession } from '@/auth/application/get-session.query.js';
import { getFavorites } from '@/shared/data/favorites.js';
import PfIcon from '@/shared/presentations/components/pf-icon.vue';
import PfSmartImg from '@/shared/presentations/components/pf-smart-img.vue';

export default {
  name: 'ProfileView',
  components: { PfIcon, PfSmartImg },
  data: () => ({ session: null, favs: [] }),
  computed: {
    name() { return this.session?.name || this.session?.email || 'Tu perfil'; },
    isOwner() { return this.session?.role === 'owner'; },
    initials() {
      const n = (this.name || '').trim();
      const parts = n.split(/\s+/);
      const a = (parts[0]?.[0] || '').toUpperCase();
      const b = (parts[1]?.[0] || '').toUpperCase();
      return (a + b) || a || 'P';
    }
  },
  mounted() {
    this.session = getSession();
    this.favs = getFavorites();
  }
};
</script>
<style scoped>
.profile-layout { display:grid; grid-template-columns: 1fr 2fr; gap: 56px; align-items: start; }
.profile-side {
  padding: 32px; border-radius: var(--r-xl);
  background: var(--bg-elev); border: 1px solid var(--line-soft);
  position: sticky; top: 96px;
}
.profile-avatar {
  width:72px; height:72px; border-radius:50%;
  background: var(--accent); color: var(--accent-ink);
  display:grid; place-items:center;
  font-family: var(--font-mono); font-size: 24px; font-weight: 600;
  margin-bottom: 16px;
}
.activity-grid { display:grid; grid-template-columns: repeat(4, 1fr); gap:16px; margin-top:16px; }
.activity-card { padding: 20px; border-radius: var(--r-lg); background: var(--bg-elev); border: 1px solid var(--line-soft); }
.activity-card .n { font-family: var(--font-display); font-size: 36px; line-height: 1; }
.activity-card .l { font-size: 12px; color: var(--ink-3); margin-top:6px; font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.08em; }

.profile-fav { display:flex; gap:16px; padding:12px; align-items:center; cursor:pointer; }
.profile-fav__img { width:80px; height:80px; border-radius: var(--r-md); overflow:hidden; flex-shrink:0; }

.plan-current {
  padding: 24px; border-radius: var(--r-lg);
  background: var(--bg-soft); border: 1px solid var(--line-soft);
  display:flex; justify-content:space-between; align-items:center; gap: 24px;
}
@media (max-width: 960px) {
  .profile-layout { grid-template-columns: 1fr; }
  .profile-side { position: static; }
  .activity-grid { grid-template-columns: repeat(2, 1fr); }
  .plan-current { flex-direction: column; align-items: flex-start; }
}
</style>
