<template>
  <div>
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4">
      <button
        @click="showAddMemberModal = true"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Member
      </button>
    </div>
    
    <!-- Loading state -->
    <div v-if="membersStore.loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
    </div>
    
    <!-- Error state -->
    <div v-else-if="membersStore.error" class="bg-red-50 p-4 rounded-lg text-red-600">
      {{ membersStore.error }}
    </div>
    
    <!-- Empty state -->
    <div v-else-if="membersStore.members.length === 0" class="p-6 bg-neutral-light bg-opacity-30 rounded-lg text-center">
      <p class="text-neutral-dark">No members found. Add your first member.</p>
    </div>
    
    <!-- Members Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-5 gap-6">
      <div 
        v-for="item in membersStore.members" 
        :key="item.id"
        @click="editMember(item)"
        class="bg-white rounded-lg shadow-card overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      >
        <img 
          :src="item.image || '/placeholder-profile.jpg'" 
          :alt="item.name"
          class="w-full h-48 object-cover"
        >
        <div class="p-4">
          <h3 class="text-lg font-medium text-neutral-dark mb-2">{{ item.name }}</h3>
          <p class="text-sm text-neutral mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {{ item.email }}
          </p>
          <p class="text-sm text-neutral">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {{ item.contact_number }}
          </p>
        </div>
      </div>
    </div>

    <!-- Add/Edit Member Modal -->
    <Modal
      :show="showMemberModal"
      :title="isEditing ? 'Edit Member' : 'Add New Member'"
      @close="closeMemberModal"
    >
      <div class="space-y-4">
        <div>
          <div class="mb-2">
            <img 
              :src="imagePreview || currentMember.image || '/placeholder-profile.jpg'" 
              alt="Member profile" 
              class="w-full h-60 object-cover rounded-lg"
            >
          </div>
          <input 
            type="file" 
            @change="handleImageChange" 
            accept="image/*"
            class="block w-full text-sm text-neutral-dark
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-medium
                file:bg-primary file:text-white
                hover:file:bg-primary-dark"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-neutral-dark mb-1">
            Name
          </label>
          <input
            v-model="currentMember.name"
            type="text"
            class="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-neutral-dark mb-1">
            Email
          </label>
          <input
            v-model="currentMember.email"
            type="email"
            class="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-neutral-dark mb-1">
            Contact Number
          </label>
          <input
            v-model="currentMember.contact_number"
            type="text"
            class="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-between space-x-3">
          <button
            v-if="isEditing"
            @click="confirmDeleteMember"
            class="px-4 py-2 text-sm font-medium text-white bg-danger rounded-lg hover:bg-danger-dark"
          >
            Delete
          </button>
          <div class="flex space-x-3">
            <button
              @click="closeMemberModal"
              class="px-4 py-2 text-sm font-medium text-neutral-dark border border-neutral-light rounded-lg hover:bg-neutral-light"
            >
              Cancel
            </button>
            <button
              @click="saveMember"
              class="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark"
            >
              {{ isEditing ? 'Save Changes' : 'Create Member' }}
            </button>
          </div>
        </div>
      </template>
    </Modal>

    <!-- Confirmation Modal -->
    <Modal
      :show="showDeleteConfirmModal"
      title="Confirm Delete"
      @close="showDeleteConfirmModal = false"
    >
      <div class="p-4">
        <p class="text-neutral-dark">Are you sure you want to delete this member?</p>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <button
            @click="showDeleteConfirmModal = false"
            class="px-4 py-2 text-sm font-medium text-neutral-dark border border-neutral-light rounded-lg hover:bg-neutral-light"
          >
            Cancel
          </button>
          <button
            @click="deleteMember"
            class="px-4 py-2 text-sm font-medium text-white bg-danger rounded-lg hover:bg-danger-dark"
          >
            Delete
          </button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script>
import Modal from '../components/ui/Modal.vue'
import { useMembersStore } from '../store/members'

export default {
  name: 'MembersPage',
  
  components: {
    Modal
  },
  
  data() {
    return {
      membersStore: useMembersStore(),
      showMemberModal: false,
      isEditing: false,
      imagePreview: null,
      currentMember: {
        id: null,
        name: '',
        email: '',
        contact_number: '',
        image: null
      },
      showDeleteConfirmModal: false
    }
  },
  
  computed: {
    showAddMemberModal: {
      get() {
        return this.showMemberModal && !this.isEditing
      },
      set(value) {
        this.showMemberModal = value
        if (value) {
          this.isEditing = false
          this.resetCurrentMember()
        }
      }
    }
  },
  
  methods: {
    // Reset the current member form
    resetCurrentMember() {
      this.currentMember = {
        id: null,
        name: '',
        email: '',
        contact_number: '',
        image: null
      }
      this.imagePreview = null
    },
    
    // Handle image upload
    handleImageChange(event) {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.imagePreview = e.target.result
        }
        reader.readAsDataURL(file)
        this.currentMember.image = file
      }
    },
    
    // Open modal to edit a member
    editMember(item) {
      this.isEditing = true
      this.currentMember = { ...item }
      this.imagePreview = null
      this.showMemberModal = true
    },
    
    // Close the member modal
    closeMemberModal() {
      this.showMemberModal = false
      this.resetCurrentMember()
    },
    
    // Save current member (create or update)
    async saveMember() {
      if (!this.currentMember.name) return
      
      if (this.isEditing) {
        await this.membersStore.updateMember(this.currentMember)
      } else {
        await this.membersStore.addMember(this.currentMember)
      }
      
      this.closeMemberModal()
    },
    
    // Show delete confirmation modal
    confirmDeleteMember() {
      this.showDeleteConfirmModal = true
    },
    
    // Delete the current member
    async deleteMember() {
      if (this.currentMember.id) {
        await this.membersStore.deleteMember(this.currentMember.id)
        this.showDeleteConfirmModal = false
        this.closeMemberModal()
      }
    }
  },
  
  mounted() {
    this.membersStore.fetchMembers()
  }
}
</script>

<style lang="scss" scoped>
</style>