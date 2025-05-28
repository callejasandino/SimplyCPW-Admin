<template>
  <div>
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <h1 class="text-2xl font-bold text-neutral-dark">Jobs</h1>
      
      <div class="flex items-center space-x-2">
        <button
          @click="showAddJobModal = true"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          New Job
        </button>
      </div>
    </div>
    
    <DataTable
      :data="jobs"
      :columns="columns"
      :row-clickable="true"
      :searchable="true"
      @row-click="handleRowClick"
    >
      <template #status="{ item }">
        <StatusBadge :status="item.status" size="sm" />
      </template>
    </DataTable>

    <!-- Add Job Modal -->
    <Modal
      :show="showAddJobModal"
      title="Add New Job"
      @close="showAddJobModal = false"
    >
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-neutral-dark mb-1">
            Job Title
          </label>
          <input
            v-model="newJob.title"
            type="text"
            class="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div class="space-y-4">
          <h3 class="text-sm font-medium text-neutral-dark">Client Information</h3>
          
          <div>
            <label class="block text-sm font-medium text-neutral mb-1">
              Client Name
            </label>
            <input
              v-model="newJob.client.name"
              type="text"
              class="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral mb-1">
              Email
            </label>
            <input
              v-model="newJob.client.email"
              type="email"
              class="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral mb-1">
              Phone
            </label>
            <input
              v-model="newJob.client.phone"
              type="tel"
              class="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral mb-1">
              Address
            </label>
            <input
              v-model="newJob.client.address"
              type="text"
              class="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-neutral-dark mb-1">
              Date
            </label>
            <input
              v-model="newJob.date"
              type="datetime-local"
              class="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-dark mb-1">
              Duration (hours)
            </label>
            <input
              v-model.number="newJob.duration"
              type="number"
              min="1"
              class="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-neutral-dark mb-1">
            Status
          </label>
          <select
            v-model="newJob.status"
            class="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="Scheduled">Scheduled</option>
            <option value="Confirmed">Confirmed</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-neutral-dark mb-1">
            Price
          </label>
          <input
            v-model.number="newJob.price"
            type="number"
            min="0"
            class="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-neutral-dark mb-1">
            Notes
          </label>
          <textarea
            v-model="newJob.notes"
            rows="3"
            class="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          ></textarea>
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="block text-sm font-medium text-neutral-dark">
              Team Members
            </label>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
            <div 
              v-for="member in members" 
              :key="member.id" 
              class="flex items-center space-x-2 p-2 border border-neutral-light rounded-lg"
            >
              <input 
                type="checkbox" 
                :id="`new-member-${member.id}`" 
                :value="member.id"
                v-model="newJob.team"
                class="h-4 w-4 text-primary focus:ring-primary border-neutral-light rounded"
              />
              <label :for="`new-member-${member.id}`" class="text-sm text-neutral-dark">
                {{ member.name }}
              </label>
            </div>
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="block text-sm font-medium text-neutral-dark">
              Equipment
            </label>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
            <div 
              v-for="equipment in equipments" 
              :key="equipment.id" 
              class="flex items-center space-x-2 p-2 border border-neutral-light rounded-lg"
            >
              <input 
                type="checkbox" 
                :id="`new-equipment-${equipment.id}`" 
                :value="equipment.id"
                v-model="newJob.equipment"
                class="h-4 w-4 text-primary focus:ring-primary border-neutral-light rounded"
              />
              <label :for="`new-equipment-${equipment.id}`" class="text-sm text-neutral-dark">
                {{ equipment.name }}
              </label>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <button
            @click="showAddJobModal = false"
            class="px-4 py-2 text-sm font-medium text-neutral-dark border border-neutral-light rounded-lg hover:bg-neutral-light"
          >
            Cancel
          </button>
          <button
            @click="createJob"
            class="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark"
          >
            Create Job
          </button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import DataTable from '../components/ui/DataTable.vue'
import StatusBadge from '../components/ui/StatusBadge.vue'
import Modal from '../components/ui/Modal.vue'
import { mockJobs } from '../data/mockData'
import { format } from 'date-fns'
import { useClientJobStore } from '../store/clientjobs'
import { useMembersStore } from '../store/members'
import { useEquipmentStore } from '../store/equipment'
import { mapActions } from 'pinia'

