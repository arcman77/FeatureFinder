<template>
    <highstock id="main-graph" :options="options"></highstock>
</template>
<script>

const graph = {
    props: ['data', 'symbol'],
    data() {
        return {
            scale: 'min'
        };
    },
    computed: {
        highstockFormated() {
            return this.data.map(data => [Number(new Date(data.T)), data.C]);
        },
        options() {
            const title = `${this.symbol} Price Data`;
            const seriesUsed = [{
                id: `${this.scale} price`,
                name: `${this.scale} price`,
                data: this.highstockFormated
            }];
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
                }
            };
        }
    },
    created() {
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