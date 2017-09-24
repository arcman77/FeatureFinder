import _ from 'lodash';
import Utils from '../providers/utils';
import AlgoUtils from './algoUtils';

/* Highcharts/Stockcharts graph data format
 * Array
 *     @index {0} - time - Integer
 *     @index {1} - price - Float
*/

class MessageInterface {
    constructor() {
        this.files = {};
        this.userFunctions = {};
        this.priceData = {};
        this.jobs = {};
        this.jobsCount = 0;
        this.pendingRequests = {};
        this.listenForCommands();
    }
    listenForCommands() {
        const self = this;
        window.addEventListener('message', (event) => {
            const command = event.data.command;
            self[command](event);
        });
    }
    //command: 'setFile'
    /*{ command: 'setFile', fileInfo: Object }*/
    setFile(event) {
        this.addFile(event.data.fileInfo);
        event.source.postMessage({
            success: true
        }, event.origin);
    }
    //command: 'setData'
    /**
     * @param {priceData} Object -
     *     @key {coinSymbol} Array
     *         @key {}
     *         @key {}
     * @param {source} String - Indicates what utility mapping function is necesarry
     *                          to convert data into the highcharts format
    */
    setData(event) {
        const self = this;
        const source = event.data.source;
        _.each(event.data.priceData, (priceData, symbol) => {
            // self.priceData[symbol] = Utils.highstockF ormatter(source, priceData);
            self.priceData[symbol] = Utils.sbaFormatter(source, priceData);
        });
        event.source.postMessage({
            success: true
        }, event.origin);
    }
    //command: 'getSignals'
    /**
     * @param {hashKey} String
     * @param {filename} String
     * @param {symbol} String - Coin or stock symbol in indicating which
     *                          key to use from price data dictionary
    */
    getSignals(event) {
        const fileKey = event.data.hashKey || event.data.filename;
        const symbol = event.data.symbol;
        const options = event.data.options;
        const file = this.getFile(fileKey);
        const signals = this.runFile(file.fileStr, symbol, options);
        event.source.postMessage({
            signals: signals
        }, event.origin);
    }
    jobFinish(event) {
        const id = event.data.id;
        const results = event.data.results;
        //resolves the promise
        this.jobs[id](results);
        delete this.jobs[id];
        this.jobsCount --;
        console.log('optimization results from iframe: ')
        console.log(results)
    }
    /**
     * @param {fileInfo} Object -
     *    @key {name} String
     *    @key {hashKey} String
     *    @key {fileStr} String
    */
    addFile(fileInfo) {
        this.files[fileInfo.hashKey] = {
            name: fileInfo.name,
            fileStr: fileInfo.fileStr
        };
    }
    runFile(fileStr, symbol, ops = {}) {
        const self = this;
        //eslint-disable-next-line no-unused-vars
        window.utils = new AlgoUtils(ops.startCash || 5000);
        //eslint-disable-next-line no-eval
        window.eval(fileStr); // user defines getSignals
        //eslint-disable-next-line no-undef
        return window.getSignals(self.priceData[symbol], ops);
    }
    getFile(uniqStr) {
        if (!uniqStr) {
            return null;
        }
        //uniqStr is hashKey
        let fileFound = this.files[uniqStr] || null;
        //uniqStr is a filename
        if (!fileFound) {
            _.each(this.files, (file) => {
                if (file.name === uniqStr) {
                    fileFound = file;
                    return false;
                }
            });
        }
        return fileFound;
    }
    optimize(event) {
        const fileKey = event.data.hashKey || event.data.filename;
        const symbol = event.data.symbol;
        const options = event.data.options;
        const file = this.getFile(fileKey).fileStr;
        this.startJob(file, symbol, options).then((results) => {
            event.source.postMessage({
                results: results
            }, event.origin);
        });
    }
    startJob(fileStr, symbol, options) {
        const jobManager = this.constructor.createSharedWorker();

        function setWorkerFile(file) {
            jobManager.postMessage({
                command: 'setFile',
                file: file
            });
        }
        function setWorkerData(priceData) {
            jobManager.postMessage({
                command: 'setData',
                priceData: priceData
            });
        }
        function setWorkerRole(role) {
            jobManager.postMessage({
                command: 'setRole',
                role: role,
            });
        }
        function getWorkerSignals(_options, id) {
            jobManager.postMessage({
                command: 'optimize',
                options: _options,
                id: id
            });
        }
        const id = Math.random();
        setWorkerFile(fileStr);
        setWorkerData(this.priceData[symbol]);
        setWorkerRole('manager', id);
        getWorkerSignals(options);
        const self = this;
        const p = new Promise((resolve) => {
            self.jobs[id] = resolve;
        });
        this.jobsCount ++;
        return p;
    }
    static createSharedWorker() {
        //var myWorker = new SharedWorker(aURL, options);
        // return new SharedWorker('workerBundle.js');
        return new Worker('workerBundle.js');
    }
    static destroySharedWorker(sharedWorker) {
        sharedWorker.terminate();
    }
}

export default new MessageInterface();
