import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useServiceStore = defineStore('services', () => {
  const services = ref([])
  const error = ref(null)

  async function fetchServices() {
    error.value = null
    
    try {
        const response = await axios.get(import.meta.env.VITE_API_URL + 'admin/services')
        services.value = response.data.services
    } catch (err) {
        error.value = err.message
    }
  }

  async function getServiceById(id) {
    const response = await axios.get(import.meta.env.VITE_API_URL + 'admin/services/' + id)
    return response.data.service
  }

  async function addService(service) {
    try {
        const formData = new FormData()
        
        // Handle image separately if it's a File object
        if (service.image instanceof File) {
            formData.append('image', service.image)
        }
        
        // Add all other service properties to the FormData
        for (const key in service) {
            if (key !== 'image' || !(service.image instanceof File)) {
                formData.append(key, service[key])
            }
        }
        
        const response = await axios.post(
            import.meta.env.VITE_API_URL + 'admin/services',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        )
        services.value.push(response.data.service)
    } catch (err) {
        error.value = err.message
    }
  }

  async function updateService(service) {
    try 
    {
      const formData = new FormData()
      
      // Handle image separately if it's a File object
      if (service.image instanceof File) {
          formData.append('image', service.image)
      }
      
      // Add all other service properties to the FormData
      for (const key in service) {
          if (key !== 'image' || !(service.image instanceof File)) {
              formData.append(key, service[key])
          }
      }

      const response = await axios.post(import.meta.env.VITE_API_URL + 'admin/services/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      const index = services.value.findIndex(s => s.id === service.id)
      if (index !== -1) {
          services.value[index] = response.data.service
      }
    } catch (err) {
        error.value = err.message
    }
  }

  async function deleteService(id) {
    try {
        await axios.delete(import.meta.env.VITE_API_URL + 'admin/services/' + id)
        services.value = services.value.filter(s => s.id !== id)
    } catch (err) {
        error.value = err.message
    }
  }

  return {
    // State
    services,
    error,
    
    // Actions
    fetchServices,
    addService,
    updateService,
    deleteService,
    getServiceById,
  }
})
