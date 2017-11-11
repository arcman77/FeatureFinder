import AlgoUtils from '../sandbox/algoUtils';

//eslint-disable-next-line no-unused-vars
const WorkerMessageInterface = {
    file: null,
    priceData: null,
    role: 'worker',
    //slaves and slaveJobs are one to one
    id: null,
    workerJobs: {},
    workers: {},
    workersCount: 0,
    pendingRequests: {},
    setRole(event) {
        WorkerMessageInterface.role = event.data.role;
        WorkerMessageInterface.id = event.data.id;
        self.postMessage({
            success: true,
            commandGiven: event.data.command
        });
    },
    //command: 'setFile'
    /*{ command: 'setFile', fileInfo: String }*/
    setFile(event) {
        WorkerMessageInterface.file = event.data.file;
        self.postMessage({
            success: true,
            commandGiven: event.data.command
        });
    },
    //command: 'setData'
    /**
     * @param {priceData} Array
     * @param {source} String - Indicates what utility mapping  is necesarry
     *                          to convert data into the highcharts format
    */
    setDataBuffers(event) {
        const data = event.data;
        const timeArray = new Int32Array(data.timeBuffer);
        // const timeBuffer = new Int32Array(data.timeBuffer, data.offset, data.size);
        const priceArray = new Float32Array(data.priceBuffer);
        // const priceBuffer = new Float32Array(data.priceBuffer, data.offset, data.size);
        WorkerMessageInterface.priceData = [timeArray, priceArray, data.size];
        self.postMessage({
            command: 'resolveBuffersSet',
            id: WorkerMessageInterface.id
        });
    },
    //command: 'getSignals'
    /**
     * @param {options} Object
    */
    getSignals(event) {
        const ops = event.data.options;
        //DEBUG
        self.postMessage({
            command: 'recievedData',
            data: WorkerMessageInterface.priceData
        });
        const id = WorkerMessageInterface.id;
        const signals = WorkerMessageInterface.runFile(WorkerMessageInterface.file, ops);
        if (WorkerMessageInterface.role === 'worker') {
            const lastVal = signals.netWorth.pop();
            signals.netWorth = [lastVal, ops];
            self.postMessage({
                results: signals,
                command: 'workerFinish',
                id: id
            });
        }
    },
    runFile(fileStr, ops) {
        // const self = this;
        //eslint-disable-next-line no-unused-vars
        self.utils = new AlgoUtils(ops.startCash || 5000);
        //eslint-disable-next-line no-eval
        self.eval(fileStr); // user defines getSignals
        // return self.getSignals(this.priceData, ops);
        //eslint-disable-next-line no-undef
        return getSignals(this.priceData, ops);
    },
    listenForCommands() {
        self.onmessage = (event) => {
            const command = event.data.command;
            WorkerMessageInterface[command](event);
            self.postMessage({
                worker: true,
                commandGiven: command,
                status: 'recieved',
            });
        };
    }
};
try {
    //eslint-disable-next-line no-undef
    if (DedicatedWorkerGlobalScope) {
        WorkerMessageInterface.listenForCommands();
    }
} catch (err) { /**/ }
