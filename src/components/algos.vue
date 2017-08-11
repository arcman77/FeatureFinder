<script>

import _ from 'lodash';
import AlgoAPI from '../providers/algoAPI';
import UserFilesAPI from '../providers/userFilesAPI';
import Dropdown from './dropdown.vue';

const Algos = {
    data() {
        return {
            AlgoAPI,
            UserFilesAPI,
            selectedFile: {},
        };
    },
    components: {
        'dropdown': Dropdown
    },
    methods: {
        performMenuAction() {

        }
    },
    computed: {
        servedData() {
            return this.UserFilesAPI.servedData;
        },
        jsFiles() {
            return this.servedData.jsFiles;
        },
        options() {
            const options = [];

            _.each(this.jsFiles, (jsFileInfo, hashKey) => {
                options.push({
                    label: jsFileInfo.name,
                    value: hashKey,
                    icon: ''
                });
            });

            return options;
        }
    },
    created() {
        // console.log(UserFilesAPI)
    }
};

export default Algos;

</script>
<template>
    <div id="algos-interface">
        <div id="select-file" class="no-select">
 
            <dropdown v-if="options.length"
                :showSelectedLabel="false"
                :options="options"
                @change="performMenuAction">
                <div slot="dropdown-control" class="button-icon--primary">
                    <div>
                        <span class="chev-down"> &#x25BC; </span>
                        SELECT FILE
                    </div>
                </div>
            </dropdown>
        </div>
    </div>
</template>
<style lang="scss">

.no-select {
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
}

#algos-interface {
    display: flex;
    #select-file {
        border: none;
        padding: 7px;
        margin-left: 5px;
        margin-right: 5px;
        line-height: 15px;
        font-size: 15px;
        max-height: 27px;
        color: rgb(155, 155, 155);       
        box-shadow: rgba(0, 0, 0, 0.5) 0px 2px 2px 0px;
        background-color: rgb(26, 26, 26);
        &:hover {
            color: rgb(210, 210, 210);
            border-color: rgb(210, 210, 210);  
            cursor: pointer;
        }
        .chev-down {
            margin-right: 5px;
        }
    }
}

</style>