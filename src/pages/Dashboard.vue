<template>
  <div class="space-y-6">
    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard 
        v-for="(stat, index) in dashboardData.stats" 
        :key="index"
        :title="stat.title"
        :value="stat.value"
        :subtitle="stat.subtitle"
        :change="stat.change"
        :prefix="stat.prefix"
        :icon="getStatIcon(index)"
        :color="getStatColor(index)"
      />
    </div>
    
    <!-- Revenue & Jobs Chart -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <ChartCard
          title="Revenue & Jobs Completed"
          subtitle="Track your business performance"
          chart-type="line"
          :chart-data="revenueJobsChartData"
        />
      </div>
      <div>
        <ChartCard
          title="Service Distribution"
          subtitle="Jobs by category"
          chart-type="doughnut"
          :chart-data="serviceDistributionChartData"
        />
      </div>
    </div>
    
    <!-- Bottom Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartCard
        title="Lead Sources"
        subtitle="Where new clients come from"
        chart-type="pie"
        :chart-data="leadSourcesChartData"
      />
      
      <div class="card">
        <h3 class="text-lg font-semibold mb-4">Recent Jobs</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(job, index) in recentJobs" :key="index">
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ job.date }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ job.service }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ job.client }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">${{ job.amount }}</td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <span class="px-2 py-1 text-xs rounded-full" 
                         :class="getStatusClass(job.status)">
                    {{ job.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="flex justify-center mt-4">
          <button class="btn btn-secondary text-sm">View All Jobs</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { 
  DollarSignIcon, 
  BarChart2Icon, 
  UsersIcon, 
  TrendingUpIcon 
} from 'lucide-vue-next'
import StatCard from '../components/StatCard.vue'
import ChartCard from '../components/ChartCard.vue'
import { dashboardData } from '../data/mock-data.js'

export default {
  components: {
    StatCard,
    ChartCard
  },
  data() {
    return {
      dashboardData,
      recentJobs: [
        { date: '2024-07-10', service: 'Residential House Washing', client: 'John Smith', amount: 250, status: 'Completed' },
        { date: '2024-07-09', service: 'Driveway Cleaning', client: 'Sarah Johnson', amount: 150, status: 'Completed' },
        { date: '2024-07-08', service: 'Commercial Building', client: 'Acme Corp', amount: 500, status: 'Completed' },
        { date: '2024-07-07', service: 'Deck Restoration', client: 'Robert Davis', amount: 300, status: 'Completed' },
        { date: '2024-07-11', service: 'Roof Cleaning', client: 'Emma Wilson', amount: 400, status: 'Scheduled' }
      ]
    }
  },
  computed: {
    revenueJobsChartData() {
      return {
        labels: dashboardData.monthlyData.map(item => item.month),
        datasets: [
          {
            label: 'Revenue ($)',
            data: dashboardData.monthlyData.map(item => item.revenue),
            borderColor: '#48b0f7',
            backgroundColor: 'rgba(72, 176, 247, 0.2)',
            fill: true,
            tension: 0.4
          },
          {
            label: 'Jobs Completed',
            data: dashboardData.monthlyData.map(item => item.jobs),
            borderColor: '#4caf50',
            backgroundColor: 'transparent',
            borderDash: [5, 5],
            tension: 0.4
          }
        ]
      }
    },
    serviceDistributionChartData() {
      return {
        labels: dashboardData.serviceDistribution.map(item => item.name),
        datasets: [
          {
            data: dashboardData.serviceDistribution.map(item => item.value),
            backgroundColor: [
              '#003f8a', // primary
              '#48b0f7', // secondary
              '#aaff00', // lime
              '#f77f00', // orange
              '#4caf50', // green
              '#2c2c2c'  // charcoal
            ],
            borderWidth: 0
          }
        ]
      }
    },
    leadSourcesChartData() {
      return {
        labels: dashboardData.leadSources.map(item => item.name),
        datasets: [
          {
            data: dashboardData.leadSources.map(item => item.value),
            backgroundColor: [
              '#48b0f7', // secondary
              '#003f8a', // primary
              '#f77f00', // orange
              '#4caf50', // green
              '#2c2c2c'  // charcoal
            ],
            borderWidth: 0
          }
        ]
      }
    }
  },
  methods: {
    getStatIcon(index) {
      const icons = [DollarSignIcon, BarChart2Icon, UsersIcon, TrendingUpIcon]
      return icons[index % icons.length]
    },
    getStatColor(index) {
      const colors = ['primary', 'secondary', 'green', 'orange']
      return colors[index % colors.length]
    },
    getStatusClass(status) {
      switch (status) {
        case 'Completed':
          return 'bg-green-100 text-green'
        case 'Scheduled':
          return 'bg-blue-100 text-primary'
        case 'Pending':
          return 'bg-yellow-100 text-yellow-600'
        case 'Canceled':
          return 'bg-red-100 text-red-500'
        default:
          return 'bg-gray-100 text-gray-500'
      }
    }
  }
}
</script>