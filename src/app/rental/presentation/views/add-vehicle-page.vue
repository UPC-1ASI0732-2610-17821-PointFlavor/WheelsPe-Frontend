<template>
  <div class="add-vehicle-page">
    <!-- Header con animación -->
    <div class="page-header">
      <button @click="goBack" class="btn-back">
        <i class="pi pi-arrow-left"></i>
        <span>{{ t('rental.addVehicle.actions.cancel') }}</span>
      </button>
      
      <div class="header-content">
        <div class="icon-wrapper">
          <i class="pi pi-car"></i>
        </div>
        <h1>{{ t('rental.addVehicle.title') }}</h1>
        <p class="subtitle">
          <i class="pi pi-sparkles"></i>
          {{ t('rental.addVehicle.subtitle') }}
        </p>
      </div>

      <!-- Progress Steps -->
      <div class="progress-steps">
        <div 
          v-for="(step, index) in steps" 
          :key="index"
          class="step"
          :class="{ active: currentStep === index, completed: currentStep > index }"
        >
          <div class="step-circle">
            <i v-if="currentStep > index" class="pi pi-check"></i>
            <span v-else>{{ index + 1 }}</span>
          </div>
          <span class="step-label">{{ step }}</span>
        </div>
      </div>
    </div>

    <div class="form-container">
      <form @submit.prevent="handleSubmit" class="vehicle-form">
        
        <!-- Información Básica -->
        <div class="form-section" :class="{ active: currentStep === 0 }">
          <div class="section-header">
            <div class="header-icon">
              <i class="pi pi-info-circle"></i>
            </div>
            <div class="header-text">
              <h2>{{ t('rental.addVehicle.sections.basicInfo') }}</h2>
              <p>{{ t('rental.addVehicle.subtitle') }}</p>
            </div>
          </div>

          <div class="form-row">
            <div class="form-field fancy-field">
              <div class="field-icon">
                <i class="pi pi-tag"></i>
              </div>
              <div class="field-content">
                <label for="brand">{{ t('rental.addVehicle.fields.brand') }} <span class="required">*</span></label>
                <pv-input-text 
                  id="brand"
                  v-model="formData.brand" 
                  :placeholder="t('rental.addVehicle.fields.brandPlaceholder')"
                  :class="{ 'p-invalid': errors.brand }"
                />
                <small v-if="errors.brand" class="error-message">
                  <i class="pi pi-exclamation-circle"></i>
                  {{ errors.brand }}
                </small>
              </div>
            </div>

            <div class="form-field fancy-field">
              <div class="field-icon">
                <i class="pi pi-bookmark"></i>
              </div>
              <div class="field-content">
                <label for="model">{{ t('rental.addVehicle.fields.model') }} <span class="required">*</span></label>
                <pv-input-text 
                  id="model"
                  v-model="formData.model" 
                  :placeholder="t('rental.addVehicle.fields.modelPlaceholder')"
                  :class="{ 'p-invalid': errors.model }"
                />
                <small v-if="errors.model" class="error-message">
                  <i class="pi pi-exclamation-circle"></i>
                  {{ errors.model }}
                </small>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-field fancy-field">
              <div class="field-icon">
                <i class="pi pi-calendar"></i>
              </div>
              <div class="field-content">
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
                <small v-if="errors.year" class="error-message">
                  <i class="pi pi-exclamation-circle"></i>
                  {{ errors.year }}
                </small>
              </div>
            </div>

            <div class="form-field fancy-field">
              <div class="field-icon">
                <i class="pi pi-palette"></i>
              </div>
              <div class="field-content">
                <label for="color">{{ t('rental.addVehicle.fields.color') }} <span class="required">*</span></label>
                <pv-select 
                  id="color"
                  v-model="formData.color" 
                  :options="colorOptions"
                  :placeholder="t('rental.addVehicle.fields.colorPlaceholder')"
                  :class="{ 'p-invalid': errors.color }"
                />
                <small v-if="errors.color" class="error-message">
                  <i class="pi pi-exclamation-circle"></i>
                  {{ errors.color }}
                </small>
              </div>
            </div>
          </div>
        </div>

        <!-- Especificaciones Técnicas -->
        <div class="form-section" :class="{ active: currentStep === 1 }">
          <div class="section-header">
            <div class="header-icon">
              <i class="pi pi-cog"></i>
            </div>
            <div class="header-text">
              <h2>{{ t('rental.addVehicle.sections.specifications') }}</h2>
              <p>{{ t('rental.addVehicle.sections.specificationsDesc') }}</p>
            </div>
          </div>

          <div class="form-row">
            <div class="form-field fancy-field">
              <div class="field-icon">
                <i class="pi pi-sliders-h"></i>
              </div>
              <div class="field-content">
                <label for="transmission">{{ t('rental.addVehicle.fields.transmission') }} <span class="required">*</span></label>
                <pv-select 
                  id="transmission"
                  v-model="formData.transmission" 
                  :options="transmissionOptions"
                  :placeholder="t('rental.addVehicle.fields.transmissionPlaceholder')"
                  :class="{ 'p-invalid': errors.transmission }"
                />
                <small v-if="errors.transmission" class="error-message">
                  <i class="pi pi-exclamation-circle"></i>
                  {{ errors.transmission }}
                </small>
              </div>
            </div>

            <div class="form-field fancy-field">
              <div class="field-icon">
                <i class="pi pi-bolt"></i>
              </div>
              <div class="field-content">
                <label for="fuelType">{{ t('rental.addVehicle.fields.fuelType') }} <span class="required">*</span></label>
                <pv-select 
                  id="fuelType"
                  v-model="formData.fuelType" 
                  :options="fuelTypeOptions"
                  :placeholder="t('rental.addVehicle.fields.fuelTypePlaceholder')"
                  :class="{ 'p-invalid': errors.fuelType }"
                />
                <small v-if="errors.fuelType" class="error-message">
                  <i class="pi pi-exclamation-circle"></i>
                  {{ errors.fuelType }}
                </small>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-field fancy-field">
              <div class="field-icon">
                <i class="pi pi-users"></i>
              </div>
              <div class="field-content">
                <label for="seats">{{ t('rental.addVehicle.fields.seats') }} <span class="required">*</span></label>
                <pv-input-number 
                  id="seats"
                  v-model="formData.seats" 
                  :placeholder="t('rental.addVehicle.fields.seatsPlaceholder')"
                  :min="2"
                  :max="9"
                  :class="{ 'p-invalid': errors.seats }"
                />
                <small v-if="errors.seats" class="error-message">
                  <i class="pi pi-exclamation-circle"></i>
                  {{ errors.seats }}
                </small>
              </div>
            </div>

            <div class="form-field fancy-field">
              <div class="field-icon">
                <i class="pi pi-id-card"></i>
              </div>
              <div class="field-content">
                <label for="licensePlate">{{ t('rental.addVehicle.fields.licensePlate') }} <span class="required">*</span></label>
                <pv-input-text 
                  id="licensePlate"
                  v-model="formData.licensePlate" 
                  :placeholder="t('rental.addVehicle.fields.licensePlatePlaceholder')"
                  :class="{ 'p-invalid': errors.licensePlate }"
                />
                <small v-if="errors.licensePlate" class="error-message">
                  <i class="pi pi-exclamation-circle"></i>
                  {{ errors.licensePlate }}
                </small>
              </div>
            </div>
          </div>
        </div>

        <!-- Ubicación y Precio -->
        <div class="form-section" :class="{ active: currentStep === 2 }">
          <div class="section-header">
            <div class="header-icon">
              <i class="pi pi-map-marker"></i>
            </div>
            <div class="header-text">
              <h2>{{ t('rental.addVehicle.sections.location') }}</h2>
              <p>{{ t('rental.addVehicle.sections.locationDesc') }}</p>
            </div>
          </div>

          <div class="form-row">
            <div class="form-field fancy-field">
              <div class="field-icon">
                <i class="pi pi-map"></i>
              </div>
              <div class="field-content">
                <label for="district">{{ t('rental.addVehicle.fields.district') }} <span class="required">*</span></label>
                <pv-select 
                  id="district"
                  v-model="formData.location.district" 
                  :options="districtOptions"
                  :placeholder="t('rental.addVehicle.fields.districtPlaceholder')"
                  :class="{ 'p-invalid': errors.district }"
                />
                <small v-if="errors.district" class="error-message">
                  <i class="pi pi-exclamation-circle"></i>
                  {{ errors.district }}
                </small>
              </div>
            </div>

            <div class="form-field fancy-field">
              <div class="field-icon">
                <i class="pi pi-building"></i>
              </div>
              <div class="field-content">
                <label for="address">{{ t('rental.addVehicle.fields.address') }}</label>
                <pv-input-text 
                  id="address"
                  v-model="formData.location.address" 
                  :placeholder="t('rental.addVehicle.fields.addressPlaceholder')"
                />
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-field fancy-field">
              <div class="field-icon">
                <i class="pi pi-dollar"></i>
              </div>
              <div class="field-content">
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
                <small v-if="errors.dailyPrice" class="error-message">
                  <i class="pi pi-exclamation-circle"></i>
                  {{ errors.dailyPrice }}
                </small>
              </div>
            </div>

            <div class="form-field fancy-field">
              <div class="field-icon">
                <i class="pi pi-check-circle"></i>
              </div>
              <div class="field-content">
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
        </div>

        <!-- Descripción e Imágenes -->
        <div class="form-section" :class="{ active: currentStep === 3 }">
          <div class="section-header">
            <div class="header-icon">
              <i class="pi pi-images"></i>
            </div>
            <div class="header-text">
              <h2>{{ t('rental.addVehicle.sections.description') }}</h2>
              <p>{{ t('rental.addVehicle.subtitle') }}</p>
            </div>
          </div>

          <div class="form-field full-width fancy-field">
            <div class="field-icon">
              <i class="pi pi-align-left"></i>
            </div>
            <div class="field-content">
              <label for="description">{{ t('rental.addVehicle.fields.description') }}</label>
              <pv-textarea 
                id="description"
                v-model="formData.description" 
                rows="5"
                :placeholder="t('rental.addVehicle.fields.descriptionPlaceholder')"
              />
              <small class="helper-text">
                <i class="pi pi-info-circle"></i>
                {{ t('rental.addVehicle.sections.basicInfoDesc') }}
              </small>
            </div>
          </div>

          <div class="form-field full-width">
            <label>
              <i class="pi pi-camera"></i>
              {{ t('rental.addVehicle.fields.photos') }}
              <span class="badge">{{ t('rental.addVehicle.subtitle') }}</span>
            </label>
            
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
                    <div class="upload-icon-wrapper">
                      <i class="pi pi-cloud-upload"></i>
                    </div>
                    <h3>{{ t('rental.addVehicle.fields.uploadPhotos') }}</h3>
                    <p>{{ t('rental.addVehicle.fields.descriptionPlaceholder') }}</p>
                    <div class="upload-tips">
                      <span><i class="pi pi-check-circle"></i> PNG, JPG</span>
                      <span><i class="pi pi-check-circle"></i> 5MB max</span>
                    </div>
                  </div>
                </template>
              </pv-file-upload>
            </div>

            <div v-if="formData.images.length > 0" class="image-preview-grid">
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
            icon="pi pi-times"
            @click="goBack"
            type="button"
            class="btn-cancel"
          />
          <pv-button 
            :label="isSubmitting ? 'Publicando...' : 'Publicar Vehículo'" 
            icon="pi pi-check-circle"
            :loading="isSubmitting"
            type="submit"
            class="btn-submit"
          />
        </div>

        <!-- Tips Card -->
        <div class="tips-card">
          <div class="tips-header">
            <i class="pi pi-lightbulb"></i>
            <h3>💡 Tips para una mejor publicación</h3>
          </div>
          <ul class="tips-list">
            <li><i class="pi pi-check"></i> Usa fotos claras y bien iluminadas</li>
            <li><i class="pi pi-check"></i> Describe detalladamente las características</li>
            <li><i class="pi pi-check"></i> Establece un precio competitivo</li>
            <li><i class="pi pi-check"></i> Responde rápido a las solicitudes</li>
          </ul>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/app/iam/application/user.store'
