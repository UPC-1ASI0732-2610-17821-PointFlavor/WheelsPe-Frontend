<template>
  <div class="support-tickets-page">
    <div class="page-header">
      <h1>{{ $t('support.tickets') }}</h1>
      <Button
        :label="$t('support.createTicket')"
        icon="pi pi-plus"
        @click="showCreateDialog = true"
      />
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <Card class="stat-card">
        <template #content>
          <div class="stat-content">
            <i class="pi pi-ticket stat-icon"></i>
            <div>
              <div class="stat-value">{{ stats.total }}</div>
              <div class="stat-label">{{ $t('support.totalTickets') }}</div>
            </div>
          </div>
        </template>
      </Card>
      
      <Card class="stat-card">
        <template #content>
          <div class="stat-content">
            <i class="pi pi-clock stat-icon status-open"></i>
            <div>
              <div class="stat-value">{{ stats.open }}</div>
              <div class="stat-label">{{ $t('support.openTickets') }}</div>
            </div>
          </div>
        </template>
      </Card>
      
      <Card class="stat-card">
        <template #content>
          <div class="stat-content">
            <i class="pi pi-exclamation-circle stat-icon status-damage"></i>
            <div>
              <div class="stat-value">{{ stats.damage }}</div>
              <div class="stat-label">{{ $t('support.damageReports') }}</div>
            </div>
          </div>
        </template>
      </Card>
      
      <Card class="stat-card">
        <template #content>
          <div class="stat-content">
            <i class="pi pi-check-circle stat-icon status-closed"></i>
            <div>
              <div class="stat-value">{{ stats.closed }}</div>
              <div class="stat-label">{{ $t('support.closedTickets') }}</div>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Filters -->
    <Card class="filters-card">
      <template #content>
        <div class="filters">
          <div class="filter-group">
            <label>{{ $t('support.filterByStatus') }}</label>
            <Dropdown
              v-model="selectedStatus"
              :options="statusOptions"
              optionLabel="label"
              optionValue="value"
              :placeholder="$t('support.allStatuses')"
              showClear
            />
          </div>
          
          <div class="filter-group">
            <label>{{ $t('support.filterByType') }}</label>
            <Dropdown
              v-model="selectedType"
              :options="typeOptions"
              optionLabel="label"
              optionValue="value"
              :placeholder="$t('support.allTypes')"
              showClear
            />
          </div>
        </div>
      </template>
    </Card>

    <!-- Tickets List -->
    <div v-if="loading" class="loading-container">
      <ProgressSpinner />
    </div>

    <Message v-else-if="error" severity="error">
      {{ error }}
    </Message>

    <div v-else-if="filteredTickets.length === 0" class="empty-state">
      <i class="pi pi-inbox" style="font-size: 4rem; color: var(--text-color-secondary)"></i>
      <p>{{ $t('support.noTicketsFound') }}</p>
    </div>

    <div v-else class="tickets-grid">
      <Card
        v-for="ticket in filteredTickets"
        :key="ticket.id"
        class="ticket-card"
        @click="viewTicket(ticket.id)"
      >
        <template #content>
          <div class="ticket-header">
            <div class="ticket-type">
              <i :class="['pi', getTypeIcon(ticket.type)]"></i>
              <span>{{ getTypeLabel(ticket.type) }}</span>
            </div>
            <Tag :severity="getPrioritySeverity(ticket.priority)">
              {{ getPriorityLabel(ticket.priority) }}
            </Tag>
          </div>
          
          <h3 class="ticket-subject">{{ ticket.subject }}</h3>
          
          <p class="ticket-description">{{ ticket.description }}</p>
          
          <div class="ticket-meta">
            <div class="ticket-status">
              <Tag :severity="ticket.status === 'open' ? 'warning' : ticket.status === 'closed' ? 'success' : 'info'">
                {{ getStatusLabel(ticket.status) }}
              </Tag>
            </div>
            
            <div class="ticket-info">
              <span v-if="ticket.vehicleName" class="ticket-vehicle">
                <i class="pi pi-car"></i>
                {{ ticket.vehicleName }}
              </span>
              <span class="ticket-date">
                <i class="pi pi-calendar"></i>
                {{ formatDate(ticket.createdAt) }}
              </span>
            </div>
          </div>
          
          <div v-if="ticket.estimatedCost" class="ticket-cost">
            <strong>{{ $t('support.estimatedCost') }}:</strong>
            <span class="cost-amount">{{ formatCost(ticket.estimatedCost) }}</span>
          </div>
        </template>
      </Card>
    </div>

    <!-- Create Ticket Dialog -->
    <SupportTicketForm
      v-model:visible="showCreateDialog"
      @created="handleTicketCreated"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import Tag from 'primevue/tag'
