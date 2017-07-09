/** chrome storage
 * All queries return promises
 * All insertions return promises unless otherwise stated
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
    this.$console = chrome.extension.getBackgroundPage().console;
    this.syncStorage.get(['_userFiles_'], (userFiles) => {
        self.userFiles = userFiles || {};
    });
}

DB.prototype._syncStorageQueryTemplate_ = function(args, asyncFunc) {
    const self = this;
    return new Promise((resolve, reject) => {
        try {
            asyncFunc(args, (results) => {
                // self.$console.log('in asyncFunc callback')
                // self.$console.log('args: \n', args)
                // self.$console.log('asyncFunc: \n', asyncFunc)
                // self.$console.log('results: \n', results)
                resolve(results);
            });
        } catch (err) {
            reject(err);
        }
    });
};

DB.prototype.syncGetItem = function(key) {
    this.$console.log('get')
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
    this.$console.log('set')
    return this._syncStorageQueryTemplate_(dictionary, this.syncStorage.set);
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

DB.prototype.getBytesInUse = function(area) {
    if (area !== 'local' && area !== 'sync') {
        console.error(`getBytesInUse called with invalid area: "${area}"`);
        return null;
    }
    const templateName = `_${area}StorageQueryTemplate_`;
    const template = this[templateName];
    return template(null, this.storage[area].getBytesInUse);
};

// non-promise return value, return value is integer
DB.prototype.getStorageQuota = function(area) {
    return this.storage[area].QUOTA_BYTES;
};

export default DB;

