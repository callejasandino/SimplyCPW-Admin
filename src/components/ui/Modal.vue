<template>
  <Transition
    enter-active-class="transition ease-out duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-150"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="show"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click.self="$emit('close')"
    >
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>

      <!-- Modal -->
      <div class="flex min-h-screen items-center justify-center p-4">
        <Transition
          enter-active-class="transition ease-out duration-300"
          enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to-class="opacity-100 translate-y-0 sm:scale-100"
          leave-active-class="transition ease-in duration-200"
          leave-from-class="opacity-100 translate-y-0 sm:scale-100"
          leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div
            v-if="show"
            class="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all w-full"
            :class="maxWidth"
          >
            <!-- Header -->
            <div v-if="title" class="px-6 py-4 border-b border-neutral-light">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-medium text-neutral-dark">{{ title }}</h3>
                <button
                  @click="$emit('close')"
                  class="rounded-full p-1 text-neutral hover:bg-neutral-light hover:text-neutral-dark transition-colors"
                >
                  <XMarkIcon class="h-5 w-5" />
                </button>
              </div>
            </div>

            <!-- Content -->
            <div :class="{ 'p-6': title }">
              <slot></slot>
            </div>

            <!-- Footer -->
            <div v-if="$slots.footer" class="px-6 py-4 border-t border-neutral-light">
              <slot name="footer"></slot>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </Transition>
</template>

<script>
import { XMarkIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'Modal',
  
  components: {
    XMarkIcon
  },
  
  props: {
    show: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    maxWidth: {
      type: String,
      default: 'max-w-2xl'
    }
  },
  
  emits: ['close'],
  
  methods: {
    handleEscape(e) {
      if (e.key === 'Escape') {
        this.$emit('close')
      }
    }
  },
  
  mounted() {
    document.addEventListener('keydown', this.handleEscape)
  },
  
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleEscape)
  }
}
</script>