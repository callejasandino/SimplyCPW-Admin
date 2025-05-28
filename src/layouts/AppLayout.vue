<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Sidebar from './Sidebar.vue'
import TopNav from './TopNav.vue'

const route = useRoute()
const router = useRouter()
const isSidebarOpen = ref(false)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

// Close sidebar on mobile when route changes
watch(
  () => route.path,
  () => {
    if (window.innerWidth < 768) {
      isSidebarOpen.value = false
    }
  }
)
</script>

<template>
  <div class="flex h-screen bg-neutral-light">
    <!-- Sidebar -->
    <Sidebar :is-open="isSidebarOpen" @close="isSidebarOpen = false" />
    
    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <TopNav @toggle-sidebar="toggleSidebar" />
      
      <main class="flex-1 overflow-y-auto bg-neutral-light p-4 md:p-6">
        <slot></slot>
      </main>
    </div>
  </div>
</template>