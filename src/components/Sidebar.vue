<template>
  <aside 
    class="bg-primary text-white w-64 shrink-0 transition-all duration-300 ease-in-out transform"
    :class="{ '-ml-64': !isOpen, 'ml-0': isOpen }"
  >
    <!-- Logo -->
    <div class="flex items-center justify-between h-16 px-6 bg-primary-dark">
      <div class="flex items-center">
        <DropletIcon class="h-8 w-8 text-secondary" />
        <span class="text-xl font-bold ml-3">PressureWash</span>
      </div>
      <button @click="$emit('toggle')" class="p-1 rounded-md lg:hidden">
        <XIcon class="h-6 w-6 text-white" />
      </button>
    </div>
    
    <!-- Navigation -->
    <nav class="py-6">
      <ul class="space-y-2">
        <li v-for="item in navItems" :key="item.path">
          <router-link 
            :to="item.path" 
            class="flex items-center px-6 py-3 text-sm font-medium transition-colors duration-200"
            :class="[
              $route.path === item.path 
                ? 'bg-primary-light text-white' 
                : 'text-gray-300 hover:bg-primary-light hover:text-white'
            ]"
          >
            <component :is="item.icon" class="h-5 w-5 mr-3" />
            <span>{{ item.title }}</span>
          </router-link>
        </li>
      </ul>
    </nav>
    
    <!-- Bottom section -->
    <div class="absolute bottom-0 w-full p-6 border-t border-primary-light">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <UserIcon class="h-5 w-5 text-secondary" />
          <span class="ml-2 text-sm font-medium">Admin</span>
        </div>
        <button @click="handleLogout" class="p-1 rounded-md hover:bg-primary-light">
          <LogOutIcon class="h-5 w-5 text-gray-300" />
        </button>
      </div>
    </div>
  </aside>
</template>

<script>
import { 
  LayoutDashboardIcon, 
  PackageIcon, 
  ImageIcon,
  MessageSquareIcon,
  ClipboardListIcon,
  CalendarIcon,
  BriefcaseIcon,
  DropletIcon,
  XIcon,
  UserIcon,
  LogOutIcon
} from 'lucide-vue-next'

export default {
  components: {
    LayoutDashboardIcon,
    PackageIcon,
    ImageIcon,
    MessageSquareIcon,
    ClipboardListIcon,
    CalendarIcon,
    BriefcaseIcon,
    DropletIcon,
    XIcon,
    UserIcon,
    LogOutIcon
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      navItems: [
        { 
          title: 'Dashboard', 
          path: '/', 
          icon: LayoutDashboardIcon 
        },
        { 
          title: 'Services', 
          path: '/services', 
          icon: PackageIcon 
        },
        { 
          title: 'Gallery', 
          path: '/gallery', 
          icon: ImageIcon 
        },
        {
          title: 'Testimonials',
          path: '/testimonials',
          icon: MessageSquareIcon
        },
        {
          title: 'Quotes',
          path: '/quotes',
          icon: ClipboardListIcon
        },
        {
          title: 'Calendar',
          path: '/calendar',
          icon: CalendarIcon
        },
        {
          title: 'Jobs',
          path: '/jobs',
          icon: BriefcaseIcon
        }
      ]
    }
  },
  methods: {
    handleLogout() {
      localStorage.removeItem('isAuthenticated')
      this.$router.push('/login')
    }
  }
}
</script>