<template>
    <svg
        class="svg-page"
        viewBox="0 0 1822 2554"
        aria-hidden="true"
        role="img"
    >
        <use :xlink:href="svg"/>
    </svg>
</template>

<script>
    import '@/assets/icons/svg/journal/appearance.svg';
    import '@/assets/icons/svg/journal/char-base.svg';
    import '@/assets/icons/svg/journal/char-resource.svg';
    import '@/assets/icons/svg/journal/char-resource-double.svg';
    import '@/assets/icons/svg/journal/info.svg';
    import '@/assets/icons/svg/journal/inventory.svg';
    import '@/assets/icons/svg/journal/notes.svg';
    import '@/assets/icons/svg/journal/spells-one.svg';
    import '@/assets/icons/svg/journal/spells-two.svg';
    import '@/assets/icons/svg/journal/spells-three.svg';

    export default {
        name: 'SvgPage',
        props: {
            pageName: {
                type: String,
                required: true,
            }
        },
        computed: {
            svg() {
                return `#${ this.pageName }`;
            },
        },
    };
</script>

<style lang="scss">
    .svg-page {
        overflow: hidden;
        flex-shrink: 0;
        width: 100%;
        height: 100%;
    }
</style>
