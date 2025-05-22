import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './assets/css/index.css'

// Import pages
import Login from './pages/Login.vue'
import Dashboard from './pages/Dashboard.vue'
import Services from './pages/Services.vue'
import Gallery from './pages/Gallery.vue'
import Testimonials from './pages/Testimonials.vue'
import Quotes from './pages/Quotes.vue'
import Calendar from './pages/Calendar.vue'
import Jobs from './pages/Jobs.vue'
import NotFound from './pages/NotFound.vue'

// Create router
const routes = [
  { 
    path: '/login', 
    component: Login,
    meta: { requiresAuth: false }
  },
  { 
    path: '/', 
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  { 
    path: '/services', 
    component: Services,
    meta: { requiresAuth: true }
  },
  { 
    path: '/gallery', 
    component: Gallery,
    meta: { requiresAuth: true }
  },
  {
    path: '/testimonials',
    component: Testimonials,
    meta: { requiresAuth: true }
  },
  {
    path: '/quotes',
    component: Quotes,
    meta: { requiresAuth: true }
  },
  {
    path: '/calendar',
    component: Calendar,
    meta: { requiresAuth: true }
  },
  {
    path: '/jobs',
    component: Jobs,
    meta: { requiresAuth: true }
  },
  { 
    path: '/:pathMatch(.*)*', 
    component: NotFound,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

// Create and mount app
const app = createApp(App)
app.use(router)
app.mount('#app')