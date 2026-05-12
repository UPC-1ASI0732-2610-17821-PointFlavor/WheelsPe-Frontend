<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import usePaymentsStore from '../../application/payment.store.js'
import { useUserStore } from '@/app/iam/application/user.store.js'

const router = useRouter()
const { t } = useI18n()
const paymentsStore = usePaymentsStore()
const userStore = useUserStore()

const { payments, fetchPayments } = paymentsStore

// Filters
const searchQuery = ref('')
const selectedStatus = ref('all')
const selectedMethod = ref('all')

// Computed filtered payments based on user role
const filteredPayments = computed(() => {
  console.log('🔄 Recalculando filteredPayments...')
  
  if (!payments.value || payments.value.length === 0) {
    console.log('⚠️ No hay pagos disponibles:', payments.value)
    return []
  }
  
  let filtered = [...payments.value]
  
  console.log('🔍 Filtrando pagos:', {
    total: payments.value.length,
    pagos: payments.value,
    currentUser: userStore.currentUser.value,
    currentUserId: userStore.currentUser.value?.id,
    isRenter: userStore.isRenter.value,
    isOwner: userStore.isOwner.value
  });
  
  // Filter by current user
  // Renters see payments they made (payerId)
  // Owners see payments they received (recipientId) or payments related to their vehicles
  if (userStore.currentUser.value?.id) {
    const userId = userStore.currentUser.value.id
    const isRenterRole = userStore.isRenter.value
    const isOwnerRole = userStore.isOwner.value
    
    console.log('🎯 Filtrando por usuario ID:', userId, 'Rol:', isRenterRole ? 'renter' : isOwnerRole ? 'owner' : 'unknown')
    
    filtered = filtered.filter(p => {
      // Check multiple possible field names for compatibility
      const payerId = p.payerId || p.userId
      const recipientId = p.recipientId || p.ownerId
      
      console.log('📋 Evaluando pago:', {
        paymentId: p.id,
        payerId,
        recipientId,
        userId,
        isRenterRole,
        isOwnerRole,
        matchesPayer: payerId === userId,
        matchesRecipient: recipientId === userId
      });
      
      if (isRenterRole) {
        // Renters see payments they made
        const matches = payerId === userId
        console.log(`  → Renter check: ${matches ? '✅ INCLUIR' : '❌ EXCLUIR'}`)
        return matches
      } else if (isOwnerRole) {
        // Owners see payments they received
        const matches = recipientId === userId || payerId === userId
        console.log(`  → Owner check: ${matches ? '✅ INCLUIR' : '❌ EXCLUIR'}`)
        return matches
      }
      
      // Fallback: show if any ID matches
      const matches = payerId === userId || recipientId === userId
      console.log(`  → Fallback check: ${matches ? '✅ INCLUIR' : '❌ EXCLUIR'}`)
      return matches
    })
  } else {
    console.log('⚠️ No hay usuario logueado')
  }
  
  console.log('✅ Pagos filtrados por usuario:', filtered.length, filtered);
  
  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(p => 
      p.id.toString().includes(query) ||
      p.method?.toLowerCase().includes(query) ||
      p.amount?.toString().includes(query)
    )
  }
  
  // Status filter
  if (selectedStatus.value !== 'all') {
    filtered = filtered.filter(p => p.status === selectedStatus.value)
  }
  
  // Method filter
  if (selectedMethod.value !== 'all') {
    filtered = filtered.filter(p => p.method === selectedMethod.value)
  }
  
  // Sort by date (most recent first)
  return filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
})

// Payment statistics
const paymentStats = computed(() => {
  const total = filteredPayments.value.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0)
  const completed = filteredPayments.value.filter(p => p.status === 'completado').length
  const pending = filteredPayments.value.filter(p => p.status === 'pendiente').length
  
  return {
    total: total.toFixed(2),
    count: filteredPayments.value.length,
    completed,
    pending
  }
})

onMounted(() => {
  console.log('🚀 Componente payments-view montado')
  console.log('👤 Usuario actual:', userStore.currentUser.value)
  console.log('📊 Pagos iniciales:', payments.value)
  fetchPayments()
})

function getMethodIcon(method) {
  if (!method) return 'pi-wallet' // Valor por defecto
  
  const icons = {
    'card': 'pi-credit-card',
    'yape': 'pi-mobile',
    'cash': 'pi-money-bill',
    'tarjeta': 'pi-credit-card',
    'credit_card': 'pi-credit-card'
  }
  return icons[method.toLowerCase()] || 'pi-wallet'
}

