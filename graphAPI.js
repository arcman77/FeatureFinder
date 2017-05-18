function graphHighCharts(array, containerSelector, scale, series, symbol) {
    var title = symbol + ' Price Data';
    var seriesUsed;
    $(containerSelector).css('overflow', 'auto');

    if (!series) {
       seriesUsed = [{
           id: scale + 'price',
           name: scale + 'price',
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
