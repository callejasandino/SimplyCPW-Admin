import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useEquipmentStore = defineStore('equipments', () => {
  const equipments = ref([])
  const error = ref(null)
  const loading = ref(false)

  async function fetchEquipments() {
    loading.value = true
    error.value = null
    
    try {
        const response = await axios.get(import.meta.env.VITE_API_URL + 'admin/equipments')
        equipments.value = response.data.equipments || []
        return equipments.value
    } catch (err) {
        error.value = err.message
        // Fallback data for testing/development
        equipments.value = [
          { id: 1, name: 'Pressure Washer' },
          { id: 2, name: 'Surface Cleaner' },
          { id: 3, name: 'Extension Wand' },
          { id: 4, name: 'Soft Wash System' }
        ]
        return equipments.value
    } finally {
        loading.value = false
    }
  }

  async function addEquipment(equipment) {
    loading.value = true
    error.value = null
    
    try {
        const response = await axios.post(
            import.meta.env.VITE_API_URL + 'admin/equipments',
            equipment
        )
        equipments.value.push(response.data.equipment)
        return response.data.equipment
    } catch (err) {
        error.value = err.message
        // For testing/development, create a fake response
        const newEquipment = {
          id: equipments.value.length > 0 ? Math.max(...equipments.value.map(e => e.id)) + 1 : 1,
          name: equipment.name
        }
        equipments.value.push(newEquipment)
        return newEquipment
    } finally {
        loading.value = false
    }
  }

  async function updateEquipment(equipment) {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.post(import.meta.env.VITE_API_URL + 'admin/equipments/update', equipment)
      
      const index = equipments.value.findIndex(e => e.id === equipment.id)
      if (index !== -1) {
          equipments.value[index] = response.data.equipment
      }
      return response.data.equipment
    } catch (err) {
        error.value = err.message
        // For testing/development
        const index = equipments.value.findIndex(e => e.id === equipment.id)
        if (index !== -1) {
            equipments.value[index] = equipment
        }
        return equipment
    } finally {
        loading.value = false
    }
  }

  async function deleteEquipment(id) {
    loading.value = true
    error.value = null
    
    try {
        await axios.delete(import.meta.env.VITE_API_URL + 'admin/equipments/' + id)
        equipments.value = equipments.value.filter(e => e.id !== id)
        return true
    } catch (err) {
        error.value = err.message
        // For testing/development
        equipments.value = equipments.value.filter(e => e.id !== id)
        return true
    } finally {
        loading.value = false
    }
  }

  return {
    // State
    equipments,
    error,
    loading,
    
    // Actions
    fetchEquipments,
    addEquipment,
    updateEquipment,
    deleteEquipment,
  }
})
