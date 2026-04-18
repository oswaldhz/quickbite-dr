import axios from 'axios'
import toast from 'react-hot-toast'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor to handle common errors and unwrap data
api.interceptors.response.use(
  (response) => {
    // Unwrap the { success, data } structure from backend
    return response.data.data
  },
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred'
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    
    // Don't show toast for 404 on public routes (e.g., restaurant not found)
    if (error.response?.status !== 404 || error.config?.url?.includes('/restaurants/')) {
      toast.error(message)
    }
    
    return Promise.reject(error)
  }
)

export default api