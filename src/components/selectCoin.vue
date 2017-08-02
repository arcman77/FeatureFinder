<template>
    <div id="add-coin">
        <input class="input-select-coin"
            type="text"
            name="symbol"
            placeholder="ETH"
            autocomplete="on" 
            v-model="coinSymobol">
        <button class="button-submit-coin"
            @click="addCoin"
            @mousedown="showAlert"
            @mouseup="showAlert">
                GO
        </button>
        <div id="alert-already-added" v-show="showAlert">COIN ALREADY ADDED</div>
        <div id="selected-coins-container" v-show="selectedCoins.length > 0">
            <coin v-for="coin in selectedCoins"
                :key="coin"
                :symbol="coin"
                @coinSelected="emitCoinSelected">
            </coin>
        </div>
    </div>
</template>

<script>

import CryptoCoinDataAPI from '../providers/cryptoCoinDataAPI';
import Coin from './coin.vue';

const SelectCoin = {
    data() {
        return {
            coinSymobol: '',
            selectedCoins: CryptoCoinDataAPI.servedData.selectedCoins,
            servedData: CryptoCoinDataAPI.servedData,
            showAlert: false
        };
    },
    components: {
        'coin': Coin
    },
    methods: {
        addCoin() {
            var coinSymobol = this.coinSymobol;
            if (!coinSymobol || this.selectedCoins.indexOf(coinSymobol) > -1) {
                this.$console.log('already added');
                return;
            }
            if (CryptoCoinDataAPI.hasCoin(coinSymobol)) {
                CryptoCoinDataAPI.addUserCoin(coinSymobol);
                // const self = this;
                CryptoCoinDataAPI.scrapeHomepageUrl(coinSymobol).then((successStatus) => {
                    if (successStatus) {
                        // self.$console.log('good successStatus', successStatus)
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
            this.selectedCoins = this.servedData.selectedCoins;
        },
        showAlert() {
            //doesn't work
            //TODO: FIX
            // this.$console.log('showAlert')
            if (this.selectedCoins.indexOf(this.coinSymobol) > -1) {
                this.showAlert = !this.showAlert;
            }
        },
        emitCoinSelected(symbol) {
            this.$emit('coinSelected', symbol);
        }
    },
    watch: {
        servedData: {
            handler() {
                this.updateSelectedCoins();
            },
            deep: true,
            immediate: true
        }
    },
    created() {
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
#selected-coins-container {
    background-color: $grey-dark;
    // display: inline-flex; 
    border-radius: 5px;
    margin-top: 10px;
    padding: 10px;
    // justify-content: center;
}
#alert-already-added {
    border: 2px solid red;
    padding: 5px;
    color: white;
    background-color: red;
    font-weight: 200;
    border-radius: 5px;
    font-size: 12px;
    line-height: 12px;
    display: inline-block;
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
}
</style>
