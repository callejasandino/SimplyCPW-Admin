<template>
  <div v-if="job">
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div class="flex items-center">
        <button 
          @click="goBack" 
          class="mr-4 p-1 rounded-full text-neutral-dark hover:bg-neutral-light"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
      </div>
      
      <div class="flex items-center space-x-2">
        <button
          v-if="isEditing"
          @click="toggleEdit"
          class="inline-flex items-center px-4 py-2 border border-neutral-light rounded-lg shadow-sm text-sm font-medium text-neutral-dark bg-white hover:bg-neutral-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-light"
        >
          Cancel
        </button>
        
        <button
          v-if="isEditing"
          @click="saveChanges"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-success hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-success"
        >
          Save Changes
        </button>
        
        <button
          v-if="!isEditing"
          @click="toggleEdit"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Edit Job
        </button>
      </div>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Job Information -->
      <div class="bg-white rounded-lg shadow-card overflow-hidden">
        <div class="p-4 border-b border-neutral-light">
          <h2 class="text-lg font-semibold text-neutral-dark">Job Information</h2>
        </div>
        <div class="p-4 space-y-4">
          <div>
            <h3 class="text-sm font-medium text-neutral mb-1">Job Title</h3>
            <div v-if="!isEditing" class="text-neutral-dark">{{ job.title }}</div>
            <input
              v-else
              v-model="formData.title"
              type="text"
              class="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <div>
            <h3 class="text-sm font-medium text-neutral mb-1">Status</h3>
            <div v-if="!isEditing">
              <StatusBadge :status="job.status" />
            </div>
            <select
              v-else
              v-model="formData.status"
              class="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option v-for="status in statusOptions" :key="status" :value="status">
                {{ status }}
              </option>
            </select>
          </div>
          
          <div>
            <h3 class="text-sm font-medium text-neutral mb-1">Price</h3>
            <div v-if="!isEditing" class="text-neutral-dark">${{ job.price }}</div>
            <input
              v-else
              v-model.number="formData.price"
              type="number"
              class="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <div>
            <h3 class="text-sm font-medium text-neutral mb-1">Date</h3>
            <div v-if="!isEditing" class="text-neutral-dark">{{ formatDate(job.date) }}</div>
            <input
              v-else
              type="datetime-local"
              :value="formatDateForInput(job.date)"
              @input="formData.date = $event.target.value"
              class="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <div>
            <h3 class="text-sm font-medium text-neutral mb-1">Duration</h3>
            <div v-if="!isEditing" class="text-neutral-dark">{{ job.duration }} hours</div>
            <input
              v-else
              v-model.number="formData.duration"
              type="number"
              min="1"
              class="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <div>
            <h3 class="text-sm font-medium text-neutral mb-1">Notes</h3>
            <div v-if="!isEditing" class="text-neutral-dark">{{ job.notes }}</div>
            <textarea
              v-else
              v-model="formData.notes"
              rows="4"
              class="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            ></textarea>
          </div>
        </div>
      </div>
      
      <!-- Client Information -->
      <div class="space-y-6">
        <div class="bg-white rounded-lg shadow-card overflow-hidden">
          <div class="p-4 border-b border-neutral-light">
            <h2 class="text-lg font-semibold text-neutral-dark">Client Information</h2>
          </div>
          <div class="p-4 space-y-4">
            <div>
              <h3 class="text-sm font-medium text-neutral mb-1">Name</h3>
              <p class="text-neutral-dark">{{ job.client.firstName }} {{ job.client.lastName }}</p>
            </div>
            
            <div>
              <h3 class="text-sm font-medium text-neutral mb-1">Email</h3>
              <p class="text-neutral-dark">{{ job.client.email }}</p>
            </div>
            
            <div>
              <h3 class="text-sm font-medium text-neutral mb-1">Phone</h3>
              <p class="text-neutral-dark">{{ job.client.phone }}</p>
            </div>
            
            <div>
              <h3 class="text-sm font-medium text-neutral mb-1">Address</h3>
              <p class="text-neutral-dark">{{ job.client.address }}</p>
            </div>
          </div>
        </div>
        
        <!-- Team and Equipment -->
        <div class="bg-white rounded-lg shadow-card overflow-hidden">
          <div class="p-4 border-b border-neutral-light">
            <h2 class="text-lg font-semibold text-neutral-dark">Team & Equipment</h2>
          </div>
          <div class="p-4 space-y-6">
            <div>
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-sm font-medium text-neutral">Team Members</h3>
              </div>
              <div v-if="!isEditing" class="space-y-2">
                <div
                  v-for="memberId in job.team"
                  :key="memberId"
                  class="px-3 py-2 bg-neutral-light bg-opacity-50 rounded-lg text-neutral-dark"
                >
                  {{ getMemberName(memberId) }}
                </div>
              </div>
              <div v-else class="space-y-2">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div 
                    v-for="member in allMembers" 
                    :key="member.id" 
                    class="flex items-center space-x-2 p-2 border border-neutral-light rounded-lg"
                  >
                    <input 
                      type="checkbox" 
                      :id="`member-${member.id}`" 
                      :value="member.id"
                      v-model="formData.team"
                      class="h-4 w-4 text-primary focus:ring-primary border-neutral-light rounded"
                    />
                    <label :for="`member-${member.id}`" class="text-sm text-neutral-dark">
                      {{ member.name }}
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-sm font-medium text-neutral">Equipment</h3>
              </div>
              <div v-if="!isEditing" class="space-y-2">
                <div
                  v-for="equipmentId in job.equipment"
                  :key="equipmentId"
                  class="px-3 py-2 bg-neutral-light bg-opacity-50 rounded-lg text-neutral-dark"
                >
                  {{ getEquipmentName(equipmentId) }}
                </div>
              </div>
              <div v-else class="space-y-2">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div 
                    v-for="equipment in allEquipments" 
                    :key="equipment.id" 
                    class="flex items-center space-x-2 p-2 border border-neutral-light rounded-lg"
                  >
                    <input 
                      type="checkbox" 
                      :id="`equipment-${equipment.id}`" 
                      :value="equipment.id"
                      v-model="formData.equipment"
                      class="h-4 w-4 text-primary focus:ring-primary border-neutral-light rounded"
                    />
                    <label :for="`equipment-${equipment.id}`" class="text-sm text-neutral-dark">
                      {{ equipment.name }}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <div v-else class="flex items-center justify-center h-64">
    <p class="text-neutral">Loading...</p>
  </div>