import { RentalApi } from '@/app/rental/infrastructure/rental-api.js'

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()
const isSubmitting = ref(false)
const currentStep = ref(0)

const steps = [
  t('rental.addVehicle.sections.basicInfo'),
  t('rental.addVehicle.sections.specifications'),
  t('rental.addVehicle.sections.pricing'),
  t('rental.addVehicle.sections.photos')
]

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
    return
  }

  try {
    isSubmitting.value = true

    // Construir el payload según la especificación del backend
    const vehicleData = {
      ownerId: userStore.currentUser.value.id,
      brand: formData.brand,
      model: formData.model,
      year: formData.year,
      color: formData.color,
      transmission: formData.transmission,
      fuelType: formData.fuelType,
      seats: formData.seats,
      licensePlate: formData.licensePlate,
      location: {
        district: formData.location.district,
        address: formData.location.address || '',
        lat: formData.location.lat,
        lng: formData.location.lng
      },
      dailyPrice: formData.dailyPrice,
      depositAmount: formData.dailyPrice * 3, // Depósito = 3 días
      status: formData.status || 'active',
      description: formData.description || '',
      images: formData.images || [],
      features: [],
      restrictions: []
    }

    await RentalApi.createVehicle(vehicleData)
    
    router.push('/rental/my-vehicles')
  } catch (error) {
    console.error('Error creating vehicle:', error)
    alert('Error al crear el vehículo. Por favor intenta nuevamente.')
  } finally {
    isSubmitting.value = false
  }
}

