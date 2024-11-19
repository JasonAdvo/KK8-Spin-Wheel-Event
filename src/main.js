import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import i18n from './i18n';

// Import Main CSS File
import './assets/main.css'

// Import Bootstrap CSS
// import 'bootstrap/dist/css/bootstrap.min.css';

const app = createApp(App);


// Make plugin or component globally
app.use(router);
app.use(i18n);


// Mount into app in index.html
app.mount('#app');
