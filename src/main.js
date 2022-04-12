import { createApp } from 'vue';
import App from '@/App.vue';
import '@/assets/styles/index.scss';
import { vfmPlugin } from 'vue-final-modal';
import { createPinia } from 'pinia/dist/pinia';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia)
    .use(vfmPlugin)
    .mount('#app');
