import { ref, computed } from 'vue'
import { AdventureRouteApi } from '@/app/adventure/infrastructure/adventure-route-api.js'

// Module-level singleton state so multiple calls share the same data
const routes = ref([])
const currentRoute = ref(null)
const loading = ref(false)
const error = ref(null)

const selectedType = ref('all')
const selectedDifficulty = ref('all')
const searchQuery = ref('')

const filteredRoutes = computed(() => {
  let filtered = routes.value || []

  if (selectedType.value && selectedType.value !== 'all') {
    filtered = filtered.filter(r => (r.type || '').toLowerCase() === selectedType.value.toLowerCase())
  }

  if (selectedDifficulty.value && selectedDifficulty.value !== 'all') {
    filtered = filtered.filter(r => (r.difficulty || '').toLowerCase() === selectedDifficulty.value.toLowerCase())
  }

  if (searchQuery.value && searchQuery.value.trim() !== '') {
    const q = searchQuery.value.trim().toLowerCase()
    filtered = filtered.filter(r => {
      return (
        (r.name || '').toLowerCase().includes(q) ||
        (r.summary || '').toLowerCase().includes(q) ||
        (r.tags || []).join(' ').toLowerCase().includes(q) ||
        (r.startLocation || '').toLowerCase().includes(q) ||
        (r.endLocation || '').toLowerCase().includes(q)
      )
    })
  }

  // order by newest
  return filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
})

const featuredRoutes = computed(() => {
  return (routes.value || []).filter(r => r.featured).slice(0, 3)
})

const stats = computed(() => {
  const list = routes.value || []
  return {
    total: list.length,
    beach: list.filter(r => r.type === 'beach').length,
    mountain: list.filter(r => r.type === 'mountain').length,
    cultural: list.filter(r => r.type === 'cultural').length,
    featured: list.filter(r => r.featured).length
  }
})

async function fetchRoutes() {
  loading.value = true
  error.value = null
  try {
    const res = await AdventureRouteApi.listRoutes()
    // AdventureRouteApi returns entity instances via assembler
    routes.value = Array.isArray(res) ? res : []
  } catch (err) {
    console.error('Error fetching routes', err)
    error.value = err?.message || String(err)
  } finally {
    loading.value = false
  }
}

async function fetchRoute(id) {
  loading.value = true
  error.value = null
  try {
    const res = await AdventureRouteApi.getRoute(id)
    currentRoute.value = res || null
    return currentRoute.value
  } catch (err) {
    console.error('Error fetching route', err)
    error.value = err?.message || String(err)
    currentRoute.value = null
    throw err
  } finally {
    loading.value = false
  }
}

function getRouteById(id) {
  return routes.value.find(r => String(r.id) === String(id)) || null
}

function resetFilters() {
  selectedType.value = 'all'
  selectedDifficulty.value = 'all'
  searchQuery.value = ''
}

export function useAdventureRoutesStore() {
  return {
    // state
    routes,
    currentRoute,
    loading,
    error,
    selectedType,
    selectedDifficulty,
    searchQuery,
    // computed
    filteredRoutes,
    featuredRoutes,
    stats,
    // actions
    fetchRoutes,
    fetchRoute,
    getRouteById,
    resetFilters
  }
}
