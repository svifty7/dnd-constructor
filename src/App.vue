<template>
    <header class="header">
        <button class="customize-btn">
            <svg-icon icon-name="customize"/>
        </button>
    </header>

    <main class="dnd-app">
        <char-journal/>
    </main>

    <modals-container/>
</template>

<script>
    import ScrollLock from '@/common/mixins/ScrollLock';
    import CharJournal from '@/views/CharJournal';
    import usePagesStore from '@/store';
    import { mapActions, mapState } from 'pinia/dist/pinia';
    import SvgIcon from '@/components/UI/SvgIcon';

    export default {
        name: 'App',
        components: {
            SvgIcon,
            CharJournal
        },
        mixins: [ScrollLock],
        computed: {
            ...mapState(usePagesStore, ['getDefaultPages', 'getPagesStyle'])
        },
        beforeMount() {
            this.setSortedPages(Object.values(this.getDefaultPages));

            const pagesStore = usePagesStore();

            pagesStore.$subscribe(this.updateStyleVariables);

            this.updateStyleVariables();
        },
        methods: {
            ...mapActions(usePagesStore, ['setSortedPages']),

            updateStyleVariables() {
                const style = this.getPagesStyle;

                document.documentElement.style.setProperty(
                    '--page-color-accent',
                    style.color.accent
                );

                document.documentElement.style.setProperty(
                    '--page-color-background',
                    style.color.background
                );

                document.documentElement.style.setProperty(
                    '--page-additional-color-accent',
                    style.additional.accent
                );

                document.documentElement.style.setProperty(
                    '--page-additional-color-background',
                    style.additional.background
                );

                document.documentElement.style.setProperty(
                    '--page-additional-background-opacity',
                    style.additional.backgroundOpacity
                );
            }
        }
    };
</script>

<style lang="scss" scoped>
    .dnd-app {
        display: flex;
        flex-direction: column;
        width: 100%;
    }
</style>
