<template>
  <div class="edit-adventure-page">
    <div class="page-header">
      <button @click="goBack" class="btn-back">
        <span class="icon">←</span>
        Volver
      </button>
      <h1>Editar Aventura</h1>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Cargando información de la aventura...</p>
    </div>

    <div v-else-if="!adventure" class="error-state">
      <div class="error-icon">⚠️</div>
      <h2>Aventura no encontrada</h2>
      <p>No se pudo cargar la información de esta aventura</p>
      <button @click="goBack" class="btn-primary">Volver a Mis Aventuras</button>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="edit-form">
      <div class="form-grid">
        <!-- Left Column -->
        <div class="form-section">
          <h3 class="section-title">Información Básica</h3>

          <div class="form-group">
            <label for="title">Título de la Aventura *</label>
            <input
              v-model="formData.title"
              id="title"
              type="text"
              required
              placeholder="Ej: Ruta Mágica por Machu Picchu"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="description">Descripción *</label>
            <textarea
              v-model="formData.description"
              id="description"
              required
              rows="5"
              placeholder="Describe tu aventura..."
              class="form-textarea"
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="type">Tipo de Aventura *</label>
              <select id="type" v-model="formData.type" required class="form-select">
                <option value="beach">Playa</option>
                <option value="mountain">Montaña</option>
                <option value="cultural">Cultural</option>
                <option value="gastronomic">Gastronómica</option>
                <option value="adventure">Aventura Extrema</option>
                <option value="scenic">Escénica</option>
              </select>
            </div>

            <div class="form-group">
              <label for="difficulty">Dificultad</label>
              <select v-model="formData.difficulty" id="difficulty" class="form-select">
                <option value="easy">Fácil</option>
                <option value="moderate">Moderada</option>
                <option value="hard">Difícil</option>
                <option value="expert">Experto</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="duration">Duración (días) *</label>
              <input
                v-model.number="formData.duration"
                id="duration"
                type="number"
                min="1"
                required
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="price">Precio (S/.) *</label>
              <input
                v-model.number="formData.price"
                id="price"
                type="number"
                min="0"
                step="0.01"
                required
                class="form-input"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="vehicleName">Vehículo *</label>
            <select v-model="formData.vehicleName" id="vehicleName" required class="form-select">
              <option value="" disabled>Selecciona un vehículo</option>
              <option v-for="vehicle in ownerVehicles" :key="vehicle.id" :value="`${vehicle.brand} ${vehicle.model}`">
                {{ vehicle.brand }} {{ vehicle.model }} ({{ vehicle.year }})
              </option>
            </select>
          </div>
        </div>

        <!-- Right Column -->
        <div class="form-section">
          <h3 class="section-title">Detalles Adicionales</h3>

          <div class="form-group">
            <label for="imageUrl">URL de Imagen (Opcional)</label>
            <input
              v-model="formData.imageUrl"
              id="imageUrl"
              type="url"
              placeholder="https://ejemplo.com/imagen.jpg (se usará un placeholder si está vacío)"
              class="form-input"
            />
            <p class="helper-text">Si no agregas una imagen, se mostrará un placeholder atractivo automáticamente</p>
            <div class="image-preview">
              <img :src="formData.imageUrl || 'https://via.placeholder.com/800x400/FF6F00/ffffff?text=Vista+Previa+de+tu+Aventura'" alt="Preview" @error="handleImageError" />
            </div>
          </div>

          <div class="form-group">
            <label for="startLocation">Punto de Partida</label>
            <input
              v-model="formData.startLocation"
              id="startLocation"
              type="text"
              placeholder="Ej: Lima, Plaza San Martín"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="destination">Destino</label>
            <input
              v-model="formData.destination"
              id="destination"
              type="text"
              placeholder="Ej: Cusco, Perú"
              class="form-input"
            />
          </div>

          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input v-model="formData.featured" type="checkbox" />
              <span>Marcar como aventura destacada</span>
            </label>
          </div>

          <div class="form-group">
            <label for="maxCapacity">Capacidad Máxima</label>
            <input
              v-model.number="formData.maxCapacity"
              id="maxCapacity"
              type="number"
              min="1"
              placeholder="Número de personas"
              class="form-input"
            />
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="form-actions">
        <button type="button" @click="goBack" class="btn-cancel">
          Cancelar
        </button>
        <button type="submit" :disabled="submitting" class="btn-submit">
          <span v-if="submitting" class="spinner-small"></span>
          <span v-else>💾</span>
          {{ submitting ? 'Guardando...' : 'Guardar Cambios' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/app/iam/application/user.store.js'
import { useRentalStore } from '@/app/rental/application/rental.store.js'
import useAdventuresStore from '@/app/adventure/application/adventures.store.js'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const rentalStore = useRentalStore()
const adventureStore = useAdventuresStore()

const loading = ref(true)
const submitting = ref(false)
const adventure = ref(null)

const formData = ref({
  title: '',
  description: '',
  duration: 1,
  price: 0,
  difficulty: 'moderate',
  vehicleName: '',
  imageUrl: '',
  destination: '',
  startLocation: '',
  endLocation: '',
  type: 'beach',
  featured: false,
  maxCapacity: 4,
  ownerId: null
})

const ownerVehicles = computed(() => {
  const userId = userStore.currentUser.value?.id
  if (!userId) return []
  return rentalStore.state.vehicles.filter(v => Number(v.ownerId) === Number(userId))
})

onMounted(async () => {
  try {
    await adventureStore.fetchAdventures()
    await rentalStore.loadVehicles()

    const adventureId = String(route.params.id)
    adventure.value = adventureStore.getAdventureById(adventureId)

    if (adventure.value) {
      // Verify ownership
      const userId = userStore.currentUser.value?.id
      if (String(adventure.value.ownerId) !== String(userId)) {
        alert('⚠️ No tienes permiso para editar esta aventura')
        router.push('/adventure/my-adventures')
        return
      }

      // Populate form with existing data
      formData.value = {
        title: adventure.value.title || adventure.value.name || '',
        description: adventure.value.description || '',
        duration: adventure.value.duration || 1,
        price: adventure.value.price || adventure.value.estimatedCost || 0,
        difficulty: adventure.value.difficulty || 'moderate',
        vehicleName: adventure.value.vehicleName || '',
        imageUrl: adventure.value.imageUrl || '',
        destination: adventure.value.destination || adventure.value.endLocation || '',
        startLocation: adventure.value.startLocation || '',
        endLocation: adventure.value.endLocation || adventure.value.destination || '',
        type: adventure.value.type || 'beach',
        featured: adventure.value.featured || false,
        maxCapacity: adventure.value.maxCapacity || 4,
        ownerId: adventure.value.ownerId
      }
    }
  } catch (error) {
    console.error('Error loading adventure:', error)
  } finally {
    loading.value = false
  }
})

const handleImageError = (e) => {
  e.target.src = 'https://via.placeholder.com/800x400/CCCCCC/666666?text=Imagen+No+Disponible'
}

const handleSubmit = async () => {
  if (submitting.value) return

  // Validation
  if (!formData.value.title.trim()) {
    alert('⚠️ Por favor ingresa un título')
    return
  }

  if (!formData.value.description.trim()) {
    alert('⚠️ Por favor ingresa una descripción')
    return
  }

  if (!formData.value.vehicleName) {
    alert('⚠️ Por favor selecciona un vehículo')
    return
  }

  if (formData.value.duration < 1) {
    alert('⚠️ La duración debe ser al menos 1 día')
    return
  }

  if (formData.value.price < 0) {
    alert('⚠️ El precio no puede ser negativo')
    return
  }

  submitting.value = true

  try {
    // Generate tags based on type and location
    const tags = [
      formData.value.type,
      formData.value.destination,
      formData.value.startLocation,
      formData.value.vehicleName.split(' ')[0] // Brand
    ].filter(Boolean)

    const updatedData = {
      ...formData.value,
      // Map to AdventureRoute schema
      name: formData.value.title,
      estimatedCost: formData.value.price,
      endLocation: formData.value.destination,
      tags: tags,
      ownerId: userStore.currentUser.value?.id
    }

    await adventureStore.updateAdventure(adventure.value.id, updatedData)
    
    alert('✅ Aventura actualizada exitosamente')
    router.push('/adventure/my-adventures')
  } catch (error) {
    console.error('Error updating adventure:', error)
    alert('❌ Error al actualizar la aventura. Por favor intenta nuevamente.')
  } finally {
    submitting.value = false
  }
}

const goBack = () => {
  router.push('/adventure/my-adventures')
}
</script>

<style scoped>
.edit-adventure-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  background: var(--bg-base);
}

.page-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.btn-back {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: white;
  border: 1px solid var(--brand-green);
  color: var(--brand-green);
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-back:hover {
  background: var(--brand-green);
  color: white;
}

.page-header h1 {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: var(--brand-green);
}

/* Loading & Error States */
.loading-container,
.error-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid var(--brand-green);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-state h2 {
  color: var(--brand-pink, #e74c3c);
  margin-bottom: 0.5rem;
}

.error-state p {
  color: #666;
  margin-bottom: 2rem;
}

.btn-primary {
  padding: 0.75rem 1.5rem;
  background: var(--brand-green);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Form */
.edit-form {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 2rem;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  padding-bottom: 0.75rem;
  border-bottom: 2px solid var(--brand-green);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

label {
  font-weight: 600;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.helper-text {
  color: var(--brand-orange);
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.form-input,
.form-textarea,
.form-select {
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  font-family: inherit;
  color: var(--text-primary);
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: var(--brand-green);
  box-shadow: 0 0 0 2px rgba(58, 94, 94, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.checkbox-group {
  padding: 1rem;
  background: var(--bg-base);
  border-radius: 8px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-weight: 500;
  color: var(--text-primary);
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--brand-green);
}

.image-preview {
  margin-top: 0.75rem;
  border-radius: 8px;
  overflow: hidden;
  max-height: 200px;
  border: 1px solid #e0e0e0;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Form Actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;
}

.btn-cancel,
.btn-submit {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-cancel {
  background: white;
  border: 1px solid #ddd;
  color: var(--text-secondary);
}

.btn-cancel:hover {
  background: #f5f5f5;
  border-color: #999;
}

.btn-submit {
  background: var(--brand-green);
  color: white;
  border: none;
}

.btn-submit:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@media (max-width: 968px) {
  .form-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

@media (max-width: 768px) {
  .edit-adventure-page {
    padding: 1rem;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .edit-form {
    padding: 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn-cancel,
  .btn-submit {
    width: 100%;
    justify-content: center;
  }
}
</style>
