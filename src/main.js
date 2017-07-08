import Vue from 'vue';
import App from './app.vue';

// new Vue({
//     el: '#app-container',
//     components: {
//         App
//     }
// });

var vm = new Vue({
    render: h => h(App)
});

vm.$mount('#app-container');
