
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
            5: 'fiveMin',
            30: 'thirtyMin',
            60: 'hour',
            1440: 'day'
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
                'GBYTE': true,
                'OMG': true,
                'WAVES': true,
                'MTL': true,
                'STRAT': true,
                'DASH': true,
                'SYS': true,
                'XEL': true,
                'STEEM': true,
                'PAY': true,
                'BLOCK': true,
                'DMD': true,
                'UBQ': true,
                'PIVX': true,
                'QTUM': true,
                'UNB': true,
                'MAID': true,
                'EDG': true,
                'GNO': true,
                'DCT': true,
                'DOGE': true,
                'GAME': true,
                'XLM': true,
                'VIA': true,
                'SHIFT': true,
                'FUN': true,
                'SNGLS': true,
                'ARDR': true,
                'WINGS': true,
                'ARK': true,
                'ANT': true,
                'DAR': true,
                'BNT': true,
                'CFI': true,
                'CLOAK': true,
                'SEC': true,
                'NBT': true,
                'EMC2': true,
                'NMR': true,
                'XCP': true,
                'BITB': true,
                'PTOY': true,
                'SPR': true,
                'HMQ': true,
                'VTC': true,
                'XAUR': true,
                'NXS': true,
                'ZEN': true,
                'STORJ': true,
                'DTB': true,
                'BTCD': true,
                'XZC': true,
                'IOC': true,
                'AMP': true,
                'COVAL': true,
                'GRS': true,
                'MYR': true,
                'BLK': true,
                'NAV': true,
                'POT': true,
                'MUSIC': true,
                'REP': true,
                'OK': true,
                'ZCL': true,
                'MONA': true,
                'RADS': true,
                'BAY': true,
                'NLG': true,
                'EXP': true,
                'MCO': true,
                'MEME': true,
                'RISE': true,
                'BLITZ': true,
                'SWT': true,
                'BURST': true,
                'EXCL': true,
                'DGD': true,
                'NEOS': true,
                'ABY': true,
                'PPC': true,
                'EMC': true,
                'BCY': true,
                'PINK': true,
                'SIB': true,
                'TKN': true,
                'LUN': true,
                'TRST': true,
                'QWARK': true,
                'MYST': true,
                'VRC': true,
                'CANN': true,
                'CLUB': true,
                'XST': true,
                'RLC': true,
                'GAM': true,
                'GRC': true,
                'NAUT': true,
                'CLAM': true,
                'BRX': true,
                'CRW': true,
                'OMNI': true,
                'TIME': true,
                'FLDC': true,
                'SPHR': true,
                'MUE': true,
                'SBD': true,
                'AGRS': true,
                'BTA': true,
                'FAIR': true,
                'START': true,
                'XBB': true,
                'MLN': true,
                'AUR': true,
                'EFL': true,
                'DOPE': true,
                'VRM': true,
                'GEO': true,
                'GOLOS': true,
                'TRUST': true,
                'INFX': true,
                'SLR': true,
                'KORE': true,
                'THC': true,
                'INCNT': true,
                'FLO': true,
                'SEQ': true,
                'SLS': true,
                '2GIVE': true,
                'EBST': true,
                'TKS': true,
                'GLD': true,
                'LMC': true,
                'SWIFT': true,
                'IOP': true,
                'PTC': true,
                'XMG': true,
                'VTR': true,
                'GBG': true,
                'PKB': true,
                'BYC': true,
                'HKG': true,
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
                'CFI': true,
                'ADX': true,
                'OMG': true,
                'ANS': true,
                'LTC': true,
                'PAY': true,
                'CVC': true,
                'SC': true,
                'XMR': true,
                'QTUM': true,
                'SNGLS': true,
                'SNT': true,
                'DASH': true,
                'XRP': true,
                'FUN': true,
                'WINGS': true,
                'FCT': true
            },
            // US DOLLAR MARKET
            USDT: {
                'BTC': true,
                'ETH': true,
                'LTC': true,
                'DASH': true,
                'XMR': true,
                'XRP': true,
                'ETC': true,
                'ZEC': true
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
        var useCurrency = coinSymbol === 'BTC' ? 'USDT' : baseCurrency;
        var market = `${useCurrency}-${coinSymbol}`;
        var marketParam = `${this.actions['set-market-name']}${market}`;
        return `${this.getApiUrl()}${marketParam}`;
    }

    setTicks(coinSymbol, interval) {
        //https://bittrex.com/Api/v2.0/pub/market/GetTicks?marketName=BTC-ETH&tickInterval=oneMin&_=1496809444398
        return `${this.setMarket(this.baseCurrency, coinSymbol)}${this.getAction('set-tick-interval')}${interval}`;
    }

    getMinuteTicksUrl(coinSymbol, tickInterval) {
        return this.setTicks(coinSymbol, this.getTicks(tickInterval));
    }

    get1MinuteTicksUrl(coinSymbol) {
        return this.setTicks(coinSymbol, this.getTicks(1));
    }

    get5MinuteTicksUrl(coinSymbol) {
        return this.setTicks(coinSymbol, this.getTicks(5));
    }

    get30MinuteTicksUrl(coinSymbol) {
        return this.setTicks(coinSymbol, this.getTicks(30));
    }

    get60MinuteTicksUrl(coinSymbol) {
        return this.setTicks(coinSymbol, this.getTicks(60));
    }

    get1DayTicksUrl(coinSymbol) {
        return this.setTicks(coinSymbol, this.getTicks(1440));
    }

    getMinuteTicksData(coinSymbol, tickInterval) {
        this.$console.log(this.getMinuteTicksUrl(coinSymbol, tickInterval));
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

    get5MinuteTicksData(coinSymbol) {
        return $.ajax({
            url: this.get5MinuteTicksUrl(coinSymbol),
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

    get1DayTicksData(coinSymbol) {
        return $.ajax({
            url: this.get1MinuteTicksUrl(coinSymbol),
            method: 'GET'
        });
    }
}

export default Bittrex;
