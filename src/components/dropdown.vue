<template>
    <div tabindex=1
        class="dropdown"
        :class="{ 'open': visible, 'dropdown-disabled': disabled }"
        @keyup.esc="deactivate"
        @blur="deactivate">
        <div class="dropdown-control-container" @click.stop = "toggle">
            <slot name="dropdown-control">
                <div class="dropdown-btn" >
                    <i class="chevron nc-icon-glyph arrows-1_minimal-down"></i>
                    <slot name="dropdown-selected-prefix"></slot>
                    <span class="dropdown-selected" v-text="selectedOptionLabel()"></span>
                </div>
            </slot>
        </div>
        <popover :position="position"  :show= "true" :offsets="offsets">
            <ul class="dropdown-menu" v-show="visible">
                <li v-for="(option, index) in options"
                    v-bind:key="index"
                    :class="{ active: isOptionSelected(option) }">
                    <a v-if="option" class="dropdown-element" @click.stop.prevent="select(option)">
                        <i v-if="option.icon" v-bind:class="option.icon" class="menu-option-icon"></i>
                        <span>{{ getOptionLabel(option) }}</span>
                    </a>
                    <div v-else class="separator"></div>
                </li>
            </ul>
        </popover>
    </div>
</template>
<script>

import Vue from 'vue';
import Popover from './popover.vue';

var Dropdown = Vue.component('dropdown', {
    components: {
        'popover': Popover
    },
    props: {
        /**
         * Preset the selected options value.
         * @type {Object}
         */
        value: {
            type: Object,
            default: null
        },
        /**
        * Array of options. If array of objects, visible label
        * will default to option.label. Custom label can be set
        * with 'label' prop
        * @type {Array}
        */
        options: {
            type: Array,
            required: true
        },
        /**
        * Key to use when generating option labels when 'option'
        * is an object
        * @default 'label'
        * @type {String}
        */
        label: {
            type: String,
            default: 'label'
        },
        /**
        * Decide whether to display the selected label. If set to false,
        * should set fixed display label using fixedLabel prop
        * @default true
        * @type {Boolean}
        */
        showSelectedLabel: {
            type: Boolean,
            default: true
        },
        /**
        * String to set fixed label text
        * @type {String}
        */
        fixedLabel: {
            type: String,
            default: ''
        },
        /**
        * Disables dropdown if true
        * @default false
        * @type {Boolean}
        */
        disabled: {
            type: Boolean,
            default: false
        },
        /**
        * Location to anchor dropdown menu
        * @default 'bottom-right'
        * @type {String}
        */
        position: {
            type: String,
            default: 'bottom-right'
        },
        /**
        * Pixels to offset i.e { top: 5, left: 5 }
        * @type {Object}
        */
        offsets: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    data() {
        return {
            visible: false,
            mutableValue: this.value,
        };
    },
    methods: {
        activate() {
            if (this.visible || this.disabled) {
                return;
            }
            this.visible = true;
            this.$emit('open');
        },
        deactivate() {
            if (!this.visible) {
                return;
            }
            this.visible = false;
            this.$emit('close');
        },
        toggle() {
            // eslint-disable-next-line no-unused-expressions
            this.visible
                ? this.deactivate()
                : this.activate();
        },
        select(option) {
            if (this.disabled) {
                return;
            }
            this.mutableValue = option;
            this.$emit('change', this.mutableValue.value);
            this.deactivate();
        },
        isOptionSelected(option) {
            return this.mutableValue === option;
        },
        selectedOptionLabel() {
            if (this.showSelectedLabel) {
                return this.getOptionLabel(this.mutableValue);
            }
            return this.fixedLabel;
        },
        getOptionLabel(option) {
            if (typeof option === 'object') {
                if (this.label && option[this.label]) {
                    return option[this.label];
                }
            }
            return option;
        }
    },
    watch: {
        value(value) {
            this.mutableValue = value;
        },
    }
});

export default Dropdown;

</script>

<style lang="scss">

$grey-dark: #222222;
$grey-ml: #B3B3B3;
$grey-ll: #d2d2d2;

.clear {
    opacity: 0;
    width: 15px;
    height: 15px;
    display: inline;
}

.dropdown {
    position: relative;
    height: 100%;
    outline: none;

    &:hover {
        .dropdown-btn {
            color: white;
        }
    }
    &.open {
        .dropdown-btn {
            color: white;
        }
        .chevron {
            transform: rotateX(180deg);
        }
    }

    .dropdown-control-container {
        height: 100%;
    }

    .dropdown-btn {
        display: flex;
        align-items: center;
        height: 100%;
        padding: 10px 20px 10px 10px;
        cursor: pointer;
        border: none;
        box-shadow: none;
        overflow: hidden;
        color: $grey-ll;
        font-size: 14px;
        .chevron {
            font-size: 10px;
            margin-right: 8px;
            transition: transform 0.3s ease;
        }
    }

    .dropdown-menu {
        display: block;
        float: left;
        min-width: 160px;
        width: 100%;
        overflow: hidden;
        padding: 8px 0px;
        margin: 0;
        font-size: 12px;
        text-align: left;
        list-style: none;
        background-color: $grey-dark;
        box-shadow: 0 4px 10px rgba(211, 211, 211, .35);
        border-radius: 4px;
        letter-spacing: 0.8px;
        z-index: 400;
        .dropdown-element {
            display: flex;
            align-items: center;
            cursor: pointer;
            color: $grey-ll;
            padding: 4px 20px;
            white-space: nowrap;
            height: 30px;
            &:hover {
                background-color: hsla(0, 0%, 100%, .08);
                color: white;
            }
            .menu-option-icon {
                margin-right: 10px;
            }
        }
        .separator {
            margin: 5px 0;
            height: 1px;
            background-color: hsla(0, 0%, 78%, .15);
        }
    }

    .prefix {
        margin-right: 6px;
    }
}
</style>
