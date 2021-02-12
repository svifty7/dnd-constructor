<template>
    <svg :style="style"
         class="svg-icon"
         viewBox="0 0 16 16"
         aria-hidden="true"
         role="img"
    >
        <use :xlink:href="svg"/>
    </svg>
</template>

<script>
    import '@/assets/icons/svg/anon.svg';
    import '@/assets/icons/svg/dnd.svg';
    import '@/assets/icons/svg/user.svg';
    import '@/assets/icons/svg/home.svg';
    import '@/assets/icons/svg/user-menu.svg';

    export default {
        name: 'SvgIcon',
        props: {
            iconName: {
                type: String,
                required: true,
            },
            size: {
                type: [Number, String],
                default: 16,
            },
        },
        computed: {
            svg() {
                return `#${this.iconName}`;
            },

            style() {
                return {
                    width: `${this.size}px`,
                    height: `${this.size}px`,
                };
            },
        },
    };
</script>

<style lang="scss">
    .svg-icon {
        overflow: hidden;
        fill: currentColor;
        flex-shrink: 0;
    }
</style>
