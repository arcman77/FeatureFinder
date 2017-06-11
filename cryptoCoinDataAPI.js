/* eslint-disable no-underscore-dangle */

function CryptoCoinDataAPI(DB) {
    var self = this;
    this.DB = DB;
    this.storageKey = '_coinData_';
    this.selectedCoinsKey = '_selectedCoins_';
    this.priceDataKey = '_priceData_';
    this.DB.get(this.storageKey).then((coinData) => {
        self.coinData = coinData
        if (!coinData) {
            self.coinData[self.selectedCoinsKey] = [];
            self.coinData[self.priceDataKey] = {};
        }
        self.selectedCoins = self.coinData[self.selectedCoinsKey];
        self.priceData = self.coinData[self.priceDataKey];
    });
}

CryptoCoinDataAPI.prototype.removeCoin = function(symbol) {
    var index = this.selectedCoins.indexOf(symbol);
    this.selectedCoins.splice(index);
    delete this.priceData[symbol];
    const dict = {};
    dict[this.storageKey] = this.coinData;
    this.DB.syncSetItem(dict);
};

