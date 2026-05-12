<template>
  <div class="ticket-detail-page">
    <div v-if="loading" class="loading-container">
      <ProgressSpinner />
    </div>

    <Message v-else-if="error" severity="error">
      {{ error }}
    </Message>

    <div v-else-if="ticket" class="ticket-detail">
      <!-- Header -->
      <div class="ticket-header">
        <Button
          icon="pi pi-arrow-left"
          text
          @click="goBack"
          :label="$t('common.back')"
        />
        
        <div class="header-actions">
          <Tag :class="ticket.statusClass">
            {{ ticket.statusLabel }}
          </Tag>
          <Tag :severity="getPrioritySeverity(ticket.priority)">
            {{ ticket.priorityLabel }}
          </Tag>
        </div>
      </div>

      <!-- Dispute Alert Banner -->
      <div v-if="ticket.disputeStatus === 'disputed'" class="dispute-alert-banner">
        <i class="pi pi-exclamation-triangle"></i>
        <div class="dispute-alert-content">
          <h4>⚠️ Este ticket ha sido disputado por el arrendatario</h4>
          <p><strong>Motivo:</strong> {{ getDisputeReasonLabel(ticket.disputeReason) }}</p>
          <p><strong>Descripción:</strong> {{ ticket.disputeDescription }}</p>
          <p class="dispute-date">Disputado el: {{ formatDate(ticket.disputedAt) }}</p>
        </div>
      </div>

      <!-- Proof Sent Banner -->
      <div v-if="ticket.disputeStatus === 'owner_proof_sent'" class="proof-sent-banner">
        <i class="pi pi-check-circle"></i>
        <div>
          <h4>✅ Pruebas adicionales enviadas</h4>
          <p>Has enviado pruebas adicionales. El arrendatario deberá proceder con el pago.</p>
        </div>
      </div>

      <!-- Main Info -->
      <Card class="ticket-main-card">
        <template #content>
          <div class="ticket-type-badge">
            <i :class="['pi', ticket.typeIcon]"></i>
            <span>{{ ticket.typeLabel }}</span>
          </div>
          
          <h1 class="ticket-title">{{ ticket.subject }}</h1>
          
          <div class="ticket-meta-info">
            <div class="meta-item">
              <i class="pi pi-user"></i>
              <span>{{ ticket.userName }} ({{ ticket.userRole === 'owner' ? $t('user.owner') : $t('user.renter') }})</span>
            </div>
            <div v-if="ticket.vehicleName" class="meta-item">
              <i class="pi pi-car"></i>
              <span>{{ ticket.vehicleName }}</span>
            </div>
            <div class="meta-item">
              <i class="pi pi-calendar"></i>
              <span>{{ ticket.formattedDate }}</span>
            </div>
          </div>

          <Divider />

          <div class="ticket-description">
            <h3>{{ $t('support.description') }}</h3>
            <p>{{ ticket.description }}</p>
          </div>

          <Divider v-if="ticket.estimatedCost" />

          <div v-if="ticket.estimatedCost" class="ticket-cost-section">
            <div class="cost-label">
              <i class="pi pi-dollar"></i>
              <span>{{ $t('support.estimatedCost') }}</span>
            </div>
            <div class="cost-value">{{ ticket.formattedCost }}</div>
          </div>

          <Divider v-if="ticket.attachments && ticket.attachments.length > 0" />

          <div v-if="ticket.attachments && ticket.attachments.length > 0" class="ticket-attachments">
            <h3>{{ $t('support.attachments') }}</h3>
            <div class="attachments-grid">
              <Image
                v-for="(attachment, index) in ticket.attachments"
                :key="index"
                :src="attachment"
                :alt="`Attachment ${index + 1}`"
                width="150"
                preview
              />
            </div>
          </div>

          <!-- Additional Proof Section (if sent) -->
          <Divider v-if="ticket.additionalProof && ticket.additionalProof.length > 0" />

          <div v-if="ticket.additionalProof && ticket.additionalProof.length > 0" class="additional-proof-section">
            <h3><i class="pi pi-folder-open"></i> Pruebas Adicionales Enviadas</h3>
            <p v-if="ticket.additionalProofMessage" class="proof-message">"{{ ticket.additionalProofMessage }}"</p>
            <div class="attachments-grid">
              <Image
                v-for="(proof, index) in ticket.additionalProof"
                :key="index"
                :src="proof"
                :alt="`Prueba adicional ${index + 1}`"
                width="150"
                preview
              />
            </div>
          </div>

          <Divider v-if="ticket.resolutionNotes" />

          <div v-if="ticket.resolutionNotes" class="ticket-resolution">
            <h3>{{ $t('support.resolutionNotes') }}</h3>
            <p>{{ ticket.resolutionNotes }}</p>
            <div v-if="ticket.resolvedAt" class="resolved-date">
              <i class="pi pi-check-circle"></i>
              <span>{{ $t('support.resolvedAt') }}: {{ new Date(ticket.resolvedAt).toLocaleString() }}</span>
            </div>
          </div>
        </template>
      </Card>

      <!-- Actions Card -->
      <Card v-if="ticket.isOpen" class="actions-card">
        <template #content>
          <h3>{{ $t('support.actions') }}</h3>
          
          <div class="actions-buttons">
            <!-- Si hay disputa y el owner aún no ha respondido -->
            <Button
              v-if="ticket.disputeStatus === 'disputed'"
              label="Enviar Pruebas Adicionales"
              icon="pi pi-upload"
              severity="warning"
              @click="showProofDialog = true"
            />
            
            <Button
              v-if="ticket.requiresPayment"
              :label="$t('support.proceedToPayment')"
              icon="pi pi-credit-card"
              severity="danger"
              @click="proceedToPayment"
            />
            
            <Button
              v-if="canCloseTicket"
              :label="$t('support.closeTicket')"
              icon="pi pi-check"
              severity="success"
              outlined
              @click="showCloseDialog = true"
            />
            
            <Button
              :label="$t('support.updateTicket')"
              icon="pi pi-pencil"
              outlined
              @click="showUpdateDialog = true"
            />
          </div>
        </template>
      </Card>

      <!-- Close Ticket Dialog -->
      <Dialog
        v-model:visible="showCloseDialog"
        :header="$t('support.closeTicket')"
        modal
        :style="{ width: '500px' }"
      >
        <div class="close-dialog-content">
          <p>{{ $t('support.closeTicketConfirm') }}</p>
          <Textarea
            v-model="resolutionNotes"
            :placeholder="$t('support.resolutionNotesPlaceholder')"
            rows="5"
          />
        </div>
        
        <template #footer>
          <Button
            :label="$t('common.cancel')"
            severity="secondary"
            @click="showCloseDialog = false"
          />
          <Button
            :label="$t('support.closeTicket')"
            severity="success"
            :loading="updating"
            @click="closeTicket"
          />
        </template>
      </Dialog>

      <!-- Send Additional Proof Dialog -->
      <Dialog
        v-model:visible="showProofDialog"
        header="Enviar Pruebas Adicionales"
        modal
        :style="{ width: '600px' }"
      >
        <div class="proof-dialog-content">
          <div class="proof-info">
            <i class="pi pi-info-circle"></i>
            <p>El arrendatario ha disputado este reporte. Envía pruebas adicionales para respaldar tu reclamo. Una vez enviadas, el arrendatario ya no podrá disputar nuevamente y deberá proceder con el pago.</p>
          </div>

          <div class="form-group">
            <label>Mensaje para el arrendatario</label>
            <Textarea
              v-model="proofMessage"
              placeholder="Explica por qué las pruebas adicionales respaldan tu reclamo..."
              rows="3"
            />
          </div>

          <div class="form-group">
            <label>Subir pruebas adicionales (imágenes)</label>
            <div class="upload-area">
              <input 
                type="file" 
                accept="image/*" 
                multiple 
                @change="handleProofUpload"
                id="proof-upload"
              />
              <label for="proof-upload" class="upload-label">
                <i class="pi pi-cloud-upload"></i>
                <span>{{ proofFiles.length > 0 ? `${proofFiles.length} archivo(s) seleccionado(s)` : 'Clic para seleccionar imágenes' }}</span>
              </label>
            </div>
          </div>

          <div v-if="proofFiles.length > 0" class="selected-files">
            <div v-for="(file, index) in proofFiles" :key="index" class="file-item">
              <i class="pi pi-image"></i>
              <span>{{ file.name }}</span>
              <button @click="removeProofFile(index)" class="remove-btn">
                <i class="pi pi-times"></i>
              </button>
            </div>
          </div>
        </div>
        
        <template #footer>
          <Button
            label="Cancelar"
            severity="secondary"
            @click="showProofDialog = false"
          />
          <Button
            label="Enviar Pruebas"
            icon="pi pi-send"
            severity="warning"
            :loading="sendingProof"
            :disabled="proofFiles.length === 0"
            @click="sendAdditionalProof"
          />
        </template>
      </Dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Divider from 'primevue/divider'
