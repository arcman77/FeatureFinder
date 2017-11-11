<template>
    <highcharts id="main-graph" :options="options"></highcharts>
</template>
<script>

const graph = {
    props: ['series', 'symbol', 'paramName'],
    data() {
        return {
           //
        };
    },
    methods: {
        sigFigConversion(data) {
            const formatted = data.map((datum) => {
                return [dataum[0] * 10, datum[1]];
            });
            return formatted
        }
    },
    computed: {
        data() {
            if (!this.series) {
                return null
            }
            return this.series[0].data;
        },
        options() {
            this.$forceUpdate();
            const seriesUsed = this.series;
            return {

                title: {
                    text: `Optimization results for: ${this.paramName}`
                },

                tooltip: {
                    valuePrefix: '$'
                },

                xAxis: {
                    floor: this.data[0][0],
                    allowDecimals: true,
                    type: 'linear',
                    formatter: function() {
                        return this.value + '';
                    },
                    title: {
                        text: `${this.paramName}`
                    }
                },

                yAxis: [
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