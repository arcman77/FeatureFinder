class AlgoAPI {
    constructor() {
        this.iframe = document.getElementById('run-algo');
        if (!this.iframe) {
            console.error('Failed to load iframe');
        }
        this.commands = {
            setFile: true,
            setData: true,
            getSignals: true
        };
        this.constructor.listen();
    }
    /*
     * @param {message} Object
            @key {command} String
            optional @key {priceData}
            optional @key {fileInfo}
    */
    sendMessage(message) {
        if (!this.iframe) {
            this.iframe = document.getElementById('run-algo');
        }
        this.iframe.contentWindow.postMessage(message, '*');
    }
    static listen() {
        window.addEventListener('message', (event) => {
            console.log(event);
        });
    }

}

export default new AlgoAPI();

