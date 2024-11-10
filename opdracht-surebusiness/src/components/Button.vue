<template>
    <button :class="buttonClasses" @click="handleClick" :disabled="disabled">
        <slot></slot>
    </button>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
    name: 'Button',
    props: {
        variant: {
            type: String as PropType<'primary' | 'secondary'>,
            default: 'primary',
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        onClick: {
            type: Function as PropType<(event: MouseEvent) => void>,
            required: false,
        },
    },
    computed: {
        buttonClasses() {
            return {
                'px-4 py-2': true,
                'bg-blue-200 text-white hover:bg-blue-300 text-blue-950': this.variant === 'primary' && !this.disabled,
                'bg-gray-100 text-gray-300 cursor-not-allowed': this.disabled,
                'bg-gray-200 text-black hover:bg-gray-300 text-gray-950': this.variant === 'secondary' && !this.disabled,
            };
        },
    },
    methods: {
        handleClick(event: MouseEvent) {
            if (this.onClick && !this.disabled) {
                this.onClick(event);
            }
        },
    },
});
</script>