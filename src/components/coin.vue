<template>
    <div class="coin-container">
        <div class="coin">
            <div class="coin-symbol">
                {{symbol}}
            </div>
            <div class="coin-name">
                {{name}}
            </div>
            <div class="homepage">
                {{homepage}}
            </div>
            <div class="load-data"
                :style="loadDataStyle">
                <dropdown position="left-bottom"
                    :showSelectedLabel="false"
                    :options="options"
                    :offsets="{ left: 5 }"
                    @change="performMenuAction">
                    <div slot="dropdown-control" class="button-icon--primary">
                        <i class="nc-icon-glyph ui-2_menu-dots rotate-90"></i>
                    </div>
                </dropdown>
            </div>
        </div>
    </div>
</template>
<script>

import Dropdown from './dropdown.vue';
import CryptoCoinDataAPI from '../providers/cryptoCoinDataAPI';

const Coin = {
    props: ['symbol'],
    data() {
        return {
            name: '',
            homepage: '',
            servedData: CryptoCoinDataAPI.servedData,
            options: [
                { label: '1 min ticks', value: '1', icon: 'min-1' },
                { label: '5 min ticks', value: '5', icon: 'min-5' },
                { label: '30 min ticks', value: '30', icon: 'min-30' },
                { label: '1 hour ticks', value: '60', icon: 'hour-1' },
                { label: '1 day ticks', value: '1440', icon: 'day-1' }
            ]
        };
    },
    components: {
        'dropdown': Dropdown
    },
    methods: {
        setName() {
            const info = CryptoCoinDataAPI.generalCoinInfo[this.symbol];
            this.name = info ? info.name : null;
        },
        setHomepage() {
            const info = CryptoCoinDataAPI.generalCoinInfo[this.symbol];
            this.homepage = info ? info.homepage : null;
        },
        fetchData(coinSymbol, minuteInterval) {
            const self = this;
            CryptoCoinDataAPI.fetch.historic.priceData(coinSymbol, minuteInterval)
            .then((data) => {
                self.$console.log(data)
            });
        },
        performMenuAction(actionValue) {
            this.fetchData(this.symbol, actionValue);
        },
    },
    computed: {
        loadDataStyle() {
            var backgroundColor;
            var borderColor;
            var borderWidth;
            const len = this.tickData.length;
            if (len > 5000) {
                backgroundColor = '#00ce85';
                borderColor = '#00b6ce';
                borderWidth = '5px';
            } else if (len > 1000) {
                backgroundColor = 'yellow';//#f7db07
                borderColor = '#e0b108';
                borderWidth = '3px';
            } else {
                backgroundColor = '#c40105';
                borderColor = '#c60139';
                borderWidth = '2px';
            }
            return {
                'background-color': backgroundColor,
                'border-color': borderColor,
                'border-width': borderWidth,
                'border-style': 'inset'
            };
        },
        loadedTickData() {
            return this.servedData.priceData[this.symbol];
        },
        tickData() {
            return this.loadedTickData || [];
        }
    },
    created() {
        this.setName();
        this.setHomepage();
    }
};

export default Coin;

</script>
<style lang="scss">

$grey-dark: #222222;
$grey-ml: #B3B3B3;

.no-select {
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
}

.coin {
    @extend .no-select;
    background-color: $grey-dark;
    border: 1px solid gold;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .coin-name {
        margin-left: 5px;
        min-width: 64px;
        color: white;
        display: inline-block;
    }
    .coin-symbol, a {
        color: $grey-ml;
        display: inline-block;
    }
    .homepage {
        color: $grey-ml;
        text-decoration: underline;
        margin-left: 25px;
        margin-right: 10px;
        display: inline-block;
    }
    .load-data {
        border-radius: 50%;
        width: 15px;
        height: 15px;
        display: inline-block;
    }
}

</style>