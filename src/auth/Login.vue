<template>
  <div class="min-h-screen flex items-center justify-center bg-neutral-light p-4">
    <div class="w-full max-w-md">
      <!-- Logo/Brand -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-primary">SimplyCPW</h1>
        <p class="text-neutral">Admin Portal</p>
      </div>
      
      <!-- Login Card -->
      <div class="bg-white rounded-lg shadow-lg p-8">
        <h2 class="text-2xl font-semibold text-neutral-dark mb-6">Sign In</h2>
        
        <form @submit.prevent="handleLogin">
          <!-- Email Input -->
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-neutral mb-1">Email</label>
            <input 
              type="email" 
              id="email" 
              v-model="email" 
              class="w-full px-4 py-2 rounded-md border border-neutral-light focus:border-primary" 
              placeholder="your@email.com" 
              required
            />
          </div>
          
          <!-- Password Input -->
          <div class="mb-6">
            <label for="password" class="block text-sm font-medium text-neutral mb-1">Password</label>
            <input 
              type="password" 
              id="password" 
              v-model="password" 
              class="w-full px-4 py-2 rounded-md border border-neutral-light focus:border-primary" 
              placeholder="••••••••" 
              required
            />
            <div class="flex justify-end mt-1">
              <a href="#" class="text-sm text-primary hover:text-primary-dark">Forgot password?</a>
            </div>
          </div>
          
          <!-- Remember Me -->
          <div class="flex items-center mb-6">
            <input 
              type="checkbox" 
              id="remember" 
              v-model="rememberMe" 
              class="h-4 w-4 text-primary border-neutral-light rounded focus:ring-primary-dark"
            />
            <label for="remember" class="ml-2 block text-sm text-neutral">Remember me</label>
          </div>
          
          <!-- Error Message -->
          <div v-if="authStore.error" class="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {{ authStore.error }}
          </div>
          
          <!-- Submit Button -->
          <button 
            type="submit" 
            class="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-md transition-colors"
            :disabled="isLoading"
          >
            <span v-if="isLoading">Signing in...</span>
            <span v-else>Sign In</span>
          </button>
        </form>
      </div>
      
      <!-- Additional Links -->
      <div class="mt-4 text-center text-sm text-neutral">
        <p>Need help? <a href="#" class="text-primary hover:text-primary-dark">Contact Support</a></p>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../store/auth';
import Cookies from 'js-cookie';

export default {
  name: 'LoginPage',
  data() {
    return {
      email: '',
      password: '',
      rememberMe: false,
      isLoading: false
    };
  },
  computed: {
    authStore() {
      return useAuthStore();
    }
  },
  methods: {
    async handleLogin() {
      this.isLoading = true;
      
      try {
        await this.authStore.login({
          email: this.email,
          password: this.password
        });
        
        if (this.rememberMe) {
          // If remember me is checked, update cookie expiration to 30 days
          Cookies.set('auth_token', this.authStore.accessToken, { expires: 30 });
        }
        
        if (this.authStore.accessToken) {
          // Redirect to dashboard on successful login
          this.$router.push('/');
        }
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>
<style scoped>
/* Apply custom styles from style.css through CSS variables */
.text-primary {
  color: var(--color-primary);
}

.text-primary-dark {
  color: var(--color-primary-dark);
}

.bg-primary {
  background-color: var(--color-primary);
}

.bg-primary-dark {
  background-color: var(--color-primary-dark);
}

.border-primary {
  border-color: var(--color-primary);
}

.text-neutral {
  color: var(--color-neutral);
}

.text-neutral-dark {
  color: var(--color-neutral-dark);
}

.bg-neutral-light {
  background-color: var(--color-neutral-light);
}

.border-neutral-light {
  border-color: var(--color-neutral-light);
}
</style>

