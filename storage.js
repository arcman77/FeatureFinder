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

DB.prototype.syncGetItems = DB.prototype.syncGetItem;

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

DB.prototype.syncSetItems = DB.prototype.syncSetItem;

DB.prototype.syncRemoveItem = function(key) {
    return this._syncStorageQueryTemplate_(key, this.syncStorage.remove);
};

DB.prototype.syncRemoveItems = function(collection) {
    var toBeDeleted = [];
    if (!Array.isArray(collection) && typeof (collection) === 'object') {
        Object.keys(collection).forEach((key) => {
            toBeDeleted.push(key);
        });
    } else {
        toBeDeleted = collection;
    }

    return this._syncStorageQueryTemplate_(toBeDeleted, this.syncStorage.remove);
};

DB.prototype._localStorageQueryTemplate_ = DB.prototype._syncStorageQueryTemplate_;

DB.prototype.localGetItem = function(key) {
    return this._localStorageQueryTemplate_(key, this.localStorage.get);
};

DB.prototype.localGetItems = DB.prototype.localGetItem;

/** localSetItem
 * @dictionary Object - regular object with key value pairs
 * example - { 'foo': 'hello', 'bar': 'hi', 'one': 1 }
*/

DB.prototype.localSetItem = function(dictionary) {
    this._localStorageQueryTemplate_(dictionary, this.localStorage.set);
};

DB.prototype.localSetItems = DB.prototype.localSetItem;

DB.prototype.localRemoveItem = function(key) {
    return this._localStorageQueryTemplate_(key, this.localStorage.remove);
};

DB.prototype.localRemoveItems = function(collection) {
    var toBeDeleted = [];
    if (!Array.isArray(collection) && typeof (collection) === 'object') {
        Object.keys(collection).forEach((key) => {
            toBeDeleted.push(key);
        });
    } else {
        toBeDeleted = collection;
    }

    return this._localStorageQueryTemplate_(toBeDeleted, this.syncStorage.remove);
};

