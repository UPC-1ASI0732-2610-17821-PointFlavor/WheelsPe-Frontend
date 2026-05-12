<template>
  <div class="edit-vehicle-page">
    <div class="page-header">
      <button @click="goBack" class="btn-back">
        <i class="pi pi-arrow-left"></i>
        {{ t('rental.editVehicle.actions.cancel') }}
      </button>
      <h1>
        <i class="pi pi-pencil"></i>
        {{ t('rental.editVehicle.title') }}
      </h1>
      <p class="subtitle">{{ t('rental.editVehicle.subtitle') }}</p>
    </div>

    <div v-if="loading" class="loading-container">
      <i class="pi pi-spin pi-spinner"></i>
      <p>{{ t('rental.editVehicle.loading') }}</p>
    </div>

    <div v-else-if="!vehicle" class="error-container">
      <i class="pi pi-exclamation-triangle"></i>
      <h2>{{ t('rental.editVehicle.notFound.title') }}</h2>
      <p>{{ t('rental.editVehicle.notFound.message') }}</p>
      <pv-button :label="t('rental.editVehicle.actions.cancel')" @click="goBack" />
    </div>

    <div v-else class="form-container">
      <form @submit.prevent="handleSubmit" class="vehicle-form">
        
        <!-- Información Básica -->
        <div class="form-section">
          <div class="section-header">
            <i class="pi pi-info-circle"></i>
            <h2>Información Básica</h2>
          </div>

          <div class="form-row">
            <div class="form-field">
              <label for="brand">{{ t('rental.addVehicle.fields.brand') }} <span class="required">*</span></label>
              <pv-input-text 
                id="brand"
                v-model="formData.brand" 
                :placeholder="t('rental.addVehicle.fields.brandPlaceholder')"
                :class="{ 'p-invalid': errors.brand }"
              />
              <small v-if="errors.brand" class="error-message">{{ errors.brand }}</small>
            </div>

            <div class="form-field">
              <label for="model">{{ t('rental.addVehicle.fields.model') }} <span class="required">*</span></label>
              <pv-input-text 
                id="model"
                v-model="formData.model" 
                :placeholder="t('rental.addVehicle.fields.modelPlaceholder')"
                :class="{ 'p-invalid': errors.model }"
              />
              <small v-if="errors.model" class="error-message">{{ errors.model }}</small>
            </div>
          </div>

          <div class="form-row">
            <div class="form-field">
              <label for="year">{{ t('rental.addVehicle.fields.year') }} <span class="required">*</span></label>
              <pv-input-number 
                id="year"
                v-model="formData.year" 
                :placeholder="t('rental.addVehicle.fields.yearPlaceholder')"
                :min="1990"
                :max="2025"
                :use-grouping="false"
                :class="{ 'p-invalid': errors.year }"
              />
              <small v-if="errors.year" class="error-message">{{ errors.year }}</small>
            </div>

            <div class="form-field">
              <label for="color">{{ t('rental.addVehicle.fields.color') }} <span class="required">*</span></label>
              <pv-select 
                id="color"
                v-model="formData.color" 
                :options="colorOptions"
                :placeholder="t('rental.addVehicle.fields.colorPlaceholder')"
                :class="{ 'p-invalid': errors.color }"
              />
              <small v-if="errors.color" class="error-message">{{ errors.color }}</small>
            </div>
          </div>
        </div>

        <!-- Especificaciones Técnicas -->
        <div class="form-section">
          <div class="section-header">
            <i class="pi pi-cog"></i>
            <h2>{{ t('rental.addVehicle.sections.specifications') }}</h2>
          </div>

          <div class="form-row">
            <div class="form-field">
              <label for="transmission">{{ t('rental.addVehicle.fields.transmission') }} <span class="required">*</span></label>
              <pv-select 
                id="transmission"
                v-model="formData.transmission" 
                :options="transmissionOptions"
                :placeholder="t('rental.addVehicle.fields.transmissionPlaceholder')"
                :class="{ 'p-invalid': errors.transmission }"
              />
              <small v-if="errors.transmission" class="error-message">{{ errors.transmission }}</small>
            </div>

            <div class="form-field">
              <label for="fuelType">{{ t('rental.addVehicle.fields.fuelType') }} <span class="required">*</span></label>
              <pv-select 
                id="fuelType"
                v-model="formData.fuelType" 
                :options="fuelTypeOptions"
                :placeholder="t('rental.addVehicle.fields.fuelTypePlaceholder')"
                :class="{ 'p-invalid': errors.fuelType }"
              />
              <small v-if="errors.fuelType" class="error-message">{{ errors.fuelType }}</small>
            </div>
          </div>

          <div class="form-row">
            <div class="form-field">
              <label for="seats">{{ t('rental.addVehicle.fields.seats') }} <span class="required">*</span></label>
              <pv-input-number 
                id="seats"
                v-model="formData.seats" 
                :placeholder="t('rental.addVehicle.fields.seatsPlaceholder')"
                :min="2"
                :max="9"
                :class="{ 'p-invalid': errors.seats }"
              />
              <small v-if="errors.seats" class="error-message">{{ errors.seats }}</small>
            </div>

            <div class="form-field">
              <label for="licensePlate">{{ t('rental.addVehicle.fields.licensePlate') }} <span class="required">*</span></label>
              <pv-input-text 
                id="licensePlate"
                v-model="formData.licensePlate" 
                :placeholder="t('rental.addVehicle.fields.licensePlatePlaceholder')"
                :class="{ 'p-invalid': errors.licensePlate }"
              />
              <small v-if="errors.licensePlate" class="error-message">{{ errors.licensePlate }}</small>
            </div>
          </div>
        </div>

        <!-- Ubicación -->
        <div class="form-section">
          <div class="section-header">
            <i class="pi pi-map-marker"></i>
            <h2>{{ t('rental.addVehicle.sections.location') }}</h2>
          </div>

          <div class="form-row">
            <div class="form-field">
              <label for="district">{{ t('rental.addVehicle.fields.district') }} <span class="required">*</span></label>
              <pv-select 
                id="district"
                v-model="formData.location.district" 
                :options="districtOptions"
                :placeholder="t('rental.addVehicle.fields.districtPlaceholder')"
                :class="{ 'p-invalid': errors.district }"
              />
              <small v-if="errors.district" class="error-message">{{ errors.district }}</small>
            </div>

            <div class="form-field">
              <label for="address">{{ t('rental.addVehicle.fields.address') }}</label>
              <pv-input-text 
                id="address"
                v-model="formData.location.address" 
                :placeholder="t('rental.addVehicle.fields.addressPlaceholder')"
              />
            </div>
          </div>
        </div>

        <!-- Precio y Disponibilidad -->
        <div class="form-section">
          <div class="section-header">
            <i class="pi pi-dollar"></i>
            <h2>{{ t('rental.addVehicle.sections.pricing') }}</h2>
          </div>

          <div class="form-row">
            <div class="form-field">
              <label for="dailyPrice">{{ t('rental.addVehicle.fields.dailyPrice') }} <span class="required">*</span></label>
              <pv-input-number 
                id="dailyPrice"
                v-model="formData.dailyPrice" 
                mode="currency"
                currency="PEN"
                locale="es-PE"
                :min="50"
                :max="10000"
                :placeholder="t('rental.addVehicle.fields.dailyPricePlaceholder')"
                :class="{ 'p-invalid': errors.dailyPrice }"
              />
              <small v-if="errors.dailyPrice" class="error-message">{{ errors.dailyPrice }}</small>
            </div>

            <div class="form-field">
              <label for="status">{{ t('rental.addVehicle.fields.status') }}</label>
              <pv-select 
                id="status"
                v-model="formData.status" 
                :options="statusOptions"
                option-label="label"
                option-value="value"
                :placeholder="t('rental.addVehicle.fields.statusPlaceholder')"
              />
            </div>
          </div>
        </div>

        <!-- Descripción -->
        <div class="form-section">
          <div class="section-header">
            <i class="pi pi-align-left"></i>
            <h2>{{ t('rental.addVehicle.sections.description') }}</h2>
          </div>

          <div class="form-field full-width">
            <label for="description">{{ t('rental.addVehicle.fields.description') }}</label>
            <pv-textarea 
              id="description"
              v-model="formData.description" 
              rows="5"
              :placeholder="t('rental.addVehicle.fields.descriptionPlaceholder')"
            />
          </div>
        </div>

        <!-- Imágenes -->
        <div class="form-section">
          <div class="section-header">
            <i class="pi pi-images"></i>
            <h2>{{ t('rental.addVehicle.fields.photos') }}</h2>
          </div>

          <div class="form-field full-width">
            <label>{{ t('rental.addVehicle.fields.uploadPhotos') }}</label>
            <div class="image-upload-area">
              <pv-file-upload 
                name="images"
                :multiple="true"
                accept="image/*"
                :max-file-size="5000000"
                @select="onImageSelect"
                :show-upload-button="false"
                :show-cancel-button="false"
              >
                <template #empty>
                  <div class="upload-placeholder">
                    <i class="pi pi-cloud-upload"></i>
                    <p>Arrastra imágenes aquí o haz clic para seleccionar</p>
                    <small>PNG, JPG hasta 5MB</small>
                  </div>
                </template>
              </pv-file-upload>
            </div>

            <div v-if="formData.images && formData.images.length > 0" class="image-preview-grid">
              <div 
                v-for="(image, index) in formData.images" 
                :key="index"
                class="image-preview-item"
              >
                <img :src="image" alt="Vehicle preview" />
                <button 
                  type="button"
                  @click="removeImage(index)" 
                  class="btn-remove-image"
                >
                  <i class="pi pi-times"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Botones de Acción -->
        <div class="form-actions">
          <pv-button 
            label="Cancelar" 
            severity="secondary" 
            outlined
            @click="goBack"
            type="button"
          />
          <pv-button 
            label="Guardar Cambios" 
            icon="pi pi-check"
            :loading="isSubmitting"
            type="submit"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/app/iam/application/user.store'
