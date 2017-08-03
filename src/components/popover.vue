<template>
    <span class="popover"
        @click="hide"
        v-show="visible"
        v-bind:style="computedStyle">
        <slot>
        </slot>
    </span>
</template>
<script>

import Vue from 'vue';
import _ from 'lodash';

var Popover = Vue.extend({
    props: {
        /**
         *
         * @type {Object}
         */
        parentPosition: {
            type: Object,
            default: null
        },
        /**
        * Whether to show the popover
        */
        show: {
            type: Boolean,
        },
        /**
        * Whether the popover is hideable
        */
        hideable: {
            type: Boolean,
        },
        /**
        * Opacity of the popover
        */
        opacity: {
            type: Number,
        },
        /**
        * Orientation
        */
        orientation: {
            type: String,
        },
        /**
        * Location to anchor dropdown menu i.e. 'top-left'
        * @type {String}
        */
        position: {
            type: String,
            default: null
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
            style: {
                'z-index': 1
            },
            popoverWidth: 0,
            popoverHeight: 0
        };
    },
    methods: {
        showPopover() {
            this.visible = true;
        },
        hide() {
            if (this.hideable) {
                this.visible = false;
            }
        },
        up() {
            return -this.popoverHeight;
        },
        down() {
            return 0; // default behavior for box layout;
        },
        center() {
            return -this.popoverHeight * 0.5;
        },
        orientationOffset() {
            return this[this.orientation || 'down']();
        }
    },
    computed: {
        computedStyle() {
            var rect;
            var offset = 0;
            var translateX = 0;
            var translateY = this.orientationOffset();

            // If absolute position to place popover
            if (this.position) {
                const verticalOffset = (this.offsets.top || -this.offsets.bottom || 0);
                const horizontalOffset = (this.offsets.left || -this.offsets.right || 0);

                this.style.position = 'absolute';

                if (this.position === 'left-top') {
                    this.style.bottom = `${0 + verticalOffset}px`;
                    this.style.right = `calc(100% + ${horizontalOffset}px)`;
                } else if (this.position === 'right-top') {
                    this.style.bottom = `${0 + verticalOffset}px`;
                    this.style.left = `calc(100% - ${horizontalOffset}px)`;
                } else if (this.position === 'left-bottom') {
                    this.style.top = `${0 - verticalOffset}px`;
                    this.style.right = `calc(100% + ${horizontalOffset}px)`;
                } else if (this.position === 'right-bottom') {
                    this.style.top = `${0 - verticalOffset}px`;
                    this.style.left = `calc(100% - ${horizontalOffset}px)`;
                } else if (this.position === 'top-left') {
                    this.style.bottom = `calc(100% + ${verticalOffset}px)`;
                    this.style.right = `${0 + horizontalOffset}px`;
                } else if (this.position === 'top-right') {
                    this.style.bottom = `calc(100% + ${verticalOffset}px)`;
                    this.style.left = `${0 - horizontalOffset}px`;
                } else if (this.position === 'bottom-left') {
                    this.style.top = `calc(100% - ${verticalOffset}px)`;
                    this.style.right = `${0 + horizontalOffset}px`;
                } else if (this.position === 'bottom-right') {
                    this.style.top = `calc(100% - ${verticalOffset}px)`;
                    this.style.left = `${0 - horizontalOffset}px`;
                }
                return this.style;
            }

            if (this.parentPosition) {
                rect = this.parentPosition;
            } else {
                rect = this.$parent.$el.getBoundingClientRect();
            }

            if (rect.top !== undefined || rect.bottom !== undefined) {
                if (rect.top !== undefined) {
                    this.style.top = rect.top;
                    offset = (this.offsets.top || -this.offsets.bottom || 0);
                    translateY += -(offset);
                } else {
                    offset = (-this.offsets.bottom || this.offsets.top || 0);
                    translateY += -(rect.bottom + offset);
                }
            }
            if (rect.left !== undefined || rect.right !== undefined) {
                if (rect.left !== undefined) {
                    offset = (this.offsets.left || -this.offsets.right || 0);
                    translateX = rect.left + offset;
                } else {
                    offset = (this.offsets.right || -this.offsets.left || 0);
                    translateX = -(rect.right + offset);
                }
            }

            this.style.transform = `translate3d(${translateX}px, ${translateY}px, 0px)`;
            this.style.opacity = this.opacity;
            return _.extend(this.style, (this.styleOptions || {}));
        }
    },
    mounted() {
        this.watchVisible = this.$watch('visible', function watchVis(visibleVal) {
            if (visibleVal) {
                this.popoverWidth = this.$el.offsetWidth;
                this.popoverHeight = this.$el.offsetHeight;
                this.watchVisible = null;
            }
        }, {
            immediate: true
        });
    },
    watch: {
        show: {
            handler(showVal) {
                this.visible = showVal;
            },
            immediate: true
        }
    }
});

export default Popover;

</script>

<style lang="scss">
    
</style>