<template>
    <div class="checkbox"
         :class="{ 'is-true': value }"
         @click.left.exact.prevent="change(!value)"
    >
        <div class="checkbox__value"/>
    </div>
</template>

<script>
    import VModel from '@/helpers/mixins/VModelMixin';

    export default {
        name: 'Checkbox',
        mixins: [VModel],
        props: {
            value: {
                type: Boolean,
                default: false
            }
        },
    };
</script>

<style lang="scss" scoped>
    .checkbox {
        width: 16px;
        height: 16px;
        border: 1px solid $gray;
        border-radius: 2px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;

        &__value {
            @include css_anim();

            opacity: 0;
            background-color: $lBlack;
            width: calc(100% - 4px);
            height: calc(100% - 4px);
            border-radius: 2px;
        }

        &.is-true {
            .checkbox__value {
                opacity: 1;
            }
        }

        &:hover {
            &:not(.is-true) {
                .checkbox__value {
                    opacity: .4;
                }
            }
        }
    }
</style>
