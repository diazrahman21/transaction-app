import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { setupApiInterceptors } from './services/api';
import './style.css';

const app = createApp(App);

setupApiInterceptors(router);

app.use(router);
app.mount('#app');
