<template>
  <div class="adventure-routes-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">
          <i class="pi pi-compass"></i>
          Descubre Tu Próxima Aventura
        </h1>
        <p class="hero-subtitle">
          Rutas épicas que transforman un simple alquiler en una experiencia inolvidable
        </p>
      </div>
      <div class="hero-overlay"></div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="stats-container">
        <div class="stat-card">
          <i class="pi pi-map stat-icon"></i>
          <div class="stat-info">
            <span class="stat-number">{{ stats.total }}</span>
            <span class="stat-label">Rutas Disponibles</span>
          </div>
        </div>
        <div class="stat-card">
          <i class="pi pi-sun stat-icon beach"></i>
          <div class="stat-info">
            <span class="stat-number">{{ stats.beach }}</span>
            <span class="stat-label">Rutas Playeras</span>
          </div>
        </div>
        <div class="stat-card">
          <i class="pi pi-cloud stat-icon mountain"></i>
          <div class="stat-info">
            <span class="stat-number">{{ stats.mountain }}</span>
            <span class="stat-label">Rutas Montañeras</span>
          </div>
        </div>
        <div class="stat-card">
          <i class="pi pi-building stat-icon cultural"></i>
          <div class="stat-info">
            <span class="stat-number">{{ stats.cultural }}</span>
            <span class="stat-label">Rutas Culturales</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Routes -->
    <section v-if="featuredRoutes.length > 0" class="featured-section">
      <div class="section-header">
        <h2 class="section-title">
          <i class="pi pi-star-fill"></i>
          Rutas Destacadas
        </h2>
        <p class="section-subtitle">Las aventuras más populares y recomendadas</p>
      </div>
      
      <div class="featured-grid">
        <AdventureRouteCard
          v-for="route in featuredRoutes"
          :key="route.id"
          :route="route"
          :featured="true"
          @view-details="viewRouteDetails"
        />
      </div>
    </section>

    <!-- Filters Section -->
    <section class="filters-section">
      <div class="filters-container">
        <!-- Search Bar -->
        <div class="search-box">
          <i class="pi pi-search"></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar rutas por nombre, ubicación o etiquetas..."
            class="search-input"
          />
        </div>

        <!-- Filter Controls -->
        <div class="filter-controls">
          <div class="filter-item">
            <label for="type-filter">Tipo de Ruta</label>
            <select id="type-filter" v-model="selectedType" class="filter-select">
              <option value="all">Todas las Rutas</option>
              <option value="beach">🏖️ Rutas Playeras</option>
              <option value="mountain">⛰️ Rutas Montañeras</option>
              <option value="cultural">🏛️ Rutas Culturales</option>
              <option value="gastronomic">🍽️ Rutas Gastronómicas</option>
              <option value="adventure">🏕️ Aventura Extrema</option>
              <option value="scenic">🌄 Rutas Escénicas</option>
            </select>
          </div>

          <div class="filter-item">
            <label for="difficulty-filter">Dificultad</label>
            <select id="difficulty-filter" v-model="selectedDifficulty" class="filter-select">
              <option value="all">Todas</option>
              <option value="easy">Fácil</option>
              <option value="moderate">Moderada</option>
              <option value="hard">Difícil</option>
            </select>
          </div>

          <button @click="resetFilters" class="btn-reset">
            <i class="pi pi-refresh"></i>
            Resetear Filtros
          </button>
        </div>
      </div>
    </section>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <i class="pi pi-spin pi-spinner loading-icon"></i>
      <p>Cargando rutas de aventura...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <i class="pi pi-exclamation-triangle error-icon"></i>
      <h3>Error al cargar rutas</h3>
      <p>{{ error }}</p>
      <button @click="fetchRoutes" class="btn-retry">
        <i class="pi pi-refresh"></i>
        Reintentar
      </button>
    </div>

    <!-- Routes Grid -->
    <section v-else class="routes-section">
      <div class="section-header">
        <h2 class="section-title">
          Todas las Rutas
          <span class="routes-count">({{ filteredRoutes.length }})</span>
        </h2>
      </div>

      <!-- Empty State -->
      <div v-if="filteredRoutes.length === 0" class="empty-state">
        <i class="pi pi-inbox empty-icon"></i>
        <h3>No se encontraron rutas</h3>
        <p>Intenta ajustar los filtros de búsqueda</p>
      </div>

      <!-- Routes Grid -->
      <div v-else class="routes-grid">
        <AdventureRouteCard
          v-for="route in filteredRoutes"
          :key="route.id"
          :route="route"
          @view-details="viewRouteDetails"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAdventureRoutesStore } from '../../application/adventure-routes.store.js'
import AdventureRouteCard from '../components/adventure-route-card.vue'

