<!-- toolbar-main -->
<template>
    <div class="toolbar-main">
        <div class="toolbar-files">
            <upload></upload>
            <algos 
                :selectedCoin="selectedCoin"
                @coinSelected="emitCoinSelected"
                @signals="emitSignals">
            </algos>
        </div>
        <div class="toolbar-stats">
        </div>
    </div>
</template>
<script>
import Upload from './upload.vue';
import Algos from './algos.vue';

const ToolbarMain = {
    props: ['priceData', 'selectedCoin'],
    components: {
        'upload': Upload,
        'algos': Algos
    },
    data() {
        return {};
    },
    methods: {
        emitCoinSelected(symbol) {
            this.$emit('coinSelected', symbol);
        },
        emitSignals(signals) {
            this.$emit('signals', signals);
        }
    }
};

export default ToolbarMain;

</script>
<style lang="scss">


.toolbar-main {
    width: 100%;
    height: 5vh;
    display: flex;
    flex-direction: row;
    .toolbar-files {
        display: flex;
        flex-direction: row;
    }
    .toolbar-stats {

    }
}  

</style>