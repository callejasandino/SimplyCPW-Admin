<template>
  <div>
    <Modal
      :show="show"
      title="Quote Details"
      @close="closeModal"
      maxWidth="max-w-7xl"
    >
      <div v-if="quote">      
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <!-- Client Information -->
          <div class="bg-white rounded-lg shadow-card overflow-hidden w-full max-w-full">
            <div class="p-4 border-b border-neutral-light">
              <h2 class="text-lg font-semibold text-neutral-dark">Client Information</h2>
            </div>
            <div class="p-4 space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <h3 class="text-sm font-medium text-neutral mb-1">First Name</h3>
                  <p class="text-neutral-dark">{{ quote.firstName }}</p>
                </div>
                <div>
                  <h3 class="text-sm font-medium text-neutral mb-1">Last Name</h3>
                  <p class="text-neutral-dark">{{ quote.lastName }}</p>
                </div>
              </div>
              
              <div>
                <h3 class="text-sm font-medium text-neutral mb-1">Email</h3>
                <p class="text-neutral-dark">{{ quote.email }}</p>
              </div>
              
              <div>
                <h3 class="text-sm font-medium text-neutral mb-1">Phone</h3>
                <p class="text-neutral-dark">{{ quote.phone }}</p>
              </div>
              
              <div>
                <h3 class="text-sm font-medium text-neutral mb-1">Address</h3>
                <p class="text-neutral-dark">{{ quote.address }}</p>
              </div>
            </div>
          </div>
          
          <!-- Quote Details -->
          <div class="bg-white rounded-lg shadow-card overflow-hidden w-full max-w-full col-span-3">
            <div class="p-4 border-b border-neutral-light">
              <h2 class="text-lg font-semibold text-neutral-dark">Quote Details</h2>
            </div>
            <div class="p-4 space-y-4">
              <div>
                <h3 class="text-sm font-medium text-neutral mb-1">Status</h3>
                <div v-if="!isEditing">
                  <StatusBadge :status="quote.status" />
                </div>
                <div v-else>
                  <select
                    v-model="formData.status"
                    class="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option v-for="status in statusOptions" :key="status" :value="status">
                      {{ status }}
                    </option>
                  </select>
                </div>
              </div>
              
              <div>
                <h3 class="text-sm font-medium text-neutral mb-1">Services Needed</h3>
                <div class="flex flex-wrap gap-2" v-if="!isEditing">
                  <span 
                    v-for="service in servicesNeeded(quote.servicesNeeded)" 
                    :key="service"
                    class="px-2 py-1 text-xs font-medium bg-primary-light text-primary-dark rounded-full"
                  >
                    {{ service }}
                  </span>
                </div>

                <div class="flex flex-wrap gap-2" v-else>
                  <div class="flex items-center gap-4 flex-wrap w-full">
                    <div v-for="service in services" :key="service.id" class="flex items-center gap-1 min-w-[150px]">
                      <input 
                        type="checkbox" 
                        :id="service.name" 
                        :value="service.name" 
                        v-model="formData.servicesNeeded" 
                      />
                      <label :for="service.name" class="text-sm">{{ service.name }}</label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 class="text-sm font-medium text-neutral mb-1">Additional Information</h3>
                <div v-if="!isEditing">
                  <p class="text-neutral-dark">{{ quote.additionalInfo }}</p>
                </div>
                <div v-else>
                  <textarea
                    v-model="formData.additionalInfo"
                    rows="4"
                    class="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  ></textarea>
                </div>
              </div>
              
              <div>
                <h3 class="text-sm font-medium text-neutral mb-1">Created At</h3>
                <p class="text-neutral-dark">{{ formatDate(quote.createdAt || quote.created_at) }}</p>
              </div>
              
              <div>
                <h3 class="text-sm font-medium text-neutral mb-1">Terms Agreement</h3>
                <p class="text-neutral-dark">{{ quote.agreedToTerms ? 'Agreed' : 'Not Agreed' }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div class="flex justify-between space-x-2 mt-5">
            <div class="flex justify-between w-full"  v-if="isEditing">
              <button
                @click="toggleEdit"
                class="inline-flex items-center px-4 py-2 border border-neutral-light rounded-lg shadow-sm text-sm font-medium text-neutral-dark bg-white hover:bg-neutral-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-light"
              >
                Cancel
              </button>

              <button
                @click="saveChanges"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-success hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-success"
              >
                Save Changes
              </button>
            </div>    

            <div class="flex justify-between w-full" v-if="!isEditing">
              <button
                @click="openClientJobModal"
                class="inline-flex items-center px-4 py-2 border border-green-700 rounded-lg shadow-sm text-sm font-medium text-white bg-success hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-success"
              >
                Add to Jobs
              </button>

               <button
                @click="toggleEdit"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Edit Quote
              </button>
            </div>
          </div>
        </div>

      </div>
    
      <div v-else class="flex items-center justify-center h-64">
        <p class="text-neutral">Loading...</p>
      </div>
    </Modal>

    <!-- Client Job Modal -->
    <ClientJobsModal
      :show="isClientJobModalOpen"
      :quote="quote"
      @close="isClientJobModalOpen = false"
    />
  </div>
</template>

<script>
import StatusBadge from '../ui/StatusBadge.vue'
import { format } from 'date-fns'
import Modal from '../ui/Modal.vue'
import { useQuoteStore } from '../../store/Quote'
import { showToast } from '../../utils/toast'
import { useServiceStore } from '../../store/service'
import ClientJobsModal from './ClientJobsModal.vue'

export default {
  name: 'QuoteDetailModal',
  
  components: {
    StatusBadge,
    Modal,
    ClientJobsModal
  },
  
  props: {
    show: {
      type: Boolean,
      default: false
    },
    quote: {
      type: Object,
      required: false,
      default: null
    }
  },
  
  data() {
    return {
      isEditing: false,
      formData: {
        status: '',
        additionalInfo: '',
        servicesNeeded: []
      },
      statusOptions: ['Pending', 'Scheduled', 'Confirmed', 'Completed', 'Cancelled'],
      quoteStore: useQuoteStore(),
      serviceStore: useServiceStore(),
      services: [],
      isClientJobModalOpen: false
    }
  },
  
  watch: {
    show(newVal) {
      if (newVal && this.quote) {
        this.formData = { ...this.quote }
        this.isEditing = false
      }
    }
  },
  
  mounted() {
    if (this.quote) {
      this.formData = { ...this.quote }
    }
  },
  
  methods: {
    formatDate(dateString) {
      if (!dateString) return 'N/A'
      
      try {
        const date = new Date(dateString)
        if (isNaN(date.getTime())) {
          return 'Invalid date'
        }
        return format(date, 'MMMM dd, yyyy HH:mm zzz')
      } catch (error) {
        console.error('Error formatting date:', error)
        return 'Invalid date'
      }
    },
    
    closeModal() {
      this.$emit('close')
    },
    
    servicesNeeded(services) {
      if (!services) return []
      try {
        return JSON.parse(services)
      } catch (error) {
        console.error('Error parsing services:', error)
        return []
      }
    },

    openClientJobModal() {
      this.isClientJobModalOpen = true
    },
    
    async toggleEdit() {
      this.isEditing = !this.isEditing
      if (this.isEditing) {
        await this.serviceStore.fetchServices()
        this.services = this.serviceStore.services

        this.formData = {
          ...this.quote,
          servicesNeeded: this.servicesNeeded(this.quote.servicesNeeded)
        }
      }
    },
    
    async saveChanges() {
      await this.quoteStore.updateQuote(this.formData)
      this.isEditing = false
      
      if (this.quoteStore.error) {
        showToast(this.quoteStore.error, 'error')
      } else {
        showToast('Quote updated successfully', 'success')
      }
      
      this.$emit('close')
    },
    
    addToJobs() {
      // Need to access quotes from the parent component or use a store
      // For now, we'll just close the edit mode
      this.isEditing = false
      this.$emit('close')
    }
  }
}
</script>