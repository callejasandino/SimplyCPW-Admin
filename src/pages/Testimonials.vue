<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { mockTestimonials } from '../data/mockData'
import { format } from 'date-fns'

const router = useRouter()
const testimonials = ref([...mockTestimonials])

const formatDate = (dateString) => {
  return format(new Date(dateString), 'MMM dd, yyyy')
}

const navigateToTestimonial = (testimonialId) => {
  router.push(`/testimonials/${testimonialId}`)
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-neutral-dark">Testimonials</h1>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="testimonial in testimonials"
        :key="testimonial.id"
        class="bg-white rounded-lg shadow-card overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
        @click="navigateToTestimonial(testimonial.id)"
      >
        <div class="p-6">
          <div class="flex items-center mb-4">
            <img
              :src="testimonial.image"
              :alt="testimonial.name"
              class="w-12 h-12 rounded-full object-cover"
            />
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-neutral-dark">{{ testimonial.name }}</h3>
              <p class="text-neutral text-sm">{{ formatDate(testimonial.date) }}</p>
            </div>
          </div>
          
          <div class="flex items-center mb-2">
            <div class="flex">
              <svg
                v-for="i in 5"
                :key="i"
                :class="[
                  'w-5 h-5',
                  i <= testimonial.rating ? 'text-yellow-400' : 'text-neutral-light'
                ]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
          
          <h4 class="text-lg font-medium text-neutral-dark mb-2">{{ testimonial.title }}</h4>
          <p class="text-neutral line-clamp-3">{{ testimonial.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>