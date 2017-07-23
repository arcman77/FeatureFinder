<template>
    <div id="manage-memory">
        Manage Memory
        <br>
        <br>
        <div id="sync-bytes-in-use">
            <span class="storage-area">
                Sync <span style="color: white;">:</span>
            </span>
            <span class="bytes-in-use">
                {{ formatedSyncBytesInUse }}
            </span>
             {{ syncBytesQuotaPercentage }} % 
            <button id="clear-sync-storage" @click="clearSyncCoinData">CLEAR COIN SYNC STORAGE</button>
        </div>
        <div id="local-bytes-in-use">
            <span class="storage-area">
                Local <span style="color: white;">:</span>
            </span>
            <span class="bytes-in-use">
                {{ formatedLocalBytesInUse }}
            </span>
             {{ localBytesQuotaPercentage }} %
            <button id="clear-local-storage" @click="clearLocalCoinData">CLEAR COIN LOCAL STORAGE</button>
        </div>
    </div>
</template>
<script type="text/javascript">

import CryptoCoinDataAPI from '../providers/cryptoCoinDataAPI';
import Utils from '../providers/utils';

const ManageMemory = {
    data() {
        return {
            coinDataStorageKey: '_coinData_',
            stockDataStorageKey: '_stockData_',
            userFilesStorageKey: '_userFiles_',
            syncBytesInUse: 0,
            localBytesInUse: 0,
            syncBytesQuota: CryptoCoinDataAPI.getStorageQuota('sync'),
            localBytesQuota: CryptoCoinDataAPI.getStorageQuota('local'),
            servedData: CryptoCoinDataAPI.servedData
        };
    },
    methods: {
        clearSyncCoinData() {
            const self = this;
            CryptoCoinDataAPI.clearSyncCoinData().then((/*success*/) => {
                self.$emit('clearSyncCoinData');
                self.$console.log('clear sync storage success');
                self.getSyncBytesInUse();
            });
        },
        clearLocalCoinData() {
            const self = this;
            CryptoCoinDataAPI.clearLocalCoinData().then((/*success*/) => {
                self.$emit('clearLocalCoinData');
                self.$console.log('clear local storage success');
                self.getLocalBytesInUse();
            });
        },
        getSyncBytesInUse() {
            const self = this;
            CryptoCoinDataAPI.getBytesInUse('sync').then((bytes) => {
                self.syncBytesInUse = bytes;
            });
        },
        getLocalBytesInUse() {
            const self = this;
            CryptoCoinDataAPI.getBytesInUse('local').then((bytes) => {
                self.localBytesInUse = bytes;
            });
        },
        updateBytesInUse() {
            this.syncBytesInUse = this.servedData.syncBytesInUse;
            this.localBytesInUse = this.servedData.localBytesInUse;
        }
    },
    computed: {
        syncBytesQuotaPercentage() {
            return ((this.syncBytesInUse / this.syncBytesQuota) * 100).toFixed(2);
        },
        localBytesQuotaPercentage() {
            return ((this.localBytesInUse / this.localBytesQuota) * 100).toFixed(2);
        },
        formatedSyncBytesInUse() {
            return Utils.formatBytes(this.syncBytesInUse, 2);
        },
        formatedLocalBytesInUse() {
            return Utils.formatBytes(this.localBytesInUse, 2);
        }
    },
    watch: {
        servedData: {
            handler() {
                this.updateBytesInUse();
            },
            deep: true,
            immediate: true
        }
    },
    created() {
        this.getSyncBytesInUse();
        this.getLocalBytesInUse();
    }
};

export default ManageMemory;

</script>
<style lang="scss">
    #manage-memory {
        color: white;
        background-color: #222222;
        padding: 10px;
        border-radius: 3px;
        line-height: 14px;
        font-size: 14px;
        font-weight: 200;
        margin-top: 15px;
        #local-bytes-in-use, #sync-bytes-in-use {
            justify-content: space-between;
            align-items: center;
            display: flex;
            .storage-area {
                color: orange;
                display: inline-block;
            }
            .bytes-in-use {
                margin-left: 10px;
                margin-right: 10px;
                padding-right: 50px;
                min-width: 50px;
                // display: inline-block;
                display: flex;
                text-align: right;
                // justify-content: flex-end;
            }
            #clear-sync-storage, #clear-local-storage {
                display: inline-block;
                display: flex;
                color: white;
                line-height: 12px;
                font-size: 12px;
                font-weight: 200;
                background-color: red;
                border: none;
                margin-top: 15px;
                margin-bottom: 15px;
                padding: 4px;
                border-radius: 3px;
                &:focus {
                    outline: none;
                }
                &:active {
                    background-color: #990033;
                }
            }
        }
    }


</style>