import Image from 'primevue/image'
import Dialog from 'primevue/dialog'
import Textarea from 'primevue/textarea'
import ProgressSpinner from 'primevue/progressspinner'
import Message from 'primevue/message'
import { useSupportStore } from '@/app/support/application/support.store.js'
import { useUserStore } from '@/app/iam/application/user.store.js'
import { apiClient } from '@/app/shared/infrastructure/apiClient.js'
import { useToast } from 'primevue/usetoast'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const toast = useToast()
const supportStore = useSupportStore()

const showCloseDialog = ref(false)
const showUpdateDialog = ref(false)
const showProofDialog = ref(false)
const resolutionNotes = ref('')
const updating = ref(false)
const sendingProof = ref(false)
const proofMessage = ref('')
const proofFiles = ref([])

const ticket = computed(() => supportStore.state.currentTicket)
const loading = computed(() => supportStore.state.loading)
const error = computed(() => supportStore.state.error)

const userStore = useUserStore()
const canCloseTicket = computed(() => {
  const currentUser = userStore.currentUser.value
  if (!currentUser || !ticket.value) return false
  return Number(ticket.value.userId) === Number(currentUser.id) || currentUser.role === 'admin'
})

const disputeReasonLabels = {
  damage_preexisting: 'El daño ya existía antes del alquiler',
  not_caused_by_me: 'No fue responsable del daño',
  exaggerated_cost: 'El costo está exagerado',
  false_report: 'El reporte es falso',
  other: 'Otro motivo'
}

