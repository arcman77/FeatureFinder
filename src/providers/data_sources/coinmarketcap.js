class CoinMarketCap {
    constructor() {
        this.name = 'CoinMarketCap';
        this.baseUrl = 'https://coinmarketcap.com';
        this.coinWebsiteStringPattern = '<li><span class="glyphicon glyphicon-link text-gray" title="Website"></span> <a href=';
        this.actions = {
            'get-currencies': '/currencies/'
        };
        this.console = chrome.extension.getBackgroundPage().console;
    }

    getAction(actionName) {
        return this.actions[actionName];
    }

    getCoinPageUrl(coinName) {
        var coinPageUrl = `${this.baseUrl}${this.actions['get-currencies']}`;
        return `${coinPageUrl}${coinName}`;
    }
    getCoinHomepage(coinName) {
        const self = this;
        return $.ajax({
            method: 'GET',
            url: self.getCoinPageUrl(coinName)
        }).then((htmlString) => {
            const index = htmlString.match(self.coinWebsiteStringPattern).index;
            const offset = self.coinWebsiteStringPattern.length;
            if (index) {
                let c1 = null;
                let c2 = null;
                let counter = 0;
                let i;
                for (i = index + offset; i < htmlString.length; i++) {
                    if (htmlString[i] === '"') {
                        counter += 1;
                        c1 = c1 || i;
                        c2 = counter === 2 ? i : null;
                        if (c1 && c2) {
                            // console.log(c1, c2)
                            return htmlString.substring(c1 + 1, c2);
                        }
                    }
                }
            }
            return null;
        });
    }
}

export default CoinMarketCap;
