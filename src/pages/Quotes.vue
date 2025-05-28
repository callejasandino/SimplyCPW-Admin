<template>
  <div>
    
    <DataTable
      :data="quotes"
      :columns="columns"
      :row-clickable="true"
      :searchable="true"
      :paginated="true"
      :pagination="pagination"
      @row-click="handleRowClick"
      @page-change="handlePageChange"
    >
      <template #status="{ item }">
        <StatusBadge :status="item.status" size="sm" />
      </template>
    </DataTable>

    <QuoteDetailModal
      :show="showQuoteDetailModal"
      :quote="selectedQuote"
      @close="closeQuoteDetailModal"
    />
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import DataTable from '../components/ui/DataTable.vue'
import StatusBadge from '../components/ui/StatusBadge.vue'
import QuoteDetailModal from '../components/modals/QuoteDetailModal.vue'
import { format } from 'date-fns'
import { useQuoteStore } from '../store/Quote'
import ClientJobsModal from '../components/modals/ClientJobsModal.vue'
export default {
  name: 'QuotesPage',
  
  components: {
    DataTable,
    StatusBadge,
    QuoteDetailModal,
    ClientJobsModal
  },
  
  data() {
    return {
      router: null,
      quoteStore: null,
      showQuoteDetailModal: false,
      selectedQuote: null,
      quotes: [],
      currentPage: 1,
      pagination: null,
      showClientJobModal: false,
      columns: [
        { 
          key: 'name', 
          label: 'Client Name',
          accessor: (item) => `${item.firstName} ${item.lastName}`
        },
        { 
          key: 'email', 
          label: 'Email' 
        },
        { 
          key: 'phone', 
          label: 'Phone' 
        },
        { 
          key: 'services', 
          label: 'Services',
          accessor: (item) => {
            try {
              const services = item.servicesNeeded;
              if (!services) return 'N/A';
              
              if (typeof services === 'string') {
                return JSON.parse(services).join(', ');
              } else if (Array.isArray(services)) {
                return services.join(', ');
              }
              return 'N/A';
            } catch (error) {
              console.error('Error parsing services:', error);
              return 'Invalid services';
            }
          }
        },
        { 
          key: 'createdAt', 
          label: 'Date',
          accessor: (item) => {
            try {
              const dateStr = item.created_at || item.createdAt;
              if (!dateStr) return 'N/A';
              
              const date = new Date(dateStr);
              if (isNaN(date.getTime())) {
                return 'Invalid date';
              }
              return format(date, 'MMM dd, yyyy');
            } catch (error) {
              console.error('Error formatting date:', error);
              return 'Invalid date';
            }
          }
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
    this.router = useRouter()
    this.quoteStore = useQuoteStore()
  },
  
  async mounted() {
    await this.fetchQuotes()
  },
  
  methods: {
    handleRowClick(quote) {
      this.selectedQuote = quote
      this.showQuoteDetailModal = true
    },

    closeQuoteDetailModal() {
      this.showQuoteDetailModal = false
    },
    
    async handlePageChange(page) {
      this.currentPage = page
      await this.fetchQuotes()
    },
    
    async fetchQuotes() {
      await this.quoteStore.fetchQuotes(this.currentPage)
      this.quotes = this.quoteStore.quotes
      this.pagination = {
        current_page: this.quoteStore.pagination.current_page,
        from: this.quoteStore.pagination.from,
        to: this.quoteStore.pagination.to,
        total: this.quoteStore.pagination.total,
        last_page: this.quoteStore.pagination.last_page,
        links: this.quoteStore.pagination.links,
        next_page_url: this.quoteStore.pagination.next_page_url,
        prev_page_url: this.quoteStore.pagination.prev_page_url
      }
    }
  }
}
</script>