<template>
  <div>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h2 class="text-2xl font-semibold text-charcoal">Jobs</h2>
        <p class="text-sm text-gray-500">Manage and track your service jobs</p>
      </div>
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="relative">
          <select 
            v-model="statusFilter" 
            class="form-input pr-8 appearance-none"
          >
            <option value="all">All Status</option>
            <option v-for="status in statuses" :key="status" :value="status">
              {{ status }}
            </option>
          </select>
          <ChevronDownIcon class="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        </div>
        <button @click="showAddForm = true" class="btn btn-primary">
          <PlusIcon class="h-5 w-5 mr-2" />
          Create Job
        </button>
      </div>
    </div>
    
    <!-- Jobs List -->
    <div v-if="filteredJobs.length > 0" class="space-y-4">
      <div v-for="job in filteredJobs" :key="job.id" class="card hover:shadow-lg transition-shadow duration-200">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex-1">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="text-lg font-medium text-charcoal">{{ job.title }}</h3>
                <p class="text-sm text-gray-500">{{ job.client.name }}</p>
              </div>
              <span 
                class="px-2 py-1 text-sm rounded-full"
                :class="getStatusClass(job.status)"
              >
                {{ job.status }}
              </span>
            </div>
            
            <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p class="text-sm font-medium text-gray-500">Date & Time</p>
                <p>{{ formatDateTime(job.date) }}</p>
                <p class="text-sm text-gray-500">Duration: {{ job.duration }}h</p>
              </div>
              
              <div>
                <p class="text-sm font-medium text-gray-500">Location</p>
                <p class="text-sm">{{ job.client.address }}</p>
              </div>
              
              <div>
                <p class="text-sm font-medium text-gray-500">Team</p>
                <div class="flex flex-wrap gap-1 mt-1">
                  <span 
                    v-for="member in job.team" 
                    :key="member"
                    class="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                  >
                    {{ member }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="flex items-center gap-3 md:self-start">
            <button 
              @click="viewJob(job)"
              class="btn btn-secondary text-sm px-4"
            >
              View Details
            </button>
            <button 
              @click="confirmDelete(job.id)"
              class="btn bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm px-4"
            >
              <Trash2Icon class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Empty State -->
    <div v-else-if="jobs.length === 0" class="card p-12 flex flex-col items-center justify-center">
      <BriefcaseIcon class="h-16 w-16 text-gray-300 mb-4" />
      <h3 class="text-xl font-medium text-charcoal mb-2">No Jobs Yet</h3>
      <p class="text-gray-500 text-center mb-6">Start by creating your first job.</p>
      <button @click="showAddForm = true" class="btn btn-primary">
        <PlusIcon class="h-5 w-5 mr-2" />
        Create Job
      </button>
    </div>
    
    <!-- No Results -->
    <div v-else class="card p-12 flex flex-col items-center justify-center">
      <SearchXIcon class="h-16 w-16 text-gray-300 mb-4" />
      <h3 class="text-xl font-medium text-charcoal mb-2">No Matching Jobs</h3>
      <p class="text-gray-500 text-center mb-6">Try adjusting your filter settings.</p>
      <button @click="statusFilter = 'all'" class="btn btn-secondary">
        Show All Jobs
      </button>
    </div>
    
    <!-- Job Details Modal -->
    <div v-if="selectedJob" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div class="flex justify-between items-center p-4 border-b">
          <h3 class="text-lg font-semibold">Job Details</h3>
          <button @click="selectedJob = null" class="p-1">
            <XIcon class="h-6 w-6" />
          </button>
        </div>
        <div class="p-6">
          <div class="flex justify-between items-start mb-6">
            <div>
              <h4 class="text-xl font-medium text-charcoal">{{ selectedJob.title }}</h4>
              <p class="text-gray-500">${{ selectedJob.price }}</p>
            </div>
            <span 
              class="px-2 py-1 text-sm rounded-full"
              :class="getStatusClass(selectedJob.status)"
            >
              {{ selectedJob.status }}
            </span>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 class="font-medium mb-2">Client Information</h5>
              <div class="space-y-2">
                <p><span class="text-gray-500">Name:</span> {{ selectedJob.client.name }}</p>
                <p><span class="text-gray-500">Email:</span> {{ selectedJob.client.email }}</p>
                <p><span class="text-gray-500">Phone:</span> {{ selectedJob.client.phone }}</p>
                <p><span class="text-gray-500">Address:</span> {{ selectedJob.client.address }}</p>
              </div>
            </div>
            
            <div>
              <h5 class="font-medium mb-2">Job Details</h5>
              <div class="space-y-2">
                <p>
                  <span class="text-gray-500">Date:</span> 
                  {{ formatDateTime(selectedJob.date) }}
                </p>
                <p>
                  <span class="text-gray-500">Duration:</span> 
                  {{ selectedJob.duration }} hours
                </p>
                <div>
                  <span class="text-gray-500">Services:</span>
                  <div class="flex flex-wrap gap-1 mt-1">
                    <span 
                      v-for="service in selectedJob.services" 
                      :key="service"
                      class="px-2 py-1 text-xs bg-secondary-light text-primary rounded-full"
                    >
                      {{ service }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="md:col-span-2">
              <h5 class="font-medium mb-2">Team & Equipment</h5>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-gray-500 mb-1">Team Members:</p>
                  <div class="flex flex-wrap gap-1">
                    <span 
                      v-for="member in selectedJob.team" 
                      :key="member"
                      class="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                    >
                      {{ member }}
                    </span>
                  </div>
                </div>
                <div>
                  <p class="text-gray-500 mb-1">Equipment:</p>
                  <div class="flex flex-wrap gap-1">
                    <span 
                      v-for="item in selectedJob.equipment" 
                      :key="item"
                      class="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                    >
                      {{ item }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="md:col-span-2">
              <h5 class="font-medium mb-2">Notes</h5>
              <p class="text-gray-600">{{ selectedJob.notes }}</p>
            </div>
          </div>
          
          <div class="flex justify-end mt-6 space-x-3">
            <button 
              @click="selectedJob = null" 
              class="btn bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Close
            </button>
            <button 
              @click="editJob(selectedJob)"
              class="btn btn-primary"
            >
              Edit Job
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div class="bg-white rounded-lg max-w-md w-full">
        <div class="p-6">
          <AlertTriangleIcon class="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-center mb-2">Delete Job?</h3>
          <p class="text-gray-500 text-center mb-6">
            Are you sure you want to delete this job? This action cannot be undone.
          </p>
          <div class="flex justify-center space-x-3">
            <button 
              @click="showDeleteConfirm = false" 
              class="btn bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Cancel
            </button>
            <button 
              @click="deleteJob" 
              class="btn bg-red-500 text-white hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { 
  PlusIcon, 
  XIcon, 
  BriefcaseIcon, 
  AlertTriangleIcon,
  ChevronDownIcon,
  SearchXIcon,
  Trash2Icon
} from 'lucide-vue-next'
import { mockJobs } from '../data/mock-data.js'

export default {
  components: {
    PlusIcon,
    XIcon,
    BriefcaseIcon,
    AlertTriangleIcon,
    ChevronDownIcon,
    SearchXIcon,
    Trash2Icon
  },
  data() {
    return {
      jobs: [...mockJobs],
      selectedJob: null,
      showAddForm: false,
      showDeleteConfirm: false,
      jobToDelete: null,
      statusFilter: 'all',
      statuses: ['Scheduled', 'Confirmed', 'In Progress', 'Completed', 'Cancelled']
    }
  },
  computed: {
    filteredJobs() {
      if (this.statusFilter === 'all') {
        return this.jobs
      }
      return this.jobs.filter(job => job.status === this.statusFilter)
    }
  },
  methods: {
    formatDateTime(dateString) {
      return new Date(dateString).toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      })
    },
    
    getStatusClass(status) {
      switch (status) {
        case 'Scheduled':
          return 'bg-secondary-light text-secondary'
        case 'Confirmed':
          return 'bg-green-100 text-green'
        case 'In Progress':
          return 'bg-orange-100 text-orange'
        case 'Completed':
          return 'bg-primary-light text-primary'
        case 'Cancelled':
          return 'bg-red-100 text-red-500'
        default:
          return 'bg-gray-100 text-gray-600'
      }
    },
    
    viewJob(job) {
      this.selectedJob = job
    },
    
    editJob(job) {
      // Implement edit functionality
      alert('Edit job functionality to be implemented')
    },
    
    confirmDelete(id) {
      this.jobToDelete = id
      this.showDeleteConfirm = true
    },
    
    deleteJob() {
      this.jobs = this.jobs.filter(job => job.id !== this.jobToDelete)
      this.showDeleteConfirm = false
      this.jobToDelete = null
      alert('Job deleted successfully!')
    }
  }
}
</script>