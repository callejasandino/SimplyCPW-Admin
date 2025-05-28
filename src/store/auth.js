import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import Cookies from 'js-cookie'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const accessToken = ref(Cookies.get('auth_token') || null)
  const error = ref(null)
  
  async function login(credentials) {
    error.value = null
    
    try {
        const response = await axios.post(import.meta.env.VITE_API_URL + 'admin/auth/login', credentials)
        const token = response.data.access_token
        accessToken.value = token
        
        // Store token in cookie (expires in 1 day by default)
        Cookies.set('auth_token', token)
    } catch (err) {
        error.value = err.message
    }
  }
  
  function logout() {
    accessToken.value = null
    user.value = null
    Cookies.remove('auth_token')
  }

  return {
    user,
    accessToken,
    login,
    logout
  }
})
