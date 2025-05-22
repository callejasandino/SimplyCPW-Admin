<template>
  <div>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h2 class="text-2xl font-semibold text-charcoal">Gallery</h2>
        <p class="text-sm text-gray-500">Showcase your pressure washing projects</p>
      </div>
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="relative">
          <select 
            v-model="activeFilter" 
            class="form-input pr-8 appearance-none"
          >
            <option value="all">All Categories</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
          <ChevronDownIcon class="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        </div>
        <button @click="showAddItemForm = true" class="btn btn-primary">
          <PlusIcon class="h-5 w-5 mr-2" />
          Add New Photo
        </button>
      </div>
    </div>
    
    <!-- Gallery Grid -->
    <div v-if="filteredGalleryItems.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <GalleryCard 
        v-for="item in filteredGalleryItems" 
        :key="item.id" 
        :item="item"
        @edit="editGalleryItem"
        @delete="confirmDeleteItem"
      />
    </div>
    
    <!-- Empty State -->
    <div v-else-if="galleryItems.length === 0" class="card p-12 flex flex-col items-center justify-center">
      <ImageIcon class="h-16 w-16 text-gray-300 mb-4" />
      <h3 class="text-xl font-medium text-charcoal mb-2">No Gallery Items Yet</h3>
      <p class="text-gray-500 text-center mb-6">Start showcasing your work by adding photos.</p>
      <button @click="showAddItemForm = true" class="btn btn-primary">
        <PlusIcon class="h-5 w-5 mr-2" />
        Add New Photo
      </button>
    </div>
    
    <!-- No Results for Filter -->
    <div v-else class="card p-12 flex flex-col items-center justify-center">
      <SearchXIcon class="h-16 w-16 text-gray-300 mb-4" />
      <h3 class="text-xl font-medium text-charcoal mb-2">No Matching Results</h3>
      <p class="text-gray-500 text-center mb-6">No items found matching your selected filter.</p>
      <button @click="activeFilter = 'all'" class="btn btn-secondary">
        Show All Items
      </button>
    </div>
    
    <!-- Add/Edit Gallery Item Modal -->
    <div v-if="showAddItemForm || editingItem" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div class="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-auto">
        <div class="flex justify-between items-center p-4 border-b">
          <h3 class="text-lg font-semibold">{{ editingItem ? 'Edit Gallery Item' : 'Add New Gallery Item' }}</h3>
          <button @click="closeForm" class="p-1">
            <XIcon class="h-6 w-6" />
          </button>
        </div>
        <div class="p-6">
          <form @submit.prevent="saveGalleryItem">
            <div class="mb-4">
              <label for="category" class="form-label">Category</label>
              <select 
                id="category" 
                v-model="galleryForm.category" 
                class="form-input" 
                required
              >
                <option v-for="category in categories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
            </div>
            
            <div class="mb-4">
              <label for="description" class="form-label">Description</label>
              <textarea 
                id="description" 
                v-model="galleryForm.description" 
                rows="2" 
                class="form-input"
              ></textarea>
            </div>
            
            <div class="mb-4">
              <label for="image" class="form-label">Main Image URL</label>
              <input 
                type="url" 
                id="image" 
                v-model="galleryForm.image" 
                class="form-input" 
                required
              />
              
              <div v-if="galleryForm.image" class="mt-3">
                <img 
                  :src="galleryForm.image" 
                  alt="Image Preview" 
                  class="h-32 w-full object-cover rounded-md"
                />
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label for="beforeImage" class="form-label">Before Image URL (Optional)</label>
                <input 
                  type="url" 
                  id="beforeImage" 
                  v-model="galleryForm.beforeImage" 
                  class="form-input"
                />
                
                <div v-if="galleryForm.beforeImage" class="mt-3">
                  <img 
                    :src="galleryForm.beforeImage" 
                    alt="Before Image Preview" 
                    class="h-32 w-full object-cover rounded-md"
                  />
                </div>
              </div>
              
              <div>
                <label for="afterImage" class="form-label">After Image URL (Optional)</label>
                <input 
                  type="url" 
                  id="afterImage" 
                  v-model="galleryForm.afterImage" 
                  class="form-input"
                />
                
                <div v-if="galleryForm.afterImage" class="mt-3">
                  <img 
                    :src="galleryForm.afterImage" 
                    alt="After Image Preview" 
                    class="h-32 w-full object-cover rounded-md"
                  />
                </div>
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
                {{ editingItem ? 'Update Item' : 'Add Item' }}
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
          <h3 class="text-lg font-semibold text-center mb-2">Delete Gallery Item?</h3>
          <p class="text-gray-500 text-center mb-6">
            Are you sure you want to delete this item? This action cannot be undone.
          </p>
          <div class="flex justify-center space-x-3">
            <button 
              @click="showDeleteConfirm = false" 
              class="btn bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Cancel
            </button>
            <button 
              @click="deleteGalleryItem" 
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
  ImageIcon, 
  AlertTriangleIcon, 
  ChevronDownIcon,
  SearchXIcon
} from 'lucide-vue-next'
import GalleryCard from '../components/GalleryCard.vue'
import { mockGallery } from '../data/mock-data.js'

export default {
  components: {
    GalleryCard,
    PlusIcon,
    XIcon,
    ImageIcon,
    AlertTriangleIcon,
    ChevronDownIcon,
    SearchXIcon
  },
  data() {
    return {
      categories: ['Residential', 'Commercial', 'Driveways', 'Decks & Patios', 'Roofs', 'Other'],
      galleryItems: [...mockGallery],
      activeFilter: 'all',
      showAddItemForm: false,
      editingItem: null,
      galleryForm: {
        category: 'Residential',
        description: '',
        image: '',
        beforeImage: '',
        afterImage: ''
      },
      showDeleteConfirm: false,
      itemToDelete: null
    }
  },
  computed: {
    filteredGalleryItems() {
      if (this.activeFilter === 'all') {
        return this.galleryItems
      }
      return this.galleryItems.filter(item => item.category === this.activeFilter)
    }
  },
  methods: {
    // Show edit gallery item form
    editGalleryItem(item) {
      this.editingItem = item
      this.galleryForm = { ...item }
    },
    
    // Show delete confirmation
    confirmDeleteItem(id) {
      this.itemToDelete = id
      this.showDeleteConfirm = true
    },
    
    // Delete gallery item
    deleteGalleryItem() {
      this.galleryItems = this.galleryItems.filter(item => item.id !== this.itemToDelete)
      this.showDeleteConfirm = false
      this.itemToDelete = null
      
      // Show toast notification (mock)
      alert('Gallery item deleted successfully!')
    },
    
    // Save gallery item (add or update)
    saveGalleryItem() {
      if (this.editingItem) {
        // Update existing item
        const index = this.galleryItems.findIndex(i => i.id === this.editingItem.id)
        if (index !== -1) {
          this.galleryItems[index] = {
            ...this.editingItem,
            ...this.galleryForm
          }
        }
      } else {
        // Add new item
        const newItem = {
          id: Date.now().toString(),
          ...this.galleryForm
        }
        this.galleryItems.push(newItem)
      }
      
      // Reset form and close modal
      this.closeForm()
      
      // Show toast notification (mock)
      alert(this.editingItem ? 'Gallery item updated successfully!' : 'Gallery item added successfully!')
    },
    
    // Close form and reset
    closeForm() {
      this.showAddItemForm = false
      this.editingItem = null
      this.galleryForm = {
        category: 'Residential',
        description: '',
        image: '',
        beforeImage: '',
        afterImage: ''
      }
    }
  }
}
</script>