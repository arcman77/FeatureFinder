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
            self.priceData[symbol] = Utils.highstockFormatter(source, priceData);
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
        const ops = event.data.options;
        const file = this.getFile(fileKey);
        const signals = this.runFile(file.fileStr, symbol, ops);
        event.source.postMessage({
            signals: signals
        }, event.origin);
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
    optimizer(fileStr, symbol, opsRanges) {
        const self = this;
        const paramKeys = Object.keys(opsRanges);
        let minP;
        let maxP;
        let varyParam;
        let delta;
        let ops;
        // if coupled
        // if uncoupled
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
    runFile(fileStr, symbol, ops) {
        const self = this;
        //eslint-disable-next-line no-unused-vars
        window.utils = new AlgoUtils(5000);
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
}

export default new MessageInterface();