function getDisputeReasonLabel(reason) {
  return disputeReasonLabels[reason] || reason
}

function formatDate(dateString) {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getPrioritySeverity = (priority) => {
  const severityMap = {
    low: 'info',
    medium: 'warning',
    high: 'danger',
    urgent: 'danger'
  }
  return severityMap[priority] || 'info'
}

const goBack = () => {
  router.push('/support/tickets')
}

const proceedToPayment = () => {
  router.push(`/payments/damage/${ticket.value.id}`)
}

const closeTicket = async () => {
  updating.value = true
  
  try {
    await supportStore.closeTicket(ticket.value.id, resolutionNotes.value)
    
    toast.add({
      severity: 'success',
      summary: t('common.success'),
      detail: t('support.ticketClosedSuccess'),
      life: 3000
    })
    
    showCloseDialog.value = false
    resolutionNotes.value = ''
  } catch (error) {
    console.error('Error closing ticket:', error)
    toast.add({
      severity: 'error',
      summary: t('common.error'),
      detail: t('support.ticketClosedError'),
      life: 3000
    })
  } finally {
    updating.value = false
  }
}

function handleProofUpload(event) {
  const files = Array.from(event.target.files)
  proofFiles.value = [...proofFiles.value, ...files]
}

function removeProofFile(index) {
  proofFiles.value.splice(index, 1)
}

async function sendAdditionalProof() {
  if (proofFiles.value.length === 0) {
    alert('Por favor selecciona al menos una imagen')
    return
  }
  
  sendingProof.value = true
  
  try {
    // En un escenario real, subiríamos las imágenes a un servidor
    // Por ahora, simulamos URLs de imágenes
    const proofUrls = proofFiles.value.map((file, index) => 
      `https://placehold.co/400x300/f59e0b/ffffff?text=Prueba+${index + 1}`
    )
    
    // Actualizar ticket
    await apiClient.patch(`/support-tickets/${ticket.value.id}`, {
      disputeStatus: 'owner_proof_sent',
      additionalProof: proofUrls,
      additionalProofMessage: proofMessage.value,
      additionalProofSentAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
    
    // Notificar al renter
    await createProofSentNotification()
    
    toast.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Pruebas adicionales enviadas correctamente',
      life: 3000
    })
    
    showProofDialog.value = false
    proofFiles.value = []
    proofMessage.value = ''
    
    // Recargar ticket
    await loadTicket()
  } catch (err) {
    console.error('Error sending proof:', err)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Error al enviar las pruebas',
      life: 3000
    })
  } finally {
    sendingProof.value = false
  }
}

async function createProofSentNotification() {
  try {
    const notification = {
      userId: ticket.value.renterId,
      type: 'dispute_proof_received',
      title: '📋 Pruebas Adicionales Recibidas',
      body: `El propietario ha enviado pruebas adicionales para el ticket #${ticket.value.id}. Ya no puedes disputar nuevamente. Debes proceder con el pago.`,
      relatedId: ticket.value.id,
      relatedType: 'ticket',
      read: false,
      actionUrl: `/payments/ticket/${ticket.value.id}`,
      actionLabel: 'Ver Ticket y Pagar',
      metadata: {
        ticketId: ticket.value.id,
        vehicleId: ticket.value.vehicleId
      },
      createdAt: new Date().toISOString()
    }
    
    await apiClient.post('/notifications', notification)
  } catch (err) {
    console.error('Error creating notification:', err)
  }
}

