<template>
  <Modal
    :show="show"
    title="Create New Job"
    @close="closeModal"
    maxWidth="max-w-7xl"
  >
    <div v-if="quote && !loading" class="p-4">      
      <form @submit.prevent="submitJob" class="space-y-6">
        <!-- Job Title -->
        <div>
          <label for="title" class="block text-sm font-medium text-neutral-dark">Job Title</label>
          <input 
            type="text" 
            id="title" 
            v-model="jobData.title"
            class="mt-1 block w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>

        <!-- Client Information (Read-only) -->
        <div class="bg-white rounded-lg border border-neutral-light p-4">
          <h3 class="text-md font-medium text-neutral-dark mb-3">Client Information</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-neutral mb-1">Name</p>
              <p class="text-neutral-dark">{{ quote.firstName }} {{ quote.lastName }}</p>
            </div>
            <div>
              <p class="text-sm text-neutral mb-1">Contact</p>
              <p class="text-neutral-dark">{{ quote.email }} / {{ quote.phone }}</p>
            </div>
            <div class="col-span-2">
              <p class="text-sm text-neutral mb-1">Address</p>
              <p class="text-neutral-dark">{{ quote.address }}</p>
            </div>
          </div>
        </div>

        <!-- Job Details -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Date -->
          <div>
            <label for="date" class="block text-sm font-medium text-neutral-dark">Date</label>
            <input 
              type="date" 
              id="date" 
              v-model="jobData.date"
              class="mt-1 block w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          <!-- Duration (in hours) -->
          <div>
            <label for="duration" class="block text-sm font-medium text-neutral-dark">Duration (hours)</label>
            <input 
              type="number" 
              id="duration" 
              v-model="jobData.duration"
              min="1"
              class="mt-1 block w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          <!-- Status -->
          <div>
            <label for="status" class="block text-sm font-medium text-neutral-dark">Status</label>
            <select
              id="status"
              v-model="jobData.status"
              class="mt-1 block w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            >
              <option v-for="status in statusOptions" :key="status" :value="status">
                {{ status }}
              </option>
            </select>
          </div>

          <!-- Price -->
          <div>
            <label for="price" class="block text-sm font-medium text-neutral-dark">Price</label>
            <input 
              type="number" 
              id="price" 
              v-model="jobData.price"
              min="0"
              step="0.01"
              class="mt-1 block w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
        </div>

        <!-- Services -->
        <div>
          <label class="block text-sm font-medium text-neutral-dark mb-2">Services</label>
          <div class="flex flex-wrap gap-3 border border-neutral-light rounded-lg p-3">
            <div v-for="service in services" :key="service.id" class="flex items-center gap-1">
              <input 
                type="checkbox" 
                :id="'service-' + service.id" 
                :value="service.name" 
                v-model="jobData.services"
              />
              <label :for="'service-' + service.id" class="text-sm">{{ service.name }}</label>
            </div>
          </div>
        </div>

        <!-- Team Members -->
        <div>
          <label class="block text-sm font-medium text-neutral-dark mb-2">Team Members</label>
          <div class="flex flex-wrap gap-3 border border-neutral-light rounded-lg p-3">
            <div v-for="member in members" :key="member.id" class="flex items-center gap-1">
              <input 
                type="checkbox" 
                :id="'team-' + member.id" 
                :value="member.id" 
                v-model="jobData.team"
              />
              <label :for="'team-' + member.id" class="text-sm">{{ member.name }}</label>
            </div>
            <div v-if="members.length === 0" class="text-neutral-dark text-sm">
              No team members available
            </div>
          </div>
        </div>

        <!-- Equipment -->
        <div>
          <label class="block text-sm font-medium text-neutral-dark mb-2">Equipment</label>
          <div class="flex flex-wrap gap-3 border border-neutral-light rounded-lg p-3">
            <div v-for="item in equipment" :key="item.id" class="flex items-center gap-1">
              <input 
                type="checkbox" 
                :id="'equipment-' + item.id" 
                :value="item.id" 
                v-model="jobData.equipment"
              />
              <label :for="'equipment-' + item.id" class="text-sm">{{ item.name }}</label>
            </div>
            <div v-if="equipment.length === 0" class="text-neutral-dark text-sm">
              No equipment available
            </div>
          </div>
        </div>

        <!-- Notes -->
        <div>
          <label for="notes" class="block text-sm font-medium text-neutral-dark">Notes</label>
          <textarea 
            id="notes" 
            v-model="jobData.notes"
            rows="4"
            class="mt-1 block w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          ></textarea>
        </div>

        <!-- Submit and Cancel Buttons -->
        <div class="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2 border border-neutral-light rounded-lg shadow-sm text-sm font-medium text-neutral-dark bg-white hover:bg-neutral-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-light"
            :disabled="submitting"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-success hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-success flex items-center justify-center"
            :disabled="submitting"
          >
            <span v-if="submitting" class="flex items-center">
              <span class="w-4 h-4 border-2 border-t-white border-white/20 rounded-full animate-spin mr-2"></span>
              Creating...
            </span>
            <span v-else>Create Job</span>
          </button>
        </div>
      </form>
    </div>
  
    <div v-else class="flex items-center justify-center h-64">
      <div class="text-center">
        <p class="text-neutral mb-2">{{ quote ? 'Loading...' : 'No quote information available' }}</p>
        <div v-if="loading" class="w-8 h-8 border-4 border-t-primary border-neutral-light rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  </Modal>
