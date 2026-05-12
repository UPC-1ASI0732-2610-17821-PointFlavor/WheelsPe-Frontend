<template>
  <div class="create-adventure-page">
    <div class="container">
      <div class="page-header">
        <h1>Crear Nueva Aventura</h1>
        <p>Comparte una ruta de aventura con tu vehículo</p>
      </div>

      <div class="form-container">
        <form @submit.prevent="handleSubmit" class="adventure-form">
          <!-- Basic Info -->
          <div class="form-section">
            <h3>Información de la Ruta</h3>
            
            <div class="form-field">
              <label for="title">Título de la Aventura *</label>
              <input 
                id="title" 
                v-model="formData.title" 
                type="text" 
                placeholder="Ej: Ruta Costera Lima - Paracas"
                required
                class="form-input"
              />
            </div>

            <div class="form-field">
              <label for="description">Descripción *</label>
              <textarea 
                id="description" 
                v-model="formData.description" 
                rows="4" 
                placeholder="Describe la experiencia, paradas, y qué hace especial esta ruta..."
                required
                class="form-input"
              ></textarea>
            </div>

            <div class="form-row">
              <div class="form-field">
                <label for="type">Tipo de Aventura *</label>
                <select id="type" v-model="formData.type" required class="form-input">
                  <option value="beach">Playa</option>
                  <option value="mountain">Montaña</option>
                  <option value="cultural">Cultural</option>
                  <option value="gastronomic">Gastronómica</option>
                  <option value="adventure">Aventura Extrema</option>
                  <option value="scenic">Escénica</option>
                </select>
              </div>

              <div class="form-field">
                <label for="difficulty">Dificultad *</label>
                <select id="difficulty" v-model="formData.difficulty" required class="form-input">
                  <option value="easy">Fácil</option>
                  <option value="moderate">Moderada</option>
                  <option value="hard">Difícil</option>
                  <option value="expert">Experto</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-field">
                <label for="startLocation">Punto de Partida *</label>
                <input 
                  id="startLocation" 
                  v-model="formData.startLocation" 
                  type="text" 
                  placeholder="Ej: Lima"
                  required
                  class="form-input"
                />
              </div>

              <div class="form-field">
                <label for="destination">Destino Principal *</label>
                <input 
                  id="destination" 
                  v-model="formData.destination" 
                  type="text" 
                  placeholder="Ej: Paracas"
                  required
                  class="form-input"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-field">
                <label for="duration">Duración (días) *</label>
                <input 
                  id="duration" 
                  v-model.number="formData.duration" 
                  type="number" 
                  min="1"
                  required
                  class="form-input"
                />
              </div>

              <div class="form-field">
                <label for="price">Precio Base (S/.) *</label>
                <input 
                  id="price" 
                  v-model.number="formData.price" 
                  type="number" 
                  min="0"
                  required
                  class="form-input"
                />
              </div>
            </div>
          </div>

          <!-- Vehicle Selection -->
          <div class="form-section">
            <h3>Vehículo Recomendado</h3>
            <p class="section-desc">Selecciona uno de tus vehículos para esta aventura</p>
            <p class="helper-text">💡 Tip: Agrega imágenes a tus vehículos para una mejor presentación</p>
            
            <div v-if="loadingVehicles" class="loading-text">Cargando vehículos...</div>
            <div v-else-if="myVehicles.length === 0" class="no-vehicles">
              No tienes vehículos registrados. <router-link to="/add-vehicle">Registra uno primero</router-link>.
            </div>
            
            <div v-else class="vehicles-grid">
              <div 
                v-for="vehicle in myVehicles" 
                :key="vehicle.id"
                class="vehicle-card"
                :class="{ selected: formData.vehicleId === vehicle.id }"
                @click="formData.vehicleId = vehicle.id"
              >
                <img :src="vehicle.imageUrl || 'https://via.placeholder.com/150/FF6F00/ffffff?text=🚗'" alt="Vehicle" class="vehicle-img" />
                <div class="vehicle-info">
                  <h4>{{ vehicle.brand }} {{ vehicle.model }}</h4>
                  <p>{{ vehicle.year }}</p>
                </div>
                <div class="check-icon" v-if="formData.vehicleId === vehicle.id">✓</div>
              </div>
            </div>
            <span v-if="errors.vehicleId" class="error-msg">{{ errors.vehicleId }}</span>
          </div>

          <!-- Image URL -->
          <div class="form-section">
            <h3>Imagen de Portada</h3>
            <div class="form-field">
              <label for="imageUrl">URL de la Imagen (Opcional)</label>
              <input 
                id="imageUrl" 
                v-model="formData.imageUrl" 
                type="url" 
                placeholder="https://ejemplo.com/imagen.jpg (opcional - se usará un placeholder si no se especifica)"
                class="form-input"
              />
              <p class="helper-text">Si no agregas una imagen, se mostrará un placeholder atractivo</p>
            </div>
            <div class="image-preview">
              <img :src="formData.imageUrl || 'https://via.placeholder.com/800x400/FF6F00/ffffff?text=Vista+Previa+de+tu+Aventura'" alt="Preview" @error="handleImageError" />
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-cancel" @click="$router.back()">Cancelar</button>
            <button type="submit" class="btn-submit" :disabled="isSubmitting">
              {{ isSubmitting ? 'Creando...' : 'Crear Aventura' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/app/iam/application/user.store.js'
import { useRentalStore } from '@/app/rental/application/rental.store.js'
import useAdventuresStore from '@/app/adventure/application/adventures.store.js'

const router = useRouter()
const userStore = useUserStore()
const rentalStore = useRentalStore()
const adventureStore = useAdventuresStore()

const isSubmitting = ref(false)
const loadingVehicles = ref(false)
const errors = reactive({})

const formData = reactive({
  title: '',
  description: '',
  destination: '',
  startLocation: '',
  type: 'beach',
  duration: 1,
  difficulty: 'moderate',
  price: 0,
  vehicleId: null,
  imageUrl: ''
})

// Get owner's vehicles
const myVehicles = computed(() => {
  const userId = userStore.currentUser.value?.id
  if (!userId) return []
  return rentalStore.state.vehicles.filter(v => Number(v.ownerId) === Number(userId))
})

onMounted(async () => {
  loadingVehicles.value = true
  await rentalStore.loadVehicles()
  loadingVehicles.value = false
})

const handleImageError = (e) => {
  e.target.src = 'https://via.placeholder.com/800x400?text=Invalid+Image+URL'
}

const handleSubmit = async () => {
  // Validate
  errors.vehicleId = ''
  if (!formData.vehicleId) {
    errors.vehicleId = 'Debes seleccionar un vehículo para la aventura'
    return
  }

  isSubmitting.value = true
  try {
    const selectedVehicle = myVehicles.value.find(v => v.id === formData.vehicleId)
    
    // Generate tags based on type and location
    const tags = [
      formData.type,
      formData.destination,
      formData.startLocation,
      selectedVehicle.brand
    ].filter(Boolean)

    const adventureData = {
      // Map to AdventureRoute schema
      name: formData.title,
      title: formData.title, // Keep title for compatibility if needed
      description: formData.description,
      endLocation: formData.destination,
      destination: formData.destination, // Keep destination for compatibility
      startLocation: formData.startLocation,
      type: formData.type,
      duration: formData.duration,
      difficulty: formData.difficulty,
      estimatedCost: formData.price,
      price: formData.price, // Keep price for compatibility
      vehicleName: `${selectedVehicle.brand} ${selectedVehicle.model}`,
      imageUrl: formData.imageUrl,
      tags: tags,
      
      // ✅ Campos requeridos por backend con valores por defecto
      images: formData.imageUrl ? [formData.imageUrl] : [],
      waypoints: [], // Por ahora vacío, se puede agregar funcionalidad después
      estimatedTime: formData.duration || '1 hour',
      distance: 0, // Valor por defecto
      
      // Metadata
      ownerId: userStore.currentUser.value.id,
      rating: 0,
      reviewsCount: 0,
      createdAt: new Date().toISOString(),
      featured: false
    }

    await adventureStore.addAdventure(adventureData)
    
    alert('¡Aventura creada exitosamente!')
    // Redirect to My Adventures (Owner view) instead of Renter view
    router.push('/adventure/my-adventures')
  } catch (error) {
    console.error('Error creating adventure:', error)
    alert('Error al crear la aventura. Inténtalo de nuevo.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.create-adventure-page {
  padding: 2rem 1rem;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.form-container {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}

.form-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #eee;
}

.form-section:last-child {
  border-bottom: none;
}

.form-section h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.form-field {
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #4a5568;
}

.section-desc {
  color: #718096;
  font-size: 0.95rem;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
}

.helper-text {
  color: #FF6F00;
  font-size: 0.85rem;
  margin-top: 0.5rem;
  font-style: italic;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.1);
}

.vehicles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.vehicle-card {
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
}

.vehicle-card:hover {
  border-color: #cbd5e0;
}

.vehicle-card.selected {
  border-color: #42b983;
  background-color: #f0fff4;
}

.vehicle-img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 4px;
}

.vehicle-info {
  padding: 0.5rem;
}

.vehicle-info h4 {
  margin: 0;
  font-size: 0.9rem;
}

.check-icon {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: #42b983;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
}

.image-preview {
  margin-top: 1rem;
  border-radius: 8px;
  overflow: hidden;
  max-height: 300px;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-cancel {
  padding: 0.75rem 1.5rem;
  border: 1px solid #cbd5e0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  color: #4a5568;
}

.btn-submit {
  padding: 0.75rem 1.5rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-msg {
  color: #e53e3e;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: block;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
