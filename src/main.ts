import { createApp } from 'vue';
import App from './App.vue';
import './index.css';

// Unregister any active service worker to prevent fetch interception/routing issues on the dev subdomain
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister();
      console.log('Successfully unregistered legacy service worker:', registration);
    }
  }).catch((err) => {
    console.warn('Service worker registration cleanup error:', err);
  });
}

createApp(App).mount('#root');