</template>

<script>
import StatusBadge from '../ui/StatusBadge.vue'
import { format } from 'date-fns'
import Modal from '../ui/Modal.vue'
import { useQuoteStore } from '../../store/Quote'
import { showToast } from '../../utils/toast'
import { useServiceStore } from '../../store/service'
import { useMembersStore } from '../../store/members'
import { useEquipmentStore } from '../../store/equipment'
import { useClientJobStore } from '../../store/clientjobs'
import { XMarkIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'ClientJobsModal',
  
  components: {
    StatusBadge,
    Modal,
    XMarkIcon
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
      jobData: {
        title: '',
        client: {},
        date: '',
        duration: 1,
        status: 'Scheduled',
        price: 0,
        notes: '',
        services: [],
        team: [],
        equipment: []
      },
      statusOptions: ['Scheduled', 'Pending', 'Confirmed', 'Completed', 'Cancelled'],
      quoteStore: useQuoteStore(),
      serviceStore: useServiceStore(),
      membersStore: useMembersStore(),
      equipmentStore: useEquipmentStore(),
      clientJobStore: useClientJobStore(),
      services: [],
      loading: false,
      submitting: false
    }
  },
  
  watch: {
    show(newVal) {
      if (newVal && this.quote) {
        this.initializeForm()
      }
    }
  },

  computed: {
    members() {
      return this.membersStore.members
    },
    equipment() {
      return this.equipmentStore.equipments
    }
  },
  
  methods: {
    async initializeForm() {
      this.loading = true
      try {
        // Fetch necessary data
        await this.serviceStore.fetchServices()
        this.services = this.serviceStore.services

        await this.membersStore.fetchMembers()
        // Members are accessed via computed property

        await this.equipmentStore.fetchEquipments()
        // Equipment are accessed via computed property

        await this.clientJobStore.fetchClientJobs()
        // Client jobs data will be available in the store

        // Set default values based on quote
        const servicesFromQuote = this.servicesNeeded(this.quote.servicesNeeded)
        
        this.jobData = {
          title: `Job for ${this.quote.firstName} ${this.quote.lastName}`,
          client: {
            id: this.quote.id,
            firstName: this.quote.firstName,
            lastName: this.quote.lastName,
            email: this.quote.email,
            phone: this.quote.phone,
            address: this.quote.address
          },
          date: new Date().toISOString().split('T')[0], // Today's date as default
          duration: 1,
          status: this.quote.status || 'Scheduled',
          price: 0,
          notes: this.quote.additionalInfo || '',
          services: servicesFromQuote,
          team: [],
          equipment: []
        }
      } catch (error) {
        console.error('Error initializing form:', error)
        showToast('Error loading data: ' + error.message, 'error')
      } finally {
        this.loading = false
      }
    },
    
    servicesNeeded(services) {
      if (!services) return []
      try {
        return JSON.parse(services)
      } catch (error) {
        console.error('Error parsing services:', error)
        showToast('Error parsing services data', 'warning')
        return []
      }
    },
    
    closeModal() {
      // Reset form data when closing
      this.jobData = {
        title: '',
        client: {},
        date: '',
        duration: 1,
        status: 'Scheduled',
        price: 0,
        notes: '',
        services: [],
        team: [],
        equipment: []
      }
      this.$emit('close')
    },
    
    async submitJob() {
      this.submitting = true
      try {
        if (!this.jobData.title.trim()) {
          showToast('Please enter a job title', 'warning')
          this.submitting = false
          return
        }
        
        await this.clientJobStore.addClientJob(this.jobData)
        
        if (this.clientJobStore.error) {
          showToast('Error: ' + this.clientJobStore.error, 'error')
        } else {
          showToast('Job created successfully', 'success')
          this.$emit('close')
        }
      } catch (error) {
        console.error('Error creating job:', error)
        showToast('Error creating job: ' + error.message, 'error')
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>