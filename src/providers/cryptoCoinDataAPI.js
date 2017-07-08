import Bittrex from './data_sources/bittrex';
import CryptoCompare from './data_sources/cryptocompare';
import CoinMarketCap from './data_sources/coinmarketcap';
import CoinMarketCapList from './data_sources/coinmarketcapCoinList';
import DB from './storage';

/* eslint-disable no-underscore-dangle */
class CryptoCoinDataAPI {
    constructor(db) {
        this.DB = db;
        this.storageKey = '_coinData_';
        this.selectedCoinsKey = '_selectedCoins_';
        this.priceDataKey = '_priceData_';
        this.$console = chrome.extension.getBackgroundPage().console;
        this.providers = {
            bittrex: new Bittrex(),
            coinMarketCap: new CoinMarketCap(),
            cryptoCompare: new CryptoCompare()
        };
        const self = this;
        this.DB.syncGetItem(this.storageKey).then((storageObject) => {
            self.setCoinStorageData('sync', storageObject);
        });
        this.DB.localGetItem(this.storageKey).then((storageObject) => {
            self.setCoinStorageData('local', storageObject);
        });

        this.generalCoinInfo = {
            'BTC': {
                name: 'Bitcoin',
                hompage: 'https://bitcoin.org/en/'
            },
            'ETH': {
                name: 'Ethereum',
                hompage: 'https://www.ethereum.org/'
            },
            'XRP': {
                name: 'Ripple',
                hompage: 'https://ripple.com/'
            },
            'LTC': {
                name: 'Litecoin',
                hompage: 'https://litecoin.com/'
            },
            'ETC': {
                name: 'Ethereum Classic',
                homepage: 'https://ethereumclassic.github.io/'
            },
            'XEM': {
                name: 'NEM',
                hompage: 'https://www.nem.io/'
            },
            'DASH': {
                name: 'Dash',
                hompage: 'https://www.dash.org/'
            },
            'MIOTA': {
                name: 'IOTA',
                homepage: 'https://iota.org/'
            }
        };
        this.generalCoinInfoFillIn();
    }

    setCoinStorageData(area, storageObject) {
        if (area !== 'sync' && area !== 'local') {
            this.$console.error(`Calling setCoinStorageData with invalid storage area: "${area}"`);
            return null;
        }
        const propertyName = `${area}CoinData`;
        this[propertyName] = storageObject || {};
        // unwrap
        this[propertyName] = this[propertyName][this.storageKey] || {};
        if (area === 'sync') {
            //eslint-disable-next-line max-len
            this[propertyName][this.selectedCoinsKey] = this[propertyName][this.selectedCoinsKey] || [];
            this.selectedCoins = this[propertyName][this.selectedCoinsKey];
        } else {
            this[propertyName][self.priceDataKey] = this[propertyName][self.priceDataKey] || {};
            self.priceData = this[propertyName][self.priceDataKey];
        }
    }

    watchSyncStorage() {
        this.selectedCoinsKey = '_selectedCoins_';
        this.priceDataKey = '_priceData_';
        const self = this;
        chrome.storage.onChanged.addListener((changes, area) => {
            if (area == 'sync' && self.storageKey in changes) {
                self.setCoinStorageData('sync', changes);
            }
            if (area === 'local' && self.storageKey in changes) {
                self.setCoinStorageData('local', changes);
            }
            self.$console.log(self);
        });
    }

    generalCoinInfoFillIn() {
        //does not include websites
        var index;
        var symbol;
        var offlineInfo = CoinMarketCapList;
        for (index = 0; index < offlineInfo.length; index++) {
            //if it wasn't added manually, auto fill it
            symbol = offlineInfo[index].symbol;
            if (!this.generalCoinInfo[symbol]) {
                this.generalCoinInfo[symbol] = {
                    name: offlineInfo[index].name,
                    hompage: null
                };
            }
        }
    }

    hasCoin(coinSymbol) {
        return !!this.generalCoinInfo[coinSymbol];
    }

    saveSyncCoinData() {
        const dict = {};
        dict[this.storageKey] = this.syncCoinData;
        //sync storage takes key vale pairs
        this.$console.log('inside saveCoinData: ');
        this.$console.log(dict);
        return this.DB.syncSetItem(dict);
    }

    saveLocalCoinData() {
        const dict = {};
        dict[this.storageKey] = this.localCoinData;
        return this.DB.localSetItem(dict);
    }

    clearSyncCoinData() {
        this.$console.log('in clearSyncCoinData');
        const dict = {};
        dict[this.storageKey] = {};
        dict[this.storageKey][this.selectedCoinsKey] = [];
        return this.DB.syncSetItem(dict);
    }

    clearLocalCoinData() {
        const dict = {};
        dict[this.storageKey] = {};
        dict[this.storageKey][this.priceDataKey] = {};
        return this.DB.syncSetItem(dict);
    }

    addUserCoin(coinSymbol) {
        this.selectedCoins.push(coinSymbol);
        return this.saveSyncCoinData();
    }

    removeCoin(symbol) {
        var index = this.selectedCoins.indexOf(symbol);
        this.selectedCoins.splice(index);
        delete this.priceData[symbol];
        return this.saveSyncCoinData();
    }

    getSelectedCoins() {
        return this.selectedCoins;
    }

    getBytesInUse(area) {
        return this.DB.getBytesInUse(area);
    }

    getStorageQuota(area) {
        return this.DB.getStorageQuota(area);
    }

    scrapeHomepageUrl(coinSymbol) {
        const name = this.generalCoinInfo[coinSymbol];
        var self = this;
        this.coinMarketCap.getCoinHomepage(name).then((homepage) => {
            if (homepage) {
                self.generalCoinInfo[coinSymbol].homepage = homepage;
                return new Promise((resolve) => {
                    resolve(true);
                });
            }
            return new Promise((resolve, reject) => {
                reject(false);
            });
        //eslint-disable-next-line
        }).catch(() => {
            return new Promise((resolve, reject) => {
                reject(false);
            });
        });
    }
}

export default new CryptoCoinDataAPI(new DB());

