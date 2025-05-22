<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-semibold text-charcoal">Services</h2>
      <button @click="showAddServiceForm = true" class="btn btn-primary">
        <PlusIcon class="h-5 w-5 mr-2" />
        Add New Service
      </button>
    </div>
    
    <!-- Service Grid -->
    <div v-if="services.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ServiceCard 
        v-for="service in services" 
        :key="service.id" 
        :service="service"
        @edit="editService"
        @delete="confirmDeleteService"
      />
    </div>
    
    <!-- Empty State -->
    <div v-else class="card p-12 flex flex-col items-center justify-center">
      <PackageIcon class="h-16 w-16 text-gray-300 mb-4" />
      <h3 class="text-xl font-medium text-charcoal mb-2">No Services Yet</h3>
      <p class="text-gray-500 text-center mb-6">Start by adding your first service offering.</p>
      <button @click="showAddServiceForm = true" class="btn btn-primary">
        <PlusIcon class="h-5 w-5 mr-2" />
        Add New Service
      </button>
    </div>
    
    <!-- Add/Edit Service Modal -->
    <div v-if="showAddServiceForm || editingService" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div class="bg-white rounded-lg max-w-lg w-full">
        <div class="flex justify-between items-center p-4 border-b">
          <h3 class="text-lg font-semibold">{{ editingService ? 'Edit Service' : 'Add New Service' }}</h3>
          <button @click="closeForm" class="p-1">
            <XIcon class="h-6 w-6" />
          </button>
        </div>
        <div class="p-6">
          <form @submit.prevent="saveService">
            <div class="mb-4">
              <label for="name" class="form-label">Service Name</label>
              <input 
                type="text" 
                id="name" 
                v-model="serviceForm.name" 
                class="form-input" 
                required
              />
            </div>
            
            <div class="mb-4">
              <label for="description" class="form-label">Description</label>
              <textarea 
                id="description" 
                v-model="serviceForm.description" 
                rows="3" 
                class="form-input" 
                required
              ></textarea>
            </div>
            
            <div class="mb-4">
              <label for="price" class="form-label">Price ($)</label>
              <input 
                type="number" 
                id="price" 
                v-model="serviceForm.price" 
                class="form-input" 
                min="0" 
                step="0.01" 
                required
              />
            </div>
            
            <div class="mb-6">
              <label for="image" class="form-label">Image URL</label>
              <input 
                type="url" 
                id="image" 
                v-model="serviceForm.image" 
                class="form-input" 
                required
              />
              
              <div v-if="serviceForm.image" class="mt-3">
                <img 
                  :src="serviceForm.image" 
                  alt="Service Preview" 
                  class="h-32 w-full object-cover rounded-md"
                />
              </div>
            </div>
            
            <div class="flex justify-end space-x-3">
              <button 
                type="button" 
                @click="closeForm" 
                class="btn bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="btn btn-primary"
              >
                {{ editingService ? 'Update Service' : 'Add Service' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div class="bg-white rounded-lg max-w-md w-full">
        <div class="p-6">
          <AlertTriangleIcon class="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-center mb-2">Delete Service?</h3>
          <p class="text-gray-500 text-center mb-6">
            Are you sure you want to delete this service? This action cannot be undone.
          </p>
          <div class="flex justify-center space-x-3">
            <button 
              @click="showDeleteConfirm = false" 
              class="btn bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Cancel
            </button>
            <button 
              @click="deleteService" 
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
import { PlusIcon, XIcon, PackageIcon, AlertTriangleIcon } from 'lucide-vue-next'
import ServiceCard from '../components/ServiceCard.vue'
import { mockServices } from '../data/mock-data.js'

export default {
  components: {
    ServiceCard,
    PlusIcon,
    XIcon,
    PackageIcon,
    AlertTriangleIcon
  },
  data() {
    return {
      services: [...mockServices],
      showAddServiceForm: false,
      editingService: null,
      serviceForm: {
        name: '',
        description: '',
        price: 0,
        image: ''
      },
      showDeleteConfirm: false,
      serviceToDelete: null
    }
  },
  methods: {
    // Show edit service form
    editService(service) {
      this.editingService = service
      this.serviceForm = { ...service }
    },
    
    // Show delete confirmation
    confirmDeleteService(id) {
      this.serviceToDelete = id
      this.showDeleteConfirm = true
    },
    
    // Delete service
    deleteService() {
      this.services = this.services.filter(service => service.id !== this.serviceToDelete)
      this.showDeleteConfirm = false
      this.serviceToDelete = null
      
      // Show toast notification (mock)
      alert('Service deleted successfully!')
    },
    
    // Save service (add or update)
    saveService() {
      if (this.editingService) {
        // Update existing service
        const index = this.services.findIndex(s => s.id === this.editingService.id)
        if (index !== -1) {
          this.services[index] = {
            ...this.editingService,
            ...this.serviceForm
          }
        }
      } else {
        // Add new service
        const newService = {
          id: Date.now().toString(),
          ...this.serviceForm
        }
        this.services.push(newService)
      }
      
      // Reset form and close modal
      this.closeForm()
      
      // Show toast notification (mock)
      alert(this.editingService ? 'Service updated successfully!' : 'Service added successfully!')
    },
    
    // Close form and reset
    closeForm() {
      this.showAddServiceForm = false
      this.editingService = null
      this.serviceForm = {
        name: '',
        description: '',
        price: 0,
        image: ''
      }
    }
  }
}
</script>