</template>

<script>
import { format, parseISO } from 'date-fns'
import StatusBadge from '../components/ui/StatusBadge.vue'
import { useMembersStore } from '../store/members'
import { useEquipmentStore } from '../store/equipment'
import { useClientJobStore } from '../store/clientjobs'
import { mapState } from 'pinia'
import { showToast } from '../utils/toast'

export default {
  components: {
    StatusBadge
  },
  data() {
    return {
      jobId: this.$route.params.id,
      isEditing: false,
      job: null,
      formData: {
        title: '',
        status: '',
        price: 0,
        notes: '',
        date: '',
        duration: 1,
        team: [],
        equipment: []
      },
      statusOptions: ['Scheduled', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'],
      clientJobStore: useClientJobStore(),
      membersStore: useMembersStore(),
      equipmentStore: useEquipmentStore()
    }
  },
  computed: {
    ...mapState(useMembersStore, ['members']),
    ...mapState(useEquipmentStore, ['equipments']),
    allMembers() {
      return this.members;
    },
    allEquipments() {
      return this.equipments;
    }
  },
  created() {
    // Always fetch job data directly using the fetchClientJob function
    this.fetchJobData();
  },
  mounted() {
    // Fetch members and equipment data
    this.membersStore.fetchMembers();
    this.equipmentStore.fetchEquipments();
  },
  methods: {
    fetchJobData() {
      this.clientJobStore.fetchClientJob(this.jobId).then(() => {
        if (this.clientJobStore.clientJob) {
          this.job = { ...this.clientJobStore.clientJob };
          this.parseJobData(this.job);
          this.initFormData();
        } else {
          showToast('Job not found', 'error');
          this.$router.push('/jobs');
        }
      }).catch(err => {
        console.error('Error fetching job:', err);
        showToast('Error fetching job: ' + err.message, 'error');
        this.$router.push('/jobs');
      });
    },
    initFormData() {
      this.formData = {
        title: this.job.title,
        status: this.job.status,
        price: this.job.price,
        notes: this.job.notes,
        date: this.formatDateForInput(this.job.date),
        duration: this.job.duration,
        team: Array.isArray(this.job.team) ? [...this.job.team] : [],
        equipment: Array.isArray(this.job.equipment) ? [...this.job.equipment] : []
      };
    },
    formatDate(dateString) {
      return format(new Date(dateString), 'MMMM dd, yyyy HH:mm');
    },
    formatDateForInput(dateString) {
      if (!dateString) return '';
      // Format date as YYYY-MM-DDTHH:MM which is required for datetime-local input
      const date = new Date(dateString);
      return format(date, "yyyy-MM-dd'T'HH:mm");
    },
    goBack() {
      this.$router.push('/jobs');
    },
    toggleEdit() {
      this.isEditing = !this.isEditing;
      if (!this.isEditing) {
        this.initFormData();
      }
    },
    saveChanges() {
      // Prepare data for API
      const updatedJob = {
        ...this.job,
        ...this.formData,
        // The API expects array types for team and equipment
        // Make sure the data is an array of IDs
        team: this.formData.team.map(id => parseInt(id)).filter(id => !isNaN(id)),
        equipment: this.formData.equipment.map(id => parseInt(id)).filter(id => !isNaN(id))
      };
      
      console.log('Saving job with data:', updatedJob);
      
      this.clientJobStore.updateClientJob(updatedJob).then(() => {
        if (this.clientJobStore.error) {
          // Handle error if needed
          console.error('Error updating job:', this.clientJobStore.error);
          showToast('Error updating job: ' + this.clientJobStore.error, 'error');
          return;
        }

        // Refresh the jobs list before navigating
        this.clientJobStore.fetchClientJobs().then(() => {
          // Update successful, navigate back to jobs list
          this.$router.push('/jobs');
          showToast('Job updated successfully!', 'success');
        });
      }).catch(err => {
        console.error('Error updating job:', err);
        showToast('Error updating job: ' + err.message, 'error');
      });
    },
    // Helper function to parse JSON strings in job data
    parseJobData(jobData) {
      if (typeof jobData.team === 'string') {
        try {
          jobData.team = JSON.parse(jobData.team);
        } catch (e) {
          jobData.team = [];
        }
      }
      
      if (typeof jobData.equipment === 'string') {
        try {
          jobData.equipment = JSON.parse(jobData.equipment);
        } catch (e) {
          jobData.equipment = [];
        }
      }
      
      if (typeof jobData.client === 'string') {
        try {
          jobData.client = JSON.parse(jobData.client);
        } catch (e) {
          jobData.client = { name: 'Unknown', email: '', phone: '', address: '' };
        }
      }
      
      if (typeof jobData.services === 'string') {
        try {
          jobData.services = JSON.parse(jobData.services);
        } catch (e) {
          jobData.services = [];
        }
      }
      
      return jobData;
    },
    // Helper functions to get names from IDs
    getMemberName(id) {
      const member = this.allMembers.find(m => m.id === parseInt(id));
      return member ? member.name : `Member ${id}`;
    },
    getEquipmentName(id) {
      const equipment = this.allEquipments.find(e => e.id === parseInt(id));
      return equipment ? equipment.name : `Equipment ${id}`;
    }
  }
}
</script>