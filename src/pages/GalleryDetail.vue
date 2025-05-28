<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  ArrowLeftIcon,
  TrashIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ArrowsPointingOutIcon
} from '@heroicons/vue/24/outline'
import FileUpload from '../components/FileUpload.vue'
import { mockGallery } from '../data/mockData'
import VueEasyLightbox from 'vue-easy-lightbox'

const route = useRoute()
const router = useRouter()
const galleryId = route.params.id
const gallery = ref([...mockGallery])
const isEditing = ref(false)
const selectedFiles = ref(null)

const galleryItem = computed(() => {
  return gallery.value.find(item => item.id === galleryId) || null
})

const formData = ref({
  description: '',
  category: ''
})

// Lightbox
const visibleLightbox = ref(false)
const lightboxIndex = ref(0)
const lightboxImages = computed(() => {
  if (!galleryItem.value) return []
  
  const images = []
  if (galleryItem.value.beforeImage) {
    images.push({ src: galleryItem.value.beforeImage, title: 'Before' })
  }
  if (galleryItem.value.afterImage) {
    images.push({ src: galleryItem.value.afterImage, title: 'After' })
  }
  if (images.length === 0) {
    images.push({ src: galleryItem.value.image, title: galleryItem.value.description })
  }
  
  return images
})

onMounted(() => {
  if (galleryItem.value) {
    formData.value = {
      description: galleryItem.value.description,
      category: galleryItem.value.category
    }
  } else {
    router.push('/gallery')
  }
})

const goBack = () => {
  router.push('/gallery')
}

const toggleEdit = () => {
  isEditing.value = !isEditing.value
  if (!isEditing.value) {
    formData.value = {
      description: galleryItem.value.description,
      category: galleryItem.value.category
    }
  }
}

const saveChanges = () => {
  const itemIndex = gallery.value.findIndex(item => item.id === galleryId)
  if (itemIndex !== -1) {
    gallery.value[itemIndex] = {
      ...gallery.value[itemIndex],
      description: formData.value.description,
      category: formData.value.category
    }
    isEditing.value = false
  }
}

const handleFilesSelected = (files) => {
  selectedFiles.value = files
}

const showLightbox = (index = 0) => {
  lightboxIndex.value = index
  visibleLightbox.value = true
}

const deleteImage = () => {
  if (confirm('Are you sure you want to delete this image?')) {
    const itemIndex = gallery.value.findIndex(item => item.id === galleryId)
    if (itemIndex !== -1) {
      gallery.value.splice(itemIndex, 1)
      router.push('/gallery')
    }
  }
}
</script>

