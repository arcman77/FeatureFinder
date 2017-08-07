<template>
    <div id="upload-wrapper">
        <button id="upload-js-file" @click="forwardClick">
            + JAVASCRIPT FILE
        </button>
        <input id="file-upload" type="file" name="file[]" style="display:none" @change="onFileChange">
    </div>
</template>
<script>
import UserFilesAPI from '../providers/userFilesAPI';

const upload = {
    data() {
        return {
        };
    },
    methods: {
        onFileChange(e) {
            const self = this;
            var files = e.target.files || e.dataTransfer.files;
            if (!files.length) {
                return;
            }
            const file = files[0];
            const reader = new FileReader();
            reader.onload = function() {
                // Entire file
                console.log(this.result);
                UserFilesAPI.addUserFile(this.result, 'sync').then((result) => {
                    self.$console.log(result)
                    self.$console.log(UserFilesAPI)
                });
            };
            reader.readAsText(file);
        },
        readByLine(fileStr) {
            const lines = fileStr.split('\n');
            let index;
            for (index = 0; index < lines.length; index++) {
                console.log(lines[index]);
            }
        },
        forwardClick() {
            document.getElementById('file-upload').click();
        }
    },
    created() {
    }
};

export default upload;

</script>
<style lang="scss">
    #upload-js-file {
        line-height: 15px;
        font-size: 15px;
        color: white;
        background-color: black;
        border-radius: 7.5px;
        padding: 5px;
        border: 1px solid white;
        margin-left: 5px;
        margin-right: 5px;
        font-weight: 2;
        &:focus {
            outline: none;
        }
    }
</style>