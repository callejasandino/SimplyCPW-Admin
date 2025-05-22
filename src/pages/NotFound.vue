<template>
  <div class="min-h-[80vh] flex flex-col items-center justify-center p-6">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-primary">404</h1>
      <h2 class="text-2xl font-semibold mt-4 mb-2">Page Not Found</h2>
      <p class="text-gray-500 max-w-md mx-auto mb-8">
        Sorry, we couldn't find the page you're looking for. Perhaps you've mistyped the URL or the page has been moved.
      </p>
      <router-link to="/" class="btn btn-primary inline-flex">
        <HomeIcon class="h-5 w-5 mr-2" />
        Back to Dashboard
      </router-link>
    </div>
  </div>
</template>

<script>
import { HomeIcon } from 'lucide-vue-next'

export default {
  components: {
    HomeIcon
  }
}
</script>