function getMethodName(method) {
  if (!method) return t('payment.history.methods.cash') // Valor por defecto
  
  const methodKey = method.toLowerCase()
  const methodMap = {
    'card': 'payment.history.methods.card',
    'yape': 'payment.history.methods.yape',
    'cash': 'payment.history.methods.cash',
    'tarjeta': 'payment.history.methods.card',
    'credit_card': 'payment.history.methods.card'
  }
  return t(methodMap[methodKey] || 'payment.history.methods.cash')
}

function getStatusClass(status) {
  if (!status) return 'status-pending' // Valor por defecto
  
  const classes = {
    'completado': 'status-completed',
    'completed': 'status-completed',
    'pendiente': 'status-pending',
    'pending': 'status-pending',
    'cancelado': 'status-cancelled',
    'cancelled': 'status-cancelled',
    'held': 'status-pending',
    'refunded': 'status-completed'
  }
  return classes[status.toLowerCase()] || 'status-pending'
}

function getStatusName(status) {
  if (!status) return t('payment.history.status.pending')
  
  const statusMap = {
    'completado': 'completed',
    'completed': 'completed',
    'pendiente': 'pending',
    'pending': 'pending',
    'cancelado': 'cancelled',
    'cancelled': 'cancelled',
    'held': 'pending',
    'refunded': 'completed'
  }
  
  const mappedStatus = statusMap[status.toLowerCase()] || 'pending'
  return t(`payment.history.status.${mappedStatus}`)
}