function onImageSelect(event) {
  const files = event.files
  files.forEach(file => {
    const reader = new FileReader()
    reader.onload = (e) => {
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
.add-vehicle-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  min-height: 100vh;
}

.page-header {
  margin-bottom: 3rem;
  text-align: center;
  position: relative;
  animation: fadeInDown 0.6s ease;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.btn-back {
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: white;
  color: var(--accent-orange);
  border: 2px solid var(--accent-orange);
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(255, 111, 0, 0.15);
}

.btn-back:hover {
  background: var(--accent-orange);
  color: white;
  transform: translateX(-5px);
  box-shadow: 0 6px 20px rgba(255, 111, 0, 0.3);
}

.header-content {
  margin-top: 2rem;
}

.icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #FF6F00 0%, #FF8F00 100%);
  border-radius: 20px;
  margin-bottom: 1.5rem;
  box-shadow: 0 10px 30px rgba(255, 111, 0, 0.3);
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { 
    transform: translateY(0); 
  }
  50% { 
    transform: translateY(-10px); 
  }
}

.icon-wrapper i {
  font-size: 2.5rem;
  color: white;
}

.page-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary-dark);
  margin: 0 0 0.75rem 0;
  background: linear-gradient(135deg, #2C3E50 0%, #FF6F00 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  color: var(--neutral-gray);
  font-size: 1.125rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.subtitle i {
  color: #FFD700;
  font-size: 1.25rem;
  animation: sparkle 2s infinite;
}

@keyframes sparkle {
  0%, 100% { 
    opacity: 1; 
    transform: scale(1); 
  }
  50% { 
    opacity: 0.5; 
    transform: scale(1.2); 
  }
}

/* Progress Steps */
.progress-steps {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  flex: 1;
  max-width: 200px;
}

.step::after {
  content: '';
  position: absolute;
  top: 20px;
  left: 50%;
  width: 100%;
  height: 2px;
  background: #e0e0e0;
  z-index: 0;
}

.step:last-child::after {
  display: none;
}

.step.completed::after {
  background: linear-gradient(90deg, #4CAF50 0%, #8BC34A 100%);
}

.step-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e0e0e0;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
  position: relative;
  z-index: 1;
  transition: all 0.3s;
}

.step.active .step-circle {
  background: linear-gradient(135deg, #FF6F00 0%, #FF8F00 100%);
  box-shadow: 0 0 0 4px rgba(255, 111, 0, 0.2);
  transform: scale(1.1);
}

.step.completed .step-circle {
  background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
  box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.2);
}

.step-label {
  font-size: 0.875rem;
  color: var(--neutral-gray);
  font-weight: 500;
  text-align: center;
}

.step.active .step-label {
  color: var(--accent-orange);
  font-weight: 700;
}

.step.completed .step-label {
  color: #4CAF50;
  font-weight: 600;
}

.form-container {
  background: white;
  border-radius: 24px;
  padding: 3rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  animation: fadeInUp 0.6s ease 0.2s both;
}

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

.form-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #FF6F00 0%, #FF8F00 50%, #FFB74D 100%);
}

.vehicle-form {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem;
  background: #f9fafb;
  border-radius: 16px;
  border: 2px solid transparent;
  transition: all 0.3s;
}

.form-section.active {
  border-color: var(--accent-orange);
  background: white;
  box-shadow: 0 4px 20px rgba(255, 111, 0, 0.1);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e0e0e0;
}

.header-icon {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #FF6F00 0%, #FF8F00 100%);
  border-radius: 12px;
  color: white;
  font-size: 1.5rem;
  box-shadow: 0 4px 12px rgba(255, 111, 0, 0.3);
}

.header-text h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-dark);
  margin: 0 0 0.25rem 0;
}

