<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { mockTestimonials } from '../data/mockData'
import { format } from 'date-fns'

const route = useRoute()
const router = useRouter()
const testimonialId = route.params.id
const testimonials = ref([...mockTestimonials])
const isEditing = ref(false)

const testimonial = computed(() => {
  return testimonials.value.find(t => t.id === testimonialId) || null
})

const formData = ref({
  name: '',
  title: '',
  description: '',
  rating: 5
})

onMounted(() => {
  if (testimonial.value) {
    formData.value = { ...testimonial.value }
  } else {
    router.push('/testimonials')
  }
})

const formatDate = (dateString) => {
  return format(new Date(dateString), 'MMMM dd, yyyy')
}

const goBack = () => {
  router.push('/testimonials')
}

const toggleEdit = () => {
  isEditing.value = !isEditing.value
  if (!isEditing.value) {
    formData.value = { ...testimonial.value }
  }
}

const saveChanges = () => {
  const testimonialIndex = testimonials.value.findIndex(t => t.id === testimonialId)
  if (testimonialIndex !== -1) {
    testimonials.value[testimonialIndex] = { ...formData.value }
    isEditing.value = false
  }
}
</script>

<template>
  <div v-if="testimonial">
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div class="flex items-center">
        <button 
          @click="goBack" 
          class="mr-4 p-1 rounded-full text-neutral-dark hover:bg-neutral-light"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 class="text-2xl font-bold text-neutral-dark">Testimonial Details</h1>
      </div>
      
      <div class="flex items-center space-x-2">
        <button
          v-if="isEditing"
          @click="toggleEdit"
          class="inline-flex items-center px-4 py-2 border border-neutral-light rounded-lg shadow-sm text-sm font-medium text-neutral-dark bg-white hover:bg-neutral-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-light"
        >
          Cancel
        </button>
        
        <button
          v-if="isEditing"
          @click="saveChanges"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-success hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-success"
        >
          Save Changes
        </button>
        
        <button
          v-if="!isEditing"
          @click="toggleEdit"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Edit Testimonial
        </button>
      </div>
    </div>
    
    <div class="bg-white rounded-lg shadow-card overflow-hidden">
      <div class="p-6">
        <div class="flex items-center mb-6">
          <img
            :src="testimonial.image"
            :alt="testimonial.name"
            class="w-16 h-16 rounded-full object-cover"
          />
          <div class="ml-4">
            <div v-if="!isEditing">
              <h2 class="text-xl font-semibold text-neutral-dark">{{ testimonial.name }}</h2>
              <p class="text-neutral">{{ formatDate(testimonial.date) }}</p>
            </div>
            <div v-else>
              <input
                v-model="formData.name"
                type="text"
                class="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent mb-2"
                placeholder="Client Name"
              />
            </div>
          </div>
        </div>
        
        <div class="space-y-6">
          <div>
            <h3 class="text-sm font-medium text-neutral mb-2">Rating</h3>
            <div class="flex items-center">
              <div v-if="!isEditing" class="flex">
                <svg
                  v-for="i in 5"
                  :key="i"
                  :class="[
                    'w-6 h-6',
                    i <= testimonial.rating ? 'text-yellow-400' : 'text-neutral-light'
                  ]"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <select
                v-else
                v-model="formData.rating"
                class="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option v-for="i in 5" :key="i" :value="i">{{ i }} Stars</option>
              </select>
            </div>
          </div>
          
          <div>
            <h3 class="text-sm font-medium text-neutral mb-2">Title</h3>
            <div v-if="!isEditing" class="text-lg font-medium text-neutral-dark">{{ testimonial.title }}</div>
            <input
              v-else
              v-model="formData.title"
              type="text"
              class="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <div>
            <h3 class="text-sm font-medium text-neutral mb-2">Description</h3>
            <div v-if="!isEditing" class="text-neutral">{{ testimonial.description }}</div>
            <textarea
              v-else
              v-model="formData.description"
              rows="4"
              class="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <div v-else class="flex items-center justify-center h-64">
    <p class="text-neutral">Loading...</p>
  </div>
</template>