function formatDate(date) {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<template>
  <div class="payments-history">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">
          <i class="pi pi-wallet"></i>
          {{ t('payment.history.title') }}
        </h1>
        <p class="page-subtitle">{{ t('payment.history.subtitle') }}</p>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon total">
          <i class="pi pi-dollar"></i>
        </div>
        <div class="stat-info">
          <p class="stat-label">{{ t('payment.history.stats.total') }}</p>
          <p class="stat-value">S/. {{ paymentStats.total }}</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon count">
          <i class="pi pi-list"></i>
        </div>
        <div class="stat-info">
          <p class="stat-label">{{ t('payment.history.stats.transactions') }}</p>
          <p class="stat-value">{{ paymentStats.count }}</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon completed">
          <i class="pi pi-check-circle"></i>
        </div>
        <div class="stat-info">
          <p class="stat-label">{{ t('payment.history.stats.completed') }}</p>
          <p class="stat-value">{{ paymentStats.completed }}</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon pending">
          <i class="pi pi-clock"></i>
        </div>
        <div class="stat-info">
          <p class="stat-label">{{ t('payment.history.stats.pending') }}</p>
          <p class="stat-value">{{ paymentStats.pending }}</p>
        </div>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="filters-section">
      <div class="search-box">
        <i class="pi pi-search"></i>
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="t('payment.history.filters.searchPlaceholder')"
          class="search-input"
        />
      </div>

      <div class="filter-group">
        <div class="filter-item">
          <label for="status-filter">{{ t('payment.history.filters.status') }}</label>
          <select id="status-filter" v-model="selectedStatus" class="filter-select">
            <option value="all">{{ t('payment.history.filters.all') }}</option>
            <option value="completado">{{ t('payment.history.stats.completed') }}</option>
            <option value="pendiente">{{ t('payment.history.stats.pending') }}</option>
            <option value="cancelado">{{ t('payment.history.status.cancelled') }}</option>
          </select>
        </div>

        <div class="filter-item">
          <label for="method-filter">{{ t('payment.history.filters.method') }}</label>
          <select id="method-filter" v-model="selectedMethod" class="filter-select">
            <option value="all">{{ t('payment.history.filters.all') }}</option>
            <option value="card">{{ t('payment.history.methods.card') }}</option>
            <option value="yape">{{ t('payment.history.methods.yape') }}</option>
            <option value="cash">{{ t('payment.history.methods.cash') }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Payments List -->
    <div class="payments-list">
      <div v-if="filteredPayments.length === 0" class="empty-state">
        <i class="pi pi-inbox"></i>
        <h3>{{ t('payment.history.empty.title') }}</h3>
        <p>{{ t('payment.history.empty.message') }}</p>
      </div>

      <div v-else class="payment-cards">
        <div
          v-for="payment in filteredPayments"
          :key="payment.id"
          class="payment-card"
        >
          <div class="payment-header">
            <div class="payment-method">
              <i :class="`pi ${getMethodIcon(payment.method)}`"></i>
              <span>{{ getMethodName(payment.method) }}</span>
            </div>
            <span :class="['status-badge', getStatusClass(payment.status)]">
              {{ t(`payment.history.status.${payment.status}`) }}
            </span>
          </div>

          <div class="payment-body">
            <div class="payment-amount">
              <span class="amount-label">{{ t('payment.history.details.amount') }}</span>
              <span class="amount-value">S/. {{ parseFloat(payment.amount).toFixed(2) }}</span>
            </div>

            <div class="payment-details">
              <div class="detail-row">
                <span class="detail-label">
                  <i class="pi pi-hashtag"></i>
                  {{ t('payment.history.details.transactionId') }}
                </span>
                <span class="detail-value">#{{ payment.id }}</span>
              </div>

              <div class="detail-row">
                <span class="detail-label">
                  <i class="pi pi-calendar"></i>
                  {{ t('payment.history.details.date') }}
                </span>
                <span class="detail-value">{{ formatDate(payment.createdAt) }}</span>
              </div>

              <div v-if="payment.description" class="detail-row">
                <span class="detail-label">
                  <i class="pi pi-info-circle"></i>
                  {{ t('payment.history.details.description') }}
                </span>
                <span class="detail-value">{{ payment.description }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.payments-history {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
}

/* Header Section */
.page-header {
  background: linear-gradient(135deg, #3A5E5E 0%, #2C5050 100%);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(58, 94, 94, 0.2);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  color: #FFFFFF;
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.page-title i {
  font-size: 2rem;
}

.page-subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  margin: 0;
}

/* Statistics Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.stat-card {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  color: #FFFFFF;
}

.stat-icon.total {
  background: linear-gradient(135deg, #3A5E5E 0%, #2C5050 100%);
}

.stat-icon.count {
  background: linear-gradient(135deg, #FF6F00 0%, #FF8F00 100%);
}

.stat-icon.completed {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
}

.stat-icon.pending {
  background: linear-gradient(135deg, #FFC107 0%, #FFB300 100%);
}

.stat-info {
  flex: 1;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
  margin: 0 0 0.25rem 0;
  font-weight: 500;
}

.stat-value {
  color: #2C3E50;
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
}

/* Filters Section */
.filters-section {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 2rem;
}

.search-box {
  position: relative;
  margin-bottom: 1.5rem;
}

.search-box i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  font-size: 1.1rem;
}

.search-input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  font-size: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: #FFFFFF;
  color: #2C3E50;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #3A5E5E;
  box-shadow: 0 0 0 3px rgba(58, 94, 94, 0.1);
}

.search-input::placeholder {
  color: #999;
}

.filter-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
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
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: #FFFFFF;
  color: #2C3E50;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #3A5E5E;
  box-shadow: 0 0 0 3px rgba(58, 94, 94, 0.1);
}

.filter-select:hover {
  border-color: #3A5E5E;
}

/* Payments List */
.payments-list {
  max-width: 1200px;
  margin: 0 auto;
}

.empty-state {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 4rem 2rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.empty-state i {
  font-size: 4rem;
  color: #ccc;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: #2C3E50;
  font-size: 1.5rem;
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  color: #666;
  font-size: 1rem;
  margin: 0;
}

.payment-cards {
  display: grid;
  gap: 1.5rem;
}

.payment-card {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-left: 4px solid #3A5E5E;
}

.payment-card:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.payment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.payment-method {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2C3E50;
}

.payment-method i {
  font-size: 1.5rem;
  color: #3A5E5E;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-completed {
  background: #E8F5E9;
  color: #2E7D32;
}

.status-pending {
  background: #FFF3E0;
  color: #F57C00;
}

.status-cancelled {
  background: #FFEBEE;
  color: #C62828;
}

.payment-body {
  display: grid;
  gap: 1.5rem;
}

.payment-amount {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.amount-label {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.amount-value {
  font-size: 2rem;
  font-weight: 700;
  color: #3A5E5E;
}

.payment-details {
  display: grid;
  gap: 0.75rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.detail-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: #666;
  font-weight: 500;
}

.detail-label i {
  color: #3A5E5E;
}

.detail-value {
  font-size: 0.95rem;
  color: #2C3E50;
  font-weight: 600;
}

/* Responsive Design */
@media (max-width: 768px) {
  .payments-history {
    padding: 1rem;
  }

  .page-header {
    padding: 1.5rem;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .page-subtitle {
    font-size: 1rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .stat-card {
    padding: 1rem;
  }

  .stat-icon {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }

  .stat-value {
    font-size: 1.5rem;
  }

  .filters-section {
    padding: 1rem;
  }

  .filter-group {
    grid-template-columns: 1fr;
  }

  .payment-card {
    padding: 1rem;
  }

  .payment-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .amount-value {
    font-size: 1.5rem;
  }

  .detail-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
