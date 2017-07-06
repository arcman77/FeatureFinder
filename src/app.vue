<template>
    <div id="app">
        Hello, Welcome to FeatureFinder!
        <select-coin></select-coin>
        <manage-memory></manage-memory>
    </div>
</template>

<script>
import Vue from 'vue';
// eslint-disable-next-line no-unused-vars
import _ from 'lodash';
import './stylesheets/app.scss';
import './imgs/icon.png';
import './manifest.json';
// eslint-disable-next-line no-unused-vars
import CryptoCoinDataAPI from './providers/cryptoCoinDataAPI';
import DB from './providers/storage';
// eslint-disable-next-line no-unused-vars
import GraphAPI from './providers/graphAPI';
import SelectCoin from './components/selectCoin.vue';
// import Coin from './components/coin.vue';
import ManageMemory from './components/manageMemory.vue';

/* eslint-disable no-undef */
Vue.prototype.$bus = new Vue();
Vue.prototype.$dev = (DEV === 'true');
Vue.prototype.$console = chrome.extension.getBackgroundPage().console;
Vue.prototype.$DB = new DB();

// eslint-disable-next-line no-unused-vars
const app = {
    data() {
        return {
            // graphAPI: new GraphAPI(),
        };
    },
    components: {
        'select-coin': SelectCoin,
        'manage-memory': ManageMemory
    },
    methods: {
        //
    },
    computed: {
        //
    },
    created() {
        //document.addEventListener('DOMContentLoaded', this.addForm, false);
    },
    mounted() {
    },
    beforeDestroy() {
        //clearInterval(this.updateTimer);
    }
};

export default app;

// App.prototype.log () {
//     // if (chrome && chrome.extension && chrome.getBackgroundPage) {
//         const backgroundPage = chrome.extension.getBackgroundPage();
//         backgroundPage.console.log.call(null, argument);
//     // }
// }

// console.log(app.console.log("hey"))

//function graph

//function select stock

//function upload algo

//function code-algo-in-browser
</script>
