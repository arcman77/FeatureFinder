import _ from 'lodash';
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
    setFile(event) {
        this.addFile(event.data.fileInfo);
        event.source.postMessage({
            success: true
        }, event.origin);
    }
    //command: 'setData'
    /* @param {priceData} Object -
     *     @key {coinSymbol} Array
     *         @key {}
     *         @key {}
    */
    setData(event) {
        const self = this;
        // const source = event.data.source;
        _.each(event.data.priceData, (priceData, symbol) => {
            self.priceData[symbol] = priceData;
        });
        event.source.postMessage({
            success: true
        }, event.origin);
    }
    //command: 'getSignals'
    getSignals(event) {
        const fileKey = event.data.hashKey || event.data.filename;
        const file = this.getFile(fileKey);
        const signals = this.runFile(file.fileStr);
        event.source.postMessage({
            signals: signals
        }, event.origin);
    }
    /* @param {fileInfo} Object -
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
    runFile(fileStr, symbol) {
        //eslint-disable-next-line no-eval
        eval(fileStr); // user defines getSignals
        //eslint-disable-next-line no-undef
        return getSignals(this.priceData[symbol]);
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
    // bittrexToHighcharts(array) {
    //     const formatted = array;
    //     return formatted;
    // }
}

export default new MessageInterface();
