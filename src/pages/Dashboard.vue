<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  CurrencyDollarIcon, 
  BriefcaseIcon, 
  UserGroupIcon, 
  StarIcon 
} from '@heroicons/vue/24/outline'
import StatCard from '../components/ui/StatCard.vue'
import LineChart from '../components/charts/LineChart.vue'
import DonutChart from '../components/charts/DonutChart.vue'
import { dashboardData, mockJobs, mockQuotes } from '../data/mockData'

const router = useRouter()

const recentJobs = ref(mockJobs.slice(0, 5))
const recentQuotes = ref(mockQuotes.slice(0, 5))

// Charts data
const revenueChartData = {
  labels: dashboardData.monthlyData.map(item => item.month),
  datasets: [
    {
      label: 'Revenue',
      data: dashboardData.monthlyData.map(item => item.revenue),
      borderColor: '#4A90E2',
      backgroundColor: 'rgba(74, 144, 226, 0.1)',
      tension: 0.4,
      fill: true,
    },
    {
      label: 'Jobs',
      data: dashboardData.monthlyData.map(item => item.jobs),
      borderColor: '#A7E9EB',
      backgroundColor: 'rgba(167, 233, 235, 0.1)',
      tension: 0.4,
      fill: true,
    }
  ]
}

const serviceDistributionData = {
  labels: dashboardData.serviceDistribution.map(item => item.name),
  datasets: [
    {
      data: dashboardData.serviceDistribution.map(item => item.value),
      backgroundColor: [
        '#4A90E2', 
        '#A7E9EB', 
        '#4CAF50', 
        '#F77F00', 
        '#DC2626'
      ],
      borderWidth: 0,
    }
  ]
}

const leadSourcesData = {
  labels: dashboardData.leadSources.map(item => item.name),
  datasets: [
    {
      data: dashboardData.leadSources.map(item => item.value),
      backgroundColor: [
        '#4A90E2', 
        '#A7E9EB', 
        '#F77F00', 
        '#4CAF50'
      ],
      borderWidth: 0,
    }
  ]
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const navigateToJob = (jobId) => {
  router.push(`/jobs/${jobId}`)
}

const navigateToQuote = (quoteId) => {
  router.push(`/quotes/${quoteId}`)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        v-for="(stat, index) in dashboardData.stats" 
        :key="index" 
        :title="stat.title" 
        :value="stat.value" 
        :subtitle="stat.subtitle" 
        :change="stat.change" 
        :prefix="stat.prefix || ''"
        :icon="index === 0 ? CurrencyDollarIcon : index === 1 ? BriefcaseIcon : index === 2 ? UserGroupIcon : StarIcon"
      />
    </div>
    
    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white rounded-lg shadow-card p-4">
        <h2 class="text-lg font-semibold text-neutral-dark mb-4">Revenue & Jobs Overview</h2>
        <div class="h-80">
          <LineChart :chart-data="revenueChartData" />
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white rounded-lg shadow-card p-4">
          <h2 class="text-lg font-semibold text-neutral-dark mb-4">Service Distribution</h2>
          <div class="h-64">
            <DonutChart :chart-data="serviceDistributionData" />
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-card p-4">
          <h2 class="text-lg font-semibold text-neutral-dark mb-4">Lead Sources</h2>
          <div class="h-64">
            <DonutChart :chart-data="leadSourcesData" />
          </div>
        </div>
      </div>
    </div>
    
    <!-- Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Jobs -->
      <div class="bg-white rounded-lg shadow-card overflow-hidden">
        <div class="p-4 border-b border-neutral-light flex items-center justify-between">
          <h2 class="text-lg font-semibold text-neutral-dark">Recent Jobs</h2>
          <router-link to="/jobs" class="text-sm text-primary hover:text-primary-dark">View all</router-link>
        </div>
        <div class="divide-y divide-neutral-light">
          <div 
            v-for="job in recentJobs" 
            :key="job.id" 
            class="p-4 hover:bg-neutral-light cursor-pointer transition-colors"
            @click="navigateToJob(job.id)"
          >
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium text-neutral-dark">{{ job.title }}</h3>
                <p class="text-sm text-neutral">{{ job.client.name }}</p>
                <div class="flex items-center mt-1">
                  <span class="text-xs text-neutral">{{ formatDate(job.date) }}</span>
                  <span class="mx-2 text-neutral">•</span>
                  <span class="text-xs text-neutral">${{ job.price }}</span>
                </div>
              </div>
              <span 
                :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  job.status === 'Completed' ? 'bg-primary-light text-primary-dark' :
                  job.status === 'Scheduled' ? 'bg-info bg-opacity-10 text-info' :
                  job.status === 'Confirmed' ? 'bg-success bg-opacity-10 text-success' :
                  job.status === 'In Progress' ? 'bg-warning bg-opacity-10 text-warning' :
                  job.status === 'Cancelled' ? 'bg-danger bg-opacity-10 text-danger' :
                  'bg-neutral-light text-neutral'
                ]"
              >
                {{ job.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Recent Quotes -->
      <div class="bg-white rounded-lg shadow-card overflow-hidden">
        <div class="p-4 border-b border-neutral-light flex items-center justify-between">
          <h2 class="text-lg font-semibold text-neutral-dark">Recent Quotes</h2>
          <router-link to="/quotes" class="text-sm text-primary hover:text-primary-dark">View all</router-link>
        </div>
        <div class="divide-y divide-neutral-light">
          <div 
            v-for="quote in recentQuotes" 
            :key="quote.id" 
            class="p-4 hover:bg-neutral-light cursor-pointer transition-colors"
            @click="navigateToQuote(quote.id)"
          >
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium text-neutral-dark">{{ quote.firstName }} {{ quote.lastName }}</h3>
                <p class="text-sm text-neutral truncate max-w-xs">{{ quote.address }}</p>
                <div class="flex items-center mt-1">
                  <span class="text-xs text-neutral">{{ formatDate(quote.createdAt) }}</span>
                  <span class="mx-2 text-neutral">•</span>
                  <span class="text-xs text-neutral">{{ quote.servicesNeeded.join(', ') }}</span>
                </div>
              </div>
              <span 
                :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  quote.status === 'Completed' ? 'bg-primary-light text-primary-dark' :
                  quote.status === 'Pending' ? 'bg-neutral-light text-neutral' :
                  'bg-neutral-light text-neutral'
                ]"
              >
                {{ quote.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>