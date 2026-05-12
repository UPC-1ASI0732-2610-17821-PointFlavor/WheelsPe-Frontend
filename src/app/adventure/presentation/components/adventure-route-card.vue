<template>
  <div class="adventure-route-card" :class="{ featured: featured }">
    <div class="card-image">
      <img :src="route.imageUrl || defaultImage" :alt="route.name" />
      <div class="card-badges">
        <span v-if="featured" class="badge featured-badge">
          <i class="pi pi-star-fill"></i>
          Destacada
        </span>
        <span class="badge type-badge" :class="`type-${route.type}`">
          {{ route.typeIcon }} {{ route.typeLabel }}
        </span>
      </div>
      <div class="card-overlay"></div>
    </div>

    <div class="card-content">
      <div class="card-header">
        <h3 class="card-title">{{ route.name }}</h3>
        <div class="card-rating">
          <i class="pi pi-star-fill"></i>
          <span>{{ route.rating.toFixed(1) }}</span>
          <span class="reviews-count">({{ route.reviewsCount }})</span>
        </div>
      </div>

      <p class="card-summary">{{ route.summary }}</p>

      <div class="card-route">
        <i class="pi pi-map-marker"></i>
        <span>{{ route.fullRoute }}</span>
      </div>

      <div class="card-details">
        <div class="detail-item">
          <i class="pi pi-calendar"></i>
          <span>{{ route.formattedDuration }}</span>
        </div>
        <div class="detail-item">
          <i class="pi pi-compass"></i>
          <span>{{ route.formattedDistance }}</span>
        </div>
        <div class="detail-item">
          <i class="pi pi-chart-line"></i>
          <span>{{ route.difficultyLevel }}</span>
        </div>
      </div>

      <div class="card-highlights" v-if="route.highlights && route.highlights.length > 0">
        <div class="highlight-item" v-for="(highlight, index) in route.highlights.slice(0, 3)" :key="index">
          <i class="pi pi-check-circle"></i>
          <span>{{ highlight }}</span>
        </div>
      </div>

      <div class="card-footer">
        <div class="card-price">
          <span class="price-label">Desde</span>
          <span class="price-value">{{ route.formattedCost }}</span>
        </div>
        <button @click="handleViewDetails" class="btn-explore">
          <span>Explorar Ruta</span>
          <i class="pi pi-arrow-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  route: {
    type: Object,
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['view-details'])

const defaultImage = computed(() => {
  const images = {
    beach: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    mountain: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    cultural: 'https://images.unsplash.com/photo-1555791018-6572a7ad7e0e?w=800',
    gastronomic: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
    adventure: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
    scenic: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'
  }
  return images[props.route.type] || images.scenic
})

function handleViewDetails() {
  emit('view-details', props.route.id)
}
</script>

<style scoped>
.adventure-route-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.adventure-route-card:hover {
  transform: translateY(-12px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.adventure-route-card.featured {
  border: 3px solid #FFD700;
}

/* Card Image */
.card-image {
  position: relative;
  width: 100%;
  height: 240px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.adventure-route-card:hover .card-image img {
  transform: scale(1.1);
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.3) 100%);
}

.card-badges {
  position: absolute;
  top: 1rem;
  left: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  z-index: 1;
}

.badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.featured-badge {
  background: rgba(255, 215, 0, 0.95);
  color: #2C3E50;
}

.type-badge {
  background: rgba(255, 255, 255, 0.95);
  color: #2C3E50;
}

.type-badge.type-beach {
  background: rgba(255, 140, 0, 0.95);
  color: white;
}

.type-badge.type-mountain {
  background: rgba(65, 105, 225, 0.95);
  color: white;
}

.type-badge.type-cultural {
  background: rgba(139, 69, 19, 0.95);
  color: white;
}

.type-badge.type-gastronomic {
  background: rgba(220, 20, 60, 0.95);
  color: white;
}

.type-badge.type-adventure {
  background: rgba(34, 139, 34, 0.95);
  color: white;
}

.type-badge.type-scenic {
  background: rgba(148, 0, 211, 0.95);
  color: white;
}

/* Card Content */
.card-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.card-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #2C3E50;
  margin: 0;
  line-height: 1.3;
  flex: 1;
}

.card-rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #FFD700;
  white-space: nowrap;
}

.card-rating span {
  color: #2C3E50;
}

.reviews-count {
  color: #666 !important;
  font-weight: 400;
  font-size: 0.85rem;
}

.card-summary {
  font-size: 0.95rem;
  color: #666;
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-route {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #2C3E50;
  font-weight: 500;
}

.card-route i {
  color: #FF6F00;
  font-size: 1.1rem;
}

.card-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.detail-item:hover {
  background: #e9ecef;
  transform: translateY(-2px);
}

.detail-item i {
  font-size: 1.25rem;
  color: #3A5E5E;
}

.detail-item span {
  font-size: 0.85rem;
  font-weight: 600;
  color: #2C3E50;
  text-align: center;
}

.card-highlights {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.highlight-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

.highlight-item i {
  color: #22c55e;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 2px solid #f0f0f0;
  margin-top: auto;
}

.card-price {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.price-label {
  font-size: 0.8rem;
  color: #666;
  font-weight: 500;
}

.price-value {
  font-size: 1.75rem;
  font-weight: 800;
  color: #3A5E5E;
  line-height: 1;
}

.btn-explore {
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #FF6F00 0%, #FF8F00 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(255, 111, 0, 0.3);
}

.btn-explore:hover {
  background: linear-gradient(135deg, #E66500 0%, #E67E00 100%);
  transform: translateX(4px);
  box-shadow: 0 6px 20px rgba(255, 111, 0, 0.4);
}

.btn-explore i {
  transition: transform 0.3s ease;
}

.btn-explore:hover i {
  transform: translateX(4px);
}

/* Responsive */
@media (max-width: 768px) {
  .card-details {
    grid-template-columns: repeat(2, 1fr);
  }

  .detail-item:last-child {
    grid-column: 1 / -1;
  }

  .card-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-explore {
    width: 100%;
    justify-content: center;
  }
}
</style>
