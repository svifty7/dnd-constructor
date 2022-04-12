<template>
    <base-modal
        @confirm="saveHandler"
        @cancel="closeHandler"
        @close="closeHandler"
    >
        <template #title>
            Добавление страниц
        </template>

        <template #default>
            <div class="create-page">
                <div
                    v-for="(page, key) in newPages"
                    :key="key"
                    class="create-page__item"
                    :class="{ 'is-selected': page.selected }"
                    @click.left.exact.prevent="togglePage(key)"
                >
                    <div class="create-page__item_body">
                        <div class="create-page__item_checkbox">
                            <svg-icon icon-name="ok"/>
                        </div>

                        <div class="create-page__item_name">
                            {{ page.label }}
                        </div>
                    </div>

                    <div
                        class="create-page__item_count"
                        @click.left.exact.prevent.stop="togglePage(key, true)"
                    >
                        <button
                            class="create-page__item_count--minus"
                            @click.left.exact.prevent="page.count - 1 < 1 ? 1 : page.count--"
                        >
                            <svg-icon icon-name="minus"/>
                        </button>

                        <label class="create-page__item_count_field">
                            <input
                                ref="inputCount"
                                v-model="page.count"
                                type="number"
                                :disabled="!page.selected"
                                @change="correctCount(key)"
                            >
                        </label>

                        <button
                            class="create-page__item_count--plus"
                            @click.left.exact.prevent="page.count + 1 > 99 ? 99 : page.count++"
                        >
                            <svg-icon icon-name="plus"/>
                        </button>
                    </div>
                </div>
            </div>
        </template>
    </base-modal>
</template>

<script>
    import BaseModal from '@/components/modals/BaseModal';
    import _ from 'lodash';
    import SvgIcon from '@/components/UI/SvgIcon';
    import { mapState } from 'pinia/dist/pinia';
    import usePagesStore from '@/store';

    export default {
        name: 'CreatePageModal',
        components: {
            SvgIcon,
            BaseModal
        },
        emits: ['addPages'],
        data: () => ({
            newPages: []
        }),
        computed: {
            ...mapState(usePagesStore, ['getDefaultPages']),
        },
        beforeMount() {
            this.initNewPages();
        },
        methods: {
            initNewPages() {
                this.newPages = _.cloneDeep(Object.values(this.getDefaultPages))
                    .map(page => ({
                        ...page,
                        selected: false,
                        count: 0
                    }));
            },

            focusInput(key) {
                this.$nextTick(() => this.$refs.inputCount[key].focus());
            },

            togglePage(key, onlyOn = false) {
                const page = this.newPages[key];

                if (onlyOn && page.selected) {
                    return;
                }

                page.selected = !page.selected;

                if (page.selected && onlyOn) {
                    this.focusInput(key);
                }

                if (page.selected && !page.count) {
                    page.count = 1;

                    return;
                }

                if (!page.selected && page.count) {
                    page.count = 0;
                }
            },

            correctCount(key) {
                const page = this.newPages[key];

                if (page.count > 99) {
                    page.count = 99;

                    return;
                }

                if (page.count < 1) {
                    page.count = 1;
                }
            },

            closeHandler(closeEvent) {
                closeEvent();
            },

            saveHandler(closeEvent) {
                const pages = this.newPages.filter(page => page.selected);
                const result = [];

                pages.forEach(page => {
                    for (let i = 0; i < page.count; i++) {
                        result.push(page.name);
                    }
                })

                this.$emit('addPages', result);

                closeEvent();
            }
        }
    }
</script>

<style lang="scss" scoped>
    .create-page {
        width: 100%;

        &__item {
            @include css_anim();

            display: flex;
            align-items: center;
            flex-wrap: wrap;
            width: 100%;
            border: 1px solid $bg;
            padding: 12px;
            border-radius: 8px;
            cursor: pointer;

            & + & {
                margin-top: 8px;
            }

            &_body {
                width: 100%;
                display: flex;
                align-items: flex-start;

                @include media($lg) {
                    width: initial;
                    flex: 1;
                }
            }

            &_checkbox {
                @include css_anim();

                display: flex;
                align-items: center;
                justify-content: center;
                width: 24px;
                height: 24px;
                border-radius: 4px;
                border: 1px solid $bg;
                padding: 4px;

                ::v-deep(> svg) {
                    @include css_anim();

                    width: 100%;
                    height: 100%;
                    opacity: 0;
                    color: $white;
                }
            }

            &_name {
                @include css_anim();

                margin: 0 12px;
                color: $black;
                flex: 1;
            }

            &_count {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                margin-left: auto;
                margin-top: 12px;
                flex-shrink: 0;

                @include media($lg) {
                    margin-top: 0;
                }

                &_field {
                    @include css_anim();

                    margin: 0 8px;
                    display: block;

                    input {
                        @include css_anim();

                        display: block;
                        padding: 4px 8px;
                        appearance: none;
                        box-shadow: none;
                        font-size: 16px;
                        line-height: 22px;
                        background-color: $white;
                        border: 1px solid $bg;
                        border-radius: 4px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        width: 48px;
                        text-align: center;
                        cursor: text;

                        &::-webkit-outer-spin-button,
                        &::-webkit-inner-spin-button {
                            margin: 0;
                            appearance: none;
                        }

                        &:disabled {
                            background-color: $bg;
                        }

                        &:hover,
                        &:focus-within {
                            border-color: $blue;
                        }
                    }
                }

                &--plus,
                &--minus {
                    @include css_anim();

                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 24px;
                    height: 24px;
                    border-radius: 4px;
                    border: 1px solid $bg;
                    padding: 4px;
                    cursor: pointer;
                    color: $gray-dark;
                    background-color: $bg;

                    ::v-deep(> svg) {
                        width: 100%;
                        height: 100%;
                    }

                    &:hover {
                        background-color: $blue;
                        border-color: $blue;
                        color: $white;
                    }
                }
            }

            @mixin selected {
                border-color: $blue;

                .create-page {
                    &__item {
                        &_checkbox {
                            border-color: $blue;
                            background-color: $blue;

                            ::v-deep(> svg) {
                                opacity: 1;
                            }
                        }

                        &_name {
                            color: $blue;
                        }

                        &_count {
                            &_field {
                                border-color: $blue;
                            }
                        }
                    }
                }
            }

            &.is-selected {
                @include selected;
            }

            &:hover {
                @include media($lg) {
                    @include selected;

                    &:not(.is-selected) {
                        .create-page {
                            &__item {
                                &_checkbox {
                                    background-color: transparentize($blue, .7);
                                    border-color: transparentize($blue, .7);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>