export default {
  name: 'JobsPage',
  components: {
    DataTable,
    StatusBadge,
    Modal
  },
  data() {
    return {
      jobs: [],
      pagination: {
        currentPage: 1,
        totalPages: 1
      },
      showAddJobModal: false,
      newJob: {
        title: '',
        client: {
          name: '',
          email: '',
          phone: '',
          address: ''
        },
        date: '',
        duration: 1,
        status: 'Scheduled',
        price: 0,
        notes: '',
        services: [],
        team: [],
        equipment: []
      },
      columns: [
        { 
          key: 'title', 
          label: 'Job Title'
        },
        { 
          key: 'client', 
          label: 'Client',
          accessor: (item) => {
            try {
              const clientData = JSON.parse(item.client);
              return `${clientData.firstName} ${clientData.lastName}`;
            } catch (e) {
              return 'Unknown Client';
            }
          }
        },
        { 
          key: 'date', 
          label: 'Date',
          accessor: (item) => format(new Date(item.date), 'MMM dd, yyyy')
        },
        { 
          key: 'price', 
          label: 'Price',
          accessor: (item) => `$${item.price}`
        },
        {
          key: 'status',
          label: 'Status',
          cellClassName: 'text-center'
        }
      ]
    }
  },
  created() {
    this.fetchClientJobs();
    this.fetchMembers();
    this.fetchEquipments();
  },
  methods: {
    ...mapActions(useClientJobStore, [
      'fetchClientJobs',
      'addClientJob',
      'updateClientJob',
      'deleteClientJob'
    ]),
    ...mapActions(useMembersStore, [
      'fetchMembers'
    ]),
    ...mapActions(useEquipmentStore, [
      'fetchEquipments'
    ]),
    handleRowClick(job) {
      // Navigate to job detail with just the ID
      this.$router.push({
        name: 'JobDetail',
        params: { id: job.id }
      });
    },
    createJob() {
      // Format the job data to match API expectations
      const formattedJob = { ...this.newJob };
      
      // Ensure team and equipment are arrays of integers
      formattedJob.team = this.newJob.team.map(id => parseInt(id)).filter(id => !isNaN(id));
      formattedJob.equipment = this.newJob.equipment.map(id => parseInt(id)).filter(id => !isNaN(id));
      
      // Add client as a formatted object
      formattedJob.client = JSON.stringify({
        firstName: this.newJob.client.name.split(' ')[0],
        lastName: this.newJob.client.name.split(' ').slice(1).join(' '),
        email: this.newJob.client.email,
        phone: this.newJob.client.phone,
        address: this.newJob.client.address
      });
      
      this.addClientJob(formattedJob);
      this.showAddJobModal = false;
      
      // Reset the form
      this.newJob = {
        title: '',
        client: {
          name: '',
          email: '',
          phone: '',
          address: ''
        },
        date: '',
        duration: 1,
        status: 'Scheduled',
        price: 0,
        notes: '',
        services: [],
        team: [],
        equipment: []
      };
    },
    parsedJobs(jobsData) {
      if (!jobsData || !jobsData.data) return [];
      
      return jobsData.data.map(job => {
        // Create a new job object with parsed fields
        const parsedJob = { ...job };
        
        // Parse JSON strings into objects/arrays
        try {
          if (typeof job.client === 'string') {
            parsedJob.client = JSON.parse(job.client);
          }
          
          if (typeof job.services === 'string') {
            parsedJob.services = JSON.parse(job.services);
          }
          
          if (typeof job.team === 'string') {
            parsedJob.team = JSON.parse(job.team);
          }
          
          if (typeof job.equipment === 'string') {
            parsedJob.equipment = JSON.parse(job.equipment);
          }
        } catch (e) {
          console.error('Error parsing job data:', e);
        }
        
        return parsedJob;
      });
    },
    updatePagination(paginationData) {
      if (!paginationData) return;
      
      this.pagination = {
        currentPage: paginationData.current_page || 1,
        totalPages: paginationData.last_page || 1,
        total: paginationData.total || 0,
        perPage: paginationData.per_page || 10,
        nextPageUrl: paginationData.next_page_url,
        prevPageUrl: paginationData.prev_page_url
      };
    }
  },
  computed: {
    clientJobStore() {
      return useClientJobStore();
    },
    clientJobs() {
      return this.clientJobStore.clientJobs;
    },
    membersStore() {
      return useMembersStore();
    },
    members() {
      return this.membersStore.members;
    },
    equipmentStore() {
      return useEquipmentStore();
    },
    equipments() {
      return this.equipmentStore.equipments;
    },
    processedJobs() {
      return this.jobs;
    }
  },
  watch: {
    clientJobs: {
      handler(newJobs) {
        if (newJobs) {
          // Handle paginated response structure
          if (newJobs.data) {
            // Store pagination info
            this.updatePagination(newJobs);
            
            // Parse jobs from the data array
            this.jobs = this.parsedJobs(newJobs);
          } else if (Array.isArray(newJobs)) {
            // Handle case where clientJobs is a simple array
            this.jobs = this.parsedJobs({ data: newJobs });
          } else {
            // Fallback to empty array
            this.jobs = [];
          }
        }
      },
      immediate: true,
      deep: true
    }
  }
}
</script>