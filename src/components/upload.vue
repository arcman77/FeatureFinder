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
            var files = e.target.files || e.dataTransfer.files;
            if (!files.length) {
                return;
            }
            const file = files[0];
            const reader = new FileReader();
            const fileObj = { name: file.name };
            reader.onload = function() {
                // Entire file
                fileObj.fileStr = this.result;
                UserFilesAPI.addUserFile(fileObj, 'sync').then(() => {
                    // self.$console.log(UserFilesAPI)
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
        line-height: 20px;
        font-size: 20px;
        color: rgb(155, 155, 155);
        background-color: rgb(26, 26, 26);
        border-color: rgb(155, 155, 155);
        border-radius: 5px;
        padding: 5px;
        border: 1px solid;
        margin-left: 5px;
        margin-right: 5px;
        font-weight: 2;
        &:focus {
            outline: none;
        }
        &:hover {
            color: rgb(210, 210, 210);
            border-color: rgb(210, 210, 210);
            cursor: pointer;
        }
    }
</style>