<template>
  <div class="card hover:shadow-lg transition-shadow duration-200">
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center">
        <img 
          :src="testimonial.image" 
          :alt="testimonial.name"
          class="w-12 h-12 rounded-full object-cover"
        />
        <div class="ml-3">
          <h3 class="font-medium text-charcoal">{{ testimonial.name }}</h3>
          <p class="text-sm text-gray-500">{{ formatDate(testimonial.date) }}</p>
        </div>
      </div>
      <div class="flex">
        <StarIcon 
          v-for="i in 5" 
          :key="i"
          :class="[
            'h-5 w-5',
            i <= testimonial.rating ? 'text-orange fill-current' : 'text-gray-300'
          ]"
        />
      </div>
    </div>
    
    <h4 class="text-lg font-medium text-charcoal mb-2">{{ testimonial.title }}</h4>
    <p class="text-gray-600 mb-4">{{ testimonial.description }}</p>
    
    <div class="flex justify-end space-x-2">
      <button @click="$emit('edit', testimonial)" class="btn btn-secondary text-sm px-3 py-1.5">
        <EditIcon class="h-4 w-4 mr-1" />
        Edit
      </button>
      <button @click="$emit('delete', testimonial.id)" class="btn text-sm px-3 py-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200">
        <Trash2Icon class="h-4 w-4 mr-1" />
        Delete
      </button>
    </div>
  </div>
</template>

<script>
import { StarIcon, EditIcon, Trash2Icon } from 'lucide-vue-next'

export default {
  components: {
    StarIcon,
    EditIcon,
    Trash2Icon
  },
  props: {
    testimonial: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  }
}
</script>