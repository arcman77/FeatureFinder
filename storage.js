/** chrome storage
 * All queries return promises
 * All insertions return promises
 * Promises will comply with the A+ standard. See http://2ality.com/2014/10/es6-promises-api.html for more info.
 * The following code provides:
 *  1. A wrapper to the extension storage api. See https://developer.chrome.com/extensions/storage for more info.
 *  2. A wrapper to access extension local storage
 * For Data quota's see https://developer.chrome.com/extensions/storage for more info.
*/

/* eslint-disable no-underscore-dangle */

function DB() {
    var self = this;
    this.CHROME_SYNC_STORAGE_QUOTA = 102400; //BYTES
    this.storage = chrome.storage;
    this.localStorage = this.storage.local;
    this.syncStorage = this.storage.sync;
    this.syncStorage.get(['_coinData_'], (coinData) => {
        self.coinData = coinData || {};
    });
    this.syncStorage.get(['_stockData_'], (stockData) => {
        self.stockData = stockData || {};
    });
    this.syncStorage.get(['_userFiles_'], (userFiles) => {
        self.userFiles = userFiles || {};
    });
}

DB.prototype._syncStorageQueryTemplate_ = function(args, asyncFunc) {
    return new Promise((resolve, reject) => {
        try {
            asyncFunc(args, (results) => {
                resolve(results);
            });
        } catch (err) {
            reject(err);
        }
    });
};

DB.prototype.syncGetItem = function(key) {
    return this._syncStorageQueryTemplate_(key, this.syncStorage.get);
};

DB.prototype.syncGetItems = function(arrayOfKeys) {
    return this._syncStorageQueryTemplate_(arrayOfKeys, this.syncDB.get);
};

DB.prototype.syncGetAll = function() {
    return this._syncStorageQueryTemplate_(null, this.syncStorage.get);
};

/** syncSetItem
 * @dictionary Object - regular object with key value pairs
 * example - { 'foo': 'hello', 'bar': 'hi', 'one': 1 }
*/

DB.prototype.syncSetItem = function(dictionary) {
    return this._chromeStorageQueryTemplate_(dictionary, this.syncStorage.set);
};

DB.prototype.syncSetItems = function(dictionary) {
    return this.syncSetItem(dictionary);
};

StockDataAPI.prototype.addItem = function(item, name) {
    var toBeStored = {
        type: Array.isArray(item) ? 'Array' : typeof (item),
        value: item
    };
    toBeStored = JSON.stringify(toBeStored);
    window.localStorage.setItem(name, toBeStored);
};



StockDataAPI.prototype.removeStock = function(symbol) {
    var index = this.selectedStocks.indexOf(symbol);
    this.selectedStocks.splice(index);
    delete this.stockData[symbol];
    this.setItem(this.selectedStocks, this.selectedStocksKey);
};

StockDataAPI.prototype.addStock = function(symbol, stockData) {
    this.selectedStocks.push(symbol);
    this.addItem(this.selectedStocks, this.selectedStocksKey);
    this.stockData[symbol] = stockData || [];
};

StockDataAPI.prototype.removeItem = function(name) {
    window.localStorage.removeItem(name);
};

StockDataAPI.prototype.getItem = function(name) {
    var obj = window.localStorage.getItem(name);
    if (!obj) {
        return;
    }
    obj = JSON.parse(obj);
    const typeMatch = Array.isArray(obj.value) ? 'Array' : typeof (obj.value) === obj.type;
    if (!typeMatch) {
        console.warn(`Data loss: ${obj.value} does not match specified type ${obj.type}`);
    }
    return obj.value;
};

StockDataAPI.prototype.addItem = function(item, name) {
    var toBeStored = {
        type: Array.isArray(item) ? 'Array' : typeof (item),
        value: item
    };
    toBeStored = JSON.stringify(toBeStored);
    window.localStorage.setItem(name, toBeStored);
};

StockDataAPI.prototype.setItem = function(item, name) {
    StockDataAPI.addItem(item, name);
};
