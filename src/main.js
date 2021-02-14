import Vue from 'vue';
import App from '@/App.vue';
import '@/assets/styles/index.scss'
import router from '@/router';

Vue.config.productionTip = false;
Vue.prototype.$baseUrl = process.env.NODE_ENV === 'production'
    ? '/dnd-constructor'
    : '';

new Vue({
    router,
    render: h => h(App),
}).$mount('#app');
