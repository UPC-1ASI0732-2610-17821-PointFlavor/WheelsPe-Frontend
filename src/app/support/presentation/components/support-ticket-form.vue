<template>
  <Dialog
    :visible="visible"
    modal
    :header="$t('support.createTicket')"
    :style="{ width: '600px' }"
    @update:visible="updateVisible"
  >
    <div class="ticket-form">
      <div class="form-group">
        <label for="type">{{ $t('support.ticketType') }} *</label>
        <Dropdown
          id="type"
          v-model="formData.type"
          :options="typeOptions"
          optionLabel="label"
          optionValue="value"
          :placeholder="$t('support.selectType')"
          :class="{ 'p-invalid': submitted && !formData.type }"
        />
        <small v-if="submitted && !formData.type" class="p-error">
          {{ $t('support.typeRequired') }}
        </small>
      </div>

      <div v-if="formData.type === 'damage'" class="form-group">
        <label for="vehicle">{{ $t('support.vehicle') }} *</label>
        <Dropdown
          id="vehicle"
          v-model="formData.vehicleId"
          :options="vehicleOptions"
          optionLabel="name"
          optionValue="id"
          :placeholder="$t('support.selectVehicle')"
          :class="{ 'p-invalid': submitted && formData.type === 'damage' && !formData.vehicleId }"
        />
        <small v-if="submitted && formData.type === 'damage' && !formData.vehicleId" class="p-error">
          {{ $t('support.vehicleRequired') }}
        </small>
      </div>

      <div v-if="formData.type === 'damage' && formData.vehicleId && rentalOptions.length > 0" class="form-group">
        <label for="rental">{{ $t('support.rental') }} *</label>
        <Dropdown
          id="rental"
          v-model="formData.rentalId"
          :options="rentalOptions"
          optionLabel="name"
          optionValue="id"
          :placeholder="$t('support.selectRental')"
          :class="{ 'p-invalid': submitted && formData.type === 'damage' && !formData.rentalId }"
        />
        <small v-if="submitted && formData.type === 'damage' && rentalOptions.length > 0 && !formData.rentalId" class="p-error">
          {{ $t('support.rentalRequired') }}
        </small>
      </div>

      <!-- Información del arrendatario que causó el daño -->
      <div v-if="formData.type === 'damage' && formData.rentalId && selectedRentalInfo" class="renter-damage-card">
        <div class="renter-damage-header">
          <i class="pi pi-exclamation-triangle"></i>
          <span class="header-title">{{ $t('support.damageResponsible') }}</span>
        </div>
        <div class="renter-damage-body">
          <div class="renter-avatar">
            <span class="renter-initials">{{ getRenterInitials(selectedRentalInfo.renterName) }}</span>
          </div>
          <div class="renter-details">
            <div class="detail-row">
              <i class="pi pi-user"></i>
              <div>
                <label>{{ $t('support.renterName') }}</label>
                <strong>{{ selectedRentalInfo.renterName }}</strong>
              </div>
            </div>
            <div class="detail-row">
              <i class="pi pi-calendar"></i>
              <div>
                <label>{{ $t('support.rentalPeriod') }}</label>
                <strong>{{ formatDateRange(selectedRentalInfo.startDate, selectedRentalInfo.endDate) }}</strong>
              </div>
            </div>
            <div class="detail-row">
              <i class="pi pi-id-card"></i>
              <div>
                <label>{{ $t('support.rentalId') }}</label>
                <strong>#{{ selectedRentalInfo.id }}</strong>
              </div>
            </div>
            <div class="detail-row">
              <i class="pi pi-dollar"></i>
              <div>
                <label>{{ $t('support.rentalValue') }}</label>
                <strong>${{ selectedRentalInfo.totalPrice }}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label for="priority">{{ $t('support.priorityLabel') }} *</label>
        <Dropdown
          id="priority"
          v-model="formData.priority"
          :options="priorityOptions"
          optionLabel="label"
          optionValue="value"
          :placeholder="$t('support.selectPriority')"
          :class="{ 'p-invalid': submitted && !formData.priority }"
        />
        <small v-if="submitted && !formData.priority" class="p-error">
          {{ $t('support.priorityRequired') }}
        </small>
      </div>

      <div class="form-group">
        <label for="subject">{{ $t('support.subject') }} *</label>
        <InputText
          id="subject"
          v-model="formData.subject"
          :placeholder="$t('support.subjectPlaceholder')"
          :class="{ 'p-invalid': submitted && !formData.subject }"
        />
        <small v-if="submitted && !formData.subject" class="p-error">
          {{ $t('support.subjectRequired') }}
        </small>
      </div>

      <div class="form-group">
        <label for="description">{{ $t('support.description') }} *</label>
        <Textarea
          id="description"
          v-model="formData.description"
          :placeholder="$t('support.descriptionPlaceholder')"
          rows="5"
          :class="{ 'p-invalid': submitted && !formData.description }"
        />
        <small v-if="submitted && !formData.description" class="p-error">
          {{ $t('support.descriptionRequired') }}
        </small>
      </div>

      <div v-if="formData.type === 'damage'" class="form-group">
        <label for="estimatedCost">{{ $t('support.estimatedCost') }}</label>
        <InputNumber
          id="estimatedCost"
          v-model="formData.estimatedCost"
          mode="currency"
          currency="PEN"
          locale="es-PE"
          :placeholder="$t('support.estimatedCostPlaceholder')"
        />
      </div>

      <div class="form-group">
        <label for="attachments">{{ $t('support.attachments') }}</label>
        <FileUpload
          mode="basic"
          name="attachments[]"
          accept="image/*"
          :maxFileSize="5000000"
          :multiple="true"
          :auto="false"
          chooseLabel="Seleccionar archivos"
          @select="onFileSelect"
        />
        <small class="p-help">{{ $t('support.attachmentsHelp') }}</small>
        
        <div v-if="formData.attachments.length > 0" class="attachments-list">
          <div v-for="(file, index) in formData.attachments" :key="index" class="attachment-item">
            <span>{{ file }}</span>
            <Button
              icon="pi pi-times"
              text
              rounded
              severity="danger"
              size="small"
              @click="removeAttachment(index)"
            />
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <Button
        :label="$t('common.cancel')"
        severity="secondary"
        @click="closeDialog"
      />
      <Button
        :label="$t('support.submitTicket')"
        :loading="loading"
        @click="submitTicket"
      />
    </template>
  </Dialog>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import InputNumber from 'primevue/inputnumber'
