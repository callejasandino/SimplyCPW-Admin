<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import Modal from '../components/ui/Modal.vue'
import { mockCalendarEvents, mockJobs } from '../data/mockData'
import { format } from 'date-fns'

const router = useRouter()
const calendarRef = ref(null)
const events = ref(mockCalendarEvents)
const showEventModal = ref(false)
const showAddEventModal = ref(false)
const selectedEvent = ref(null)
const newEvent = ref({
  title: '',
  start: '',
  end: '',
  status: 'Scheduled',
  client: {
    name: '',
    email: '',
    phone: '',
    address: ''
  },
  price: 0,
  notes: ''
})

const calendarOptions = {
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay'
  },
  events: events.value,
  editable: true,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  eventClick: handleEventClick,
  eventDrop: handleEventDrop,
  eventResize: handleEventResize,
  select: handleDateSelect
}

function handleEventClick(info) {
  selectedEvent.value = mockJobs.find(job => job.id === info.event.extendedProps.jobId)
  showEventModal.value = true
}

function handleEventDrop(info) {
  // Handle event drag and drop
  console.log('Event dropped:', info.event)
}

function handleEventResize(info) {
  // Handle event resize
  console.log('Event resized:', info.event)
}

function handleDateSelect(info) {
  newEvent.value.start = info.startStr
  newEvent.value.end = info.endStr
  showAddEventModal.value = true
}

function formatDateTime(date) {
  return format(new Date(date), 'MMM dd, yyyy HH:mm')
}

function createEvent() {
  // Add event logic here
  showAddEventModal.value = false
}

function viewJobDetails(jobId) {
  router.push(`/jobs/${jobId}`)
}
</script>

<template>
  <div>
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <h1 class="text-2xl font-bold text-neutral-dark">Calendar</h1>
      
      <div class="flex items-center space-x-2">
        <button
          @click="showAddEventModal = true"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          New Event
        </button>
      </div>
    </div>
    
    <div class="bg-white rounded-lg shadow-card p-6">
      <FullCalendar
        ref="calendarRef"
        :options="calendarOptions"
        class="fc-theme-standard"
      />
    </div>

    <!-- View Event Modal -->
    <Modal
      :show="showEventModal"
      title="Event Details"
      @close="showEventModal = false"
    >
      <div v-if="selectedEvent" class="space-y-4">
        <div>
          <h3 class="text-sm font-medium text-neutral mb-1">Title</h3>
          <p class="text-neutral-dark">{{ selectedEvent.title }}</p>
        </div>

        <div>
          <h3 class="text-sm font-medium text-neutral mb-1">Client</h3>
          <p class="text-neutral-dark">{{ selectedEvent.client.name }}</p>
          <p class="text-neutral">{{ selectedEvent.client.email }}</p>
          <p class="text-neutral">{{ selectedEvent.client.phone }}</p>
        </div>

        <div>
          <h3 class="text-sm font-medium text-neutral mb-1">Date & Time</h3>
          <p class="text-neutral-dark">{{ formatDateTime(selectedEvent.date) }}</p>
          <p class="text-neutral">Duration: {{ selectedEvent.duration }} hours</p>
        </div>

        <div>
          <h3 class="text-sm font-medium text-neutral mb-1">Status</h3>
          <span 
            :class="[
              'px-2 py-1 text-xs font-medium rounded-full',
              selectedEvent.status === 'Completed' ? 'bg-primary-light text-primary-dark' :
              selectedEvent.status === 'Scheduled' ? 'bg-info bg-opacity-10 text-info' :
              selectedEvent.status === 'Confirmed' ? 'bg-success bg-opacity-10 text-success' :
              selectedEvent.status === 'In Progress' ? 'bg-warning bg-opacity-10 text-warning' :
              selectedEvent.status === 'Cancelled' ? 'bg-danger bg-opacity-10 text-danger' :
              'bg-neutral-light text-neutral'
            ]"
          >
            {{ selectedEvent.status }}
          </span>
        </div>

        <div>
          <h3 class="text-sm font-medium text-neutral mb-1">Price</h3>
          <p class="text-neutral-dark">${{ selectedEvent.price }}</p>
        </div>

        <div>
          <h3 class="text-sm font-medium text-neutral mb-1">Notes</h3>
          <p class="text-neutral">{{ selectedEvent.notes }}</p>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <button
            @click="showEventModal = false"
            class="px-4 py-2 text-sm font-medium text-neutral-dark border border-neutral-light rounded-lg hover:bg-neutral-light"
          >
            Close
          </button>
          <button
            @click="viewJobDetails(selectedEvent?.id)"
            class="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark"
          >
            View Job Details
          </button>
        </div>
      </template>
    </Modal>

    <!-- Add Event Modal -->
    <Modal
      :show="showAddEventModal"
      title="Add New Event"
      @close="showAddEventModal = false"
    >
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-neutral-dark mb-1">
            Title
          </label>
          <input
            v-model="newEvent.title"
            type="text"
            class="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-neutral-dark mb-1">
              Start Date
            </label>
            <input
              v-model="newEvent.start"
              type="datetime-local"
              class="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-dark mb-1">
              End Date
            </label>
            <input
              v-model="newEvent.end"
              type="datetime-local"
              class="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-neutral-dark mb-1">
            Status
          </label>
          <select
            v-model="newEvent.status"
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
            Client Name
          </label>
          <input
            v-model="newEvent.client.name"
            type="text"
            class="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-neutral-dark mb-1">
            Client Email
          </label>
          <input
            v-model="newEvent.client.email"
            type="email"
            class="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-neutral-dark mb-1">
            Price
          </label>
          <input
            v-model.number="newEvent.price"
            type="number"
            class="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-neutral-dark mb-1">
            Notes
          </label>
          <textarea
            v-model="newEvent.notes"
            rows="3"
            class="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          ></textarea>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <button
            @click="showAddEventModal = false"
            class="px-4 py-2 text-sm font-medium text-neutral-dark border border-neutral-light rounded-lg hover:bg-neutral-light"
          >
            Cancel
          </button>
          <button
            @click="createEvent"
            class="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark"
          >
            Create Event
          </button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<style>
/* Calendar Styles */
:root {
  --fc-border-color: theme('colors.neutral.light');
  --fc-button-text-color: theme('colors.neutral.dark');
  --fc-button-bg-color: theme('colors.white');
  --fc-button-border-color: theme('colors.neutral.light');
  --fc-button-hover-bg-color: theme('colors.neutral.light');
  --fc-button-hover-border-color: theme('colors.neutral.light');
  --fc-button-active-bg-color: theme('colors.primary.DEFAULT');
  --fc-button-active-border-color: theme('colors.primary.DEFAULT');
  --fc-event-bg-color: theme('colors.primary.DEFAULT');
  --fc-event-border-color: theme('colors.primary.DEFAULT');
  --fc-today-bg-color: theme('colors.primary.light' / 0.1);
}

.fc .fc-button {
  @apply rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary;
}

.fc .fc-button-primary:not(:disabled).fc-button-active,
.fc .fc-button-primary:not(:disabled):active {
  @apply text-white;
}

.fc .fc-toolbar-title {
  @apply text-xl font-semibold text-neutral-dark;
}

.fc .fc-event {
  @apply cursor-pointer rounded-lg border-none shadow-sm transition-shadow hover:shadow-md;
}

.fc td, .fc th {
  @apply border-neutral-light;
}
</style>