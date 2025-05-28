import { createRouter, createWebHistory } from 'vue-router'
import Cookies from 'js-cookie'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../auth/login.vue'),
    meta: { title: 'Login', public: true }
  },
  {
    path: '/',
    component: () => import('../layouts/AuthenticatedLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/dashboard'
      },
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: async () => await import('../pages/Dashboard.vue'),
        meta: { title: 'Dashboard'}
      },
      {
        path: '/quotes',
        name: 'Quotes',
        component: async () => await import('../pages/Quotes.vue'),
        meta: { title: 'Quotes'}
      },
      {
        path: '/jobs',
        name: 'Jobs',
        component: async () => await import('../pages/Jobs.vue'),
        meta: { title: 'Jobs'}
      },
      {
        path: '/jobs/:id',
        name: 'JobDetail',
        component: () => import('../pages/JobDetail.vue'),
        meta: { title: 'Job Detail'}
      },
      {
        path: '/calendar',
        name: 'Calendar',
        component: async () => await import('../pages/Calendar.vue'),
        meta: { title: 'Calendar'}
      },
      {
        path: '/services',
        name: 'Services',
        component: async () => await import('../pages/Services.vue'),
        meta: { title: 'Services'}
      },
      {
        path: '/gallery',
        name: 'Gallery',
        component: async () => await import('../pages/Gallery.vue'),
        meta: { title: 'Gallery'}
      },
      {
        path: '/gallery/:id',
        name: 'GalleryDetail',
        component: async () => await import('../pages/GalleryDetail.vue'),
        meta: { title: 'Gallery Item'}
      },
      {
        path: '/testimonials',
        name: 'Testimonials',
        component: async () => await import('../pages/Testimonials.vue'),
        meta: { title: 'Testimonials'}
      },
      {
        path: '/testimonials/:id',
        name: 'TestimonialDetail',
        component: async () => await import('../pages/TestimonialDetail.vue'),
        meta: { title: 'Testimonial Detail'}
      },
      {
        path: '/equipments',
        name: 'Equipments',
        component: async () => await import('../pages/Equipments.vue'),
        meta: { title: 'Equipments'}
      },
      {
        path: '/members',
        name: 'Members',
        component: async () => await import('../pages/Members.vue'),
        meta: { title: 'Members'}
      },
      {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: async () => await import('../pages/NotFound.vue'),
        meta: { title: 'Page Not Found'}
      }
    ]
  },
  
]


const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = Cookies.get('auth_token')
  
  if (to.meta.requiresAuth && !token) {
    next({ name: 'Login' })
  } else if (to.meta.requiresAuth && token) {
    next()
  } else {
    next()
  }
})

export default router