import { RentalApi } from '@/app/rental/infrastructure/rental-api.js'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const loading = ref(true)
const isSubmitting = ref(false)
const vehicle = ref(null)

const formData = reactive({
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  color: '',
  transmission: '',
  fuelType: '',
  seats: 5,
  licensePlate: '',
  location: {
    district: '',
    address: '',
    lat: -12.0464,
    lng: -77.0428
  },
  dailyPrice: 150,
  status: 'active',
  description: '',
  images: []
})

const errors = reactive({
  brand: '',
  model: '',
  year: '',
  color: '',
  transmission: '',
  fuelType: '',
  seats: '',
  licensePlate: '',
  district: '',
  dailyPrice: ''
})

// Opciones para los selects
const colorOptions = [
  'Blanco', 'Negro', 'Gris', 'Plata', 'Rojo', 'Azul', 
  'Verde', 'Amarillo', 'Naranja', 'Marrón', 'Otro'
]

const transmissionOptions = ['Manual', 'Automática', 'CVT']

const fuelTypeOptions = ['Gasolina', 'Diésel', 'GLP', 'Eléctrico', 'Híbrido']

const statusOptions = [
  { label: 'Activo', value: 'active' },
  { label: 'Pausado', value: 'paused' }
]

const districtOptions = [
  'Miraflores', 'San Isidro', 'Barranco', 'Surco', 'La Molina',
  'San Borja', 'Lince', 'Jesús María', 'Pueblo Libre', 'Magdalena',
  'San Miguel', 'Callao', 'Chorrillos', 'Surquillo', 'Lima',
  'Ate', 'Los Olivos', 'Independencia', 'San Juan de Lurigancho', 'Otro'
]

