const StockDataAPI = StockDataAPI || null;
const GraphAPI = GraphAPI || null;

function App() {
    this.selectors = {
        graphContainerId: 'graphs-container',
        stockSymbolTextInputId: 'add-stock-symbol'
    };
    this.stockDataAPI = new StockDataAPI();
    this.graphAPI = new GraphAPI();
}

App.prototype.addForm = function() {
    var checkPageButton = document.getElementById('add-stocks');
    var textInputPresent = false;
    var self = this;
    checkPageButton.addEventListener('click', () => {
        if (!textInputPresent) {
            chrome.tabs.getSelected(null, (tab) => {
                const d = document;
                const f = d.createElement('form');
                const i = d.createElement('input');
                const b = d.createElement('button');
                b.textContent = 'GO';
                b.id = this.stockSymbolTextInputId;
                i.type = 'text';
                i.name = 'symbol';
                i.value = 'DIG';
                i.autocomplete = 'on';
                // i.value = tab.url;
                f.appendChild(i);
                f.appendChild(b);
                d.body.appendChild(f);
                textInputPresent = true;
                self.listenForUserInput(b);
            });
        }
    }, false);
};

App.prototype.addNewStockRequest = function(symbol) {
    var req = this.stockDataAPI.queryYahooFinance(symbol);
    req.then((stockData) => {
        this.stockDataAPI.addStock(symbol, stockData);
    });
    req.catch((error) => {
        //TODO: handle error better
        alert(error);
    });
};

App.prototype.listenForUserInput = function(button) {
    var self = this;
    button.addEventListener('click', (e) => {
        var symbol = document.getElementById(this.selectors.stockSymbolTextInputId).value;
        self.addNewStockRequest(symbol);
    });
};

const app = new App();

document.addEventListener('DOMContentLoaded', app.addForm, false);

//function graph

//function select stock

//function upload algo

//function code-algo-in-browser
