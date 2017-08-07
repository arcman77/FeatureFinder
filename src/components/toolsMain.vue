<template>
    <div id="tools-main">
        <toolbar-main></toolbar-main>
    </div>
</template>
<script>

import ToolbarMain from './toolbarMain.vue';

const ToolsMain = {
    components: {
        'toolbar-main': ToolbarMain
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