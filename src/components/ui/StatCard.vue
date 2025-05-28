<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  change: {
    type: Number,
    default: 0
  },
  prefix: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div class="bg-white rounded-lg shadow-card p-6 transform transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
    <div class="flex items-start justify-between">
      <div>
        <h3 class="text-neutral-dark font-medium text-sm mb-1">{{ title }}</h3>
        <div class="flex items-baseline">
          <span class="text-2xl font-bold text-neutral-dark">{{ prefix }}{{ value }}</span>
          <span 
            v-if="change !== 0" 
            :class="[
              'ml-2 text-xs font-semibold px-2 py-0.5 rounded',
              change > 0 ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'
            ]"
          >
            {{ change > 0 ? '+' : '' }}{{ change }}%
          </span>
        </div>
        <p class="text-neutral text-xs mt-1">{{ subtitle }}</p>
      </div>
      <div v-if="icon" class="p-3 rounded-full bg-primary-light">
        <component :is="icon" class="w-5 h-5 text-primary" />
      </div>
    </div>
  </div>
</template>