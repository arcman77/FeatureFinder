function StockDataAPI() {
    this.selectedStocks = {};
    this.stockData = {};
}

StockDataAPI.prototype.removeStock = function(symbol) {
    delete this.selectedStocks[symbol];
    delete this.stockData[symbol];
    window.localStorage.removeItem(symbol);
};

StockDataAPI.prototype.addStock = function(symbol) {
    this.selectedStocks[symbol] = symbol;
    window.local
};

StockDataAPI.prototype.yahooJson2HighchartsDATA = function(arrayOfJson) {
    var mappedData = [];
    arrayOfJson.forEach((qouteObject) => {
    //1st - make date time object from string, 2nd - convert it to decimal form
        mappedData.unshift([Number(new Date(qouteObject['Date'])), Number(qouteObject['Close'])]);
    });
    return mappedData;
};

StockDataAPI.prototype.queryYahooFinance = function(symbol, callback) {
// function queryYahooAPI(symbol,callback,container){
    var query = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.historicaldata%20where%20symbol%20%3D%20%22'+ symbol + '%22%20and%20startDate%20%3D%20%222014-06-11%22%20and%20endDate%20%3D%20%222015-09-14%22&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys'; 
    var request = $.ajax({
        url: query,
        method: 'GET'
    });

    request.done((response) => {

        var goodQuery = response['query']['results'] !== null;

        if (goodQuery){
            return response['query']['results']['quote'];
            // const result = callback(response['query']['results']['quote']);
            // processedStockData[symbol] = result;
            // graphHome(result,container,'Day',undefined,symbol);
        }

        alert('The stock '+ symbol + ' does not exsist. Please find the correct ticker symbol.');
    });
};


StockDataAPI.prototype.queryGoogleFinance = function() {

}