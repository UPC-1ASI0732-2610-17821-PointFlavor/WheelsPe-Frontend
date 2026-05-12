<template>
  <div class="page-enter">
    <section class="section">
      <div class="wrap-narrow">
        <button class="btn btn--ghost btn--sm" @click="goBack" style="margin-bottom:24px">
          <PfIcon name="back"/> Volver al lugar
        </button>

        <article class="review-target">
          <div class="review-target__img"><PfSmartImg :src="h.img" :alt="h.name"/></div>
          <div>
            <span class="eyebrow">{{ h.category }} · {{ h.district }}</span>
            <h2 style="font-size:26px;margin-top:4px">{{ h.name }}</h2>
            <p style="font-size:14px;color:var(--ink-2);margin-top:4px">
              Cuéntanos cómo te fue. Tu reseña ayuda a otros comensales.
            </p>
          </div>
        </article>

        <form @submit.prevent="submit" style="display:grid;gap:32px">
          <section class="pref-block">
            <div class="pref-block__head"><div><h3 style="font-size:24px">Tu calificación</h3><p>Cinco estrellas si es para repetir.</p></div></div>
            <div style="display:flex;gap:10px">
              <button v-for="n in 5" :key="n" type="button"
                class="star-btn"
                :class="{ on: (hover || rating) >= n }"
                @mouseenter="hover = n" @mouseleave="hover = 0" @click="rating = n">
                <PfIcon name="star" :size="24"/>
              </button>
            </div>
            <p v-if="rating > 0" style="margin-top:12px;font-size:14px;color:var(--ink-2)">
              {{ ratingLabel }}
            </p>
          </section>

          <section class="pref-block">
            <div class="pref-block__head">
              <div><h3 style="font-size:24px">Tu reseña</h3></div>
              <span style="font-size:12px;color:var(--ink-3);font-family:var(--font-mono)">{{ text.length }} / 500</span>
            </div>
            <textarea class="textarea" v-model="text" :maxlength="500" rows="6"
              placeholder="¿Qué probaste? ¿Cómo fue el servicio? ¿Volverías?"
              style="resize:vertical"/>
          </section>

          <section class="pref-block">
            <div class="pref-block__head"><div><h3 style="font-size:24px">Etiquetas</h3><p>Hasta 3.</p></div></div>
            <div style="display:flex;gap:8px;flex-wrap:wrap">
              <button v-for="t in tagOptions" :key="t" type="button"
                :class="['chip', tags.includes(t) && 'chip--on']" @click="toggleTag(t)">
                <PfIcon v-if="tags.includes(t)" name="check"/> {{ t }}
              </button>
            </div>
          </section>

          <section class="pref-block">
            <div class="pref-block__head"><div><h3 style="font-size:24px">¿Subir fotos?</h3><p>Opcional, pero ayuda mucho.</p></div></div>
            <div class="photo-uploads">
              <div v-for="i in 4" :key="i" class="placeholder" style="aspect-ratio:1/1;border-radius:var(--r-md);cursor:pointer">
                <PfIcon name="plus"/>
              </div>
            </div>
          </section>

          <div style="display:flex;gap:12px;padding-top:16px;border-top:1px solid var(--line-soft)">
            <button type="submit" class="btn btn--accent btn--lg" :disabled="!rating || text.length < 20">
              Publicar reseña
            </button>
            <button type="button" class="btn btn--ghost btn--lg" @click="goBack">Cancelar</button>
            <span style="margin-left:auto;align-self:center;font-size:13px;color:var(--ink-3)">Mínimo 20 caracteres</span>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>
<script>
import PfIcon from '@/shared/presentations/components/pf-icon.vue';
import PfSmartImg from '@/shared/presentations/components/pf-smart-img.vue';
import { findHuarique } from '@/shared/data/mock-data.js';

export default {
  name: 'ReviewNewView',
  components: { PfIcon, PfSmartImg },
  data: () => ({
    rating: 0, hover: 0, text: '', tags: [],
    tagOptions: ['Familiar','Romántico','Vale la espera','Tradicional','Buen servicio','Para llevar','Generoso']
  }),
  computed: {
    h() { return findHuarique(this.$route.params.huariqueId); },
    ratingLabel() { return ['','Mejorable','Aceptable','Bien','Muy bien','Excelente'][this.rating]; }
  },
  methods: {
    toggleTag(t) {
      const i = this.tags.indexOf(t);
      if (i >= 0) this.tags.splice(i, 1);
      else if (this.tags.length < 3) this.tags.push(t);
    },
    submit() { this.$router.push({ name: 'huarique-detail', params: { id: this.h.id } }); },
    goBack() { this.$router.push({ name: 'huarique-detail', params: { id: this.h.id } }); }
  }
};
</script>
<style scoped>
.review-target {
  display:flex; gap:18px; padding:18px; margin-bottom: 32px;
  border:1px solid var(--line-soft); border-radius: var(--r-lg);
  background: var(--bg-soft);
}
.review-target__img { width:96px; height:96px; border-radius: var(--r-md); overflow:hidden; flex-shrink:0; }
.pref-block__head { display:flex; justify-content:space-between; align-items:baseline; margin-bottom: 16px; }
.pref-block__head p { color: var(--ink-3); font-size: 14px; margin-top: 4px; }
.star-btn {
  width:56px; height:56px; border-radius: var(--r-md);
  border:1px solid var(--line); background: var(--bg-elev);
  cursor:pointer; display:grid; place-items:center;
  color: var(--ink-3); transition: all .15s ease;
}
.star-btn.on { color: var(--accent); }
.photo-uploads { display:grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
</style>
