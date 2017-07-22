
class Bittrex {
    constructor() {
        this.name = 'bittrex';
        this.baseUrl = 'https://bittrex.com';
        this.apiPrefix = '/Api/v2.0/pub/market/GetTicks?';
        // https://bittrex.com/Api/v2.0/pub/market/GetTicks?marketName=BTC-ETH&tickInterval=thirtyMin&_=1496809444398
        // https://bittrex.com/Api/v2.0/pub/market/GetTicks?marketName=BTC-ETH&tickInterval=oneMin&_=1496809444398
        this.$console = chrome.extension.getBackgroundPage().console;
        this.actions = {
            'set-market-name': '&marketName=',
            'set-tick-interval': '&tickInterval='
        };
        this.ticks = {
            1: 'oneMin',
            30: 'thirtyMin',
            60: 'sixtyMin'
        };
        this.baseCurrency = 'BTC';
        this.markets = {
            //BITCOIN MARKET
            BTC: {
                'LTC': true,
                'ETH': true,
                'ETC': true,
                'XRP': true,
                'ANS': true,
                'SC': true,
                'KMD': true,
                'QRL': true,
                'STR': true,
                'XEM': true,
                'DAS': true,
                'GNT': true,
                'BAT': true,
                'VOX': true,
                'DGB': true,
                'LSK': true,
                'ZEC': true,
                'NXT': true,
                'XVG': true,
                'DCR': true,
            },
            //ETHEREUM MARKET
            ETC: {
                'ETC': true,
                'BAT': true,
                'GNT': true,
                'CRB': true,
                'QRL': true,
                'ANT': true,
                'SNG': true,
                'TKN': true,
                'HMQ': true,
                'RLC': true,
                'REP': true,
                'TRS': true,
                'GUP': true,
                'WIN': true,
                '1ST': true,
                'LGD': true,
                'LUN': true,
                'DGD': true,
                'GNO': true,
                'MGO': true,
            },
            // US DOLLAR MARKET
            USDT: {
                'BTC': true,
                'ETH': true
            },
            BITCNY: {
                'BTC': true
            }
        };
    }
    //todo get current ETH BTC prices for conversion
    getAction(actionName) {
        return this.actions[actionName];
    }

    getTicks(numberMin) {
        return this.ticks[numberMin];
    }

    getApiUrl() {
        return `${this.baseUrl}${this.apiPrefix}_=${Number(new Date())}`;
    }

    setMarket(baseCurrency, coinSymbol) {
        var market = `${baseCurrency}-${coinSymbol}`;
        var marketParam = `${this.actions['set-market-name']}${market}`;
        return `${this.getApiUrl()}${marketParam}`;
    }

    setTicks(coinSymbol, interval) {
        //https://bittrex.com/Api/v2.0/pub/market/GetTicks?marketName=BTC-ETH&tickInterval=oneMin&_=1496809444398
        return `${this.setMarket(this.baseCurrency, coinSymbol)}${this.getAction['set-tick-interval']}${interval}`;
    }

    getMinuteTicksUrl(coinSymbol, tickInterval) {
        return this.setTicks(coinSymbol, this.getTicks(tickInterval));
    }

    get1MinuteTicksUrl(coinSymbol) {
        return this.setTicks(coinSymbol, this.getTicks(1));
    }

    get30MinuteTicksUrl(coinSymbol) {
        return this.setTicks(coinSymbol, this.getTicks(30));
    }

    get60MinuteTicksUrl(coinSymbol) {
        return this.setTicks(coinSymbol, this.getTicks(60));
    }

    getMinuteTicksData(coinSymbol, tickInterval) {
        this.$console.log('inside get minute tick data')
        return $.ajax({
            url: this.getMinuteTicksUrl(coinSymbol, tickInterval),
            method: 'GET'
        });
    }

    get1MinuteTicksData(coinSymbol) {
        return $.ajax({
            url: this.get1MinuteTicksUrl(coinSymbol),
            method: 'GET'
        });
    }

    get30MinuteTicksData(coinSymbol) {
        return $.ajax({
            url: this.get30MinuteTicksUrl(coinSymbol),
            method: 'GET'
        });
    }

    get60MinuteTicksData(coinSymbol) {
        return $.ajax({
            url: this.get60MinuteTicksUrl(coinSymbol),
            method: 'GET'
        });
    }
}

export default Bittrex;
