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
                :style="{ color: dataLoadedColor}">
            </div>
        </div>
    </div>
</template>
<script>

import CryptoCoinDataAPI from '../providers/cryptoCoinDataAPI';

const Coin = {
    props: ['symbol'],
    data() {
        return {
            name: '',
            homepage: '',
            tickData: [],
            loadedTickData: {}
        };
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
        fetchLoadedData(coinSymbol, minuteInterval) {
            const self = this;
            const req = CryptoCoinDataAPI.fetch.historic.priceData(coinSymbol, minuteInterval);
            req.then((data) => {
                self.tickData = data;
            });
        }
    },
    computed: {
        dataLoadedColor() {
            const len = this.tickData.length;
            if (len > 300) {
                return 'green';
            } else if (len > 200) {
                return 'yellow';
            }
            return 'red';
        }
    },
    created() {
        // this.fetchLoadedData('ETH', 1);
        this.setName();
        this.setHomepage();
    }
};

export default Coin;

</script>
<style lang="scss">

$grey-dark: #222222;
$grey-ml: #B3B3B3;

.coin {
    background-color: $grey-dark;
    border: 1px solid gold;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 5px;
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
    }
}

</style>