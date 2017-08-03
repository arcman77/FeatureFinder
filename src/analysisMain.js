import Vue from 'vue';
import VueHighcharts from 'vue-highcharts';
import Highcharts from 'highcharts/highstock';
import App from './analysis.vue';
import DB from './providers/storage';

Vue.use(VueHighcharts, { Highcharts });
/* eslint-disable no-undef */
Vue.prototype.$view = 'analysis';
Vue.prototype.$bus = new Vue();
Vue.prototype.$dev = (DEV === 'true');
Vue.prototype.$console = chrome.extension.getBackgroundPage().console;
Vue.prototype.$DB = new DB();

const vm = new Vue({
    render: h => h(App)
});

vm.$mount('#app-container');
