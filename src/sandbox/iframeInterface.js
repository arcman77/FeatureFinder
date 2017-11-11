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
        this.workers = {};
        this.workersCount = 0;
        this.workerJobs = [];
        this.pendingRequests = {};
        this.listenForCommands();
        this.origin = null;
        this.source = null;
        this.workerSetBufferPromises = {};
    }
    listenForCommands() {
        const self = this;
        window.addEventListener('message', (event) => {
            const command = event.data.command;
            if (command.includes('set') && !self.source) {
                self.origin = event.origin;
                self.source = event.source;
            }
            self[command](event);
        });
    }
    //command: 'setFile'
    /*{ command: 'setFile', fileInfo: Object }*/
    setFile(event) {
        this.addFile(event.data.fileInfo);
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
        _.each(event.data.priceData, (coinPriceData, symbol) => {
            // self.priceData[symbol] = Utils.bittrexToHighstock(source, priceData[symbol]);
            self.priceData[symbol] = Utils.highstocksFormatter(source, coinPriceData);
        });
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
            command: 'singleRunSignals',
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
        console.log('optimization results from iframe: ');
        console.log(results);
    }
    workerFinish(event) {
        const id = event.data.id;
        const results = event.data.results;
        //resolves the promise
        this.workerJobs[id](results);
        delete this.workerJobs[id];
        this.destroyWorker(id);
        this.workersCount --;
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
        const data = self.priceData[symbol];

        return window.getSignals([data.timeData, data.priceData, data.length], ops);
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
    //eslint-disable-next-line
    setWorkerRole(role, id, worker) {
        worker.postMessage({
            command: 'setRole',
            role: role,
            id: id
        });
    }
    resolveBuffersSet(event) {
        //resolves worker promise
        this.workerSetBufferPromises[event.data.id]();
    }
    setWorkerDataBuffers(worker, tBuffer, pBuffer, size) {
        const self = this;
        worker.postMessage({
            command: 'setDataBuffers',
            timeBuffer: tBuffer,
            priceBuffer: pBuffer,
            size: size
        });
        return new Promise((resolve) => {
            self.workerSetBufferPromises[worker.id] = resolve;
        });
    }
    optimize(event) {
        const thiss = this;
        const id = event.data.id;
        const opsRanges = event.data.options.optimize;
        const fixedOptions = event.data.options;
        const fileKey = event.data.hashKey || event.data.filename;
        const symbol = event.data.symbol;
        const priceData = this.priceData[symbol];
        delete fixedOptions.optimize;
        const file = this.getFile(fileKey).fileStr;
        const paramKeys = Object.keys(opsRanges);
        let minP;
        let maxP;
        let varyParam;
        let delta;
        let options;
        let workerPromises = [];
        const pBuffer = new SharedArrayBuffer(priceData.length * priceData.offset);
        const tBuffer = new SharedArrayBuffer(priceData.length * priceData.offset);
        // window.pBuffer = pBuffer
        // window.tBuffer = tBuffer
        // if coupled:
        //
        // if uncoupled:
        paramKeys.forEach((param) => {
            let count; //number of workers needed
            if (Array.isArray(opsRanges[param])) {
                count = opsRanges[param].length;
            } else {
                minP = opsRanges[param].rangeStart;
                maxP = opsRanges[param].rangeEnd;
                delta = opsRanges[param].delta || 1;
                count = Math.ceil((maxP - minP) / delta);
            }
            let worker;
            const updated = Utils.copyIntoSharedArray(tBuffer, pBuffer, priceData);
            for (let i = 0; i < count; i++) {
                worker = thiss.createWorker();
                workerPromises.push(thiss.setWorkerDataBuffers(worker,
                    updated.tBuffer,
                    updated.pBuffer,
                    priceData.length));
            }
            workerPromises = [];
            let counter = 0;
            if (Array.isArray(opsRanges[param])) {
                const range = opsRanges[param];
                options = Object.assign({}, fixedOptions);
                range.forEach((value) => {
                    worker = thiss.workers[counter];
                    options[param] = value;
                    workerPromises.push(thiss.startWorker(file, options, worker));
                    counter++;
                });
            } else {
                for (varyParam = minP; varyParam <= maxP; varyParam += delta) {
                    worker = thiss.workers[counter];
                    options = {};
                    options[param] = varyParam;
                    workerPromises.push(thiss.startWorker(file, options, worker));
                    counter++;
                }
            }
        });
        return Promise.all(workerPromises).then((results) => {
            console.log(results);
            event.source.postMessage({
                command: 'jobFinish',
                results: results,
                id: id
            }, event.origin);
        }).catch((err) => {
            console.log('shit went wrong: ', err);
        });
    }

    startWorker(fileStr, options, worker) {
        function setWorkerFile(file) {
            worker.postMessage({
                command: 'setFile',
                file: file
            });
        }

        function getWorkerSignals(_options) {
            worker.postMessage({
                command: 'getSignals',
                options: _options,
            });
        }
        setWorkerFile(fileStr);
        const p = new Promise((resolve) => {
            this.workerJobs[worker.id] = resolve;
        });
        getWorkerSignals(options);
        return p;
    }
    createWorker() {
        const id = this.workersCount;
        const w = new Worker('workerBundle.js');
        w.id = id;
        this.setWorkerRole('worker', id, w);
        this.workersCount ++;
        this.workers[id] = w;
        const selff = this;
        w.onmessage = (event) => {
            const command = event.data.command;
            // if (command === 'workerFinish') {
            //     console.log('event recieved from worker: ', event);
            // }
            // if (command && command.includes('recieved')) {
            //     console.log('worker has data: ', event.data);
            //     return;
            // }
            if (!command) {
                return;
            }
            selff[command](event);
        };
        return w;
    }
    destroyWorker(id) {
        this.workers[id].terminate();
    }
}

export default new MessageInterface();
