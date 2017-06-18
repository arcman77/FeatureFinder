
class Bittrex {
    constructor() {
        this.name = 'bittrex';
        this.baseUrl = 'https://bittrex.com';
        this.apiPrefix = '/Api/v2.0/pub/market/GetTicks?';
        this.actions = {
            'set-market-name': '&marketName=',
            'set-tick-interval': '&tickInterval='
        };
    }

    getAction(actionName) {
        return this.actions[actionName];
    }

    getUrl() {
        return `${this.baseUrl}${this.apiPrefix}_=${Number(new Date())}`;
    }

    setMarket(base, coinSymbol) {
        var market = `${base}-${coinSymbol}`;
        var marketParam = `${this.action['set-market-name']}${market}`;
        return `${this.getUrl()}${marketParam}`;
    }

    // getTicks(coinSymbol) {
    //     //var
    // }
}

export default Bittrex;
