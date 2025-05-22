<template>
  <!-- Show login page without layout -->
  <router-view v-if="$route.path === '/login'"></router-view>
  
  <!-- Show main layout with sidebar for authenticated routes -->
  <div v-else class="min-h-screen flex">
    <!-- Sidebar -->
    <Sidebar :is-open="sidebarOpen" @toggle="toggleSidebar" />
    
    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-h-screen overflow-hidden">
      <!-- Header -->
      <header class="bg-white shadow-sm z-10">
        <div class="flex items-center justify-between px-4 py-3">
          <div class="flex items-center">
            <button @click="toggleSidebar" class="p-2 rounded-md lg:hidden">
              <MenuIcon class="h-6 w-6 text-charcoal" />
            </button>
            <h1 class="text-xl font-semibold text-primary ml-4">{{ currentPageTitle }}</h1>
          </div>
          <div class="flex items-center space-x-4">
            <div class="relative">
              <button class="p-2 rounded-full hover:bg-light-gray">
                <BellIcon class="h-6 w-6 text-charcoal" />
              </button>
            </div>
            <div>
              <span class="font-medium">Admin User</span>
            </div>
          </div>
        </div>
      </header>
      
      <!-- Page Content -->
      <main class="flex-1 overflow-auto bg-light-gray p-6">
        <router-view></router-view>
      </main>
      
      <!-- Footer -->
      <footer class="bg-white px-6 py-4 border-t">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">
              &copy; {{ new Date().getFullYear() }} Pressure Washing Admin Panel
            </p>
          </div>
          <div class="flex items-center space-x-2">
            <InfoIcon class="h-4 w-4 text-gray-500" />
            <span class="text-sm text-gray-500">Version 1.0.0</span>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import { MenuIcon, BellIcon, InfoIcon } from 'lucide-vue-next'
import Sidebar from './components/Sidebar.vue'

export default {
  components: {
    Sidebar,
    MenuIcon,
    BellIcon,
    InfoIcon
  },
  data() {
    return {
      sidebarOpen: false
    }
  },
  computed: {
    currentPageTitle() {
      const path = this.$route.path
      if (path === '/') return 'Dashboard'
      if (path === '/services') return 'Services'
      if (path === '/gallery') return 'Gallery'
      if (path === '/testimonials') return 'Testimonials'
      if (path === '/quotes') return 'Quotes'
      return 'Not Found'
    }
  },
  methods: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    }
  },
  mounted() {
    // Check screen size on load
    this.sidebarOpen = window.innerWidth >= 1024
    
    // Update sidebar state on resize
    window.addEventListener('resize', () => {
      this.sidebarOpen = window.innerWidth >= 1024
    })
  }
}
</script>