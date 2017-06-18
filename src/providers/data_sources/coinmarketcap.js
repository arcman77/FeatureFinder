class CoinMarketCap {
    constructor() {
        this.name = 'CoinMarketCap';
        this.baseUrl = 'https://coinmarketcap.com';
        this.actions = {

        };
    }
    getAction(actionName) {
        return this.actions[actionName];
    }
}

export default CoinMarketCap;
