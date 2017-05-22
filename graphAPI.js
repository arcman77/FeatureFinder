function graphHighCharts(array, containerSelector, scale, series, symbol) {
    var title = `${symbol} Price Data`;
    var seriesUsed;
    $(containerSelector).css('overflow', 'auto');

    if (!series) {
        seriesUsed = [{
            id: `${scale} price`,
            name: `${scale} price`,
            data: array
        }];
    } else {
        seriesUsed = series;
    }

    $(containerSelector).highcharts('StockChart', {
        rangeSelector: {
            allButtonsEnabled: true,
            selected: 2
            //inputDateFormat: '%Y-%m-%d'
        },

        title: {
            text: title
        },

        tooltip: {
            valuePrefix: '$'
        },

        xAxis: {
            time: [scale],
            type: 'datetime',
        },

        yAxis: {
            title: {
                text: 'Price'
            }
        },

        series: seriesUsed,
        legend: {
            enabled: true,
            floating: true,
            align: 'left',
            verticalAlign: 'top',
            color: 'red',
            name: 'Sell'
        },
        credits: {
            enabled: false
        },
    });
}

function getSignalSeries(processedStockData, stockAlgoFunction) {
    var series = [];
    var scale = 'Day';

    series.push({
        id: `${scale} price`,
        name: `${scale} price`,
        data: processedStockData,
    });
    //call stockAlgoFunction on stock data:
    const buySellSignals = stockAlgoFunction(processedStockData);
    const buyFlagSeries = buySellSignals.buy.map((signal, index) => {
        return {
            x: signal[0],
            text: `bought at: $${signal[1]}`,
            id: `Bflag-${index}`,
        };
    });
    const sellFlagSeries = buySellSignals.sell.map((signal, index) => {
        return {
            x: signal[0],
            text: `sold at: $${signal[1]}`,
            id: `sflag-${index}`,
        };
    });
    //add sub-series buy-signals
    series.push({
        type: 'flags',
        onSeries: `${scale} price`,
        shadow: false,
        width: 7,
        shape: 'url(https://mt.google.com/vt/icon?psize=20&font=fonts/Roboto-Regular.ttf&color=ff330000&name=icons/spotlight/spotlight-waypoint-a.png&ax=44&ay=48&scale=1&text=%E2%80%B2)',
        data: buyFlagSeries,
        showInLegend: true,
        color: '#1eaa56',
        name: 'Buy'
    });
    //add sub-series sell-signals
    series.push({
        type: 'flags',
        onSeries: `${scale} price`,
        shadow: false,
        width: 7,
        shape: 'url(https://camo.githubusercontent.com/b4f21ebe4ad7c00f459e8ed115e6efb37fe69348/687474703a2f2f63686172742e676f6f676c65617069732e636f6d2f63686172743f636873743d645f6d61705f70696e5f6c65747465722663686c643d7c464630303030)',
        data: sellFlagSeries,
        showInLegend: true,
        color: '#f20000',
        name: 'Buy'
     // radius: 6,
     // fillColor: '#f20000',
     // lineWidth: 2,
     // lineColor: null, // inherit from series
     // symbol   :'circle',
     // shape    :"circle",
     // states: {
     //     hover: {
     //         fillColor: null,
     //         lineWidth: 2,
     //       radius:6
     //     }
     // }
    });

    return series; //contains regular stock data in addition to the newly generated signals
}
