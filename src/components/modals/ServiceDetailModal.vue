<template>
    <Modal
        :show="show"
        title="Service Details"
        @close="closeModal"
    >
        <div v-if="serviceStore.isLoading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>

        <div v-else-if="service" class="space-y-6">
            <div class="space-y-4">
                <div>
                    <div v-if="!isEditing" class="text-neutral-dark">
                        <img :src="service.image" class="w-full h-60 object-cover rounded-lg">
                    </div>
                    <div v-else class="space-y-2">
                        <img :src="imagePreview || service.image" class="w-full h-60 object-cover rounded-lg mb-2">
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
                    <h3 class="text-sm font-medium text-neutral mb-2">Service Name</h3>
                    <div v-if="!isEditing" class="text-neutral-dark">{{ service.name }}</div>
                    <input
                        v-else
                        v-model="formData.name"
                        type="text"
                        class="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                </div>
                    
                <div>
                    <h3 class="text-sm font-medium text-neutral mb-2">Description</h3>
                    <div v-if="!isEditing" class="text-neutral-dark">{{ service.description }}</div>
                    <textarea
                        v-else
                        v-model="formData.description"
                        rows="4"
                        class="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    ></textarea>
                </div>
                    
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 class="text-sm font-medium text-neutral mb-2">Price</h3>
                        <div v-if="!isEditing" class="text-neutral-dark">{{ service.price }}</div>
                        <input
                        v-else
                        v-model="formData.price"
                        type="text"
                        class="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>
                    
                    <div>
                        <h3 class="text-sm font-medium text-neutral mb-2">Duration</h3>
                        <div v-if="!isEditing" class="text-neutral-dark">{{ service.duration }}</div>
                        <input
                        v-else
                        v-model="formData.duration"
                        type="text"
                        class="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>
                </div>
            </div>
        </div>
        
        <div v-else-if="!serviceStore.isLoading" class="flex items-center justify-center h-64">
            <p class="text-neutral">Service not found</p>
        </div>

        <template #footer>
            <div class="flex justify-end space-x-3">
                <div v-if="isEditing" class="flex space-x-3 ml-auto">
                    <button
                        @click="toggleEdit"
                        class="px-4 py-2 text-sm font-medium text-neutral-dark border border-neutral-light rounded-lg hover:bg-neutral-light"
                    >
                        Cancel
                    </button>
                    <button
                        @click="saveChanges"
                        class="px-4 py-2 text-sm font-medium text-white bg-success rounded-lg hover:bg-green-700"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
            
            <div class="flex justify-between" v-if="!isEditing">
                <div>
                    <button
                        v-if="!isEditing"
                        @click="deleteService"
                        class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                    >
                    Delete
                    </button>
                </div>

                <div v-if="!isEditing">
                    <button
                        @click="toggleEdit"
                        class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                    Edit Service
                    </button>
                </div>
            </div>
        </template>
    </Modal>
</template>

<script>
import { useServiceStore } from '../../store/service'
import Modal from '../ui/Modal.vue'

export default {
  components: {
    Modal
  },
  
  props: {
    service: {
      type: Object,
      required: false,
      default: null
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  
  data() {
    return {
      serviceStore: useServiceStore(),
      isEditing: false,
      formData: {
        id: '',
        name: '',
        description: '',
        price: '',
        duration: '',
        image: ''
      },
      imagePreview: null
    }
  },
  
  watch: {
    show(newVal) {
      if (newVal && this.service) {
        // Initialize form data when modal opens
        this.formData = { ...this.service }
        this.isEditing = false
      }
    }
  },
  
  mounted() {
    if (this.service) {
      this.formData = { ...this.service }
    }
  },
  
  methods: {
    closeModal() {
      this.$emit('close')
    },
    
    toggleEdit() {
      this.isEditing = !this.isEditing
      if (this.isEditing) {
        this.formData = { ...this.service }
      }
    },
    
    async saveChanges() {
      // Now update the service with all data including possibly new image URL
      await this.serviceStore.updateService(this.formData)
      this.isEditing = false
      this.imagePreview = null
      this.$emit('close')
    },
    
    async deleteService() {
      await this.serviceStore.deleteService(this.service.id)
      this.closeModal()
    },
    
    handleImageChange(event) {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.imagePreview = e.target.result
        }
        reader.readAsDataURL(file)
        this.formData.image = file
      }
    }
  }
}
</script>