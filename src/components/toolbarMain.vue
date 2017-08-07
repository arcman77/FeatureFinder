<!-- toolbar-main -->
<template>
    <div class="toolbar-main">
        <div class="toolbar-files">
            <upload></upload>
        </div>
        <div class="tolbar-stats">
            
        </div>
    </div>
</template>
<script>
import Upload from './upload.vue';

const ToolbarMain = {
    components: {
        'upload': Upload
    },
    data() {
        return {

        };
    }
};

export default ToolbarMain;

</script>
<style lang="scss">


.toolbar-bar {
    width: 100%;
    height: 5vh;
    display: flex;
    flex-direction: row;
    .toolbar-files {
        
    }
    .toolbar-stats {

    }
}  

</style>