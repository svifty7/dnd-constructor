<template>
    <svg
        class="svg-icon"
        viewBox="0 0 16 16"
        aria-hidden="true"
        role="img"
    >
        <use :xlink:href="svg"/>
    </svg>
</template>

<script>
    import '@/assets/icons/svg/ok.svg';
    import '@/assets/icons/svg/add.svg';
    import '@/assets/icons/svg/copy.svg';
    import '@/assets/icons/svg/edit.svg';
    import '@/assets/icons/svg/remove.svg';
    import '@/assets/icons/svg/plus.svg';
    import '@/assets/icons/svg/minus.svg';

    export default {
        name: 'SvgIcon',
        props: {
            iconName: {
                type: String,
                required: true,
            }
        },
        computed: {
            svg() {
                return `#${ this.iconName }`;
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
