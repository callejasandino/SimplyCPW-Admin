<template>
  <div class="card hover:shadow-lg transition-shadow duration-200 overflow-hidden">
    <div class="relative h-40 -mx-6 -mt-6 mb-4">
      <img :src="service.image" :alt="service.name" class="w-full h-full object-cover">
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      <div class="absolute bottom-0 left-0 p-4">
        <h3 class="text-white text-lg font-semibold">{{ service.name }}</h3>
        <div class="flex items-center">
          <span class="text-white font-bold">${{ service.price }}</span>
        </div>
      </div>
    </div>
    <p class="text-sm text-gray-600 mb-4 line-clamp-3">{{ service.description }}</p>
    <div class="flex justify-between items-center mt-4">
      <button @click="$emit('edit', service)" class="btn btn-secondary text-sm px-3 py-1.5">
        <EditIcon class="h-4 w-4 mr-1" />
        Edit
      </button>
      <button @click="$emit('delete', service.id)" class="btn text-sm px-3 py-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200">
        <Trash2Icon class="h-4 w-4 mr-1" />
        Delete
      </button>
    </div>
  </div>
</template>

<script>
import { EditIcon, Trash2Icon } from 'lucide-vue-next'

export default {
  components: {
    EditIcon,
    Trash2Icon
  },
  props: {
    service: {
      type: Object,
      required: true
    }
  },
  emits: ['edit', 'delete']
}
</script>