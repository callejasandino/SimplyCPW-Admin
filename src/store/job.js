import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useJobStore = defineStore('jobs', () => {
  const jobs = ref([])
  const error = ref(null)
  const loading = ref(false)

  async function fetchJobs() {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.get(import.meta.env.VITE_API_URL + 'admin/jobs')
      jobs.value = response.data.jobs
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function getJob(id) {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.get(import.meta.env.VITE_API_URL + 'admin/jobs/' + id)
      return response.data.job
    } catch (err) {
      error.value = err.message
      return null
    } finally {
      loading.value = false
    }
  }

  async function createJob(job) {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + 'admin/jobs',
        job
      )
      jobs.value.push(response.data.job)
      return response.data.job
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      return null
    } finally {
      loading.value = false
    }
  }

  async function updateJob(job) {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.put(
        import.meta.env.VITE_API_URL + 'admin/jobs/' + job.id,
        job
      )
      
      const index = jobs.value.findIndex(j => j.id === job.id)
      if (index !== -1) {
        jobs.value[index] = response.data.job
      }
      return response.data.job
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      return null
    } finally {
      loading.value = false
    }
  }

  async function deleteJob(id) {
    loading.value = true
    error.value = null
    
    try {
      await axios.delete(import.meta.env.VITE_API_URL + 'admin/jobs/' + id)
      jobs.value = jobs.value.filter(j => j.id !== id)
      return true
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    jobs,
    error,
    loading,
    
    // Actions
    fetchJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob,
  }
}) 