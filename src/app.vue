<template>
    <div id="app">
        Hello, Welcome to FeatureFinder!
        <select-coin></select-coin>
        <manage-memory></manage-memory>
        <button @click="fullPage"> Full page mode </button>
    </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import _ from 'lodash';
import './stylesheets/app.scss';
import './imgs/icon.png';
import './manifest.json';
// eslint-disable-next-line no-unused-vars
import CryptoCoinDataAPI from './providers/cryptoCoinDataAPI';
// eslint-disable-next-line no-unused-vars
import GraphAPI from './providers/graphAPI';
import SelectCoin from './components/selectCoin.vue';
import ManageMemory from './components/manageMemory.vue';

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
        fullPage() {
            chrome.tabs.create({ url: chrome.runtime.getURL('analysis.html') });
        }
    },
    computed: {
        //
    },
    created() {
    },
    mounted() {
    },
    beforeDestroy() {
    }
};

export default app;

//function upload algo

//function code-algo-in-browser
</script>
<style lang="scss">
    #app {
        width: 500px;
    }
</style>