const loadTicket = async () => {
  const ticketId = route.params.id
  await supportStore.fetchTicket(ticketId)
}

onMounted(() => {
  loadTicket()
})
</script>

<style scoped>
.ticket-detail-page {
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.loading-container {
  display: flex;
  justify-content: center;
  padding: 4rem;
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

/* Dispute Alert Banner */
.dispute-alert-banner {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 12px;
  margin-bottom: 1.5rem;
  border-left: 5px solid #f59e0b;
}

.dispute-alert-banner > i {
  font-size: 2rem;
  color: #d97706;
  flex-shrink: 0;
}

.dispute-alert-content h4 {
  margin: 0 0 0.75rem 0;
  color: #92400e;
  font-size: 1.1rem;
}

.dispute-alert-content p {
  margin: 0 0 0.5rem 0;
  color: #78350f;
  line-height: 1.5;
}

.dispute-date {
  font-size: 0.85rem;
  color: #a16207;
  margin-top: 0.5rem !important;
}

/* Proof Sent Banner */
.proof-sent-banner {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  border-radius: 12px;
  margin-bottom: 1.5rem;
  border-left: 5px solid #22c55e;
}

.proof-sent-banner > i {
  font-size: 2rem;
  color: #16a34a;
}

.proof-sent-banner h4 {
  margin: 0 0 0.25rem 0;
  color: #166534;
}

.proof-sent-banner p {
  margin: 0;
  color: #15803d;
  font-size: 0.9rem;
}

.ticket-main-card {
  margin-bottom: 2rem;
}

.ticket-type-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--surface-100);
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-color-secondary);
  margin-bottom: 1rem;
}

.ticket-title {
  margin: 0 0 1.5rem 0;
  font-size: 2rem;
  font-weight: 600;
  color: var(--text-color);
}

.ticket-meta-info {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  font-size: 0.95rem;
  color: var(--text-color-secondary);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.meta-item i {
  color: var(--primary-color);
}

.ticket-description h3,
.ticket-attachments h3,
.ticket-resolution h3 {
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-color);
}

.ticket-description p,
.ticket-resolution p {
  margin: 0;
  line-height: 1.6;
  color: var(--text-color-secondary);
}

.ticket-cost-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: linear-gradient(135deg, var(--red-50) 0%, var(--orange-50) 100%);
  border-radius: 8px;
}

.cost-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-color);
}

.cost-label i {
  font-size: 1.5rem;
  color: var(--red-500);
}

.cost-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--red-600);
}

.attachments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

/* Additional Proof Section */
.additional-proof-section {
  padding: 1rem;
  background: #ecfdf5;
  border-radius: 8px;
  border-left: 4px solid #22c55e;
}

.additional-proof-section h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #166534;
}

.additional-proof-section .proof-message {
  font-style: italic;
  color: #15803d;
  padding: 0.75rem;
  background: rgba(255,255,255,0.5);
  border-radius: 6px;
  margin-bottom: 1rem;
}

.resolved-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: var(--green-50);
  border-radius: 6px;
  font-size: 0.875rem;
  color: var(--green-700);
}

.resolved-date i {
  color: var(--green-600);
}

.actions-card h3 {
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.actions-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.close-dialog-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.close-dialog-content p {
  margin: 0;
  color: var(--text-color-secondary);
}

/* Proof Dialog Styles */
.proof-dialog-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.proof-info {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  background: #fef3c7;
  border-radius: 8px;
  border-left: 4px solid #f59e0b;
}

.proof-info i {
  color: #d97706;
  flex-shrink: 0;
  font-size: 1.25rem;
}

.proof-info p {
  margin: 0;
  color: #92400e;
  font-size: 0.9rem;
  line-height: 1.5;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #475569;
}

.upload-area {
  position: relative;
}

.upload-area input[type="file"] {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.upload-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: #f8fafc;
  border: 2px dashed #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.upload-label:hover {
  border-color: #f59e0b;
  background: #fffbeb;
}

.upload-label i {
  font-size: 2.5rem;
  color: #94a3b8;
  margin-bottom: 0.5rem;
}

.upload-label span {
  color: #64748b;
  font-weight: 500;
}

.selected-files {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: #f1f5f9;
  border-radius: 6px;
}

.file-item i {
  color: #64748b;
}

.file-item span {
  flex: 1;
  font-size: 0.9rem;
  color: #475569;
}

.file-item .remove-btn {
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  color: #94a3b8;
  transition: color 0.2s;
}

.file-item .remove-btn:hover {
  color: #ef4444;
}
</style>
