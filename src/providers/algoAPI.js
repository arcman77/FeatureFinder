class RunAlgoAPI {
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
        this.listen();
    }
    /*
     * @param {message} Object
            @key {command} String
            optional @key {priceData}
            optional @key {fileInfo}
    */
    sendMessage(message) {
        this.iframe.contentWindow.postMessage(message, '*');
    }
    static listen() {
        // const self = this;
        window.addEventListener('message', (event) => {
            console.log(event);
        });
    }

}

export default new RunAlgoAPI();

