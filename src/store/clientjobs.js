import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useClientJobStore = defineStore('client-jobs', () => {
  const clientJobs = ref([])
  const clientJob = ref(null)
  const error = ref(null)

  async function fetchClientJobs() {
    error.value = null
    
    try {
        const response = await axios.get(import.meta.env.VITE_API_URL + 'admin/client-jobs')

        clientJobs.value = response.data.clientJobs
    } catch (err) {
        error.value = err.message
    }
  }

  async function fetchClientJob(id) {
    error.value = null
    
    try {
        const response = await axios.get(import.meta.env.VITE_API_URL + 'admin/client-jobs/' + id)
        clientJob.value = response.data.clientJob
    } catch (err) {
        error.value = err.message
    }
  }

  async function addClientJob(clientJob) {
    error.value = null;
    try {
        // Make a copy to avoid mutating the original data
        const jobData = { ...clientJob };
        
        // Ensure team and equipment are properly formatted for the API
        // (API expects arrays, not JSON strings)
        if (jobData.team && !Array.isArray(jobData.team)) {
          try {
            jobData.team = JSON.parse(jobData.team);
          } catch (e) {
            jobData.team = [];
          }
        }
        
        if (jobData.equipment && !Array.isArray(jobData.equipment)) {
          try {
            jobData.equipment = JSON.parse(jobData.equipment);
          } catch (e) {
            jobData.equipment = [];
          }
        }
        
        const response = await axios.post(
            import.meta.env.VITE_API_URL + 'admin/client-jobs',
            jobData
        );
        
        return response.data.clientJob;
    } catch (err) {
        error.value = err.message;
    }
  }

  async function updateClientJob(clientJob) {
    error.value = null;
    try 
    {
      // Make a copy to avoid mutating the original data
      const jobData = { ...clientJob };
      
      // Ensure team and equipment are properly formatted for the API
      // (API expects arrays, not JSON strings)
      if (jobData.team && !Array.isArray(jobData.team)) {
        try {
          jobData.team = JSON.parse(jobData.team);
        } catch (e) {
          jobData.team = [];
        }
      }
      
      if (jobData.equipment && !Array.isArray(jobData.equipment)) {
        try {
          jobData.equipment = JSON.parse(jobData.equipment);
        } catch (e) {
          jobData.equipment = [];
        }
      }
      
      const response = await axios.post(import.meta.env.VITE_API_URL + 'admin/client-jobs/update', jobData);
      
      // Set the current job in the store
      clientJob.value = response.data.clientJob;
      
      // Simply return without trying to update clientJobs array
      // We'll refetch jobs when returning to the job list anyway
      return response.data.clientJob;
    } catch (err) {
      error.value = err.message;
      throw err; // Re-throw to allow proper catch in components
    }
  }

  async function deleteClientJob(id) {
    try {
        await axios.delete(import.meta.env.VITE_API_URL + 'admin/client-jobs/' + id)
        clientJobs.value = clientJobs.value.filter(c => c.id !== id)
    } catch (err) {
        error.value = err.message
    }
  }

  return {
    // State
    clientJobs,
    error,
    clientJob,
    // Actions
    fetchClientJobs,
    addClientJob,
    updateClientJob,
    deleteClientJob,
    fetchClientJob,
  }
})
