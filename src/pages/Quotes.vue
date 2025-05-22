<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-semibold text-charcoal">Quote Requests</h2>
        <p class="text-sm text-gray-500">Manage incoming service quotes</p>
      </div>
      <div class="flex space-x-3">
        <div class="relative">
          <select 
            v-model="statusFilter" 
            class="form-input pr-8 appearance-none"
          >
            
            <option value="all">All Status</option>
            <option v-for="status in statuses" :key="status" :value="status">
              {{ status }}
            </option>
          </select>
          <ChevronDownIcon class="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        </div>
        <button @click="showAddForm = true" class="btn btn-primary">
          <PlusIcon class="h-5 w-5 mr-2" />
          Add Quote
        </button>
      </div>
    </div>
    
    <!-- Quotes Table -->
    <div v-if="filteredQuotes.length > 0" class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Services</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="quote in filteredQuotes" :key="quote.id">
              <td class="px-4 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-charcoal">
                  {{ quote.firstName }} {{ quote.lastName }}
                </div>
                <div class="text-sm text-gray-500">{{ quote.address }}</div>
              </td>
              <td class="px-4 py-4 whitespace-nowrap">
                <div class="text-sm text-charcoal">{{ quote.email }}</div>
                <div class="text-sm text-gray-500">{{ quote.phone }}</div>
              </td>
              <td class="px-4 py-4">
                <div class="flex flex-wrap gap-1">
                  <span 
                    v-for="service in quote.servicesNeeded" 
                    :key="service"
                    class="px-2 py-1 text-xs bg-secondary-light text-primary rounded-full"
                  >
                    {{ service }}
                  </span>
                </div>
              </td>
              <td class="px-4 py-4 whitespace-nowrap">
                <span 
                  class="px-2 py-1 text-xs rounded-full"
                  :class="getStatusClass(quote.status)"
                >
                  {{ quote.status }}
                </span>
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(quote.createdAt) }}
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  @click="viewQuote(quote)"
                  class="text-primary hover:text-primary-dark mr-3"
                >
                  View
                </button>
                <button 
                  @click="confirmDelete(quote.id)"
                  class="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Empty State -->
    <div v-else-if="quotes.length === 0" class="card p-12 flex flex-col items-center justify-center">
      <ClipboardListIcon class="h-16 w-16 text-gray-300 mb-4" />
      <h3 class="text-xl font-medium text-charcoal mb-2">No Quote Requests</h3>
      <p class="text-gray-500 text-center mb-6">Start by adding your first quote request.</p>
      <button @click="showAddForm = true" class="btn btn-primary">
        <PlusIcon class="h-5 w-5 mr-2" />
        Add Quote
      </button>
    </div>
    
    <!-- No Results -->
    <div v-else class="card p-12 flex flex-col items-center justify-center">
      <SearchXIcon class="h-16 w-16 text-gray-300 mb-4" />
      <h3 class="text-xl font-medium text-charcoal mb-2">No Matching Quotes</h3>
      <p class="text-gray-500 text-center mb-6">Try adjusting your filter settings.</p>
      <button @click="statusFilter = 'all'" class="btn btn-secondary">
        Show All Quotes
      </button>
    </div>
    
    <!-- Add/Edit Quote Modal -->
    <div v-if="showAddForm || editingQuote" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div class="flex justify-between items-center p-4 border-b">
          <h3 class="text-lg font-semibold">
            {{ editingQuote ? 'Edit Quote Request' : 'Add New Quote Request' }}
          </h3>
          <button @click="closeForm" class="p-1">
            <XIcon class="h-6 w-6" />
          </button>
        </div>
        <div class="p-6">
          <form @submit.prevent="saveQuote">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label class="form-label" for="firstName">First Name</label>
                <input 
                  type="text" 
                  id="firstName" 
                  v-model="quoteForm.firstName" 
                  class="form-input"
                  required
                />
              </div>
              
              <div>
                <label class="form-label" for="lastName">Last Name</label>
                <input 
                  type="text" 
                  id="lastName" 
                  v-model="quoteForm.lastName" 
                  class="form-input"
                  required
                />
              </div>
              
              <div>
                <label class="form-label" for="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  v-model="quoteForm.email" 
                  class="form-input"
                  required
                />
              </div>
              
              <div>
                <label class="form-label" for="phone">Phone</label>
                <input 
                  type="tel" 
                  id="phone" 
                  v-model="quoteForm.phone" 
                  class="form-input"
                  required
                />
              </div>
            </div>
            
            <div class="mb-4">
              <label class="form-label" for="address">Address</label>
              <input 
                type="text" 
                id="address" 
                v-model="quoteForm.address" 
                class="form-input"
                required
              />
            </div>
            
            <div class="mb-4">
              <label class="form-label">Services Needed</label>
              <div class="grid grid-cols-2 gap-2">
                <label 
                  v-for="service in availableServices" 
                  :key="service"
                  class="flex items-center space-x-2 p-2 rounded-md border cursor-pointer hover:bg-gray-50"
                >
                  <input 
                    type="checkbox"
                    v-model="quoteForm.servicesNeeded"
                    :value="service"
                    class="rounded text-primary focus:ring-primary"
                  />
                  <span class="text-sm">{{ service }}</span>
                </label>
              </div>
            </div>
            
            <div class="mb-4">
              <label class="form-label" for="additionalInfo">Additional Information</label>
              <textarea 
                id="additionalInfo" 
                v-model="quoteForm.additionalInfo" 
                rows="3" 
                class="form-input"
              ></textarea>
            </div>
            
            <div class="mb-4">
              <label class="form-label" for="status">Status</label>
              <select 
                id="status" 
                v-model="quoteForm.status" 
                class="form-input"
                required
              >
                <option v-for="status in statuses" :key="status" :value="status">
                  {{ status }}
                </option>
              </select>
            </div>
            
            <div class="mb-6">
              <label class="flex items-center space-x-2">
                <input 
                  type="checkbox"
                  v-model="quoteForm.agreedToTerms"
                  required
                  class="rounded text-primary focus:ring-primary"
                />
                <span class="text-sm text-gray-600">
                  Agreed to terms and privacy policy
                </span>
              </label>
            </div>
            
            <div class="flex justify-end space-x-3">
              <button 
                type="button" 
                @click="closeForm" 
                class="btn bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="btn btn-primary"
              >
                {{ editingQuote ? 'Update Quote' : 'Add Quote' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    
    <!-- View Quote Modal -->
    <div v-if="viewingQuote" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div class="bg-white rounded-lg max-w-2xl w-full">
        <div class="flex justify-between items-center p-4 border-b">
          <h3 class="text-lg font-semibold">Quote Details</h3>
          <button @click="viewingQuote = null" class="p-1">
            <XIcon class="h-6 w-6" />
          </button>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <h4 class="text-sm font-medium text-gray-500">Client</h4>
              <p class="mt-1">{{ viewingQuote?.firstName }} {{ viewingQuote?.lastName }}</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500">Status</h4>
              <span 
                class="inline-block mt-1 px-2 py-1 text-xs rounded-full"
                :class="getStatusClass(viewingQuote?.status)"
              >
                {{ viewingQuote?.status }}
              </span>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500">Email</h4>
              <p class="mt-1">{{ viewingQuote?.email }}</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500">Phone</h4>
              <p class="mt-1">{{ viewingQuote?.phone }}</p>
            </div>
            <div class="col-span-2">
              <h4 class="text-sm font-medium text-gray-500">Address</h4>
              <p class="mt-1">{{ viewingQuote?.address }}</p>
            </div>
            <div class="col-span-2">
              <h4 class="text-sm font-medium text-gray-500">Services Needed</h4>
              <div class="flex flex-wrap gap-2 mt-1">
                <span 
                  v-for="service in viewingQuote?.servicesNeeded" 
                  :key="service"
                  class="px-2 py-1 text-xs bg-secondary-light text-primary rounded-full"
                >
                  {{ service }}
                </span>
              </div>
            </div>
            <div class="col-span-2">
              <h4 class="text-sm font-medium text-gray-500">Additional Information</h4>
              <p class="mt-1">{{ viewingQuote?.additionalInfo || 'None provided' }}</p>
            </div>
            <div class="col-span-2">
              <h4 class="text-sm font-medium text-gray-500">Created At</h4>
              <p class="mt-1">{{ formatDate(viewingQuote?.createdAt) }}</p>
            </div>
          </div>
          
          <div class="flex justify-end mt-6 space-x-3">
            <button 
              @click="viewingQuote = null" 
              class="btn bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Close
            </button>
            <button 
              @click="editQuote(viewingQuote)"
              class="btn btn-primary"
            >
              Edit Quote
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div class="bg-white rounded-lg max-w-md w-full">
        <div class="p-6">
          <AlertTriangleIcon class="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-center mb-2">Delete Quote Request?</h3>
          <p class="text-gray-500 text-center mb-6">
            Are you sure you want to delete this quote request? This action cannot be undone.
          </p>
          <div class="flex justify-center space-x-3">
            <button 
              @click="showDeleteConfirm = false" 
              class="btn bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Cancel
            </button>
            <button 
              @click="deleteQuote" 
              class="btn bg-red-500 text-white hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { 
  PlusIcon, 
  XIcon, 
  ClipboardListIcon, 
  AlertTriangleIcon,
  ChevronDownIcon,
  SearchXIcon
} from 'lucide-vue-next'
import { mockQuotes, mockServices } from '../data/mock-data.js'

export default {
  components: {
    PlusIcon,
    XIcon,
    ClipboardListIcon,
    AlertTriangleIcon,
    ChevronDownIcon,
    SearchXIcon
  },
  data() {
    return {
      quotes: [...mockQuotes],
      showAddForm: false,
      editingQuote: null,
      viewingQuote: null,
      showDeleteConfirm: false,
      quoteToDelete: null,
      statusFilter: 'all',
      statuses: ['Pending', 'Approved', 'Completed', 'Cancelled'],
      availableServices: mockServices.map(service => service.name),
      quoteForm: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        servicesNeeded: [],
        additionalInfo: '',
        status: 'Pending',
        agreedToTerms: false
      }
    }
  },
  computed: {
    filteredQuotes() {
      if (this.statusFilter === 'all') {
        return this.quotes
      }
      return this.quotes.filter(quote => quote.status === this.statusFilter)
    }
  },
  methods: {
    formatDate(dateString) {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    
    getStatusClass(status) {
      switch (status) {
        case 'Pending':
          return 'bg-orange-100 text-orange'
        case 'Approved':
          return 'bg-green-100 text-green'
        case 'Completed':
          return 'bg-primary-light text-primary'
        case 'Cancelled':
          return 'bg-red-100 text-red-500'
        default:
          return 'bg-gray-100 text-gray-600'
      }
    },
    
    viewQuote(quote) {
      this.viewingQuote = quote
    },
    
    editQuote(quote) {
      this.editingQuote = quote
      this.quoteForm = { ...quote }
      this.viewingQuote = null
      this.showAddForm = true
    },
    
    confirmDelete(id) {
      this.quoteToDelete = id
      this.showDeleteConfirm = true
    },
    
    deleteQuote() {
      this.quotes = this.quotes.filter(quote => quote.id !== this.quoteToDelete)
      this.showDeleteConfirm = false
      this.quoteToDelete = null
      alert('Quote deleted successfully!')
    },
    
    saveQuote() {
      if (this.editingQuote) {
        const index = this.quotes.findIndex(q => q.id === this.editingQuote.id)
        if (index !== -1) {
          this.quotes[index] = {
            ...this.editingQuote,
            ...this.quoteForm
          }
        }
      } else {
        const newQuote = {
          id: Date.now().toString(),
          ...this.quoteForm,
          createdAt: new Date().toISOString()
        }
        this.quotes.push(newQuote)
      }
      
      this.closeForm()
      alert(this.editingQuote ? 'Quote updated successfully!' : 'Quote added successfully!')
    },
    
    closeForm() {
      this.showAddForm = false
      this.editingQuote = null
      this.quoteForm = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        servicesNeeded: [],
        additionalInfo: '',
        status: 'Pending',
        agreedToTerms: false
      }
    }
  }
}
</script>