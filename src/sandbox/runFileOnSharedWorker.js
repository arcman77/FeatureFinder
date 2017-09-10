import AlgoUtils from './algoUtils';

//eslint-disable-next-line no-unused-vars
class SharedWorkerMessageInterface {
    constructor() {
        this.file = null;
        this.priceData = null;
        this.role = 'slave';
        //slaves and slaveJobs are one to one
        this.slaveJobs = {};
        this.slaves = {};
        this.slavesCount = 0;
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
    setRole(event) {
        this.role = event.data.role;
        event.source.postMessage({
            success: true
        }, event.origin);
    }
    //command: 'setFile'
    /*{ command: 'setFile', fileInfo: String }*/
    setFile(event) {
        this.file = event.data.file;
        event.source.postMessage({
            success: true
        }, event.origin);
    }
    //command: 'setData'
    /**
     * @param {priceData} Array
     * @param {source} String - Indicates what utility mapping function is necesarry
     *                          to convert data into the highcharts format
    */
    setData(event) {
        this.priceData = event.data.priceData;
        event.source.postMessage({
            success: true
        }, event.origin);
    }
    //command: 'getSignals'
    /**
     * @param {options} Object
    */
    getSignals(event) {
        const ops = event.data.options;
        const signals = this.runFile(this.file, this.priceData, ops);
        event.source.postMessage({
            signals: signals
        }, event.origin);
    }
    slaveFinish(event) {
        const id = event.data.id;
        const results = event.data.results;
        //resolves the promise
        this.slaveJobs[id](results);
        delete this.slaveJobs[id];
        this.destroySharedWorker(this.slaves[id]);
        this.slavesCount --;
    }
    runFile(fileStr, ops) {
        const self = this;
        //eslint-disable-next-line no-unused-vars
        window.utils = new AlgoUtils(ops.startCash || 5000);
        //eslint-disable-next-line no-eval
        window.eval(fileStr); // user defines getSignals
        //eslint-disable-next-line no-undef
        return window.getSignals(self.priceData, ops);
    }
    optimizer(fileStr, symbol, opsRanges) {
        const self = this;
        const paramKeys = Object.keys(opsRanges);
        let minP;
        let maxP;
        let varyParam;
        let delta;
        let ops;
        // if coupled:
        //
        // if uncoupled:
        paramKeys.forEach((param) => {
            if (Array.isArray(opsRanges[param])) {
                const range = opsRanges[param];
                ops = {};
                range.forEach((value) => {
                    ops[param] = value;
                    self.runFile(fileStr, symbol, ops);
                });
            } else {
                minP = opsRanges[param].rangeStart;
                maxP = opsRanges[param].rangeEnd;
                delta = opsRanges[param].delta || 1;
                for (varyParam = minP; varyParam <= maxP; varyParam += delta) {
                    ops = {};
                    ops[param] = varyParam;
                    self.runFile(fileStr, symbol, ops);
                }
            }
        });
    }
    static startSlave(fileStr, symbol, options) {
        const slave = this.constructor.createSharedWorker();
        function setWorkerFile(file) {
            slave.postMessage({
                command: 'setFile',
                file: file
            });
        }
        function setWorkerData(priceData) {
            slave.postMessage({
                command: 'setData',
                priceData: priceData
            });
        }
        function setWorkerRole(role) {
            slave.postMessage({
                command: 'setRole',
                role: role,
            });
        }
        function getWorkerSignals(optionss, id) {
            slave.postMessage({
                command: 'getSignals',
                options: optionss,
                id: id
            });
        }
        const id = Math.random();
        setWorkerFile(fileStr);
        setWorkerData(this.priceData[symbol]);
        setWorkerRole('slave', id);
        getWorkerSignals(options);
        const self = this;
        const p = new Promise((resolve) => {
            self.slaveJobs[id] = resolve;
        });
        this.slaves[id] = slave;
        this.slavesCount ++;
        return p;
    }
    static createSharedWorker() {
        //var myWorker = new SharedWorker(aURL, options);
        return new SharedWorker('runFileOnSharedWorker.js');
    }
    static destroySharedWorker(sharedWorker) {
        sharedWorker.terminate();
    }
}

new SharedWorkerMessageInterface();