const router = useRouter()
const store = useAdventureRoutesStore()

const {
  routes,
  loading,
  error,
  selectedType,
  selectedDifficulty,
  searchQuery,
  filteredRoutes,
  featuredRoutes,
  stats,
  fetchRoutes,
  resetFilters
} = store

onMounted(() => {
  fetchRoutes()
})

function viewRouteDetails(routeId) {
  router.push({ name: 'adventure-route-detail', params: { id: routeId } })
}
</script>

<style scoped>
.adventure-routes-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

/* Hero Section */
.hero-section {
  position: relative;
  height: 400px;
  background: linear-gradient(135deg, rgba(58, 94, 94, 0.95) 0%, rgba(44, 80, 80, 0.95) 100%),
              url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600') center/cover;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 50% 50%, transparent 0%, rgba(0, 0, 0, 0.3) 100%);
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 800px;
  padding: 2rem;
  animation: fadeInUp 0.8s ease;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin: 0 0 1rem 0;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.hero-title i {
  font-size: 3rem;
  animation: spin 20s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.hero-subtitle {
  font-size: 1.5rem;
  margin: 0;
  opacity: 0.95;
  font-weight: 300;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

/* Stats Section */
.stats-section {
  padding: 3rem 2rem;
  background: white;
  border-bottom: 1px solid #e0e0e0;
}

.stats-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.stat-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  font-size: 3rem;
  color: #3A5E5E;
  padding: 1rem;
  background: rgba(58, 94, 94, 0.1);
  border-radius: 12px;
}

.stat-icon.beach {
  color: #FF8C00;
  background: rgba(255, 140, 0, 0.1);
}

.stat-icon.mountain {
  color: #4169E1;
  background: rgba(65, 105, 225, 0.1);
}

.stat-icon.cultural {
  color: #8B4513;
  background: rgba(139, 69, 19, 0.1);
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2C3E50;
  line-height: 1;
}

.stat-label {
  font-size: 0.95rem;
  color: #666;
  margin-top: 0.5rem;
  font-weight: 500;
}

/* Featured Section */
.featured-section {
  padding: 4rem 2rem;
  background: white;
}

.section-header {
  max-width: 1200px;
  margin: 0 auto 3rem;
  text-align: center;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2C3E50;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.section-title i {
  color: #FFD700;
  font-size: 2rem;
}

.section-subtitle {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
}

.featured-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

/* Filters Section */
.filters-section {
  padding: 2rem;
  background: #f8f9fa;
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
}

.filters-container {
  max-width: 1200px;
  margin: 0 auto;
}

.search-box {
  position: relative;
  margin-bottom: 1.5rem;
}

.search-box i {
  position: absolute;
  left: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  font-size: 1.2rem;
}

.search-input {
  width: 100%;
  padding: 1rem 1.25rem 1rem 3.5rem;
  font-size: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  background: white;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #3A5E5E;
  box-shadow: 0 0 0 4px rgba(58, 94, 94, 0.1);
}

.filter-controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  align-items: end;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-item label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #2C3E50;
}

.filter-select {
  padding: 0.875rem 1rem;
  font-size: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #3A5E5E;
  box-shadow: 0 0 0 3px rgba(58, 94, 94, 0.1);
}

.btn-reset {
  padding: 0.875rem 1.5rem;
  background: #FF6F00;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.btn-reset:hover {
  background: #E66500;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 111, 0, 0.3);
}

/* Routes Section */
.routes-section {
  padding: 4rem 2rem;
}

.routes-count {
  color: #666;
  font-weight: 400;
  font-size: 1.5rem;
}

.routes-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

/* Loading & Error States */
.loading-container,
.error-container {
  text-align: center;
  padding: 6rem 2rem;
}

.loading-icon,
.error-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.loading-icon {
  color: #3A5E5E;
}

.error-icon {
  color: #ef4444;
}

.error-container h3 {
  font-size: 1.5rem;
  color: #2C3E50;
  margin: 0 0 0.5rem 0;
}

.error-container p {
  color: #666;
  margin: 0 0 1.5rem 0;
}

.btn-retry {
  padding: 0.875rem 1.5rem;
  background: #3A5E5E;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.btn-retry:hover {
  background: #2C5050;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(58, 94, 94, 0.3);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 6rem 2rem;
}

.empty-icon {
  font-size: 5rem;
  color: #ccc;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.75rem;
  color: #2C3E50;
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .stats-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .stat-card {
    padding: 1.5rem;
  }

  .featured-grid,
  .routes-grid {
    grid-template-columns: 1fr;
  }

  .filter-controls {
    grid-template-columns: 1fr;
  }

  .section-title {
    font-size: 2rem;
  }
}
</style>