onMounted(async () => {
  await loadVehicle()
})

async function loadVehicle() {
  try {
    loading.value = true
    
    // Verificar que el usuario está autenticado
    if (!userStore.currentUser.value) {
      alert('Debes iniciar sesión para editar vehículos')
      router.push('/auth/login')
      return
    }
    
    const vehicleId = route.params.id
    vehicle.value = await RentalApi.getVehicle(vehicleId)
    
    // Debug: Verificar IDs
    console.log('🚗 Vehicle Owner ID:', vehicle.value.ownerId, typeof vehicle.value.ownerId)
    console.log('👤 Current User ID:', userStore.currentUser.value?.id, typeof userStore.currentUser.value?.id)
    
    // Verificar que el usuario es el dueño (comparación flexible)
    if (String(vehicle.value.ownerId) !== String(userStore.currentUser.value?.id)) {
      alert('No tienes permiso para editar este vehículo')
      router.push('/rental/my-vehicles')
      return
    }

    // Cargar datos en el formulario
    Object.assign(formData, vehicle.value)
    
    // Asegurar que images sea un array
    if (!formData.images) {
      formData.images = []
    }
  } catch (error) {
    console.error('Error loading vehicle:', error)
  } finally {
    loading.value = false
  }
}

function validateForm() {
  let isValid = true
  
  // Reset errors
  Object.keys(errors).forEach(key => errors[key] = '')

  if (!formData.brand.trim()) {
    errors.brand = 'La marca es requerida'
    isValid = false
  }

  if (!formData.model.trim()) {
    errors.model = 'El modelo es requerido'
    isValid = false
  }

  if (!formData.year || formData.year < 1990 || formData.year > 2025) {
    errors.year = 'Ingresa un año válido (1990-2025)'
    isValid = false
  }

  if (!formData.color) {
    errors.color = 'Selecciona un color'
    isValid = false
  }

  if (!formData.transmission) {
    errors.transmission = 'Selecciona la transmisión'
    isValid = false
  }

  if (!formData.fuelType) {
    errors.fuelType = 'Selecciona el tipo de combustible'
    isValid = false
  }

  if (!formData.seats || formData.seats < 2 || formData.seats > 9) {
    errors.seats = 'Ingresa un número de asientos válido (2-9)'
    isValid = false
  }

  if (!formData.licensePlate.trim()) {
    errors.licensePlate = 'La placa es requerida'
    isValid = false
  }

  if (!formData.location.district) {
    errors.district = 'Selecciona un distrito'
    isValid = false
  }

  if (!formData.dailyPrice || formData.dailyPrice < 50) {
    errors.dailyPrice = 'El precio debe ser mayor a S/ 50'
    isValid = false
  }

  return isValid
}