import FileUpload from 'primevue/fileupload'
import { useSupportStore } from '@/app/support/application/support.store.js'
import { useRentalStore } from '@/app/rental/application/rental.store'
import { IamApi } from '@/app/iam/infrastructure/iam-api.js'
import { useUserStore } from '@/app/iam/application/user.store.js'
import { useToast } from 'primevue/usetoast'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:visible', 'created'])

const { t } = useI18n()
const toast = useToast()
const supportStore = useSupportStore()
const rentalStore = useRentalStore()
const userStore = useUserStore()

const submitted = ref(false)
const loading = ref(false)
const rentals = ref([])
const vehicles = ref([])

const formData = ref({
  type: null,
  vehicleId: null,
  rentalId: null,
  renterId: null,
  priority: 'medium',
  subject: '',
  description: '',
  estimatedCost: 0,
  attachments: []
})

const typeOptions = [
  { label: t('support.type.damage'), value: 'damage' },
  { label: t('support.type.complaint'), value: 'complaint' },
  { label: t('support.type.question'), value: 'question' },
  { label: t('support.type.technical'), value: 'technical' },
  { label: t('support.type.other'), value: 'other' }
]

const priorityOptions = [
  { label: t('support.priority.low'), value: 'low' },
  { label: t('support.priority.medium'), value: 'medium' },
  { label: t('support.priority.high'), value: 'high' },
  { label: t('support.priority.urgent'), value: 'urgent' }
]

