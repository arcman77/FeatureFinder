<script>

import _ from 'lodash';
import CryptoCoinDataAPI from '../providers/cryptoCoinDataAPI';
import AlgoAPI from '../providers/algoAPI';
import UserFilesAPI from '../providers/userFilesAPI';
import Dropdown from './dropdown.vue';
import Gear from './gear.vue';

const Algos = {
    data() {
        return {
            AlgoAPI,
            userFilesServedData: UserFilesAPI.servedData,
            cryptoCoinServedData: CryptoCoinDataAPI.servedData,
            selectedFileHashKey: null,
            gearHoverState: false
        };
    },
    components: {
        'dropdown': Dropdown,
        'gear': Gear
    },
    methods: {
        performFileMenuAction(hashKey) {
            this.setFile(hashKey);
            this.selectedFileHashKey = hashKey;
            this.setData('bittrex', this.priceData);
        },
        performRunMenuAction(symbol) {
            const signals = this.getSignals(this.selectedFileHashKey, symbol);
            console.log(signals);
        },
        setFile(hashKey) {
            const fileInfo = this.jsFiles[hashKey];
            fileInfo.hashKey = hashKey;
            AlgoAPI.sendMessage({
                command: 'setFile',
                fileInfo: fileInfo
            });
        },
        setData(source, priceData) {
            AlgoAPI.sendMessage({
                command: 'setData',
                source: source,
                priceData: priceData
            });
        },
        getSignals(hashKey, symbol) {
            AlgoAPI.sendMessage({
                command: 'getSignals',
                hashKey: hashKey,
                symbol: symbol
            });
        },
        getCoinName(symbol) {
            const info = CryptoCoinDataAPI.generalCoinInfo[symbol];
            return info ? info.name : null;
        },
        listenForSignals() {
            const self = this;
            window.addEventListener('message', (event) => {
                if (event.data.signals) {
                    const series = self.convertSignalsToSeries(event.data.signals);
                    self.$emit('signals', series);
                }
            });
        },
        convertSignalsToSeries(signals) {
            const series = [];
            //TODO: remove temporary filtering of buy singals
            signals.buy = signals.buy.filter(bid => bid[2] > 0);
            const buyFlagSeries = signals.buy.map((signal, index) => ({
                x: signal[0],
                text: `bought ${signal[2]} coins at: $${signal[1]}`,
                id: `Bflag-${index}`,
            }));
            const sellFlagSeries = signals.sell.map((signal, index) => ({
                x: signal[0],
                text: `sold ${signal[2]} coins at: $${signal[1]}`,
                id: `sflag-${index}`,
            }));
            //add sub-series buy-signals
            series.push({
                type: 'flags',
                onSeries: 'priceData',
                shadow: false,
                width: 7,
                shape: 'circlepin',
                data: buyFlagSeries,
                showInLegend: true,
                color: '#2884e0',
                name: 'Buy',
                title: 'B',
                style: { color: 'white' },
                fillColor: '#2884e0',
                turboThreshold: 0
            });
            //add sub-series sell-signals
            series.push({
                type: 'flags',
                onSeries: 'priceData',
                shadow: false,
                width: 7,
                shape: 'circlepin',
                data: sellFlagSeries,
                showInLegend: true,
                color: '#18a689',
                name: 'Sell',
                title: 'S',
                style: { color: 'black' },
                fillColor: '#18a689',
                turboThreshold: 0
            });
            return series; //contains regular Tick data in addition to the newly generated signals
        }
    },
    computed: {
        jsFiles() {
            return this.userFilesServedData.jsFiles;
        },
        priceData() {
            return this.cryptoCoinServedData.priceData;
        },
        selectedCoins() {
            return this.cryptoCoinServedData.selectedCoins;
        },
        fileOptions() {
            const options = [];
            _.each(this.jsFiles, (jsFileInfo, hashKey) => {
                options.push({
                    label: jsFileInfo.name,
                    value: hashKey,
                    icon: ''
                });
            });
            return options;
        },
        coinOptions() {
            const options = [];
            _.each(this.selectedCoins, (symbol) => {
                options.push({
                    label: this.getCoinName(symbol),
                    value: symbol,
                    icon: ''
                });
            });
            return options;
        }
    },
    created() {
        const self = this;
        this.hashWatcher = this.$watch('jsFiles', (newVal) => {
            if (!newVal) {
                return;
            }
            self.selectedFileHashKey = Object.keys(self.jsFiles)[0];
            if (!self.selectedFileHashKey) {
                return;
            }
            self.setFile(self.selectedFileHashKey);
            self.setData('bittrex', self.priceData);
            self.hashWatcher();
            self.hashWatcher = null;
        });
        this.listenForSignals();
    }
};

export default Algos;

</script>
<template>
    <div id="algos-interface">
        <div id="select-file" class="no-select">
            <dropdown v-if="fileOptions.length"
                :showSelectedLabel="false"
                :options="fileOptions"
                @change="performFileMenuAction">
                <div slot="dropdown-control" class="button-icon--primary">
                    <div>
                        <span class="chev-down"> &#x25BC; </span>
                        SELECT FILE
                    </div>
                </div>
            </dropdown>
        </div>
        <div id="select-and-run"
            class="no-select"
            @mouseenter="gearHoverState = true"
            @mouseleave="gearHoverState = false">
            <dropdown v-if="coinOptions.length"
                class="wrapper"
                :showSelectedLabel="false"
                :options="coinOptions"
                @change="performRunMenuAction">
                <div slot="dropdown-control" class="button-icon--primary">
                    <div class="wrapper">
                        <gear id="gear"
                            :color="'rgb(155, 155, 155)'"
                            :hoverColor="'rgb(210, 210, 210)'"
                            :backgroundColor="'rgb(26, 26, 26)'"
                            :isHovering="gearHoverState">    
                        </gear>
                        RUN
                    </div>
                </div>
            </dropdown>
        </div>
    </div>
</template>
<style lang="scss">

.no-select {
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
}

#algos-interface {
    display: flex;
    #select-file {
        border: none;
        padding: 7px;
        margin-left: 5px;
        margin-right: 5px;
        line-height: 20px;
        font-size: 20px;
        max-height: 32px;
        color: rgb(155, 155, 155);       
        box-shadow: rgba(0, 0, 0, 0.5) 0px 2px 2px 0px;
        background-color: rgb(26, 26, 26);
        &:hover {
            color: rgb(210, 210, 210);
            border-color: rgb(210, 210, 210);  
            cursor: pointer;
        }
        .chev-down {
            margin-right: 5px;
        }
    }
    #select-and-run {
        border: none;
        padding: 7px;
        margin-left: 5px;
        margin-right: 5px;
        line-height: 20px;
        font-size: 20px;
        max-height: 32px;
        color: rgb(155, 155, 155);       
        box-shadow: rgba(0, 0, 0, 0.5) 0px 2px 2px 0px;
        background-color: rgb(26, 26, 26);
        display: flex;
        align-items: center;
        &:hover {
            color: rgb(210, 210, 210);
            border-color: rgb(210, 210, 210);  
            cursor: pointer;
        }
        #gear {
            min-height: 20px;
            min-width: 20px;
            max-height: 20px;
            max-width: 20px;
            margin-right: 5px;
        }
        .wrapper {
            display: flex;
            align-items: center;
        }
    }
}

</style>