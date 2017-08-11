<template>
    <div id="app-analysis">
        <div id="top">
            <graph v-if="selectedCoin && loadedTickData"
                :symbol="selectedCoin"
                :data="loadedTickData">
            </graph>
            <div class="tools-right">
                <select-coin class="tools"
                    @coinSelected="setSelectedCoin">
                </select-coin>
                <manage-memory class="tools">
                </manage-memory>
            </div>
        </div>
        <div id="bottom">
            <tools-main></tools-main>
        </div>
    </div>
</template>
    
<script>

/* eslint-disable no-unused-vars */
import _ from 'lodash';
import './stylesheets/app.scss';
import CryptoCoinDataAPI from './providers/cryptoCoinDataAPI';
import SelectCoin from './components/selectCoin.vue';
import ManageMemory from './components/manageMemory.vue';
import Graph from './components/graph.vue';
import ToolsMain from './components/toolsMain.vue';
import Utils from './providers/utils';

// eslint-disable-next-line no-unused-vars
const app = {
    data() {
        return {
            showGraph: false,
            selectedCoin: null,
            servedData: CryptoCoinDataAPI.servedData
        };
    },
    components: {
        'graph': Graph,
        'select-coin': SelectCoin,
        'manage-memory': ManageMemory,
        'tools-main': ToolsMain
    },
    methods: {
        setSelectedCoin(symbol) {
            this.selectedCoin = symbol;
        },
        resizeBody() {
            document.body.style = 'width: 100vw';
        }
    },
    computed: {
        loadedTickData() {
            return this.servedData.priceData[this.selectedCoin];
        },
        tickData() {
            return this.loadedTickData || [];
        }
    },
    created() {
        this.resizeBody();
        const params = Utils.getUrlParam('coin');
        if (params) {
            this.selectedCoin = params;
        }
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
$jet-black: #1A1A1A;

html {
    box-sizing: border-box;
    overflow: hidden;
}

*,
*::before,
*::after {
    box-sizing: inherit;
}

#app-analysis {
    width: 100vw;
    max-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: $jet-black;
    #top {
        max-height: 50vh;
        height: 50vh;
        display: flex;
        flex-direction: row;
        .tools-right {
            width: 40vw;
            display: inline-flex;
            flex-direction: column;
        }
    }
    #bottom {
        max-height: 50vh;
        height: 50vh;
    }
}

</style>