<template>
  <div v-if="galleryItem">
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div class="flex items-center">
        <button 
          @click="goBack" 
          class="mr-4 p-1 rounded-full text-neutral-dark hover:bg-neutral-light"
        >
          <ArrowLeftIcon class="w-5 h-5" />
        </button>
        <h1 class="text-2xl font-bold text-neutral-dark">Gallery Item Details</h1>
      </div>
      
      <div class="flex items-center space-x-2">
        <button
          v-if="!isEditing"
          @click="deleteImage"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-danger hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-danger"
        >
          <TrashIcon class="w-5 h-5 mr-2" />
          Delete
        </button>
        
        <button
          v-if="isEditing"
          @click="toggleEdit"
          class="inline-flex items-center px-4 py-2 border border-neutral-light rounded-lg shadow-sm text-sm font-medium text-neutral-dark bg-white hover:bg-neutral-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-light"
        >
          <XMarkIcon class="w-5 h-5 mr-2" />
          Cancel
        </button>
        
        <button
          v-if="isEditing"
          @click="saveChanges"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-success hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-success"
        >
          <CheckIcon class="w-5 h-5 mr-2" />
          Save
        </button>
        
        <button
          v-if="!isEditing"
          @click="toggleEdit"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <PencilIcon class="w-5 h-5 mr-2" />
          Edit
        </button>
      </div>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Image section -->
      <div class="bg-white rounded-lg shadow-card overflow-hidden">
        <!-- Before/After comparison -->
        <div v-if="galleryItem.beforeImage && galleryItem.afterImage" class="grid grid-cols-2 gap-2 p-4">
          <div class="relative group">
            <img 
              :src="galleryItem.beforeImage" 
              alt="Before" 
              class="w-full h-64 object-cover rounded-lg" 
            />
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-40">
              <button
                @click="showLightbox(0)"
                class="p-2 bg-white rounded-full text-neutral-dark"
              >
                <ArrowsPointingOutIcon class="w-5 h-5" />
              </button>
            </div>
            <div class="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 text-xs rounded">
              Before
            </div>
          </div>
          <div class="relative group">
            <img 
              :src="galleryItem.afterImage" 
              alt="After" 
              class="w-full h-64 object-cover rounded-lg" 
            />
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-40">
              <button
                @click="showLightbox(1)"
                class="p-2 bg-white rounded-full text-neutral-dark"
              >
                <ArrowsPointingOutIcon class="w-5 h-5" />
              </button>
            </div>
            <div class="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 text-xs rounded">
              After
            </div>
          </div>
        </div>
        
        <!-- Single image -->
        <div v-else class="relative group">
          <img 
            :src="galleryItem.image" 
            :alt="galleryItem.description" 
            class="w-full h-80 object-cover" 
          />
          <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-40">
            <button
              @click="showLightbox()"
              class="p-2 bg-white rounded-full text-neutral-dark"
            >
              <ArrowsPointingOutIcon class="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <!-- Image upload for editing -->
        <div v-if="isEditing" class="p-4 border-t border-neutral-light">
          <h3 class="text-lg font-medium text-neutral-dark mb-4">Update Image</h3>
          <FileUpload 
            :multiple="false" 
            accept="image/*" 
            :max-size="5" 
            label="Replace Image"
            @files-selected="handleFilesSelected"
          />
        </div>
      </div>
      
      <!-- Details section -->
      <div class="bg-white rounded-lg shadow-card overflow-hidden">
        <div class="p-4 border-b border-neutral-light">
          <h2 class="text-lg font-semibold text-neutral-dark">Image Details</h2>
        </div>
        
        <div class="p-4 space-y-4">
          <!-- Category -->
          <div>
            <h3 class="text-sm font-medium text-neutral mb-2">Category</h3>
            <div v-if="!isEditing" class="flex items-center">
              <span class="text-sm font-medium px-2 py-1 bg-primary-light text-primary-dark rounded-full">
                {{ galleryItem.category }}
              </span>
            </div>
            <div v-else>
              <select
                v-model="formData.category"
                class="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Driveways">Driveways</option>
                <option value="Decks & Patios">Decks & Patios</option>
                <option value="Roofs">Roofs</option>
              </select>
            </div>
          </div>
          
          <!-- Description -->
          <div>
            <h3 class="text-sm font-medium text-neutral mb-2">Description</h3>
            <p v-if="!isEditing" class="text-neutral-dark">{{ galleryItem.description }}</p>
            <div v-else>
              <textarea
                v-model="formData.description"
                rows="4"
                class="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              ></textarea>
            </div>
          </div>
          
          <!-- Technical Details -->
          <div v-if="!isEditing">
            <h3 class="text-sm font-medium text-neutral mb-2">Technical Details</h3>
            <div class="bg-neutral-light bg-opacity-50 p-4 rounded-lg space-y-2">
              <div class="flex justify-between">
                <span class="text-sm text-neutral">Image ID:</span>
                <span class="text-sm text-neutral-dark">{{ galleryItem.id }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-neutral">Has Before/After:</span>
                <span class="text-sm text-neutral-dark">{{ galleryItem.beforeImage && galleryItem.afterImage ? 'Yes' : 'No' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-neutral">Image Type:</span>
                <span class="text-sm text-neutral-dark">{{ galleryItem.isLocal ? 'Local' : 'Remote' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Lightbox -->
    <vue-easy-lightbox
      :visible="visibleLightbox"
      :imgs="lightboxImages"
      :index="lightboxIndex"
      @hide="visibleLightbox = false"
    ></vue-easy-lightbox>
  </div>
  
  <div v-else class="flex items-center justify-center h-64">
    <p class="text-neutral">Loading...</p>
  </div>
</template>