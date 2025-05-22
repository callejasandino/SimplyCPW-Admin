<template>
  <div class="card">
    <div class="flex justify-between items-start mb-6">
      <div>
        <h3 class="text-lg font-semibold text-charcoal">{{ title }}</h3>
        <p class="text-sm text-gray-500">{{ subtitle }}</p>
      </div>
      <div class="flex space-x-2">
        <button v-for="period in periods" 
                :key="period"
                @click="activePeriod = period"
                class="px-3 py-1 text-xs rounded-md transition-colors duration-200"
                :class="activePeriod === period ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'">
          {{ period }}
        </button>
      </div>
    </div>
    <div class="h-72">
      <component :is="chartComponent" 
                :chart-data="chartData" 
                :chart-options="chartOptions" />
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'

export default {
  props: {
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      default: ''
    },
    chartType: {
      type: String,
      default: 'line', // line, bar, pie, doughnut
      validator: (value) => ['line', 'bar', 'pie', 'doughnut'].includes(value)
    },
    chartData: {
      type: Object,
      required: true
    },
    chartOptions: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      periods: ['Week', 'Month', 'Year'],
      activePeriod: 'Month'
    }
  },
  computed: {
    chartComponent() {
      const components = {
        line: defineAsyncComponent(() => import('./charts/LineChart.vue')),
        bar: defineAsyncComponent(() => import('./charts/BarChart.vue')),
        pie: defineAsyncComponent(() => import('./charts/PieChart.vue')),
        doughnut: defineAsyncComponent(() => import('./charts/DoughnutChart.vue'))
      }
      return components[this.chartType]
    }
  }
}
</script>