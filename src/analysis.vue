<script>

/* eslint-disable no-unused-vars */
import _ from 'lodash';
import './stylesheets/app.scss';
import CryptoCoinDataAPI from './providers/cryptoCoinDataAPI';
import SelectCoin from './components/selectCoin.vue';
import ManageMemory from './components/manageMemory.vue';
import PriceGraph from './components/priceGraph.vue';
import OptimizeGraph from './components/optimizeGraph.vue';
import ToolsMain from './components/toolsMain.vue';
import Utils from './providers/utils';

// eslint-disable-next-line no-unused-vars
const app = {
    data() {
        return {
            showGraph: false,
            selectedCoin: null,
            servedData: CryptoCoinDataAPI.servedData,
            signals: null,
            optimizeSeries: null,
            paramName: null,
            graphs: {
                price: true,
                optimize: false
            }
        };
    },
    components: {
        'price-graph': PriceGraph,
        'optimize-graph': OptimizeGraph,
        'select-coin': SelectCoin,
        'manage-memory': ManageMemory,
        'tools-main': ToolsMain
    },
    methods: {
        setSelectedCoin(symbol) {
            this.selectedCoin = symbol;
        },
        setOptimizeSeries(series, paramName) {
            this.paramName = paramName;
            this.optimizeSeries = series;
        },
        resizeBody() {
            document.body.style = 'width: 100vw';
        },
        updateSelectedCoin(symbol) {
            this.selectedCoin = symbol;
        },
        setSignals(signals) {
            this.signals = signals;
        },
        selectGraph(name) {

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
    }
};

export default app;

</script>

<template>
    <div id="app-analysis">
        <div id="top">
            <ul id="graphs-tab">
                <li id="price-graph-tab"
                    @click="selectGraph('price')">        
                </li>
                <li id="optimize-graph-tab"
                    
                    @click="selectGraph('optimize')">
                </li>
            </ul>
            <price-graph v-if="selectedCoin && loadedTickData"
                v-show="graphs.price"
                :symbol="selectedCoin"
                :data="loadedTickData"
                :series="signals">
            </price-graph>
            <optimize-graph v-if="optimizeSeries"
                v-show="graphs.optimize"
                :symbol="selectedCoin"
                :paramName="paramName"
                :series="optimizeSeries">    
            </optimize-graph>
            <div class="tools-right">
                <select-coin class="tools"
                    @coinSelected="setSelectedCoin">
                </select-coin>
                <manage-memory class="tools">
                </manage-memory>
            </div>
        </div>
        <div id="bottom">
            <tools-main 
                @coinSelected="updateSelectedCoin"
                :selectedCoin="selectedCoin"
                @signals="setSignals"
                @optimizeSeries="setOptimizeSeries">
            </tools-main>
        </div>
    </div>
</template>

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