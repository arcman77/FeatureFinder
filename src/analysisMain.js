import Vue from 'vue';
import App from './analysis.vue';

var vm = new Vue({
    render: h => h(App)
});

vm.$mount('#app-container');
