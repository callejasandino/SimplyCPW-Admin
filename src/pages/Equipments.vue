<template>
  <div>
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4">
      <button
        @click="showAddEquipmentModal = true"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Equipment
      </button>
    </div>
    
    <!-- Loading state -->
    <div v-if="equipmentStore.loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
    </div>
    
    <!-- Error state -->
    <div v-else-if="equipmentStore.error" class="bg-red-50 p-4 rounded-lg text-red-600">
      {{ equipmentStore.error }}
    </div>
    
    <!-- Empty state -->
    <div v-else-if="equipmentStore.equipments.length === 0" class="p-6 bg-neutral-light bg-opacity-30 rounded-lg text-center">
      <p class="text-neutral-dark">No equipment found. Add your first equipment item.</p>
    </div>
    
    <!-- Equipment Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-5 gap-6">
      <div 
        v-for="item in equipmentStore.equipments" 
        :key="item.id"
        @click="editEquipment(item)"
        class="bg-white rounded-lg shadow-card p-6 hover:shadow-lg transition-shadow cursor-pointer"
      >
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-lg font-medium text-neutral-dark">{{ item.name }}</h3>
          <span class="text-xs text-neutral bg-neutral-light rounded-full px-2 py-1">#{{ item.id }}</span>
        </div>
      </div>
    </div>

    <!-- Add/Edit Equipment Modal -->
    <Modal
      :show="showEquipmentModal"
      :title="isEditing ? 'Edit Equipment' : 'Add New Equipment'"
      @close="closeEquipmentModal"
    >
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-neutral-dark mb-1">
            Equipment Name
          </label>
          <input
            v-model="currentEquipment.name"
            type="text"
            class="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-between space-x-3">
          <button
            v-if="isEditing"
            @click="confirmDeleteEquipment"
            class="px-4 py-2 text-sm font-medium text-white bg-danger rounded-lg hover:bg-danger-dark"
          >
            Delete
          </button>
          <div class="flex space-x-3">
            <button
              @click="closeEquipmentModal"
              class="px-4 py-2 text-sm font-medium text-neutral-dark border border-neutral-light rounded-lg hover:bg-neutral-light"
            >
              Cancel
            </button>
            <button
              @click="saveEquipment"
              class="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark"
            >
              {{ isEditing ? 'Save Changes' : 'Create Equipment' }}
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
        <p class="text-neutral-dark">Are you sure you want to delete this equipment?</p>
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
            @click="deleteEquipment"
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
import { useEquipmentStore } from '../store/equipment'

export default {
  name: 'EquipmentsPage',
  
  components: {
    Modal
  },
  
  data() {
    return {
      equipmentStore: useEquipmentStore(),
      showEquipmentModal: false,
      isEditing: false,
      currentEquipment: {
        id: null,
        name: ''
      },
      showDeleteConfirmModal: false
    }
  },
  
  computed: {
    showAddEquipmentModal: {
      get() {
        return this.showEquipmentModal && !this.isEditing
      },
      set(value) {
        this.showEquipmentModal = value
        if (value) {
          this.isEditing = false
          this.resetCurrentEquipment()
        }
      }
    }
  },
  
  methods: {
    // Reset the current equipment form
    resetCurrentEquipment() {
      this.currentEquipment = {
        id: null,
        name: ''
      }
    },
    
    // Open modal to edit an equipment item
    editEquipment(item) {
      this.isEditing = true
      this.currentEquipment = { ...item }
      this.showEquipmentModal = true
    },
    
    // Close the equipment modal
    closeEquipmentModal() {
      this.showEquipmentModal = false
      this.resetCurrentEquipment()
    },
    
    // Save current equipment (create or update)
    async saveEquipment() {
      if (!this.currentEquipment.name) return
      
      if (this.isEditing) {
        await this.equipmentStore.updateEquipment(this.currentEquipment)
      } else {
        await this.equipmentStore.addEquipment(this.currentEquipment)
      }
      
      this.closeEquipmentModal()
    },
    
    // Show delete confirmation modal
    confirmDeleteEquipment() {
      this.showDeleteConfirmModal = true
    },
    
    // Delete the current equipment
    async deleteEquipment() {
      if (this.currentEquipment.id) {
        await this.equipmentStore.deleteEquipment(this.currentEquipment.id)
        this.showDeleteConfirmModal = false
        this.closeEquipmentModal()
      }
    }
  },
  
  mounted() {
    // Call fetchEquipments and log the result
    this.equipmentStore.fetchEquipments()
  }
}
</script>

<style lang="scss" scoped>
</style>