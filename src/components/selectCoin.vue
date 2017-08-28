<template>
    <div id="user-add-coin">
        <div class="input-wrapper">
          <svg id="search-svg" viewBox="0 0 320 70"
                   data-init="M160,3 L160,3 a27,27 0 0,1 0,54 L160,57 a27,27 0 0,1 0,-54 M197,67 181.21,51.21"
                   data-mid="M160,3 L160,3 a27,27 0 0,1 0,54 L160,57 a27,27 0 0,1 0,-54 M179.5,49.5 179.5,49.5"
                   data-active="M27,3 L293,3 a27,27 0 0,1 0,54 L27,57 a27,27 0 0,1 0,-54 M179.5,49.5 179.5,49.5">
                <path class="search-svg-path" d="M160,3 L160,3 a27,27 0 0,1 0,54 L160,57 a27,27 0 0,1 0,-54 M197,67 181.21,51.21" />
            </svg>
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
                SEARCH COIN
            </button>
        </div>
        <div id="alert-already-added" v-show="showAlertState">COIN ALREADY ADDED</div>
        <div id="selected-coins-container" 
            :class="{'full-page-mode': $view === 'analysis'}"
            v-show="selectedCoins.length > 0">
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
            showAlertState: false,
            timeout: null
        };
    },
    components: {
        'coin': Coin
    },
    methods: {
        addCoin() {
            var coinSymobol = this.coinSymobol;
            if (!coinSymobol) {
                return;
            }
            if (this.selectedCoins.indexOf(coinSymobol) > -1) {
                this.showAlertState = true;
                const self = this;
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    self.showAlertState = false;
                }, 700);
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
                this.showAlertState = !this.showAlertState;
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
$jet-black: #1A1A1A;

#user-add-coin {
    background-color: $jet-black;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .input-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        border-bottom: 1px solid white;

        #search-svg {
            height: 20px;
            margin-left: -20px;
            .search-svg-path {
                fill: none;
                stroke: #fff;
                stroke-width: 3px;
            }
        }
        .input-select-coin {
            max-height: 20px;
            max-width: 75px;
            margin-top: 10px;
            margin-bottom: 10px;
            margin-left: -20px;
            color: white;
            background-color: $jet-black;
            border: none;
            &:focus {
                outline: none;
            }
        }
        .button-submit-coin {
            max-height: 20px;
            max-width: 105px;
            background-color: $jet-black;
            color: white;
            border: none;
            cursor: pointer;
            &:focus {
                outline: none;
            }
            &:active {
                color: gold;
            }
        }
    }

    #selected-coins-container {
        background-color: $jet-black;
        border-radius: 5px;
        width: 100%;
        padding: 10px;
        display: flex;
        flex-direction: column;

    }
    .full-page-mode {
        max-height: 30vh;
        overflow: auto;
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
        transition: all 1s linear;
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
}



</style>
