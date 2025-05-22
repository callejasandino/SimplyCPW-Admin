<template>
  <div class="card hover:shadow-lg transition-shadow duration-200">
    <div class="flex justify-between items-start">
      <div>
        <h3 class="text-gray-500 text-sm font-medium mb-1">{{ title }}</h3>
        <div class="flex items-end">
          <span class="text-2xl font-semibold text-charcoal">{{ formattedValue }}</span>
          <span v-if="change !== undefined" 
                class="ml-2 text-sm font-medium"
                :class="change >= 0 ? 'text-green' : 'text-red-500'">
            {{ change >= 0 ? '+' : '' }}{{ change }}%
          </span>
        </div>
      </div>
      <div :class="`p-3 rounded-lg bg-${color}-light`">
        <component :is="icon" class="h-6 w-6" :class="`text-${color}`" />
      </div>
    </div>
    <div class="mt-4 flex justify-between items-center">
      <p class="text-sm text-gray-500">{{ subtitle }}</p>
      <component :is="trendIcon" 
                v-if="change !== undefined"
                class="h-4 w-4" 
                :class="change >= 0 ? 'text-green' : 'text-red-500'" />
    </div>
  </div>
</template>

<script>
import { TrendingUpIcon, TrendingDownIcon } from 'lucide-vue-next'

export default {
  components: {
    TrendingUpIcon,
    TrendingDownIcon
  },
  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      type: [Number, String],
      required: true
    },
    subtitle: {
      type: String,
      default: 'Last 30 days'
    },
    change: {
      type: Number,
      default: undefined
    },
    icon: {
      type: Object,
      required: true
    },
    color: {
      type: String,
      default: 'primary'
    },
    prefix: {
      type: String,
      default: ''
    }
  },
  computed: {
    formattedValue() {
      return `${this.prefix}${this.value}`
    },
    trendIcon() {
      return this.change >= 0 ? TrendingUpIcon : TrendingDownIcon
    }
  }
}
</script>