var StockDataAPI = StockDataAPI || null;
var GraphAPI = GraphAPI || null;

function App() {
    this.selectors = {
        graphContainerId: 'graphs-container',
        stockSymbolTextInputId: 'add-stock-symbol'
    };
    this.stockDataAPI = new StockDataAPI();
    this.graphAPI = new GraphAPI();
    this.console = chrome.extension.getBackgroundPage().console
}

// App.prototype.log = function () {
//     // if (chrome && chrome.extension && chrome.getBackgroundPage) {
//         const backgroundPage = chrome.extension.getBackgroundPage();
//         backgroundPage.console.log.call(null, argument);
//     // }
// }

App.prototype.addForm = function() {
    var checkPageButton = document.getElementById('add-stocks');
    var textInputPresent = false;
    //scope hack
    var self = app;
    checkPageButton.addEventListener('click', () => {
        if (!textInputPresent) {
            chrome.tabs.getSelected(null, (tab) => {
                textInputPresent = true;
                self.listenForUserInput();
            });
        }
    }, false);
};

App.prototype.addNewStockRequest = function(symbol) {
    //scope hack
    var self = this;
    var req = self.stockDataAPI.queryYahooFinance(symbol);
    req.then((response) => {
        self.console.log(response)

        if (response.query && response.query.results && response.query.results.quote) {
            const stockData = response['query']['results']['quote'];
            self.stockDataAPI.addStock(symbol, stockData);
            // self.console.log(stockData);
        }
        // eslint-disable-next-line no-throw-literal
        throw `The stock symbol ${symbol} does not exsist. Please choose a valid ticker symbol`;
    });
    
    req.catch((error) => {
        //TODO: handle error better
        self.log(error);
    });
};

App.prototype.listenForUserInput = function() {
    //scope hack
    const self = this;
    const d = document;
    const button = d.createElement('button');
    const input = d.createElement('input');
    input.type = 'text';
    input.name = 'symbol';
    input.value = 'DIG';
    input.autocomplete = 'on';
    button.textContent = 'GO';
    button.id = self.selectors.stockSymbolTextInputId;
    // self.console.log('listenForUserInput')
    button.addEventListener('click', (e) => {
        var symbol = document.getElementById(self.selectors.stockSymbolTextInputId).value;
        self.addNewStockRequest(symbol);
    });
    d.body.appendChild(input);
    d.body.appendChild(button);
};

const app = new App();

// console.log(app)
// console.log(app.console.log("hey"))


document.addEventListener('DOMContentLoaded', app.addForm, false);

//function graph

//function select stock

//function upload algo

//function code-algo-in-browser
