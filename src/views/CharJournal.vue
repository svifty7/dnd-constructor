<template>
    <draggable
        v-model="getSortedPages"
        v-bind="dragOptions"
        group="pages"
        item-key="index"
        handle=".drag-target"
        delay-on-touch-only="300"
        touch-start-threshold="3"
        class="char-journal"
        tag="transition-group"
        :component-data="{ tag: 'div', type: 'transition-group', name: 'fade' }"
    >
        <template #item="{ element }">
            <div class="char-journal__page">
                <page-preview
                    :page="element"
                />
            </div>
        </template>
    </draggable>
</template>

<script>
    import PagePreview from '@/views/PagePreview';
    import Draggable from 'vuedraggable';
    import { mapState } from 'pinia/dist/pinia';
    import usePagesStore from '@/store';

    export default {
        name: 'CharJournal',
        components: {
            PagePreview,
            Draggable
        },
        computed: {
            ...mapState(usePagesStore, ['getSortedPages']),

            dragOptions() {
                return {
                    animation: 300,
                    group: "pages",
                    disabled: false
                };
            }
        },
        methods: {
            downloadPDF(pdf) {
                const url = document.createElement('a');
                const blob = new Blob([pdf], {
                    type: 'application/octet-stream',
                });

                url.download = 'CharacterJournal.pdf';
                url.href = URL.createObjectURL(blob);

                url.click();

                URL.revokeObjectURL(url.href);
            },
        },
    }
</script>

<style lang="scss" scoped>
    .char-journal {
        overflow: auto;
        display: grid;
        grid-template-columns: repeat(1, 1fr);
        align-content: start;
        grid-gap: 32px;
        padding: 48px;
        max-width: 1440px;
        margin: 0 auto;

        @include media($sm) {
            grid-template-columns: repeat(2, 1fr);
        }

        @include media($lg) {
            grid-template-columns: repeat(3, 1fr);
        }

        @include media($xl) {
            grid-template-columns: repeat(4, 1fr);
        }

        @include media($xxl) {
            grid-template-columns: repeat(5, 1fr);
        }

        &__page {
            width: 100%;
        }
    }
</style>
