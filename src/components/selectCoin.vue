<template>
    <div id="add-coin">
        <input class="input-select-coin"
            type="text"
            name="symbol"
            placeholder="ETH"
            autocomplete="on" 
            v-model="coinSymobol">
        <button class="button-submit-coin" @click="addCoin">GO</button>
        <div id="selected-coins-container">
            <coin v-for="coin in selectedCoins" key="coin"></coin>
        </div>
    </div>
</template>

<script type="text/javascript">
import CryptoCoinDataAPI from '../providers/cryptoCoinDataAPI';
import Coin from './coin.vue';

const SelectCoin = {
    data() {
        return {
            coinSymobol: 'ETH',
            selectedCoins: CryptoCoinDataAPI.getSelectedCoins() || []
            // selectedCoins: []
        };
    },
    components: {
        'coin': Coin
    },
    methods: {
        addCoin() {
            var coinSymobol = this.coinSymobol;
            this.$console.log('coin: ', coinSymobol);
            if (!coinSymobol) {
                return;
            }
            this.$console.log(CryptoCoinDataAPI, CryptoCoinDataAPI.hasCoin(coinSymobol));
            if (CryptoCoinDataAPI.hasCoin(coinSymobol)) {
                CryptoCoinDataAPI.addUserCoin(coinSymobol);
                this.selectedCoins.push(coinSymobol);
                this.updateSelectedCoins();
                const self = this;
                CryptoCoinDataAPI.scrapeHomepageUrl(coinSymobol).then((successStatus) => {
                    if (successStatus) {
                        // self.$console.log('good successStatus', successStatus)
                        self.updateSelectedCoins();
                        // self.$console.log(self.selectedCoins)
                    } else {
                        // self.$console.log('bad successStatus: ')
                        // self.$console.log(successStatus)
                    }
                }).catch(() => {
                    this.$console.log('did not find coin homepage');
                });
            }
        },
        updateSelectedCoins() {
            // this.$console.log('in updateSelectedCoins: ')
            // this.$console.log(this.selectedCoins)
            this.selectedCoins = CryptoCoinDataAPI.getSelectedCoins() || this.selectedCoins;
            // this.$console.log('in updateSelectedCoins: ')
            // this.$console.log(this.selectedCoins)
        }
    },
    created() {
        this.$console.log(CryptoCoinDataAPI);
    }
};

export default SelectCoin;

</script>

<style lang="scss">
$grey-dark: #222222;
$grey-ml: #B3B3B3;

#button-submit-coin {
    &:focus {
        outline: none;
    }
    &:active {
        background-color: green;
    }
}
.selected-coin {
    background-color: $grey-dark;
    display: inline-flex;
    color: white;
    border-radius: 5px;
    margin-top: 16px;
    padding: 2px;
    font-size: 14px;
    align-items: center;
    height: 32px;
    .coin-name {
        margin-left: 5px;
        min-width: 64px;
    }
    .coin-symbol, a {
        color: $grey-ml;
    }
    .homepage {
        text-decoration: underline;
        margin-left: 25px;
        margin-right: 10px;
    }
}
</style>
