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
            homepage: ''
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
}

</style>