<template>
  <aside :class="sidebarClasses">
    <div class="h-full flex flex-col">
      <!-- Logo -->
      <div class="flex items-center justify-between p-4 border-b border-neutral-light">
        <div class="flex items-center">
          <span class="text-primary text-xl font-bold">SimplyCPW Admin</span>
        </div>
        <button 
          @click="emit('close')" 
          class="md:hidden p-1 rounded-full text-neutral hover:bg-neutral-light"
        >
          <XMarkIcon class="w-6 h-6" />
        </button>
      </div>
      
      <!-- Navigation -->
      <nav class="flex-1 px-2 py-4 overflow-y-auto">
        <ul class="space-y-1">
          <li v-for="item in navigationItems" :key="item.name">
            <router-link
              :to="item.path"
              :class="[
                'flex items-center px-4 py-3 text-sm rounded-lg transition-colors',
                isActive(item.path)
                  ? 'bg-primary text-white font-medium'
                  : 'text-neutral-dark hover:bg-neutral-light'
              ]"
            >
              <component :is="item.icon" class="w-5 h-5 mr-3" />
              {{ item.name }}
            </router-link>
          </li>
        </ul>
      </nav>
      
      <!-- Footer -->
      <div class="p-4 border-t border-neutral-light">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
            A
          </div>
          <div>
            <p class="text-neutral-dark font-medium text-sm">Admin User</p>
            <p class="text-neutral text-xs">admin@cleaningservice.com</p>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script>
import { 
  HomeIcon, 
  DocumentTextIcon, 
  BriefcaseIcon, 
  CalendarIcon, 
  BuildingStorefrontIcon, 
  PhotoIcon, 
  ChatBubbleBottomCenterTextIcon,
  WrenchScrewdriverIcon,
  UserGroupIcon
} from '@heroicons/vue/24/outline'

export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  
  emits: ['close'],
  
  data() {
    return {
      navigationItems: [
        { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
        { name: 'Quotes', path: '/quotes', icon: DocumentTextIcon },
        { name: 'Jobs', path: '/jobs', icon: BriefcaseIcon },
        { name: 'Calendar', path: '/calendar', icon: CalendarIcon },
        { name: 'Services', path: '/services', icon: BuildingStorefrontIcon },
        { name: 'Gallery', path: '/gallery', icon: PhotoIcon },
        { name: 'Testimonials', path: '/testimonials', icon: ChatBubbleBottomCenterTextIcon },
        { name: 'Equipments', path: '/equipments', icon: WrenchScrewdriverIcon },
        { name: 'Members', path: '/members', icon: UserGroupIcon }
      ]
    }
  },
  
  computed: {
    sidebarClasses() {
      return [
        'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0',
        this.isOpen ? 'translate-x-0' : '-translate-x-full'
      ]
    }
  },
  
  watch: {
    '$route.path': function() {
      if (this.isOpen) {
        this.$emit('close')
      }
    }
  },
  
  methods: {
    isActive(path) {
      return this.$route.path === path || this.$route.path.startsWith(`${path}/`)
    }
  }
}
</script>