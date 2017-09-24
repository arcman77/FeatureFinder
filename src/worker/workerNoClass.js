import AlgoUtils from '../sandbox/algoUtils';

//eslint-disable-next-line no-unused-vars
const WorkerMessageInterface = {
    file: null,
    priceData: null,
    role: 'slave',
    //slaves and slaveJobs are one to one
    slaveJobs: {},
    slaves: {},
    slavesCount: 0,
    pendingRequests: {},
    setRole(event) {
        WorkerMessageInterface.role = event.data.role;
        self.postMessage({
            success: true
        });
    },
    //command: 'setFile'
    /*{ command: 'setFile', fileInfo: String }*/
    setFile(event) {
        WorkerMessageInterface.file = event.data.file;
        self.postMessage({
            success: true
        });
    },
    //command: 'setData'
    /**
     * @param {priceData} Array
     * @param {source} String - Indicates what utility mapping  is necesarry
     *                          to convert data into the highcharts format
    */
    setData(event) {
        WorkerMessageInterface.priceData = event.data.priceData;
        self.postMessage({
            success: true
        });
    },
    //command: 'getSignals'
    /**
     * @param {options} Object
    */
    getSignals(event) {
        const ops = event.data.options;
        const id = event.data.id;
        self.postMessage({
            command: 'getSignals',
            status: 'recieved',
            id: id
        });
        const signals = this.runFile(this.file, this.priceData, ops);
        console.log('from worker, getSignals', signals)
        if (WorkerMessageInterface.role === 'slave') {
            signals.netWorth = [signals.netWorth[signals.netWorth.length - 1]];
            self.postMessage({
                results: signals,
                command: 'slaveFinish',
                id: id
            });
        }
    },
    slaveFinish(event) {
        const id = event.data.id;
        const results = event.data.results;
        //resolves the promise
        WorkerMessageInterface.slaveJobs[id](results);
        delete WorkerMessageInterface.slaveJobs[id];
        WorkerMessageInterface.destroySharedWorker(WorkerMessageInterface.slaves[id]);
        WorkerMessageInterface.slavesCount --;
    },
    runFile(fileStr, ops) {
        // const self = this;
        //eslint-disable-next-line no-unused-vars
        self.utils = new AlgoUtils(ops.startCash || 5000);
        //eslint-disable-next-line no-eval
        self.eval(fileStr); // user defines getSignals
        //eslint-disable-next-line no-undef
        return self.getSignals(this.priceData, ops);
    },
    optimize(event) {
        if (WorkerMessageInterface.role === 'slave') {
            return;
        }
        const thiss = this;
        const id = event.data.id;
        const opsRanges = event.data.options.optimize;
        const fixedOptions = event.data.options;
        delete fixedOptions.optimize;
        const file = WorkerMessageInterface.file;
        const paramKeys = Object.keys(opsRanges);
        let minP;
        let maxP;
        let varyParam;
        let delta;
        let options;
        const slavePromises = [];
        // if coupled:
        //
        // if uncoupled:
        paramKeys.forEach((param) => {
            if (Array.isArray(opsRanges[param])) {
                const range = opsRanges[param];
                options = Object.assign({}, fixedOptions);
                range.forEach((value) => {
                    options[param] = value;
                    slavePromises.push(thiss.startSlave(file, options));
                });
            } else {
                minP = opsRanges[param].rangeStart;
                maxP = opsRanges[param].rangeEnd;
                delta = opsRanges[param].delta || 1;

                for (varyParam = minP; varyParam <= maxP; varyParam += delta) {
                    options = {};
                    options[param] = varyParam;
                    slavePromises.push(thiss.startSlave(file, options));
                }
            }
        });
        return Promise.all(slavePromises).then((results) => {
            self.postMessage({
                command: 'jobFinish',
                results: results,
                id: id
            });
        }).catch((err) => {
            console.log('shit went wrong: ', err);
        });
    },
    startSlave(fileStr, options) {
        const slave = WorkerMessageInterface.createSharedWorker();
        function setWorkerFile(file) {
            slave.postMessage({
                command: 'setFile',
                file: file
            });
        }
        function setWorkerData(priceData) {
            // slave.postMessage(sab);
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
        setWorkerData(WorkerMessageInterface.priceData);
        setWorkerRole('slave', id);
        getWorkerSignals(options);
        const p = new Promise((resolve) => {
            WorkerMessageInterface.slaveJobs[id] = resolve;
        });
        WorkerMessageInterface.slaves[id] = slave;
        WorkerMessageInterface.slavesCount ++;
        return p;
    },
    createSharedWorker() {
        //var myWorker = new SharedWorker(aURL, options);
        // return new SharedWorker('workerBundle.js');
        return new Worker('workerBundle.js');
    },
    destroySharedWorker(sharedWorker) {
        sharedWorker.terminate();
    },
    listenForCommands() {
        self.addEventListener('message', (event) => {
            console.log('from worker:')
            console.log(event)
            const command = event.data.command;
            WorkerMessageInterface[command](event);
        });
    }
};

WorkerMessageInterface.listenForCommands();
