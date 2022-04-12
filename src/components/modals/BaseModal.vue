<template>
    <vue-final-modal
        v-slot="{ params, close }"
        v-bind="$attrs"
        content-class="base-modal"
    >
        <div class="base-modal__header">
            <div class="base-modal__title">
                <slot name="title"/>
            </div>

            <button
                class="base-modal__close"
                @click.left.exact.prevent="close"
            >
                <span class="base-modal__close_icon">
                    <svg-icon icon-name="remove"/>
                </span>
            </button>
        </div>

        <div class="base-modal__content">
            <div class="base-modal__safe">
                <div class="base-modal__body">
                    <slot :params="params"/>
                </div>
            </div>
        </div>

        <div class="base-modal__controls">
            <button
                class="base-modal__btn is-cancel"
                @click.left.exact.prevent="$emit('cancel', close)"
            >
                Отмена
            </button>

            <button
                class="base-modal__btn is-ok"
                @click.left.exact.prevent="$emit('confirm', close)"
            >
                Ок
            </button>
        </div>
    </vue-final-modal>
</template>

<script>
    import SvgIcon from '@/components/UI/SvgIcon';

    export default {
        name: 'BaseModal',
        components: { SvgIcon },
        inheritAttrs: true,
        emits: ['cancel', 'confirm']
    }
</script>

<style lang="scss" scoped>
    ::v-deep(.vfm__container) {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    ::v-deep(.base-modal) {
        background-color: $white;
        max-width: 90%;
        max-height: 90%;
        margin: auto;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 0 12px -8px $black;
        display: flex;
        flex-direction: column;
    }

    .base-modal {
        &__header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 16px;
            border-bottom: 1px solid $bg;
            flex-shrink: 0;
        }

        &__title {
            color: $blue;
            font-size: 22px;
            line-height: 28px;
            padding-bottom: 4px;
        }

        &__close {
            @include css_anim($time: .2s);

            margin-left: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 0;
            background-color: transparent;
            cursor: pointer;
            color: $blue;
            appearance: none;
            padding: 0;
            border-radius: 8px;
            overflow: hidden;

            &_icon {
                width: 32px;
                height: 32px;
                padding: 8px;

                ::v-deep(> svg) {
                    width: 100%;
                    height: 100%;
                }
            }

            &:hover {
                @include media($lg) {
                    color: $gray-dark;
                    background-color: $bg;
                }
            }
        }

        &__content {
            overflow: auto;
            width: 100%;
            flex: 1;
        }

        &__safe {
            padding: 16px;
        }

        &__controls {
            @include css_anim();

            display: flex;
            justify-content: flex-end;
            width: 100%;
            z-index: 1;
            position: relative;
            padding: 12px 16px;
            flex-shrink: 0;
            border: 1px solid $bg;

            &:hover {
                @include media($lg) {
                    box-shadow: 0 0 16px $bg;
                }
            }
        }

        &__btn {
            @include css_anim($time: .2s);

            display: flex;
            align-items: center;
            justify-content: center;
            flex: 1;
            border: 1px solid $bg;
            border-radius: 8px;
            background-color: transparent;
            cursor: pointer;
            color: $blue;
            appearance: none;
            padding: 12px 16px;

            & + & {
                margin-left: 16px;
            }

            &:hover {
                @include media($lg) {
                    color: $white;

                    &.is-cancel {
                        background-color: $red;
                        border-color: $red;
                    }

                    &.is-ok {
                        background-color: $green;
                        border-color: $green;
                    }
                }
            }
        }
    }
</style>
