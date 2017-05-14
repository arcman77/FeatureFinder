function StockDataAPI() {

}

StockDataAPI.prototype.queryYahooFinance = function(symbol, callback) {
// function queryYahooAPI(symbol,callback,container){
    var query = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.historicaldata%20where%20symbol%20%3D%20%22'+ symbol + '%22%20and%20startDate%20%3D%20%222014-06-11%22%20and%20endDate%20%3D%20%222015-09-14%22&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
    
    var request = $.ajax({
      url: query,
      method: 'GET'
    });

    request.done(function(response){

      var goodQuery = ( response['query']['results'] != null );

      if (goodQuery){
        result = callback(response['query']['results']['quote']);
        processedStockData[symbol] = result;
        graphHome(result,container,'Day',undefined,symbol);
      }
      else{
        alert('The stock '+ symbol + ' does not exsist. Please find the correct ticker symbol.');
      }

    });
}
}

StockDataAPI.prototype.queryGoogleFinance = function() {

}