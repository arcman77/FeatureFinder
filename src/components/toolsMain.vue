<template>
    <div id="tools-main">
        <toolbar-main
            @coinSelected="emitCoinSelected" 
            :selectedCoin="selectedCoin"
            @signals="emitSignals"
            @optimizeSeries="emitOptimizeSeries">
        </toolbar-main>
    </div>
</template>
<script>

import ToolbarMain from './toolbarMain.vue';

const ToolsMain = {
    props: ['priceData', 'selectedCoin'],
    components: {
        'toolbar-main': ToolbarMain
    },
    methods: {
        emitCoinSelected(symbol) {
            this.$emit('coinSelected', symbol);
        },
        emitSignals(signals) {
            this.$emit('signals', signals);
        },
        emitOptimizeSeries(series, paramName) {
            this.$emit('optimizeSeries', series, paramName);
        },
    }
};

export default ToolsMain;

</script>
<style lang="scss">

#tools-main {
    width: 100%;
    height: 50vh;
    display: flex;
    display-direction: column;
}

</style>