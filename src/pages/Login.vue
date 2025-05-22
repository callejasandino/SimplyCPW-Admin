<template>
  <div class="min-h-screen bg-light-gray flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <div class="flex items-center justify-center mb-4">
          <DropletIcon class="h-12 w-12 text-primary" />
        </div>
        <h2 class="text-2xl font-bold text-charcoal mb-2">Welcome Back</h2>
        <p class="text-gray-500">Sign in to your admin account</p>
      </div>
      
      <div class="bg-white rounded-lg shadow-card p-6">
        <form @submit.prevent="handleLogin">
          <div class="mb-4">
            <label class="form-label" for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              v-model="email" 
              class="form-input"
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div class="mb-6">
            <label class="form-label" for="password">Password</label>
            <div class="relative">
              <input 
                :type="showPassword ? 'text' : 'password'" 
                id="password" 
                v-model="password" 
                class="form-input pr-10"
                required
                placeholder="Enter your password"
              />
              <button 
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <EyeIcon v-if="!showPassword" class="h-5 w-5" />
                <EyeOffIcon v-else class="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div v-if="error" class="mb-4 p-3 bg-red-100 text-red-500 rounded-md text-sm">
            {{ error }}
          </div>
          
          <button 
            type="submit" 
            class="btn btn-primary w-full"
            :disabled="isLoading"
          >
            <LoaderIcon v-if="isLoading" class="animate-spin h-5 w-5 mr-2" />
            {{ isLoading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { DropletIcon, EyeIcon, EyeOffIcon, LoaderIcon } from 'lucide-vue-next'

export default {
  components: {
    DropletIcon,
    EyeIcon,
    EyeOffIcon,
    LoaderIcon
  },
  data() {
    return {
      email: '',
      password: '',
      showPassword: false,
      isLoading: false,
      error: ''
    }
  },
  methods: {
    async handleLogin() {
      this.isLoading = true
      this.error = ''
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (this.email === 'test@mail.com' && this.password === 'qweqwe') {
        localStorage.setItem('isAuthenticated', 'true')
        this.$router.push('/')
      } else {
        this.error = 'Invalid email or password'
      }
      
      this.isLoading = false
    }
  },
  created() {
    // Redirect to dashboard if already authenticated
    if (localStorage.getItem('isAuthenticated') === 'true') {
      this.$router.push('/')
    }
  }
}
</script>