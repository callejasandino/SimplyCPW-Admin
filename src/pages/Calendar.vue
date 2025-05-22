<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-semibold text-charcoal">Calendar</h2>
        <p class="text-sm text-gray-500">Schedule and manage your jobs</p>
      </div>
      <button @click="showAddForm = true" class="btn btn-primary">
        <PlusIcon class="h-5 w-5 mr-2" />
        Add Event
      </button>
    </div>
    
    <div class="card">
      <FullCalendar 
        ref="calendar"
        :options="calendarOptions"
      />
    </div>
    
    <!-- Event Details Modal -->
    <div v-if="selectedEvent" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div class="bg-white rounded-lg max-w-lg w-full">
        <div class="flex justify-between items-center p-4 border-b">
          <h3 class="text-lg font-semibold">Event Details</h3>
          <button @click="selectedEvent = null" class="p-1">
            <XIcon class="h-6 w-6" />
          </button>
        </div>
        <div class="p-6">
          <h4 class="text-xl font-medium mb-4">{{ selectedEvent.title }}</h4>
          
          <div class="space-y-4">
            <div>
              <p class="text-sm font-medium text-gray-500">Time</p>
              <p>{{ formatEventTime(selectedEvent) }}</p>
            </div>
            
            <div>
              <p class="text-sm font-medium text-gray-500">Client</p>
              <p>{{ selectedEvent.extendedProps.client.name }}</p>
              <p class="text-sm text-gray-500">
                {{ selectedEvent.extendedProps.client.email }} <br>
                {{ selectedEvent.extendedProps.client.phone }}
              </p>
            </div>
            
            <div>
              <p class="text-sm font-medium text-gray-500">Address</p>
              <p>{{ selectedEvent.extendedProps.client.address }}</p>
            </div>
            
            <div>
              <p class="text-sm font-medium text-gray-500">Status</p>
              <span 
                class="inline-block px-2 py-1 text-sm rounded-full"
                :class="getStatusClass(selectedEvent.extendedProps.status)"
              >
                {{ selectedEvent.extendedProps.status }}
              </span>
            </div>
            
            <div>
              <p class="text-sm font-medium text-gray-500">Price</p>
              <p>${{ selectedEvent.extendedProps.price }}</p>
            </div>
          </div>
          
          <div class="flex justify-end mt-6 space-x-3">
            <button 
              @click="selectedEvent = null" 
              class="btn bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Close
            </button>
            <router-link 
              :to="`/jobs/${selectedEvent.extendedProps.jobId}`"
              class="btn btn-primary"
            >
              View Job Details
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { PlusIcon, XIcon } from 'lucide-vue-next'
import { mockCalendarEvents } from '../data/mock-data.js'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

export default {
  components: {
    FullCalendar,
    PlusIcon,
    XIcon
  },
  data() {
    return {
      selectedEvent: null,
      showAddForm: false,
      calendarOptions: {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        initialView: 'timeGridWeek',
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: mockCalendarEvents,
        editable: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        eventClick: this.handleEventClick,
        select: this.handleDateSelect,
        eventDrop: this.handleEventDrop,
        eventResize: this.handleEventResize,
        height: 'auto',
        allDaySlot: false,
        slotMinTime: '06:00:00',
        slotMaxTime: '20:00:00'
      }
    }
  },
  methods: {
    handleEventClick(info) {
      this.selectedEvent = info.event
    },
    
    handleDateSelect(info) {
      this.showAddForm = true
      // You can use info.start and info.end to pre-fill the form
    },
    
    handleEventDrop(info) {
      // Handle event drag and drop
      alert(`Event moved to ${info.event.startStr}`)
    },
    
    handleEventResize(info) {
      // Handle event duration resize
      alert(`Event duration changed to ${info.event.endStr}`)
    },
    
    formatEventTime(event) {
      const start = new Date(event.start)
      const end = new Date(event.end)
      
      return `${start.toLocaleString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      })} - ${end.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric'
      })}`
    },
    
    getStatusClass(status) {
      switch (status) {
        case 'Scheduled':
          return 'bg-secondary-light text-secondary'
        case 'Confirmed':
          return 'bg-green-100 text-green'
        case 'In Progress':
          return 'bg-orange-100 text-orange'
        case 'Completed':
          return 'bg-primary-light text-primary'
        case 'Cancelled':
          return 'bg-red-100 text-red-500'
        default:
          return 'bg-gray-100 text-gray-600'
      }
    }
  }
}
</script>

<style>
.fc {
  @apply font-sans;
}

.fc .fc-toolbar.fc-header-toolbar {
  @apply mb-4;
}

.fc .fc-button {
  @apply bg-gray-100 border-0 text-charcoal hover:bg-gray-200 focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:outline-none;
}

.fc .fc-button-primary:not(:disabled).fc-button-active,
.fc .fc-button-primary:not(:disabled):active {
  @apply bg-primary text-white;
}

.fc .fc-daygrid-day.fc-day-today,
.fc .fc-timegrid-col.fc-day-today {
  @apply bg-secondary/5;
}

.fc .fc-timegrid-slot {
  @apply h-12;
}

.fc .fc-timegrid-slot-label {
  @apply text-sm text-gray-500;
}

.fc .fc-event {
  @apply cursor-pointer border-0 rounded shadow-sm;
}

.fc .fc-event:hover {
  @apply brightness-95;
}

.fc .fc-toolbar-title {
  @apply text-xl font-semibold text-charcoal;
}
</style>