<template>
  <div>
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4">
      <button
        @click="showAddServiceModal = true"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Service
      </button>
    </div>
    
    <!-- Loading state -->
    <div v-if="serviceStore.isLoading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
    </div>
    
    <!-- Error state -->
    <div v-else-if="serviceStore.error" class="bg-red-50 p-4 rounded-lg text-red-600">
      {{ serviceStore.error }}
    </div>
    
    <!-- Services grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-5 gap-6">
      <div
        v-for="service in serviceStore.services"
        :key="service.id"
        class="bg-white rounded-lg shadow-card overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
        @click="navigateToService(service)"
      >
        <img :src="service.image" class="w-full h-48 object-cover">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-neutral-dark mb-2">{{ service.name }}</h3>
          <p class="text-neutral mb-4">{{ ellipsis(service.description) }}</p>
          <div class="flex justify-between items-center text-sm">
            <span class="font-medium text-primary">Price: ${{ service.price }}</span>
            <span class="text-neutral">Duration: {{ service.duration }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Service Modal -->
    <Modal
      :show="showAddServiceModal"
      title="Add New Service"
      @close="showAddServiceModal = false"
    >
      <div class="space-y-4">
        <div>
          <div class="space-y-2">
              <img :src="imagePreview || newService.image" class="w-full h-60 object-cover rounded-lg mb-2">
              <input 
                  type="file" 
                  @change="handleImageChange" 
                  accept="image/*"
                  class="block w-full text-sm text-neutral-dark
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-lg file:border-0
                        file:text-sm file:font-medium
                        file:bg-primary file:text-white
                        hover:file:bg-primary-dark"
              />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-neutral-dark mb-1">
            Service Name
          </label>
          <input
            v-model="newService.name"
            type="text"
            class="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-neutral-dark mb-1">
            Description
          </label>
          <textarea
            v-model="newService.description"
            rows="3"
            class="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-neutral-dark mb-1">
            Price
          </label>
          <input
            v-model="newService.price"
            type="text"
            placeholder="e.g., From $200"
            class="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-neutral-dark mb-1">
            Duration
          </label>
          <input
            v-model="newService.duration"
            type="text"
            placeholder="e.g., 2-4 hours"
            class="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <button
            @click="showAddServiceModal = false"
            class="px-4 py-2 text-sm font-medium text-neutral-dark border border-neutral-light rounded-lg hover:bg-neutral-light"
          >
            Cancel
          </button>
          <button
            @click="createService"
            class="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark"
          >
            Create Service
          </button>
        </div>
      </template>
    </Modal>

    <ServiceDetailModal 
      :show="showServiceDetailModal" 
      :service="selectedService" 
      @close="showServiceDetailModal = false" 
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Modal from '../components/ui/Modal.vue'
import { useServiceStore } from '../store/service'
import ServiceDetailModal from '../components/modals/ServiceDetailModal.vue'
const router = useRouter()
const serviceStore = useServiceStore()
const showAddServiceModal = ref(false)
const showServiceDetailModal = ref(false)
const selectedService = ref(null)

const newService = ref({
  name: '',
  description: '',
  price: '',
  duration: '',
  image: ''
})

const imagePreview = ref(null)

onMounted( async () => {
  await serviceStore.fetchServices()
  newService.value = serviceStore.services
})

const navigateToService = (service) => {
  // router.push(`/services/${serviceId}`)
  selectedService.value = service
  showServiceDetailModal.value = true
}

function createService() {
  if (newService.value.name && newService.value.description) {
    serviceStore.addService(newService.value)
    // Reset form
    newService.value = {
      name: '',
      description: '',
      price: '',
      duration: '',
      image: ''
    }
    showAddServiceModal.value = false
  }
}

const handleImageChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
    newService.value.image = file
  }
}

function ellipsis(text) {
  return text.length > 100 ? text.substring(0, 100) + '...' : text
}
</script>