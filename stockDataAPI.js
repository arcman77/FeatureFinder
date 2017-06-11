function StockDataAPI(DB) {
    this.DB = DB;
    this.selectedStocks = [];
    this.selectedStocksKey = '_selectedStocks_';
    this.stockData = {};
}

StockDataAPI.prototype.removeStock = function(symbol) {
    var index = this.selectedStocks.indexOf(symbol);
    this.selectedStocks.splice(index);
    delete this.stockData[symbol];
    this.setItem(this.selectedStocks, this.selectedStocksKey);
};

StockDataAPI.prototype.addStock = function(symbol, stockData) {
    this.selectedStocks.push(symbol);
    this.addItem(this.selectedStocks, this.selectedStocksKey);
    this.stockData[symbol] = stockData || [];
};

StockDataAPI.prototype.removeItem = function(name) {
    window.localStorage.removeItem(name);
};

StockDataAPI.prototype.getItem = function(name) {
    var obj = window.localStorage.getItem(name);
    if (!obj) {
        return;
    }
    obj = JSON.parse(obj);
    const typeMatch = Array.isArray(obj.value) ? 'Array' : typeof (obj.value) === obj.type;
    if (!typeMatch) {
        console.warn(`Data loss: ${obj.value} does not match specified type ${obj.type}`);
    }
    return obj.value;
};

StockDataAPI.prototype.addItem = function(item, name) {
    var toBeStored = {
        type: Array.isArray(item) ? 'Array' : typeof (item),
        value: item
    };
    toBeStored = JSON.stringify(toBeStored);
    window.localStorage.setItem(name, toBeStored);
};

StockDataAPI.prototype.setItem = function(item, name) {
    StockDataAPI.addItem(item, name);
};

StockDataAPI.prototype.yahooJson2HighchartsDATA = function(arrayOfJson) {
    var mappedData = [];
    arrayOfJson.forEach((qouteObject) => {
    //1st - make date time object from string, 2nd - convert it to decimal form
        mappedData.unshift([Number(new Date(qouteObject['Date'])), Number(qouteObject['Close'])]);
    });
    return mappedData;
};

StockDataAPI.prototype.queryYahooFinance = function(symbol, start, stop) {
    const a = new Date();
    const b = this.addMonths(a, -6);
    //  '2017-5-29'
    const stopUsed = stop || `${ a.getFullYear() }-${ (a.getMonth()+1) }-${ a.getDate() }`;
    const startUsed = start || `${ b.getFullYear() }-${ (b.getMonth()+1) }-${ b.getDate() }`;
    const yqlApiBase = 'https://query.yahooapis.com/v1/public/yql?';
    const query = 'q=select%20*%20from%20yahoo.finance.historicaldata%20where%20symbol%20%3D%20%22' + symbol + '%22%20and%20startDate%20%3D%20%22' + startUsed + '%22%20and%20endDate%20%3D%20%22' + stopUsed + '%22&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
    console.log(yqlApiBase + query)
    const request = $.ajax({
        url: yqlApiBase + query,
        method: 'GET'
    });

    return request;
};

StockDataAPI.prototype.addMonths = function(date, months) {
  date.setMonth(date.getMonth() + months);
  return date;
};
