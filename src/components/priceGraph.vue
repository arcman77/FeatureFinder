<template>
    <highstock id="main-graph" :options="options"></highstock>
</template>
<script>

const graph = {
    props: ['data', 'symbol', 'series'],
    data() {
        return {
            scale: 'minute'
        };
    },
    computed: {
        highstockFormated() {
            return this.data.map(data => [Number(new Date(data.T)), data.C]);
        },
        options() {
            this.$forceUpdate();
            const title = `${this.symbol} Price Data`;
            const seriesUsed = [{
                id: 'priceData',
                name: `${this.scale} price`,
                data: this.highstockFormated,
                yAxis: 0
            }];
            if (this.series) {
                this.series.forEach((subSeries) => {
                    if (subSeries.length > this.highstockFormated.length) {
                        //eslint-disable-next-line no-param-reassign
                        subSeries = subSeries.slice(0, this.highstockFormated.length);
                    }
                    seriesUsed.push(subSeries);
                });
            }
            return {
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
                    time: [this.scale],
                    type: 'datetime',
                },

                yAxis: [
                    {
                        title: {
                            text: 'Price'
                        }
                    },
                    {
                        title: {
                            text: 'Net Worth'
                        }
                    }
                ],

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
                }
            };
        }
    }
};

export default graph;

</script>
<style lang="scss">
$grey-dark: #222222;
$grey-ml: #B3B3B3;

#main-graph {
    width: 60vw;
    height: 50vh;
    display: inline-block;
    padding: 10px;
    background-color: $grey-ml;
    border: 3px solid $grey-dark;
    border-radius: 5px;
}

</style>