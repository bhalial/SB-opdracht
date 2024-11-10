// src/main.ts
import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import the router
import { useGlobalStore } from './store'; // Import the store
import './style.css';

const app = createApp(App);

// Provide the store globally
app.provide('globalStore', useGlobalStore());

// Use the router
app.use(router);

// Mount the app
app.mount('#app');
