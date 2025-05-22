<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-semibold text-charcoal">Testimonials</h2>
        <p class="text-sm text-gray-500">Manage client reviews and feedback</p>
      </div>
      <button @click="showAddForm = true" class="btn btn-primary">
        <PlusIcon class="h-5 w-5 mr-2" />
        Add Testimonial
      </button>
    </div>
    
    <!-- Testimonials Grid -->
    <div v-if="testimonials.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <TestimonialCard 
        v-for="testimonial in testimonials" 
        :key="testimonial.id" 
        :testimonial="testimonial"
        @edit="editTestimonial"
        @delete="confirmDelete"
      />
    </div>
    
    <!-- Empty State -->
    <div v-else class="card p-12 flex flex-col items-center justify-center">
      <MessageSquareIcon class="h-16 w-16 text-gray-300 mb-4" />
      <h3 class="text-xl font-medium text-charcoal mb-2">No Testimonials Yet</h3>
      <p class="text-gray-500 text-center mb-6">Start adding client testimonials to showcase your work.</p>
      <button @click="showAddForm = true" class="btn btn-primary">
        <PlusIcon class="h-5 w-5 mr-2" />
        Add Testimonial
      </button>
    </div>
    
    <!-- Add/Edit Modal -->
    <div v-if="showAddForm || editingTestimonial" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div class="bg-white rounded-lg max-w-lg w-full">
        <div class="flex justify-between items-center p-4 border-b">
          <h3 class="text-lg font-semibold">
            {{ editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial' }}
          </h3>
          <button @click="closeForm" class="p-1">
            <XIcon class="h-6 w-6" />
          </button>
        </div>
        <div class="p-6">
          <form @submit.prevent="saveTestimonial">
            <div class="mb-4">
              <label class="form-label" for="name">Client Name</label>
              <input 
                type="text" 
                id="name" 
                v-model="testimonialForm.name" 
                class="form-input"
                required
              />
            </div>
            
            <div class="mb-4">
              <label class="form-label" for="image">Client Image URL</label>
              <input 
                type="url" 
                id="image" 
                v-model="testimonialForm.image" 
                class="form-input"
                required
              />
              <div v-if="testimonialForm.image" class="mt-2">
                <img 
                  :src="testimonialForm.image" 
                  alt="Preview" 
                  class="w-16 h-16 rounded-full object-cover"
                />
              </div>
            </div>
            
            <div class="mb-4">
              <label class="form-label">Rating</label>
              <div class="flex space-x-2">
                <button 
                  v-for="i in 5" 
                  :key="i"
                  type="button"
                  @click="testimonialForm.rating = i"
                  class="focus:outline-none"
                >
                  <StarIcon 
                    :class="[
                      'h-8 w-8',
                      i <= testimonialForm.rating ? 'text-orange fill-current' : 'text-gray-300'
                    ]"
                  />
                </button>
              </div>
            </div>
            
            <div class="mb-4">
              <label class="form-label" for="title">Title</label>
              <input 
                type="text" 
                id="title" 
                v-model="testimonialForm.title" 
                class="form-input"
                required
              />
            </div>
            
            <div class="mb-6">
              <label class="form-label" for="description">Description</label>
              <textarea 
                id="description" 
                v-model="testimonialForm.description" 
                rows="3" 
                class="form-input"
                required
              ></textarea>
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
                {{ editingTestimonial ? 'Update Testimonial' : 'Add Testimonial' }}
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
          <h3 class="text-lg font-semibold text-center mb-2">Delete Testimonial?</h3>
          <p class="text-gray-500 text-center mb-6">
            Are you sure you want to delete this testimonial? This action cannot be undone.
          </p>
          <div class="flex justify-center space-x-3">
            <button 
              @click="showDeleteConfirm = false" 
              class="btn bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Cancel
            </button>
            <button 
              @click="deleteTestimonial" 
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
import { PlusIcon, XIcon, MessageSquareIcon, StarIcon, AlertTriangleIcon } from 'lucide-vue-next'
import TestimonialCard from '../components/TestimonialCard.vue'
import { mockTestimonials } from '../data/mock-data.js'

export default {
  components: {
    TestimonialCard,
    PlusIcon,
    XIcon,
    MessageSquareIcon,
    StarIcon,
    AlertTriangleIcon
  },
  data() {
    return {
      testimonials: [...mockTestimonials],
      showAddForm: false,
      editingTestimonial: null,
      showDeleteConfirm: false,
      testimonialToDelete: null,
      testimonialForm: {
        name: '',
        image: '',
        rating: 5,
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      }
    }
  },
  methods: {
    editTestimonial(testimonial) {
      this.editingTestimonial = testimonial
      this.testimonialForm = { ...testimonial }
    },
    
    confirmDelete(id) {
      this.testimonialToDelete = id
      this.showDeleteConfirm = true
    },
    
    deleteTestimonial() {
      this.testimonials = this.testimonials.filter(t => t.id !== this.testimonialToDelete)
      this.showDeleteConfirm = false
      this.testimonialToDelete = null
      alert('Testimonial deleted successfully!')
    },
    
    saveTestimonial() {
      if (this.editingTestimonial) {
        const index = this.testimonials.findIndex(t => t.id === this.editingTestimonial.id)
        if (index !== -1) {
          this.testimonials[index] = {
            ...this.editingTestimonial,
            ...this.testimonialForm
          }
        }
      } else {
        const newTestimonial = {
          id: Date.now().toString(),
          ...this.testimonialForm
        }
        this.testimonials.push(newTestimonial)
      }
      
      this.closeForm()
      alert(this.editingTestimonial ? 'Testimonial updated successfully!' : 'Testimonial added successfully!')
    },
    
    closeForm() {
      this.showAddForm = false
      this.editingTestimonial = null
      this.testimonialForm = {
        name: '',
        image: '',
        rating: 5,
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      }
    }
  }
}
</script>