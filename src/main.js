import Vue from 'vue';
import App from './app.vue';
import DB from './providers/storage';

/* eslint-disable no-undef */
Vue.prototype.$view = 'main';
Vue.prototype.$bus = new Vue();
Vue.prototype.$dev = (DEV === 'true');
Vue.prototype.$console = chrome.extension.getBackgroundPage().console;
Vue.prototype.$DB = new DB();

// new Vue({
//     el: '#app-container',
//     components: {
//         App
//     }
// });

const vm = new Vue({
    render: h => h(App)
});

vm.$mount('#app-container');
