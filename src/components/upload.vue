<template>
    <button id="upload-js-file">+ JAVASCRIPT FILE</button>
    <input type="file" name="file[]">
</template>
<script>
const upload = {
    data() {
        return {
        };
    },
    methods: {
        // listenForFileSelection() {
        //     const uploadComponent = this;
        //     chrome.fileBrowserHandler.onExecute.addListener((id, details) => {
        //         if (id !== 'upload-js-file') {
        //             return;
        //         }
        //         const fileEntries = details.entries;
        //         //eslint-disable-next-line
        //         for (let i = 0, entry; entry = fileEntries[i]; ++i) {
        //             entry.file((file) => {
        //                 // send file somewhere
        //                 uploadComponent.$console.log(file);
        //             });
        //         }
        //     });
        // }
    },
    created() {
        this.listenForFileSelection();
    }
};

export default upload;

</script>
<style lang="scss">
    
</style>