async function handleSubmit() {
  if (!validateForm()) {
    // Mostrar alerta de validación
    alert('Por favor completa todos los campos requeridos correctamente')
    return
  }

  try {
    isSubmitting.value = true

    const vehicleData = {
      ...formData,
      updatedAt: new Date().toISOString()
    }

    await RentalApi.updateVehicle(vehicle.value.id, vehicleData)
    
    // Mostrar mensaje de éxito
    alert('✅ Vehículo actualizado exitosamente!')
    
    // Redirigir después de un breve momento
    setTimeout(() => {
      router.push('/rental/my-vehicles')
    }, 500)
  } catch (error) {
    console.error('Error updating vehicle:', error)
    alert('❌ Error al actualizar el vehículo. Por favor intenta nuevamente.\n\nDetalles: ' + (error.message || 'Error desconocido'))
  } finally {
    isSubmitting.value = false
  }
}

function onImageSelect(event) {
  const files = event.files
  files.forEach(file => {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (!formData.images) {
        formData.images = []
      }
      formData.images.push(e.target.result)
    }
    reader.readAsDataURL(file)
  })
}

function removeImage(index) {
  formData.images.splice(index, 1)
}

function goBack() {
  router.push('/rental/my-vehicles')
}
</script>

<style scoped>
.edit-vehicle-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
  text-align: center;
  position: relative;
}

.btn-back {
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: transparent;
  color: var(--accent-orange);
  border: 2px solid var(--accent-orange);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 600;
}

.btn-back:hover {
  background: var(--accent-orange);
  color: white;
}

.page-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary-dark);
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.page-header h1 i {
  color: var(--accent-orange);
}

.subtitle {
  color: var(--neutral-gray);
  font-size: 1.125rem;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: 1rem;
}

.loading-container i,
.error-container i {
  font-size: 4rem;
  color: var(--accent-orange);
}

.error-container h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary-dark);
  margin: 0;
}

.error-container p {
  color: var(--neutral-gray);
}

.form-container {
  background: white;
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.vehicle-form {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid var(--accent-orange);
}

.section-header i {
  font-size: 1.5rem;
  color: var(--accent-orange);
}

.section-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary-dark);
  margin: 0;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-field.full-width {
  grid-column: 1 / -1;
}

.form-field label {
  font-weight: 600;
  color: var(--primary-dark);
  font-size: 0.95rem;
}

.required {
  color: #ef4444;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.image-upload-area {
  border: 2px dashed var(--accent-orange);
  border-radius: 12px;
  overflow: hidden;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
}

.upload-placeholder i {
  font-size: 3rem;
  color: var(--accent-orange);
  margin-bottom: 1rem;
}

.upload-placeholder p {
  font-size: 1.125rem;
  color: var(--primary-dark);
  margin: 0 0 0.5rem 0;
}

.upload-placeholder small {
  color: var(--neutral-gray);
}

.image-preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.image-preview-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #e0e0e0;
}

.image-preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.btn-remove-image {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-remove-image:hover {
  background: #dc2626;
  transform: scale(1.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 2px solid #e0e0e0;
}

/* Responsive */
@media (max-width: 768px) {
  .edit-vehicle-page {
    padding: 1rem;
  }

  .form-container {
    padding: 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .btn-back {
    position: static;
    margin-bottom: 1rem;
  }

  .page-header h1 {
    font-size: 1.75rem;
  }
}

/* PrimeVue Overrides */
:deep(.p-inputtext),
:deep(.p-inputnumber-input),
:deep(.p-select),
:deep(.p-textarea) {
  border-radius: 8px;
  border: 2px solid #e0e0e0;
  padding: 0.75rem;
  font-size: 1rem;
  transition: all 0.2s;
}

:deep(.p-inputtext:focus),
:deep(.p-inputnumber-input:focus),
:deep(.p-select:focus),
:deep(.p-textarea:focus) {
  border-color: var(--accent-orange);
  box-shadow: 0 0 0 3px rgba(255, 111, 0, 0.1);
}

:deep(.p-invalid) {
  border-color: #ef4444 !important;
}

:deep(.p-button) {
  padding: 0.875rem 2rem;
  font-weight: 600;
  border-radius: 8px;
  font-size: 1rem;
}

:deep(.p-fileupload) {
  border: none;
}

:deep(.p-fileupload-buttonbar) {
  display: none;
}

:deep(.p-fileupload-content) {
  border: none;
  padding: 0;
}
</style>
