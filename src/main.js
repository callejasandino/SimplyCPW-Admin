import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';

// Create pinia instance
const pinia = createPinia()

createApp(App)
  .use(router)
  .use(pinia)
  .use(ToastPlugin)
  .mount('#app')