// Cargar vehículos y rentas reales
const loadData = async () => {
  await rentalStore.loadRentals()
  await rentalStore.loadVehicles()
  
  const user = userStore.currentUser.value
  if (user) {
    
    if (user.role === 'owner') {
      // Owner: obtener todas las rentas completadas de sus vehículos
      const allRentals = rentalStore.state.rentals
      const completedRentals = allRentals.filter(r => r.status === 'completed')

      // Obtener IDs de vehículos del owner que tienen rentas completadas
      const ownerVehicles = rentalStore.state.vehicles.filter(v => v.ownerId === user.id)
      const vehiclesWithCompletedRentals = ownerVehicles.filter(v => 
        completedRentals.some(r => r.vehicleId === v.id)
      )

      // Cargar users para enriquecer renterName si no está presente
      let usersMap = {}
      try {
        const users = await IamApi.listUsers()
        usersMap = users.reduce((acc, u) => {
          acc[u.id] = `${u.firstName} ${u.lastName}`
          return acc
        }, {})
      } catch (err) {
        console.warn('No se pudieron cargar usuarios para enriquecer rentas:', err)
      }

      vehicles.value = vehiclesWithCompletedRentals
      const vehicleIds = vehicles.value.map(v => v.id)
      // Añadir renterName a las rentas si falta
      rentals.value = completedRentals
        .filter(r => vehicleIds.includes(r.vehicleId))
        .map(r => ({
          ...r,
          renterName: r.renterName || usersMap[r.renterId] || ''
        }))

      console.log('🚗 Vehículos con rentas completadas:', vehicles.value.length)
      console.log('📋 Rentas completadas:', rentals.value.length)
    } else {
      // Renter: mostrar sus rentas
      rentals.value = rentalStore.state.rentals.filter(r => r.renterId === user.id)
      const vehicleIds = rentals.value.map(r => r.vehicleId)
      vehicles.value = rentalStore.state.vehicles.filter(v => vehicleIds.includes(v.id))
    }
  } else {
    console.warn('No current user found in userStore when loading support ticket form')
    vehicles.value = []
    rentals.value = []
  }
}

const vehicleOptions = computed(() => {
  return vehicles.value.map(v => ({
    id: v.id,
    name: `${v.brand} ${v.model} ${v.year} - ${v.licensePlate}`
  }))
})

const rentalOptions = computed(() => {
  const selectedVehicle = vehicles.value.find(v => Number(v.id) === Number(formData.value.vehicleId))
  if (!selectedVehicle) return []
  
  return rentals.value
    .filter(r => Number(r.vehicleId) === Number(formData.value.vehicleId))
    .map(r => ({
      id: r.id,
      name: `Alquiler #${r.id} - ${r.renterName} (${new Date(r.startDate).toLocaleDateString()} - ${new Date(r.endDate).toLocaleDateString()})`,
      renterId: r.renterId,
      renterName: r.renterName
    }))
})

// Información del rental seleccionado
const selectedRentalInfo = computed(() => {
  if (!formData.value.rentalId) return null
  return rentals.value.find(r => r.id === formData.value.rentalId)
})

// Obtener iniciales del arrendatario
const getRenterInitials = (name) => {
  if (!name) return '?'
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return parts[0][0].toUpperCase()
}

// Formatear rango de fechas
const formatDateRange = (start, end) => {
  const startDate = new Date(start).toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  })
  const endDate = new Date(end).toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  })
  return `${startDate} - ${endDate}`
}

onMounted(() => {
  loadData()
})

const updateVisible = (value) => {
  emit('update:visible', value)
}

const closeDialog = () => {
  resetForm()
  updateVisible(false)
}

const resetForm = () => {
  formData.value = {
    type: null,
    vehicleId: null,
    rentalId: null,
    renterId: null,
    priority: 'medium',
    subject: '',
    description: '',
    estimatedCost: 0,
    attachments: []
  }
  submitted.value = false
}

const onFileSelect = (event) => {
  // Simulamos URLs de archivos subidos
  const files = event.files
  files.forEach(file => {
    formData.value.attachments.push(`https://example.com/uploads/${file.name}`)
  })
}

const removeAttachment = (index) => {
  formData.value.attachments.splice(index, 1)
}

const validateForm = () => {
  if (!formData.value.type) return false
  if (!formData.value.priority) return false
  if (!formData.value.subject) return false
  if (!formData.value.description) return false
  if (formData.value.type === 'damage' && !formData.value.vehicleId) return false
  
  return true
}

