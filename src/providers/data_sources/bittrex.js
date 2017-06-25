
class Bittrex {
    constructor() {
        this.name = 'bittrex';
        this.baseUrl = 'https://bittrex.com';
        this.apiPrefix = '/Api/v2.0/pub/market/GetTicks?';
        this.actions = {
            'set-market-name': '&marketName=',
            'set-tick-interval': '&tickInterval='
        };
        this.baseCurrency = 'BTC';
        this.markets = [
            'BTC-LTC ',
            'BTC-ETH ',
            'BTC-ETC ',
            'BTC-XRP ',
            'BTC-ANS ',
            'BTC-SC ',
            'BTC-KMD ',
            'BTC-QRL ',
            'BTC-STR ',
            'BTC-XEM ',
            'BTC-DAS ',
            'BTC-GNT ',
            'BTC-BAT ',
            'BTC-VOX ',
            'BTC-DGB ',
            'BTC-LSK ',
            'BTC-ZEC ',
            'BTC-NXT ',
            'BTC-XVG ',
            'BTC-DCR ',

            'ETH-ETC ',
            'ETH-BAT ',
            'ETH-GNT ',
            'ETH-CRB ',
            'ETH-QRL ',
            'ETH-ANT ',
            'ETH-SNG ',
            'ETH-TKN ',
            'ETH-HMQ ',
            'ETH-RLC ',
            'ETH-REP ',
            'ETH-TRS ',
            'ETH-GUP ',
            'ETH-WIN ',
            'ETH-1ST ',
            'ETH-LGD ',
            'ETH-LUN ',
            'ETH-DGD ',
            'ETH-GNO ',
            'ETH-MGO ',

            'USDT-BTC',
            'USDT-ETH',
            'BITCNY-BTC',
        ];
    }
    //todo get current ETH BTC prices for conversion
    getAction(actionName) {
        return this.actions[actionName];
    }

    getUrl() {
        return `${this.baseUrl}${this.apiPrefix}_=${Number(new Date())}`;
    }

    setMarket(baseCurrency, coinSymbol) {
        var market = `${baseCurrency}-${coinSymbol}`;
        var marketParam = `${this.action['set-market-name']}${market}`;
        return `${this.getUrl()}${marketParam}`;
    }

    getTicks(coinSymbol, interval) {
        //https://bittrex.com/Api/v2.0/pub/market/GetTicks?marketName=BTC-ETH&tickInterval=oneMin&_=1496809444398
        return `${this.setMarket(this.baseCurrency, coinSymbol)}${this.getAction['set-tick-interval']}${interval}`;
    }
}

export default Bittrex;
