<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { 
  Bars3Icon, 
  BellIcon, 
  MagnifyingGlassIcon 
} from '@heroicons/vue/24/outline'

const emit = defineEmits(['toggle-sidebar'])
const route = useRoute()

const currentDate = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})

const notifications = ref([
  { id: 1, message: 'New quote request from John Smith', time: '10 minutes ago' },
  { id: 2, message: 'Job #2345 has been marked as completed', time: '1 hour ago' },
  { id: 3, message: 'Team meeting scheduled for tomorrow', time: '3 hours ago' }
])

const showNotifications = ref(false)

// Close notifications when clicking outside
const handleClickOutside = (event) => {
  const dropdown = document.querySelector('#notifications-dropdown')
  const button = document.querySelector('#notifications-button')
  if (dropdown && !dropdown.contains(event.target) && !button.contains(event.target)) {
    showNotifications.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
}

const getPageTitle = () => {
  return route.meta.title || 'Dashboard'
}
</script>

<template>
  <header class="bg-white shadow-sm">
    <div class="px-4 py-3 flex items-center justify-between">
      <!-- Left side -->
      <div class="flex items-center">
        <button
          @click="emit('toggle-sidebar')"
          class="p-1 mr-3 rounded-full text-neutral hover:bg-neutral-light md:hidden"
        >
          <Bars3Icon class="w-6 h-6" />
        </button>
        <h1 class="text-xl font-semibold text-neutral-dark">{{ getPageTitle() }}</h1>
      </div>
      
      <!-- Right side -->
      <div class="flex items-center space-x-4">
        <div class="relative hidden md:block">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MagnifyingGlassIcon class="w-5 h-5 text-neutral" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            class="pl-10 pr-4 py-2 w-60 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        
        <!-- Notifications -->
        <div class="relative">
          <button
            id="notifications-button"
            @click="toggleNotifications"
            class="p-1 rounded-full text-neutral hover:bg-neutral-light relative"
          >
            <BellIcon class="w-6 h-6" />
            <span class="absolute top-0 right-0 block w-2 h-2 bg-danger rounded-full"></span>
          </button>
          
          <!-- Notifications dropdown -->
          <div
            v-if="showNotifications"
            id="notifications-dropdown"
            class="absolute right-0 mt-2 w-80 bg-white border border-neutral-light rounded-lg shadow-lg z-10"
          >
            <div class="p-3 border-b border-neutral-light">
              <h3 class="font-medium text-neutral-dark">Notifications</h3>
            </div>
            <div class="max-h-80 overflow-y-auto">
              <div
                v-for="notification in notifications"
                :key="notification.id"
                class="p-3 border-b border-neutral-light hover:bg-neutral-light cursor-pointer"
              >
                <p class="text-sm text-neutral-dark">{{ notification.message }}</p>
                <p class="text-xs text-neutral mt-1">{{ notification.time }}</p>
              </div>
            </div>
            <div class="p-3 text-center">
              <a href="#" class="text-sm text-primary hover:text-primary-dark">View all notifications</a>
            </div>
          </div>
        </div>
        
        <!-- Date -->
        <div class="hidden md:block text-right">
          <p class="text-sm text-neutral-dark">{{ currentDate }}</p>
        </div>
      </div>
    </div>
  </header>
</template>