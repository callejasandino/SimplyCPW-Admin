<script setup>
import { ref, computed } from 'vue'
import { CloudArrowUpIcon, XMarkIcon, PhotoIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  multiple: {
    type: Boolean,
    default: false
  },
  accept: {
    type: String,
    default: 'image/*'
  },
  maxSize: {
    type: Number,
    default: 5 // in MB
  },
  label: {
    type: String,
    default: 'Upload Images'
  }
})

const emit = defineEmits(['files-selected', 'file-removed'])

const fileInput = ref(null)
const isDragging = ref(false)
const files = ref([])
const errors = ref([])

const hasFiles = computed(() => files.value.length > 0)

const onFileInputChange = (event) => {
  handleFiles(event.target.files)
}

const handleFiles = (fileList) => {
  errors.value = []
  const newFiles = []
  
  Array.from(fileList).forEach(file => {
    // Check file type
    if (!file.type.match(props.accept.replace('*', '.*'))) {
      errors.value.push(`${file.name} is not a valid file type`)
      return
    }
    
    // Check file size
    if (file.size > props.maxSize * 1024 * 1024) {
      errors.value.push(`${file.name} exceeds the maximum file size of ${props.maxSize}MB`)
      return
    }
    
    // Create URL for preview
    const url = URL.createObjectURL(file)
    newFiles.push({
      file,
      url,
      name: file.name,
      size: formatFileSize(file.size)
    })
  })
  
  if (props.multiple) {
    files.value = [...files.value, ...newFiles]
  } else {
    files.value = newFiles.length > 0 ? [newFiles[0]] : []
  }
  
  if (files.value.length > 0) {
    emit('files-selected', props.multiple ? files.value.map(f => f.file) : files.value[0].file)
  }
  
  // Reset file input
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const removeFile = (index) => {
  // Revoke object URL to avoid memory leaks
  URL.revokeObjectURL(files.value[index].url)
  
  const removedFile = files.value[index].file
  files.value.splice(index, 1)
  
  emit('file-removed', removedFile)
}

const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' bytes'
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
  else return (bytes / 1048576).toFixed(1) + ' MB'
}

const onDragEnter = (e) => {
  e.preventDefault()
  isDragging.value = true
}

const onDragOver = (e) => {
  e.preventDefault()
  isDragging.value = true
}

const onDragLeave = () => {
  isDragging.value = false
}

const onDrop = (e) => {
  e.preventDefault()
  isDragging.value = false
  handleFiles(e.dataTransfer.files)
}

const triggerFileInput = () => {
  fileInput.value.click()
}
</script>

<template>
  <div>
    <!-- Upload Area -->
    <div
      @dragenter="onDragEnter"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
      @click="triggerFileInput"
      :class="[
        'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all',
        isDragging ? 'border-primary bg-primary-light' : 'border-neutral-light hover:border-primary hover:bg-primary-light hover:bg-opacity-10',
        hasFiles ? 'py-4' : 'py-12'
      ]"
    >
      <input
        ref="fileInput"
        type="file"
        :multiple="multiple"
        :accept="accept"
        @change="onFileInputChange"
        class="hidden"
      />
      
      <div v-if="!hasFiles || multiple">
        <CloudArrowUpIcon class="mx-auto h-12 w-12 text-neutral" />
        <p class="mt-2 text-sm text-neutral-dark font-medium">
          {{ isDragging ? 'Drop files here' : label }}
        </p>
        <p class="mt-1 text-xs text-neutral">
          Drag and drop {{ multiple ? 'files' : 'a file' }} here, or click to select {{ multiple ? 'files' : 'a file' }}
        </p>
        <p class="mt-1 text-xs text-neutral">
          Max file size: {{ maxSize }}MB
        </p>
      </div>
    </div>
    
    <!-- Error Messages -->
    <div v-if="errors.length > 0" class="mt-3">
      <p v-for="(error, index) in errors" :key="index" class="text-sm text-danger">
        {{ error }}
      </p>
    </div>
    
    <!-- File Preview -->
    <div v-if="hasFiles" class="mt-4 space-y-3">
      <div
        v-for="(file, index) in files"
        :key="index"
        class="flex items-center bg-white p-3 rounded-lg shadow-sm"
      >
        <div class="flex-shrink-0 mr-3">
          <div v-if="file.url && file.file.type.startsWith('image/')" class="h-12 w-12 rounded overflow-hidden">
            <img :src="file.url" alt="Preview" class="h-full w-full object-cover" />
          </div>
          <div v-else class="h-12 w-12 rounded bg-neutral-light flex items-center justify-center">
            <PhotoIcon class="h-6 w-6 text-neutral" />
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-neutral-dark truncate">{{ file.name }}</p>
          <p class="text-xs text-neutral">{{ file.size }}</p>
        </div>
        <button
          @click.stop="removeFile(index)"
          class="flex-shrink-0 ml-2 p-1 rounded-full text-neutral hover:bg-neutral-light hover:text-danger"
        >
          <XMarkIcon class="h-5 w-5" />
        </button>
      </div>
    </div>
  </div>
</template>