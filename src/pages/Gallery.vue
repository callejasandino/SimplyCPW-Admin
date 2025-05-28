```vue
<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  ArrowsPointingOutIcon
} from '@heroicons/vue/24/outline'
import FileUpload from '../components/FileUpload.vue'
import Modal from '../components/ui/Modal.vue'
import { mockGallery } from '../data/mockData'
import VueEasyLightbox from 'vue-easy-lightbox'

const router = useRouter()
const gallery = ref([...mockGallery])
const searchQuery = ref('')
const showUploadModal = ref(false)
const selectedCategory = ref('All')
const selectedFiles = ref(null)
const newImageDescription = ref('')
const newImageCategory = ref('Residential')

// Lightbox
const visibleLightbox = ref(false)
const currentImage = ref('')

const categories = computed(() => {
  const allCategories = gallery.value.map(item => item.category)
  return ['All', ...new Set(allCategories)]
})

const filteredGallery = computed(() => {
  let filtered = gallery.value
  
  // Filter by category
  if (selectedCategory.value !== 'All') {
    filtered = filtered.filter(item => item.category === selectedCategory.value)
  }
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(item => 
      item.description.toLowerCase().includes(query) || 
      item.category.toLowerCase().includes(query)
    )
  }
  
  return filtered
})

const showImage = (imageUrl) => {
  currentImage.value = imageUrl
  visibleLightbox.value = true
}

const handleFilesSelected = (files) => {
  selectedFiles.value = files
}

const addNewImage = () => {
  if (!selectedFiles.value || !newImageDescription.value || !newImageCategory.value) {
    alert('Please fill all required fields')
    return
  }
  
  // In a real app, we would upload the file to a server
  // Here we just create a URL from the file for demo purposes
  const fileUrl = URL.createObjectURL(selectedFiles.value)
  
  const newImage = {
    id: (gallery.value.length + 1).toString(),
    image: fileUrl,
    category: newImageCategory.value,
    description: newImageDescription.value,
    isLocal: true // Flag to indicate this is a local file, not from a remote URL
  }
  
  gallery.value.unshift(newImage)
  
  // Reset form
  selectedFiles.value = null
  newImageDescription.value = ''
  showUploadModal.value = false
}

const navigateToDetail = (id) => {
  router.push(`/gallery/${id}`)
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <h1 class="text-2xl font-bold text-neutral-dark">Gallery</h1>
      
      <div class="flex items-center space-x-2">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MagnifyingGlassIcon class="w-5 h-5 text-neutral" />
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search gallery..."
            class="pl-10 pr-4 py-2 w-full sm:w-60 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        
        <button
          @click="showUploadModal = true"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <PlusIcon class="w-5 h-5 mr-2" />
          Add Image
        </button>
      </div>
    </div>
    
    <!-- Category filters -->
    <div class="mb-6 flex flex-wrap gap-2">
      <button
        v-for="category in categories"
        :key="category"
        @click="selectedCategory = category"
        :class="[
          'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
          selectedCategory === category
            ? 'bg-primary text-white'
            : 'bg-white text-neutral-dark hover:bg-neutral-light'
        ]"
      >
        {{ category }}
      </button>
    </div>
    
    <!-- Gallery grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div
        v-for="item in filteredGallery"
        :key="item.id"
        class="bg-white rounded-lg shadow-card overflow-hidden group"
      >
        <div class="relative h-48 overflow-hidden">
          <img
            :src="item.image"
            :alt="item.description"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button
              @click.stop="showImage(item.image)"
              class="p-2 bg-white rounded-full text-neutral-dark mx-1"
            >
              <ArrowsPointingOutIcon class="w-5 h-5" />
            </button>
            <button
              @click.stop="navigateToDetail(item.id)"
              class="p-2 bg-primary rounded-full text-white mx-1"
            >
              <span class="sr-only">View details</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>
        <div class="p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium px-2 py-1 bg-primary-light text-primary-dark rounded-full">{{ item.category }}</span>
          </div>
          <p class="text-sm text-neutral-dark line-clamp-2">{{ item.description }}</p>
        </div>
      </div>
    </div>
    
    <!-- Empty state -->
    <div v-if="filteredGallery.length === 0" class="text-center py-12">
      <div class="mx-auto w-24 h-24 bg-neutral-light rounded-full flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-neutral" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-neutral-dark mb-1">No images found</h3>
      <p class="text-neutral">Try adjusting your search or filter criteria</p>
    </div>
    
    <!-- Upload modal -->
    <Modal
      :show="showUploadModal"
      title="Add New Image"
      @close="showUploadModal = false"
    >
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-neutral-dark mb-2">
            Image
          </label>
          <FileUpload 
            :multiple="false" 
            accept="image/*" 
            :max-size="5" 
            label="Upload Image"
            @files-selected="handleFilesSelected"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-neutral-dark mb-2">
            Category
          </label>
          <select
            v-model="newImageCategory"
            class="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option v-for="category in categories.filter(c => c !== 'All')" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-neutral-dark mb-2">
            Description
          </label>
          <textarea
            v-model="newImageDescription"
            rows="3"
            class="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Enter image description"
          ></textarea>
        </div>
      </div>
      
      <template #footer>
        <div class="flex justify-end space-x-3">
          <button
            @click="showUploadModal = false"
            class="px-4 py-2 text-sm font-medium text-neutral-dark border border-neutral-light rounded-lg hover:bg-neutral-light"
          >
            Cancel
          </button>
          <button
            @click="addNewImage"
            class="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark"
          >
            Add Image
          </button>
        </div>
      </template>
    </Modal>
    
    <!-- Lightbox -->
    <vue-easy-lightbox
      :visible="visibleLightbox"
      :imgs="currentImage"
      @hide="visibleLightbox = false"
    ></vue-easy-lightbox>
  </div>
</template>
```