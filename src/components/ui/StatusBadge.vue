<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: 'md' // sm, md, lg
  }
})

const statusConfig = {
  'Pending': { color: 'text-neutral', bgColor: 'bg-neutral-light' },
  'Scheduled': { color: 'text-info', bgColor: 'bg-info bg-opacity-10' },
  'Confirmed': { color: 'text-success', bgColor: 'bg-success bg-opacity-10' },
  'In Progress': { color: 'text-warning', bgColor: 'bg-warning bg-opacity-10' },
  'Completed': { color: 'text-primary-dark', bgColor: 'bg-primary-light' },
  'Cancelled': { color: 'text-danger', bgColor: 'bg-danger bg-opacity-10' }
}

const statusClasses = computed(() => {
  const config = statusConfig[props.status] || { color: 'text-neutral', bgColor: 'bg-neutral-light' }
  
  const sizeClasses = {
    'sm': 'text-xs px-2 py-1',
    'md': 'text-sm px-3 py-1',
    'lg': 'text-base px-4 py-1.5'
  }
  
  return [
    config.color,
    config.bgColor,
    sizeClasses[props.size],
    'inline-flex rounded-full font-medium'
  ]
})
</script>

<template>
  <span :class="statusClasses">
    {{ status }}
  </span>
</template>