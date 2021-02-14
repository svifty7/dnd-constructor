<template>
    <div class="dnd-app">
        <header class="header">
            <div class="nav__btn"
                 :class="{ 'is-opened': menu.opened }"
                 @click.left.exact.prevent="menu.opened = !menu.opened"
            />

            <div v-if="$route.meta.title"
                 class="header__title"
            >
                {{ $route.meta.title }}
            </div>

            <router-link v-if="$route.name !== 'home'"
                         :to="{ name: 'home' }"
                         class="header__home"
                         @click.left.exact="menu.opened = false"
            >
                <svg-icon icon-name="home"
                          size="24"
                />
            </router-link>
        </header>

        <div v-scroll-lock="menu.opened"
             class="nav"
             :class="{ 'is-opened': menu.opened }"
             @click.left.exact.self.prevent="menu.opened = false"
        >
            <div class="nav__body">
                <router-link v-for="(item, itemKey) in menu.list"
                             :key="itemKey"
                             :to="{ name: item.link, params: 'params' in item && item.params ? item.params : {} }"
                             class="nav__item"
                             active-class="is-active"
                             @click.left.exact="menu.opened = false"
                >
                    {{ item.name }}
                </router-link>

                <div class="icons8">
                    Все иконки взяты с сайта <a href="//icons8.ru"
                                                target="_blank"
                    >Icons8</a>
                </div>
            </div>
        </div>

        <main class="main">
            <router-view v-slot="{ Component }">
                <transition name="fade"
                            mode="out-in"
                >
                    <component :is="Component"/>
                </transition>
            </router-view>
        </main>
    </div>
</template>

<script>
    import SvgIcon from '@/components/UI/SvgIcon';
    import ScrollLock from '@/helpers/mixins/ScrollLock';

    export default {
        name: 'App',
        components: { SvgIcon },
        mixins: [ScrollLock],
        data() {
            return {
                menu: {
                    opened: false,
                    list: [{
                        name: 'Список персонажей',
                        link: 'home',
                    }],
                },
            };
        },
    };
</script>

<style lang="scss" scoped>
    .dnd-app {
        width: 100%;
    }

    .header {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 40px;
        z-index: 100;
        background-color: $white;
        display: none;
        align-items: center;
        padding: 8px 16px;
        box-shadow: 0 0 8px transparentize($black, .7);
        overflow: hidden;

        &__title {
            width: 100%;
            padding: 0 40px;
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
            font-weight: 600;
            font-size: 18px;
            text-align: center;
        }

        &__home {
            @include css_anim($item: color);

            display: flex;
            position: absolute;
            top: 8px;
            right: 16px;
            left: initial;
            color: $black;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            border-radius: 2px;
            cursor: pointer;

            &:hover {
                @include css_anim();

                color: $lBlack;
            }
        }
    }

    .nav {
        @include css_anim();

        position: fixed;
        top: 40px;
        left: 0;
        width: 100%;
        height: calc(100% - 40px);
        background-color: transparentize($black, .7);
        pointer-events: none;
        opacity: 0;
        z-index: 110;
        display: flex;
        justify-content: flex-start;
        overflow: hidden;

        &__body {
            @include css_anim();

            width: 288px;
            height: 100%;
            background-color: $white;
            transform: translateX(-100%);
            display: flex;
            flex-direction: column;
            padding-top: 16px;
            box-shadow: inset 1px 4px 9px -6px transparentize($black, .7);
            cursor: default;
            position: relative;
            overflow: auto;
        }

        &.is-opened {
            opacity: 1;
            pointer-events: auto;
            cursor: pointer;

            .nav__body {
                transform: translateX(0);
            }
        }

        &__btn {
            display: flex;
            position: fixed;
            top: 8px;
            left: 16px;
            color: $black;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            border-radius: 2px;
            z-index: 130;
            cursor: pointer;

            &:before, &:after {
                @include css_anim();

                content: '';
                display: block;
                position: absolute;
                width: 16px;
                height: 2px;
                border-radius: 2px;
                background-color: currentColor;
            }

            &:before {
                transform: translateY(-3px);
            }

            &:after {
                transform: translateY(3px);
            }

            &:hover {
                &:before {
                    transform: translateY(-3px) translateX(3px);
                }

                &:after {
                    transform: translateY(3px) translateX(-3px);
                }
            }

            &.is-opened {
                &:before {
                    transform: rotate(45deg);
                }

                &:after {
                    transform: rotate(-45deg);
                }
            }
        }

        &__item {
            padding: 8px 16px;
            display: flex;
            width: 100%;
            cursor: pointer;
            flex-shrink: 0;
            color: $black;

            &:last-of-type {
                padding-bottom: 24px;
            }

            &.is-active {
                color: $green;
            }
        }

        .icons8 {
            width: 100%;
            border-top: 1px solid $gray;
            padding: 12px 16px;
            font-size: 14px;
            background-color: $white;
            color: $black;
            margin-top: auto;
            position: sticky;
            left: 0;
            bottom: 0;

            a {
                color: $green;

                &:hover {
                    color: $gray;
                }
            }
        }
    }
</style>
