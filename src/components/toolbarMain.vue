<!-- toolbar-main -->
<template>
    <div class="toolbar-main">
        <div class="toolbar-files">
            <upload></upload>
            <algos></algos>
        </div>
        <div class="toolbar-stats">
            
        </div>
    </div>
</template>
<script>
import Upload from './upload.vue';
import Algos from './algos.vue';

const ToolbarMain = {
    components: {
        'upload': Upload,
        'algos': Algos
    },
    data() {
        return {};
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