.header-text p {
  font-size: 0.95rem;
  color: var(--neutral-gray);
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

.form-field.fancy-field {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 1rem;
  background: white;
  padding: 1.25rem;
  border-radius: 12px;
  border: 2px solid #e0e0e0;
  transition: all 0.3s;
}

.form-field.fancy-field:hover {
  border-color: var(--accent-orange);
  box-shadow: 0 4px 12px rgba(255, 111, 0, 0.1);
}

.field-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%);
  border-radius: 10px;
  color: var(--accent-orange);
  font-size: 1.25rem;
  flex-shrink: 0;
}

.field-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-field label {
  font-weight: 600;
  color: var(--primary-dark);
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.required {
  color: #ef4444;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  animation: shake 0.3s;
}

@keyframes shake {
  0%, 100% { 
    transform: translateX(0); 
  }
  25% { 
    transform: translateX(-5px); 
  }
  75% { 
    transform: translateX(5px); 
  }
}

.helper-text {
  color: var(--neutral-gray);
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.helper-text i {
  color: #2196F3;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
  color: white;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: 0.5rem;
}

.image-upload-area {
  border: 3px dashed var(--accent-orange);
  border-radius: 16px;
  overflow: hidden;
  background: linear-gradient(135deg, #FFF3E0 0%, #FFECB3 100%);
  transition: all 0.3s;
}

.image-upload-area:hover {
  border-color: #e65100;
  background: linear-gradient(135deg, #FFE0B2 0%, #FFCC80 100%);
  box-shadow: 0 4px 20px rgba(255, 111, 0, 0.2);
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
}

.upload-icon-wrapper {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 20px;
  margin-bottom: 1.5rem;
  box-shadow: 0 8px 24px rgba(255, 111, 0, 0.2);
}

.upload-icon-wrapper i {
  font-size: 3rem;
  color: var(--accent-orange);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { 
    transform: translateY(0); 
  }
  50% { 
    transform: translateY(-10px); 
  }
}

.upload-placeholder h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-dark);
  margin: 0 0 0.5rem 0;
}

.upload-placeholder p {
  font-size: 1rem;
  color: var(--neutral-gray);
  margin: 0 0 1rem 0;
}

.upload-tips {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  margin-top: 1rem;
}

.upload-tips span {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  color: #4CAF50;
  font-weight: 600;
}

.upload-tips i {
  font-size: 1rem;
}

.image-preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
  padding: 1rem;
  background: white;
  border-radius: 12px;
}

.image-preview-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  border: 3px solid #e0e0e0;
  transition: all 0.3s;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.image-preview-item:hover {
  border-color: var(--accent-orange);
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.image-preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.image-preview-item:hover img {
  transform: scale(1.1);
}

.btn-remove-image {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.95);
  color: white;
  border: 2px solid white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
  opacity: 0;
}

.image-preview-item:hover .btn-remove-image {
  opacity: 1;
}

.btn-remove-image:hover {
  background: #dc2626;
  transform: scale(1.15) rotate(90deg);
  box-shadow: 0 6px 16px rgba(239, 68, 68, 0.6);
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  padding: 2rem 0;
  margin-top: 2rem;
  border-top: 2px dashed #e0e0e0;
}

.btn-cancel {
  min-width: 180px;
}

.btn-submit {
  min-width: 220px;
  background: linear-gradient(135deg, #FF6F00 0%, #FF8F00 100%) !important;
  border: none !important;
  box-shadow: 0 8px 24px rgba(255, 111, 0, 0.4);
  transition: all 0.3s;
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(255, 111, 0, 0.5);
}

/* Tips Card */
.tips-card {
  margin-top: 2rem;
  padding: 2rem;
  background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
  border-radius: 16px;
  border: 2px solid #2196F3;
  box-shadow: 0 4px 20px rgba(33, 150, 243, 0.2);
}

.tips-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.tips-header i {
  font-size: 2rem;
  color: #FFC107;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { 
    transform: scale(1); 
  }
  50% { 
    transform: scale(1.1); 
  }
}

.tips-header h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary-dark);
  margin: 0;
}

.tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.tips-list li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: var(--primary-dark);
  padding: 0.5rem;
  background: white;
  border-radius: 8px;
}

.tips-list i {
  color: #4CAF50;
  font-size: 1rem;
}

/* Responsive */
@media (max-width: 968px) {
  .tips-list {
    grid-template-columns: 1fr;
  }

  .progress-steps {
    flex-wrap: wrap;
    gap: 1.5rem;
  }

  .step::after {
    display: none;
  }
}

@media (max-width: 768px) {
  .add-vehicle-page {
    padding: 1rem;
  }

  .form-container {
    padding: 2rem 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .btn-back {
    position: static;
    margin-bottom: 1rem;
    width: 100%;
    justify-content: center;
  }

  .page-header h1 {
    font-size: 1.75rem;
  }

  .icon-wrapper {
    width: 60px;
    height: 60px;
  }

  .icon-wrapper i {
    font-size: 2rem;
  }

  .form-section {
    padding: 1.5rem;
  }

  .form-field.fancy-field {
    flex-direction: column;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn-cancel,
  .btn-submit {
    width: 100%;
  }

  .progress-steps {
    overflow-x: auto;
    justify-content: flex-start;
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
  border-radius: 50px;
  font-size: 1rem;
  transition: all 0.3s;
}

:deep(.p-button:not(:disabled):hover) {
  transform: translateY(-2px);
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
