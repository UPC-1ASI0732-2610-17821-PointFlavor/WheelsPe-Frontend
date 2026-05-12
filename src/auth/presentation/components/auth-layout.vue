<template>
  <div class="auth-layout">
    <div class="auth-layout__form">
      <div style="width:100%;max-width:420px">
        <div style="margin-bottom:40px;color:var(--accent)"><PfIcon name="brand" :size="32"/></div>
        <span class="eyebrow">{{ subtitle }}</span>
        <h1 class="auth-layout__title">{{ title }}</h1>
        <slot/>
      </div>
    </div>
    <div class="auth-layout__aside">
      <PfSmartImg :src="asideImg" alt=""/>
      <div class="auth-layout__veil"></div>
      <div class="auth-layout__content">
        <span class="eyebrow" style="color:rgba(255,255,255,.6)">— Bienvenido</span>
        <h2 class="auth-layout__aside-title">{{ asideTitle }}</h2>
        <p class="auth-layout__aside-text">{{ asideText }}</p>
        <div class="auth-layout__stats">
          <div class="auth-stat"><div class="n">1.8k+</div><div class="l">Huariques</div></div>
          <div class="auth-stat"><div class="n">92k</div><div class="l">Reseñas</div></div>
          <div class="auth-stat"><div class="n">4.7</div><div class="l">Rating prom.</div></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import PfIcon from '@/shared/presentations/components/pf-icon.vue';
import PfSmartImg from '@/shared/presentations/components/pf-smart-img.vue';
export default {
  name: 'AuthLayout',
  components: { PfIcon, PfSmartImg },
  props: { title: String, subtitle: String, asideTitle: String, asideText: String, asideImg: String }
};
</script>
<style scoped>
.auth-layout { min-height: calc(100vh - 73px); display:grid; grid-template-columns: 1fr 1fr; }
.auth-layout__form { display:grid; place-items: center; padding: 48px 24px; }
.auth-layout__title { font-size: clamp(40px, 4vw, 56px); line-height: 1; margin-top: 12px; margin-bottom: 32px; letter-spacing: -0.02em; }
.auth-layout__aside { position:relative; overflow:hidden; background: var(--ink); }
.auth-layout__aside img { opacity: 0.7; height: 100%; }
.auth-layout__veil { position:absolute; inset:0; background: linear-gradient(135deg, rgba(20,15,10,.55), rgba(20,15,10,.85)); }
.auth-layout__content { position:absolute; inset:0; padding: 56px; display:flex; flex-direction:column; justify-content:flex-end; color:#fff; }
.auth-layout__aside-title { font-size: 44px; color:#fff; margin-top:12px; line-height: 1.05; max-width: 440px; }
.auth-layout__aside-text { color: rgba(255,255,255,.78); font-size: 16px; margin-top:16px; max-width:420px; line-height:1.55; }
.auth-layout__stats { display:flex; gap:12px; margin-top: 32px; }
.auth-stat { padding-right: 24px; border-right: 1px solid rgba(255,255,255,.18); }
.auth-stat .n { font-family: var(--font-display); font-size: 28px; color:#fff; }
.auth-stat .l { font-size: 11px; color: rgba(255,255,255,.55); font-family: var(--font-mono); letter-spacing: 0.08em; text-transform: uppercase; }
@media (max-width: 880px) {
  .auth-layout { grid-template-columns: 1fr; }
  .auth-layout__aside { display: none; }
}
</style>
