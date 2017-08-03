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
        this.selectedCoinsKey = 'selectedCoins';
        this.priceDataKey = 'priceData';
        this.liveDataKey = 'liveData';
        this.$console = chrome.extension.getBackgroundPage().console;
        this.servedData = {
            selectedCoins: [],
            priceData: {},
            liveData: {},
            localBytesInUse: 0,
            syncBytesInUse: 0
        };
        this.providers = {
            bittrex: new Bittrex(),
            coinMarketCap: new CoinMarketCap(),
            cryptoCompare: new CryptoCompare({
                selectedCoins: this.servedData.selectedCoins,
                priceData: this.servedData.liveData,
                CryptoCoinDataAPI: this
            })
        };

        window.coins = this.servedData.selectedCoins;
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
                homepage: 'https://bitcoin.org/en/'
            },
            'ETH': {
                name: 'Ethereum',
                homepage: 'https://www.ethereum.org/'
            },
            'XRP': {
                name: 'Ripple',
                homepage: 'https://ripple.com/'
            },
            'LTC': {
                name: 'Litecoin',
                homepage: 'https://litecoin.com/'
            },
            'ETC': {
                name: 'Ethereum Classic',
                homeepage: 'https://ethereumclassic.github.io/'
            },
            'XEM': {
                name: 'NEM',
                homepage: 'https://www.nem.io/'
            },
            'DASH': {
                name: 'Dash',
                homepage: 'https://www.dash.org/'
            },
            'MIOTA': {
                name: 'IOTA',
                homepage: 'https://iota.org/'
            }
        };
        this.generalCoinInfoFillIn();
        this.watchSyncStorage();
        this.fetch = {
            historic: {
                //returns Ajax Promise
                priceData(symbol, minuteInterval) {
                    const req = self.providers.bittrex.getMinuteTicksData(symbol, minuteInterval);
                    req.then((response) => {
                        //{"success":true,"message":"","result":[{"O":0.13350000,
                        if (response.success && response.result) {
                            self.saveLocalCoinPriceData(symbol, response.result);
                        }
                        return response;
                    });

                    return req;
                }
            }
        };
    }

    setCoinStorageData(area, storageObject, isUpdateEvent) {
        if (area !== 'sync' && area !== 'local') {
            this.$console.error(`Calling setCoinStorageData with invalid storage area: "${area}"`);
            return null;
        }
        const propertyName = `${area}CoinData`;
        if (isUpdateEvent) {
            let key;
            //eslint-disable-next-line no-restricted-syntax
            for (key in storageObject) {
                this[propertyName][key] = storageObject[key];
                this.servedData[key] = storageObject[key];
            }
        } else {
            this[propertyName] = storageObject || {};
            // unwrap
            this[propertyName] = this[propertyName][this.storageKey] || {};

            if (area === 'sync') {
                //eslint-disable-next-line max-len
                this[propertyName][this.selectedCoinsKey] = this[propertyName][this.selectedCoinsKey] || [];
                this.servedData.selectedCoins = this[propertyName][this.selectedCoinsKey];
            } else {
                this[propertyName][this.priceDataKey] = this[propertyName][this.priceDataKey] || {};
                this.servedData.priceData = this[propertyName][this.priceDataKey];
            }
        }
        const self = this;
        this.getBytesInUse(area).then((bytes) => {
            self.servedData[`${area}BytesInUse`] = bytes;
        });
    }

    watchSyncStorage() {
        // TODO: invesitgate why var name 'self' can't be used in chrome callbacks
        const selff = this;
        chrome.storage.onChanged.addListener((changes, area) => {
            // selff.$console.log('storage changed happened', changes, area)
            if ((area == 'sync' || area === 'local') && selff.storageKey in changes) {
                selff.setCoinStorageData(area, changes[selff.storageKey].newValue, true);
            }
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
                    homepage: null
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
        // this.$console.log('save: ', dict);
        return this.DB.syncSetItem(dict);
    }

    saveLocalCoinData() {
        const dict = {};
        dict[this.storageKey] = this.localCoinData;
        return this.DB.localSetItem(dict);
    }

    saveLocalCoinPriceData(coinSymbol, data) {
        this.localCoinData[this.priceDataKey][coinSymbol] = data;
        this.saveLocalCoinData();
    }

    clearSyncCoinData() {
        // this.$console.log('in clearSyncCoinData');
        const dict = {};
        dict[this.storageKey] = {};
        dict[this.storageKey][this.selectedCoinsKey] = [];
        return this.DB.syncSetItem(dict);
    }

    clearLocalCoinData() {
        const dict = {};
        dict[this.storageKey] = {};
        dict[this.storageKey][this.priceDataKey] = {};
        // this.$console.log('clearLocalCoinData: ', dict)
        return this.DB.localSetItem(dict);
    }

    addUserCoin(coinSymbol) {
        this.syncCoinData[this.selectedCoinsKey].push(coinSymbol);
        return this.saveSyncCoinData();
    }

    removeCoin(symbol) {
        var index = this.selectedCoins.indexOf(symbol);
        this.syncCoinData[this.selectedCoinsKey].splice(index);
        delete this.localCoinData[this.priceDataKey][symbol];
        return [this.saveSyncCoinData(), this.saveLocalCoinData()];
    }

    getSelectedCoins() {
        return this.syncCoinData[this.selectedCoinsKey];
    }

    getBytesInUse(area) {
        return this.DB.getBytesInUse(area);
    }

    getStorageQuota(area) {
        return this.DB.getStorageQuota(area);
    }

    getLocalCoinData() {
        return this.localCoinData;
    }

    getLocalCoinPriceData() {
        return this.localCoinData[this.priceDataKey];
    }

    getLocalCoinPriceSymbolData(symbol) {
        return this.localCoinData[this.priceDataKey][symbol];
    }

    scrapeHomepageUrl(coinSymbol) {
        const name = this.generalCoinInfo[coinSymbol];
        const self = this;
        this.coinMarketCap.getCoinHomepage(name).then((homepage) => {
            self.$console.log('in get coin homepage');
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