const submitTicket = async () => {
  submitted.value = true

  if (!validateForm()) {
    toast.add({
      severity: 'error',
      summary: t('common.error'),
      detail: t('support.fillRequiredFields'),
      life: 3000
    })
    return
  }

  loading.value = true

  try {
    const user = userStore.currentUser.value
    if (!user) throw new Error('No authenticated user')

    const ticketData = {
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      userRole: user.role,
      type: formData.value.type,
      subject: formData.value.subject,
      description: formData.value.description,
      priority: formData.value.priority,
      attachments: formData.value.attachments
    }

    if (formData.value.vehicleId) {
      ticketData.vehicleId = formData.value.vehicleId
      const vehicle = vehicleOptions.value.find(v => Number(v.id) === Number(formData.value.vehicleId))
      ticketData.vehicleName = vehicle?.name || ''
    }

    if (formData.value.rentalId) {
      ticketData.rentalId = formData.value.rentalId
      const rental = rentalOptions.value.find(r => Number(r.id) === Number(formData.value.rentalId))
      if (rental) {
        ticketData.renterId = rental.renterId
        ticketData.renterName = rental.renterName
      }
    }

    if (formData.value.estimatedCost) {
      ticketData.estimatedCost = formData.value.estimatedCost
    }

    // Crear el ticket (si es damage y tiene renterId, se creará notificación automática)
    await supportStore.createTicket(ticketData)

    toast.add({
      severity: 'success',
      summary: t('common.success'),
      detail: t('support.ticketCreatedSuccess'),
      life: 3000
    })

    emit('created')
    closeDialog()
  } catch (error) {
    console.error('Error creating ticket:', error)
    toast.add({
      severity: 'error',
      summary: t('common.error'),
      detail: t('support.ticketCreatedError'),
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

// Resetear campos específicos cuando cambia el tipo
watch(() => formData.value.type, (newType) => {
  if (newType !== 'damage') {
    formData.value.vehicleId = null
    formData.value.rentalId = null
    formData.value.renterId = null
    formData.value.estimatedCost = 0
  }
})

// Resetear rental cuando cambia el vehículo
watch(() => formData.value.vehicleId, () => {
  formData.value.rentalId = null
  formData.value.renterId = null
})

// Actualizar renterId y renterName cuando selecciona un rental
watch(() => formData.value.rentalId, (newRentalId) => {
  if (newRentalId) {
    const rental = rentals.value.find(r => r.id === newRentalId)
    if (rental) {
      formData.value.renterId = rental.renterId
    }
  }
})
</script>

<style scoped>
.ticket-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: var(--text-color);
}

.attachments-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.attachment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--surface-50);
  border-radius: 4px;
  font-size: 0.875rem;
}

.p-help {
  font-size: 0.75rem;
  color: var(--text-color-secondary);
}

/* Tarjeta de información del arrendatario responsable del daño */
.renter-damage-card {
  background: linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%);
  border: 2px solid #FF6F00;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(255, 111, 0, 0.15);
  margin-top: 0.5rem;
}

.renter-damage-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: linear-gradient(135deg, #FF6F00 0%, #FF8F00 100%);
  color: white;
}

.renter-damage-header i {
  font-size: 1.5rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}

.header-title {
  font-weight: 700;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.renter-damage-body {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem 1.25rem;
}

.renter-avatar {
  flex-shrink: 0;
}

.renter-initials {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #FF6F00 0%, #FF8F00 100%);
  color: white;
  font-size: 2rem;
  font-weight: 700;
  border-radius: 50%;
  box-shadow: 0 4px 8px rgba(255, 111, 0, 0.3);
}

.renter-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-row {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.detail-row i {
  font-size: 1.25rem;
  color: #FF6F00;
  margin-top: 0.25rem;
}

.detail-row > div {
  flex: 1;
}

.detail-row label {
  display: block;
  font-size: 0.75rem;
  color: #666;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.25rem;
}

.detail-row strong {
  display: block;
  font-size: 1rem;
  color: #333;
  font-weight: 600;
}
</style>
