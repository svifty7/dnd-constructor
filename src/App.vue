<template>
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

    export default {
        name: 'App',
        components: { CharJournal },
        mixins: [ScrollLock],
        computed: {
            ...mapState(usePagesStore, ['getDefaultPages'])
        },
        beforeMount() {
            this.setSortedPages(Object.values(this.getDefaultPages));
        },
        methods: {
            ...mapActions(usePagesStore, ['setSortedPages'])
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