import ProgressSpinner from 'primevue/progressspinner'
import Message from 'primevue/message'
import { useSupportStore } from '@/app/support/application/support.store.js'
import SupportTicketForm from '../components/support-ticket-form.vue'
import { useUserStore } from '@/app/iam/application/user.store.js'

const { t } = useI18n()
const router = useRouter()
const supportStore = useSupportStore()

const showCreateDialog = ref(false)
const selectedStatus = ref(null)
const selectedType = ref(null)

const tickets = computed(() => supportStore.state.tickets || [])
const stats = computed(() => supportStore.stats.value || { total: 0, open: 0, closed: 0, damage: 0 })
const loading = computed(() => supportStore.state.loading)
const error = computed(() => supportStore.state.error)

const statusOptions = [
  { label: t('support.status.open'), value: 'open' },
  { label: t('support.status.inProgress'), value: 'in_progress' },
  { label: t('support.status.resolved'), value: 'resolved' },
  { label: t('support.status.closed'), value: 'closed' }
]

const typeOptions = [
  { label: t('support.type.damage'), value: 'damage' },
  { label: t('support.type.complaint'), value: 'complaint' },
  { label: t('support.type.question'), value: 'question' },
  { label: t('support.type.technical'), value: 'technical' },
  { label: t('support.type.other'), value: 'other' }
]

const filteredTickets = computed(() => {
  let result = tickets.value

  if (selectedStatus.value) {
    result = result.filter(t => t.status === selectedStatus.value)
  }

  if (selectedType.value) {
    result = result.filter(t => t.type === selectedType.value)
  }

  return result
})

const getTypeIcon = (type) => {
  const icons = {
    'damage': 'pi-exclamation-triangle',
    'complaint': 'pi-comment',
    'question': 'pi-question-circle',
    'technical': 'pi-wrench',
    'other': 'pi-info-circle'
  }
  return icons[type] || 'pi-ticket'
}

const getTypeLabel = (type) => {
  return t(`support.type.${type}`)
}

const getPriorityLabel = (priority) => {
  return t(`support.priority.${priority}`)
}

const getStatusLabel = (status) => {
  return t(`support.status.${status}`)
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

const formatCost = (cost) => {
  return `$${cost.toFixed(2)}`
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  })
}

const viewTicket = (ticketId) => {
  router.push(`/support/tickets/${ticketId}`)
}

const handleTicketCreated = async () => {
  showCreateDialog.value = false
  await loadTickets()
}

const loadTickets = async () => {
  // Prefer userStore over localStorage to get the current authenticated user
  const userStore = useUserStore()
  const user = userStore.currentUser.value
  if (user && user.id !== undefined && user.id !== null) {
    await supportStore.fetchTickets(Number(user.id))
  } else {
    // Fallback: try localStorage if userStore is empty (check canonical key)
    const userStr = localStorage.getItem('moveo_current_user') || localStorage.getItem('user')
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr)
        await supportStore.fetchTickets(Number(parsed.id))
      } catch (err) {
        console.warn('Could not parse user from localStorage', err)
      }
    }
  }
}

onMounted(() => {
  loadTickets()
})
</script>

<style scoped>
.support-tickets-page {
  padding: 2rem;
  max-width: 100%;
  width: 100%;
  margin: 0;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  margin: 0;
  font-size: 2rem;
  font-weight: 600;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%);
  border-left: 4px solid #FF6F00;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  font-size: 2.5rem;
  color: #FF6F00;
}

.stat-icon.status-open {
  color: #FF8F00;
}

.stat-icon.status-damage {
  color: #FF6F00;
}

.stat-icon.status-closed {
  color: var(--green-500);
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #FF6F00;
}

.stat-label {
  font-size: 0.875rem;
  color: #666;
  margin-top: 0.25rem;
  font-weight: 500;
}

.filters-card {
  margin-bottom: 2rem;
}

.filters {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.filter-group {
  flex: 1;
  min-width: 200px;
}

.filter-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #FF6F00;
  font-size: 0.95rem;
}

.loading-container {
  display: flex;
  justify-content: center;
  padding: 4rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  text-align: center;
}

.empty-state p {
  margin-top: 1rem;
  color: var(--text-color-secondary);
  font-size: 1.1rem;
}

.tickets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.ticket-card {
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid var(--surface-border);
}

.ticket-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.ticket-type {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-color-secondary);
}

.ticket-subject {
  margin: 0 0 0.75rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-color);
}

.ticket-description {
  margin: 0 0 1rem 0;
  font-size: 0.875rem;
  color: var(--text-color-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.ticket-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.ticket-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: var(--text-color-secondary);
}

.ticket-info span {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.ticket-cost {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.75rem;
  border-top: 1px solid var(--surface-border);
  font-size: 0.875rem;
}

.cost-amount {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--primary-color);
}
</style>
