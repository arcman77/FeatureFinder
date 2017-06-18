class CryptoCompare {
    constructor() {
        this.name = 'cryptocompare';
        this.baseUrl = 'https://www.cryptocompare.com';
        this.actions = {

        };
    }
    getAction(actionName) {
        return this.actions[actionName];
    }
}

export default CryptoCompare;
