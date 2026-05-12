// Cliente API con soporte JWT
// En desarrollo usamos el servidor local si no se define VITE_API_BASE_URL.
const BASE = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:5332/api/v1' : null)
if (!BASE) {
  throw new Error('Falta la variable de entorno VITE_API_BASE_URL')
}

// Token storage keys
const TOKEN_KEY = 'moveo_access_token'
const REFRESH_TOKEN_KEY = 'moveo_refresh_token'
const TOKEN_EXPIRES_KEY = 'moveo_token_expires'

// Token management functions
export const tokenManager = {
  getAccessToken: () => localStorage.getItem(TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  getTokenExpiry: () => localStorage.getItem(TOKEN_EXPIRES_KEY),
  
  setTokens: (accessToken, refreshToken, expiresAt) => {
    localStorage.setItem(TOKEN_KEY, accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
    if (expiresAt) {
      localStorage.setItem(TOKEN_EXPIRES_KEY, expiresAt)
    }
  },
  
  clearTokens: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(TOKEN_EXPIRES_KEY)
    localStorage.removeItem('moveo_current_user')
  },
  
  isTokenExpired: () => {
    const expiresAt = localStorage.getItem(TOKEN_EXPIRES_KEY)
    if (!expiresAt) return true
    return new Date(expiresAt) <= new Date()
  },
  
  hasValidToken: () => {
    const token = localStorage.getItem(TOKEN_KEY)
    return token && !tokenManager.isTokenExpired()
  }
}

// Flag to prevent multiple refresh attempts
let isRefreshing = false
let refreshPromise = null

// Refresh token function
async function refreshAccessToken() {
  if (isRefreshing) {
    return refreshPromise
  }
  
  isRefreshing = true
  const accessToken = tokenManager.getAccessToken()
  const refreshToken = tokenManager.getRefreshToken()
  
  if (!accessToken || !refreshToken) {
    isRefreshing = false
    throw new Error('No tokens available for refresh')
  }
  
  refreshPromise = (async () => {
    try {
      const res = await fetch(`${BASE}/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken, refreshToken })
      })
      
      if (!res.ok) {
        tokenManager.clearTokens()
        throw new Error('Refresh token expired')
      }
      
      const data = await res.json()
      tokenManager.setTokens(data.token, data.refreshToken, data.expiresAt)
      return data.token
    } finally {
      isRefreshing = false
      refreshPromise = null
    }
  })()
  
  return refreshPromise
}

// Main request function with JWT support
async function request(path, options = {}) {
  const url = path.startsWith('http') ? path : `${BASE}${path.startsWith('/') ? path : '/' + path}`
  
  // Build headers with Authorization if token exists
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  }
  
  // Add Authorization header if we have a token (except for auth endpoints)
  const isAuthEndpoint = path.includes('/auth/login') || 
                         path.includes('/auth/register') || 
                         path.includes('/auth/refresh-token')
  
  if (!isAuthEndpoint) {
    const token = tokenManager.getAccessToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }
  
  let res = await fetch(url, { headers, ...options })
  
  // Handle 401 - try to refresh token
  if (res.status === 401 && !isAuthEndpoint) {
    try {
      const newToken = await refreshAccessToken()
      headers['Authorization'] = `Bearer ${newToken}`
      res = await fetch(url, { headers, ...options })
    } catch (refreshError) {
      // Refresh failed, redirect to login
      console.error('Token refresh failed:', refreshError)
      tokenManager.clearTokens()
      
      // Dispatch event for components to handle logout
      window.dispatchEvent(new CustomEvent('auth:logout', { detail: { reason: 'token_expired' } }))
      
      throw new Error('Session expired. Please login again.')
    }
  }
  
  // Read body once as text
  const bodyText = await res.text()
  
  if (!res.ok) {
    let errorBody
    try { 
      errorBody = JSON.parse(bodyText) 
    } catch { 
      errorBody = bodyText 
    }
    
    const error = new Error(
      errorBody?.message || 
      `API ${res.status} ${res.statusText}: ${typeof errorBody === 'string' ? errorBody : JSON.stringify(errorBody)}`
    )
    error.status = res.status
    error.body = errorBody
    throw error
  }
  
  // Parse response based on content type
  const ct = res.headers.get('content-type') || ''
  if (ct.includes('application/json') && bodyText) {
    try {
      return JSON.parse(bodyText)
    } catch {
      return bodyText
    }
  }
  return bodyText
}

export const apiClient = {
  get: (p, opts = {}) => request(p, { ...opts }),
  post: (p, b, opts = {}) => request(p, { method: 'POST', body: JSON.stringify(b), ...opts }),
  put: (p, b, opts = {}) => request(p, { method: 'PUT', body: JSON.stringify(b), ...opts }),
  patch: (p, b, opts = {}) => request(p, { method: 'PATCH', body: JSON.stringify(b), ...opts }),
  delete: (p, opts = {}) => request(p, { method: 'DELETE', ...opts })
}

export { BASE as API_BASE_URL }
