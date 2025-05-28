<template>
  <div class="bg-white rounded-lg shadow-card overflow-hidden">
    <div v-if="searchable" class="p-4 border-b border-neutral-light">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search..."
        class="w-full px-4 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      />
    </div>
    
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-neutral-light">
        <thead class="bg-neutral-light bg-opacity-50">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              :class="[
                'px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider',
                column.className
              ]"
            >
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody v-if="filteredData.length > 0" class="bg-white divide-y divide-neutral-light">
          <tr 
            v-for="item in filteredData" 
            :key="item.id"
            @click="handleRowClick(item)"
            :class="{ 'cursor-pointer hover:bg-neutral-light hover:bg-opacity-30 transition-colors': rowClickable }"
          >
            <td 
              v-for="column in columns" 
              :key="column.key"
              :class="[
                'px-6 py-4 whitespace-nowrap text-sm text-neutral-dark',
                column.cellClassName
              ]"
            >
              <slot :name="column.key" :item="item" :value="renderCellContent(item, column)">
                {{ renderCellContent(item, column) }}
              </slot>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td :colspan="columns.length" class="px-6 py-4 text-center text-sm text-neutral">
              {{ emptyMessage }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Pagination -->
    <div v-if="paginated && pagination" class="px-6 py-3 border-t border-neutral-light flex items-center justify-between">
      <div class="text-sm text-neutral-dark">
        Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} entries
      </div>
      <div class="flex items-center space-x-2">
        <button 
          @click="changePage(pagination.current_page - 1)" 
          :disabled="!pagination.prev_page_url"
          class="px-3 py-1 rounded border border-neutral-light text-sm font-medium"
          :class="pagination.prev_page_url ? 'hover:bg-neutral-light cursor-pointer' : 'opacity-50 cursor-not-allowed'"
        >
          Previous
        </button>
        <div v-for="link in pagination.links.slice(1, -1)" :key="link.url" class="flex">
          <button 
            @click="link.url && changePage(Number(link.label))"
            :disabled="!link.url"
            class="px-3 py-1 rounded border text-sm font-medium"
            :class="link.active ? 'bg-primary text-white border-primary' : 'border-neutral-light hover:bg-neutral-light cursor-pointer'"
          >
            {{ link.label }}
          </button>
        </div>
        <button 
          @click="changePage(pagination.current_page + 1)" 
          :disabled="!pagination.next_page_url"
          class="px-3 py-1 rounded border border-neutral-light text-sm font-medium"
          :class="pagination.next_page_url ? 'hover:bg-neutral-light cursor-pointer' : 'opacity-50 cursor-not-allowed'"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  columns: {
    type: Array,
    required: true
  },
  rowClickable: {
    type: Boolean,
    default: false
  },
  searchable: {
    type: Boolean,
    default: false
  },
  emptyMessage: {
    type: String,
    default: 'No data available'
  },
  // Pagination props
  pagination: {
    type: Object,
    default: null
  },
  paginated: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['row-click', 'page-change'])

const searchQuery = ref('')

const filteredData = computed(() => {
  if (!props.searchable || !searchQuery.value) {
    return props.data
  }
  
  const query = searchQuery.value.toLowerCase()
  return props.data.filter(item => {
    return props.columns.some(column => {
      const value = column.accessor ? column.accessor(item) : item[column.key]
      return value && String(value).toLowerCase().includes(query)
    })
  })
})

function handleRowClick(item) {
  if (props.rowClickable) {
    emit('row-click', item)
  }
}

function renderCellContent(item, column) {
  if (!item) return ''
  
  if (column.accessor) {
    return column.accessor(item)
  }
  
  return item[column.key] || ''
}

function changePage(page) {
  emit('page-change', page)
}
</script>