<template>
    <div id="app-analysis">
        Hello, Welcome to FeatureFinder - Analysis!
        <select-coin></select-coin>
        <manage-memory></manage-memory>
    </div>
</template>

<script>
import Vue from 'vue';
/* eslint-disable no-unused-vars */
import _ from 'lodash';
import './stylesheets/app.scss';
import CryptoCoinDataAPI from './providers/cryptoCoinDataAPI';
import DB from './providers/storage';
import GraphAPI from './providers/graphAPI';
import SelectCoin from './components/selectCoin.vue';
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
        };
    },
    components: {
        'select-coin': SelectCoin,
        'manage-memory': ManageMemory
    },
    methods: {
        resize() {
            document.body.style = 'width: 100vw;';
        }
    },
    computed: {
    },
    created() {
        // this.resize();
    },
    mounted() {
    },
    beforeDestroy() {
        //clearInterval(this.updateTimer);
    }
};

export default app;

//function graph

//function upload algo

//function code-algo-in-browser
</script>
<style lang="scss">
    #app-analysis {
        width: 100vw;
    }
</style>
