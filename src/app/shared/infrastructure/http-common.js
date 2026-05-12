import { apiClient } from './apiClient.js'

// Compatibility wrapper: expose an object with the same call-signature
// that existing code expects from an axios instance (i.e. methods that
// return an object with a `data` property). This keeps minimal changes
// required when switching to `apiClient` while preserving a simple
// centralized place for error logging.
export const http = {
  get: async (path) => {
    try {
      const data = await apiClient.get(path)
      return { data }
    } catch (error) {
      console.error('API Error (GET):', error)
      throw error
    }
  },
  post: async (path, body) => {
    try {
      const data = await apiClient.post(path, body)
      return { data }
    } catch (error) {
      console.error('API Error (POST):', error)
      throw error
    }
  },
  put: async (path, body) => {
    try {
      const data = await apiClient.put(path, body)
      return { data }
    } catch (error) {
      console.error('API Error (PUT):', error)
      throw error
    }
  },
  patch: async (path, body) => {
    try {
      const data = await apiClient.patch(path, body)
      return { data }
    } catch (error) {
      console.error('API Error (PATCH):', error)
      throw error
    }
  },
  delete: async (path) => {
    try {
      const data = await apiClient.delete(path)
      return { data }
    } catch (error) {
      console.error('API Error (DELETE):', error)
      throw error
    }
  }
}

export default http