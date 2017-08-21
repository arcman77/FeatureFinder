//1. save uploaded files to sync storage as string
//2. send fileStr to iframe for consumption
import sha256 from 'sha256';
import DB from './storage';

/* eslint-disable no-underscore-dangle */
class UserFilesAPI {
    constructor(db) {
        const self = this;
        this.DB = db;
        this.storageKey = '_userFiles_';
        this.jsFilesKey = 'jsFiles';
        this.$console = chrome.extension.getBackgroundPage().console;
        this.servedData = {
            jsFiles: {}
        };
        this.DB.syncGetItem(this.storageKey).then((storageObject) => {
            self.setFilesStorageData('sync', storageObject);
        });
        window.userFilesAPI = this;
    }
    setFilesStorageData(area, storageObject, isUpdateEvent) {
        if (area !== 'sync' && area !== 'local') {
            this.$console.error(`Calling setFilesStorageData with invalid storage area: "${area}"`);
            return null;
        }
        const propertyName = `${area}FileData`;
        if (isUpdateEvent) {
            let key;
            //eslint-disable-next-line no-restricted-syntax
            for (key in storageObject) {
                this[propertyName][key] = storageObject[key];
                this.servedData[key] = storageObject[key];
            }
        } else {
            // really should only be run once
            this[propertyName] = storageObject || {};
            // unwrap
            this[propertyName] = this[propertyName][this.storageKey] || {};
            //eslint-disable-next-line max-len
            this[propertyName][this.jsFilesKey] = this[propertyName][this.jsFilesKey] || {};
            this.servedData[this.jsFilesKey] = this[propertyName][this.jsFilesKey];
        }
    }
    watchSyncStorage() {
        const selff = this;
        chrome.storage.onChanged.addListener((changes, area) => {
            if ((area == 'sync' || area === 'local') && selff.storageKey in changes) {
                selff.setCoinStorageData(area, changes[selff.storageKey].newValue, true);
            }
        });
    }
    syncSaveFileData() {
        const dict = {};
        dict[this.storageKey] = this.syncFileData;
        return this.DB.syncSetItem(dict);
    }
    localSaveFileData() {
        const dict = {};
        dict[this.storageKey] = this.localFileData;
        return this.DB.localSetItem(dict);
    }
    clearFileLocalData() {
        const dict = {};
        dict[this.storageKey] = {};
        dict[this.storageKey][this.jsFilesKey] = {};
        return this.DB.localSetItem(dict);
    }
    clearFileSyncData() {
        const dict = {};
        dict[this.storageKey] = {};
        dict[this.storageKey][this.jsFilesKey] = {};
        return this.DB.syncSetItem(dict);
    }
    addUserFile(fileObj, area) {
        const fileKey = sha256(fileObj.fileStr);
        this[`${area}FileData`][this.jsFilesKey][fileKey] = fileObj;
        return this[`${area}SaveFileData`]();
    }
}

export default new UserFilesAPI(new DB());
