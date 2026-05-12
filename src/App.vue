<template>
  <nav class="nav">
    <div class="nav__inner">
      <RouterLink class="nav__brand" to="/">
        <PfIcon name="brand" :size="26" style="color: var(--accent)"/>
        <span>PointFlavor</span>
      </RouterLink>

      <button class="nav__toggle" type="button" aria-label="Abrir menú"
        :aria-expanded="menuOpen ? 'true' : 'false'" @click="toggleMenu">
        <span></span><span></span><span></span>
      </button>

      <div id="main-menu" :class="['nav__menu', menuOpen && 'nav__menu--open']">
        <RouterLink to="/">Inicio</RouterLink>
        <RouterLink to="/categories">Categorías</RouterLink>
        <RouterLink to="/map">Explorar</RouterLink>
        <RouterLink to="/promos">Promos</RouterLink>
        <RouterLink to="/plans">Planes</RouterLink>
        <RouterLink to="/contact">Contacto</RouterLink>

        <div class="nav__actions">
          <LanguageSwitcher inline />
          <template v-if="!isLoggedIn">
            <RouterLink class="btn btn--ghost btn--sm" to="/auth" @click="closeAllMenus">Ingresar</RouterLink>
            <RouterLink class="btn btn--accent btn--sm" to="/register" @click="closeAllMenus">Crear cuenta</RouterLink>
          </template>

          <template v-else>
            <div class="user-menu" @click.stop>
              <button class="user-menu__toggle" type="button"
                :aria-expanded="userMenuOpen ? 'true' : 'false'" @click="toggleUserMenu">
                <span class="user-avatar" aria-hidden="true">{{ userInitials }}</span>
                <span>{{ userName }}</span>
              </button>

              <div v-if="userMenuOpen" class="user-menu__panel">
                <RouterLink to="/profile" @click="closeAllMenus">Mi perfil</RouterLink>
                <RouterLink to="/favorites" @click="closeAllMenus">Favoritos</RouterLink>
                <RouterLink to="/preferences" @click="closeAllMenus">Preferencias</RouterLink>
                <RouterLink v-if="isOwner" to="/owner" @click="closeAllMenus">Mi huarique</RouterLink>
                <button class="btn--logout" @click="logout">Salir</button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </nav>

  <RouterView />

  <footer class="footer">
    <div class="wrap">
      <div class="footer__grid">
        <div>
          <div class="nav__brand">
            <PfIcon name="brand" :size="26" style="color: var(--accent)"/>
            <span>PointFlavor</span>
          </div>
          <p style="color:var(--ink-2); font-size:14px; max-width:320px; margin-top:16px;">
            Una guía honesta para comer rico en cualquier barrio del Perú. Sin estrellas falsas, sin atajos.
          </p>
        </div>
        <div>
          <h4>Descubrir</h4>
          <ul>
            <li><RouterLink to="/categories">Categorías</RouterLink></li>
            <li><RouterLink to="/map">Mapa</RouterLink></li>
            <li><RouterLink to="/promos">Promociones</RouterLink></li>
            <li><RouterLink to="/results">Cerca de ti</RouterLink></li>
          </ul>
        </div>
        <div>
          <h4>Cuenta</h4>
          <ul>
            <li><RouterLink to="/auth">Ingresar</RouterLink></li>
            <li><RouterLink to="/register">Crear cuenta</RouterLink></li>
            <li><RouterLink to="/plans">Planes</RouterLink></li>
            <li><RouterLink to="/owner">Para dueños</RouterLink></li>
          </ul>
        </div>
        <div>
          <h4>Compañía</h4>
          <ul>
            <li><RouterLink to="/contact">Contacto</RouterLink></li>
            <li><a href="#" @click.prevent>Términos</a></li>
            <li><a href="#" @click.prevent>Privacidad</a></li>
          </ul>
        </div>
      </div>
      <div class="footer__bottom">
        <span>© 2026 PointFlavor — Hecho en Lima</span>
        <span>v2.0 · Rediseño minimal</span>
      </div>
    </div>
  </footer>
</template>

<script>
import { getSession, clearSession } from '@/auth/application/get-session.query.js';
import LanguageSwitcher from '@/shared/presentations/components/language-switcher.vue';
import PfIcon from '@/shared/presentations/components/pf-icon.vue';

export default {
  name: 'App',
  components: { LanguageSwitcher, PfIcon },
  data: () => ({ session: null, menuOpen: false, userMenuOpen: false }),
  computed: {
    isLoggedIn() { return this.session && this.session.id; },
    isOwner() { return this.session?.role === 'owner'; },
    userName() { return this.session?.name || this.session?.email || 'Usuario'; },
    userInitials() {
      const n = (this.userName || '').trim();
      if (!n) return 'U';
      const parts = n.split(/\s+/);
      const a = (parts[0]?.[0] || '').toUpperCase();
      const b = (parts[1]?.[0] || '').toUpperCase();
      return (a + b) || a || 'U';
    }
  },
  mounted() {
    this.loadSession();
    window.addEventListener('storage', this.loadSession);
    window.addEventListener('ps-session-updated', this.loadSession);
    this._removeAfterEach = this.$router.afterEach(() => {
      setTimeout(() => this.loadSession(), 50);
      this.closeAllMenus();
    });
    document.addEventListener('click', this.handleOutsideClick);
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.loadSession);
    window.removeEventListener('ps-session-updated', this.loadSession);
    document.removeEventListener('click', this.handleOutsideClick);
    if (typeof this._removeAfterEach === 'function') this._removeAfterEach();
  },
  methods: {
    handleOutsideClick() { this.userMenuOpen = false; },
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
      if (this.menuOpen) this.userMenuOpen = false;
    },
    toggleUserMenu() {
      this.userMenuOpen = !this.userMenuOpen;
      if (this.userMenuOpen) this.menuOpen = false;
    },
    closeAllMenus() { this.menuOpen = false; this.userMenuOpen = false; },
    loadSession() { this.session = getSession(); },
    logout() {
      clearSession();
      this.session = null;
      this.closeAllMenus();
      this.$router.push('/');
    }
  }
};
</script>
