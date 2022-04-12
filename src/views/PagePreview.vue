<template>
    <div class="page-preview">
        <div class="page-preview__body">
            <div class="page-preview__img drag-target">
                <component
                    :is="pages[page.name]"
                    :accent-color="'#1c1c1e'"
                    :background-color="'#ffffff'"
                    :additional-accent-color="'#aeaeb2'"
                    :additional-background-color="'#f2f2f7'"
                    :additional-background-color-opacity="1"
                />
            </div>

            <div class="page-preview__controls">
                <button class="page-preview__btn is-remove">
                    <span class="page-preview__btn_icon">
                        <svg-icon icon-name="remove"/>
                    </span>
                </button>

                <button class="page-preview__btn is-edit">
                    <span class="page-preview__btn_icon">
                        <svg-icon icon-name="edit"/>
                    </span>
                </button>

                <button
                    class="page-preview__btn is-add"
                    @click.left.prevent.exact="openModalCreate"
                >
                    <span class="page-preview__btn_icon">
                        <svg-icon icon-name="add"/>
                    </span>
                </button>
            </div>
        </div>

        <div class="page-preview__name">
            {{ page.label }}
        </div>
    </div>
</template>

<script>
    import SvgIcon from '@/components/UI/SvgIcon';
    import AppearancePage from '@/components/pages/AppearancePage';
    import CharBasePage from '@/components/pages/CharBasePage';
    import CharResourcePage from '@/components/pages/CharResourcePage';
    import CharResourceDoublePage from '@/components/pages/CharResourceDoublePage';
    import InfoPage from '@/components/pages/InfoPage';
    import InventoryPage from '@/components/pages/InventoryPage';
    import NotesPage from '@/components/pages/NotesPage';
    import SpellsOnePage from '@/components/pages/SpellsOnePage';
    import SpellsTwoPage from '@/components/pages/SpellsTwoPage';
    import SpellsThreePage from '@/components/pages/SpellsThreePage';
    import { shallowRef } from 'vue';
    import CreatePageModal from '@/components/modals/CreatePageModal';
    import { mapActions } from 'pinia/dist/pinia';
    import usePagesStore from '@/store';

    export default {
        name: 'PagePreview',
        components: { SvgIcon },
        props: {
            page: {
                type: Object,
                default: () => ({})
            }
        },
        data: () => ({
            pages: {
                Info: shallowRef(InfoPage),
                CharBase: shallowRef(CharBasePage),
                CharResource: shallowRef(CharResourcePage),
                CharResourceDouble: shallowRef(CharResourceDoublePage),
                Inventory: shallowRef(InventoryPage),
                SpellsOne: shallowRef(SpellsOnePage),
                SpellsTwo: shallowRef(SpellsTwoPage),
                SpellsThree: shallowRef(SpellsThreePage),
                Appearance: shallowRef(AppearancePage),
                Notes: shallowRef(NotesPage),
            }
        }),
        methods: {
            ...mapActions(usePagesStore, ['addSortedPages']),

            openModalCreate() {
                this.$vfm.show({
                    component: CreatePageModal,
                    on: {
                        addPages: pages => this.addSortedPages(this.page.index, pages)
                    }
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .page-preview {
        width: 100%;

        &__body {
            @include css_anim();

            width: 100%;
            background-color: $white;
            border-radius: 8px;
            overflow: hidden;
        }

        &__img {
            width: 100%;
            position: relative;

            &:before {
                content: '';
                display: block;
                width: 100%;
                padding-bottom: calc(2554 / 1822 * 100%);
            }

            ::v-deep(> svg) {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }
        }

        &__controls {
            @include css_anim();

            display: flex;
            width: 100%;
            z-index: 1;
            position: relative;

            &:hover {
                @include media($lg) {
                    box-shadow: 0 0 12px -1px $gray-light;
                }
            }
        }

        &__btn {
            @include css_anim($time: .2s);

            display: flex;
            align-items: center;
            justify-content: center;
            flex: 1;
            border: 0;
            background-color: transparent;
            cursor: pointer;
            color: $blue;
            appearance: none;
            padding: 0;
            border-top: 1px solid $bg;

            &_icon {
                width: 48px;
                height: 48px;
                padding: 12px;

                ::v-deep(> svg) {
                    width: 100%;
                    height: 100%;
                }
            }

            &:hover {
                @include media($lg) {
                    color: $white;

                    &.is-remove {
                        background-color: $red;
                        border-color: $red;
                    }

                    &.is-edit {
                        background-color: $blue;
                        border-color: $blue;
                    }

                    &.is-add {
                        background-color: $green;
                        border-color: $green;
                    }
                }
            }
        }

        &__name {
            text-align: center;
            margin-top: 12px;
            font-size: 14px;
        }

        &:hover {
            @include media($lg) {
                .page-preview {
                    &__body {
                        box-shadow: 0 0 12px $gray-light;
                    }
                }
            }
        }
    }
</style>
