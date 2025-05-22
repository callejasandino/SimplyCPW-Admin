<template>
  <div class="card hover:shadow-lg transition-shadow duration-200 overflow-hidden group">
    <div class="relative h-48 -mx-6 -mt-6 mb-4 overflow-hidden">
      <img :src="item.image" :alt="item.description || item.category" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      <div class="absolute top-2 right-2">
        <span class="px-2 py-1 bg-primary text-white text-xs rounded-md">{{ item.category }}</span>
      </div>
      <div v-if="item.beforeImage && item.afterImage" class="absolute bottom-2 right-2">
        <button @click="showBeforeAfter = true" class="px-2 py-1 bg-orange text-white text-xs rounded-md flex items-center">
          <BeforeAfterIcon class="h-3 w-3 mr-1" />
          Before/After
        </button>
      </div>
    </div>
    <p v-if="item.description" class="text-sm text-gray-600 mb-4">{{ item.description }}</p>
    <div class="flex justify-between items-center mt-4">
      <button @click="$emit('edit', item)" class="btn btn-secondary text-sm px-3 py-1.5">
        <EditIcon class="h-4 w-4 mr-1" />
        Edit
      </button>
      <button @click="$emit('delete', item.id)" class="btn text-sm px-3 py-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200">
        <Trash2Icon class="h-4 w-4 mr-1" />
        Delete
      </button>
    </div>
    
    <!-- Before/After Modal -->
    <div v-if="showBeforeAfter" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div class="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto">
        <div class="flex justify-between items-center p-4 border-b">
          <h3 class="text-lg font-semibold">Before & After</h3>
          <button @click="showBeforeAfter = false" class="p-1">
            <XIcon class="h-6 w-6" />
          </button>
        </div>
        <div class="p-4 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm font-medium mb-2">Before</p>
              <img :src="item.beforeImage" alt="Before" class="w-full h-60 object-cover rounded-lg">
            </div>
            <div>
              <p class="text-sm font-medium mb-2">After</p>
              <img :src="item.afterImage" alt="After" class="w-full h-60 object-cover rounded-lg">
            </div>
          </div>
          <p v-if="item.description" class="text-sm text-gray-600">{{ item.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { EditIcon, Trash2Icon, ScanIcon as BeforeAfterIcon, XIcon } from 'lucide-vue-next'

export default {
  components: {
    EditIcon,
    Trash2Icon,
    BeforeAfterIcon,
    XIcon
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showBeforeAfter: false
    }
  },
  emits: ['edit', 'delete']
}
</script>