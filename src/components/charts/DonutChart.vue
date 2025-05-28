<script setup>
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps({
  chartData: {
    type: Object,
    required: true
  },
  chartOptions: {
    type: Object,
    default: () => ({})
  }
})

const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
    }
  },
  cutout: '70%'
}

const options = computed(() => {
  return {
    ...defaultOptions,
    ...props.chartOptions
  }
})
</script>

<template>
  <div class="h-full">
    <Doughnut :data="chartData" :options="options" />
  </div>
</template>