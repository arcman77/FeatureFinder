import Bittrex from './data_sources/bittrex';
import CryptoCompare from './data_sources/cryptocompare';
import CoinMarketCap from './data_sources/coinmarketcap';

/* eslint-disable no-underscore-dangle */
class CryptoCoinDataAPI {
    constructor(DB) {
        this.DB = DB;
        this.storageKey = '_coinData_';
        this.selectedCoinsKey = '_selectedCoins_';
        this.priceDataKey = '_priceData_';
        this.providers = {
            bittrex: new Bittrex(),
            coinMarketCap: new CoinMarketCap(),
            cryptoCompare: new CryptoCompare()
        };
        const self = this;
        this.DB.get(this.storageKey).then((coinData) => {
            self.coinData = coinData;
            if (!coinData) {
                self.coinData[self.selectedCoinsKey] = [];
                self.coinData[self.priceDataKey] = {};
            }
            self.selectedCoins = self.coinData[self.selectedCoinsKey];
            self.priceData = self.coinData[self.priceDataKey];
        });
    }

    // addCoin(symbol) {
    //     //
    // }

    removeCoin(symbol) {
        var index = this.selectedCoins.indexOf(symbol);
        this.selectedCoins.splice(index);
        delete this.priceData[symbol];
        const dict = {};
        dict[this.storageKey] = this.coinData;
        this.DB.syncSetItem(dict);
    }
}

export default CryptoCoinDataAPI;

