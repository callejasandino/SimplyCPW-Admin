import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useQuoteStore = defineStore('quotes', () => {
  const quotes = ref([])
  const error = ref(null)
  const pagination = ref({
    current_page: 1,
    from: null,
    to: null,
    total: 0,
    last_page: 1,
    links: [],
    next_page_url: null,
    prev_page_url: null
  })

  async function fetchQuotes(page = 1) {
    error.value = null
    
    try {
        const response = await axios.get(import.meta.env.VITE_API_URL + 'admin/quotes', {
          params: { page }
        })
        
        // If the API returns data in the format provided in the example
        if (response.data.data) {
          quotes.value = response.data.data
          
          // Update pagination info
          pagination.value = {
            current_page: response.data.current_page,
            from: response.data.from,
            to: response.data.to,
            total: response.data.total,
            last_page: response.data.last_page,
            links: response.data.links,
            next_page_url: response.data.next_page_url,
            prev_page_url: response.data.prev_page_url
          }
        } else {
          // If the API returns data in a different format
          quotes.value = response.data.quotes
        }
    } catch (err) {
        error.value = err.message
    }
  }

  async function updateQuote(quote) {
    try 
    {
      const response = await axios.post(import.meta.env.VITE_API_URL + 'admin/quotes/update', quote)
      
      const index = quotes.value.findIndex(q => q.id === quote.id)
      if (index !== -1) {
          quotes.value[index] = response.data.quote
      }
    } catch (err) {
        console.error(err)
        error.value = err.message
    }
  }

  async function deleteQuote(id) {
    try {
        await axios.delete(import.meta.env.VITE_API_URL + 'admin/quotes/' + id)
        quotes.value = quotes.value.filter(q => q.id !== id)
    } catch (err) {
        error.value = err.message
    }
  }

  return {
    // State
    quotes,
    error,
    pagination,
    
    // Actions
    fetchQuotes,
    updateQuote,
    deleteQuote,
  }
})
