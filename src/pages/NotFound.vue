<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
    <h1 class="text-6xl font-bold text-primary mb-4">404</h1>
    <h2 class="text-2xl font-semibold text-neutral-dark mb-2">Page Not Found</h2>
    <p class="text-neutral mb-8 max-w-md">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
    <button
      @click="goHome"
      class="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
    >
      Go to Dashboard
    </button>
  </div>
</template>