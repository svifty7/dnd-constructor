<template>
    <div class="constructor">
        <div class="constructor__builder">
            <div v-for="(page, index) in selected"
                 :key="index"
                 class="constructor__builder_page"
            >
                <div v-if="isAddBtnVisible(index, 'top')"
                     class="constructor__builder_page_add"
                     @click.left.exact.prevent="addPage(0)"
                >
                    <div class="constructor__builder_page_add_btn"/>
                </div>

                <div class="constructor__builder_page_value">
                    <multiselect v-if="page.type === ''"
                                 :value="null"
                                 :options="pages"
                                 label="name"
                                 track-by="type"
                                 placeholder="Выберите тип страницы"
                                 @select="setPageType($event, index)"
                    />

                    <div v-else
                         class="constructor__builder_page_value_text"
                    >
                        {{ getPageName(page.type) }}
                    </div>

                    <label class="constructor__builder_page_value_count">
                        <input v-model.number.trim="page.count"
                               type="text"
                        >
                    </label>

                    <div v-if="selected.length > 1"
                         class="constructor__builder_page_rm"
                         @click.left.exact.prevent="removePage(index)"
                    />
                </div>

                <div
                    v-if="isAddBtnVisible(index, 'bottom')"
                    class="constructor__builder_page_add"
                    @click.left.exact.prevent="addPage(index + 1)"
                >
                    <div class="constructor__builder_page_add_btn"/>
                </div>
            </div>

            <div v-if="isBigAddBtnVisible"
                 class="constructor__builder_add"
                 @click.left.exact.prevent="addPage(selected.length)"
            >
                <span>{{ 'Добавить страницу' }}</span>
            </div>

            <div class="constructor__builder_preview"
                 @click.left.exact.prevent="previewIndex = 0"
            >
                <span>{{ 'Предпросмотр' }}</span>
            </div>

            <div class="constructor__builder_download"
                 @click.left.exact.prevent="createPDF"
            >
                <transition name="fade">
                    <svg-icon v-if="loading"
                              icon-name="loader"
                    />
                </transition>

                <span>{{ 'Скачать' }}</span>
            </div>
        </div>

        <cool-light-box
            :items="previewPDF"
            :index="previewIndex"
            @close="previewIndex = null"
        />
    </div>
</template>

<script>
    import { PDFDocument } from 'pdf-lib'
    import Multiselect from 'vue-multiselect'
    import CoolLightBox from 'vue-cool-lightbox'
    import SvgIcon from '@/components/UI/SvgIcon';

    export default {
        name: 'Constructor',
        components: { SvgIcon, Multiselect, CoolLightBox },
        data() {
            return {
                pages: [{
                    type: 'mainInfo',
                    name: 'Титульный лист',
                }, {
                    type: 'characteristic',
                    name: 'Характеристики',
                }, {
                    type: 'inventory',
                    name: 'Инвентарь',
                }, {
                    type: 'spellsOne',
                    name: 'Заклинания (1 - 3 круг)',
                }, {
                    type: 'spellsTwo',
                    name: 'Заклинания (4 - 7 круг)',
                }, {
                    type: 'spellsThree',
                    name: 'Заклинания (8 - 9 круг)',
                }, {
                    type: 'appearance',
                    name: 'Внешний вид',
                }, {
                    type: 'notes',
                    name: 'Заметки',
                }],
                selected: [{
                    type: 'mainInfo',
                    count: 1,
                }, {
                    type: 'characteristic',
                    count: 1,
                }, {
                    type: 'inventory',
                    count: 1,
                }, {
                    type: 'spellsOne',
                    count: 1,
                }, {
                    type: 'spellsTwo',
                    count: 1,
                }, {
                    type: 'spellsThree',
                    count: 1,
                }, {
                    type: 'appearance',
                    count: 1,
                }, {
                    type: 'notes',
                    count: 3,
                }],
                maxPageCount: 64,
                previewIndex: null,
                loading: false,
            }
        },
        computed: {
            pagesCount() {
                let count = 0;

                this.selected.forEach(page => {
                    count += page.count === '' ? 1 : page.count
                })

                return count
            },

            isMaxPageCount() {
                return this.pagesCount >= this.maxPageCount
            },

            isBigAddBtnVisible() {
                return !!this.selected[this.selected.length - 1].type
            },

            previewPDF() {
                const pages = [];

                let counter = 1;

                this.selected.forEach(page => {
                    if (!page.type) return;

                    const defaultPage = this.pages.find(item => item.type === page.type);

                    pages.push({
                        id: counter,
                        type: defaultPage.type,
                        count: page.count,
                        title: defaultPage.name,
                        description: `В количестве ${page.count} стр.`,
                        src: `${this.$baseUrl}/constructor/png/${page.type}.png`,
                    });

                    counter++;
                });

                return pages
            },

            readyPDF() {
                const pages = [];

                let counter = 0;

                this.previewPDF.forEach(page => {
                    let duplicate = 1;

                    while (duplicate <= page.count) {
                        pages.push({
                            index: counter,
                            type: page.type,
                        });

                        counter++;
                        duplicate++;
                    }
                });

                return pages
            },
        },
        methods: {
            getPageName(type) {
                const page = this.pages.find(item => item.type === type);

                return page.name;
            },

            addPage(index) {
                const emptyIndex = this.selected.findIndex(page => !page.type);
                const list = [...this.selected.filter(page => !!page.type)];

                list.splice(emptyIndex >= 0 && index > emptyIndex ? index - 1 : index, 0, {
                    type: '',
                    count: 1,
                });

                this.selected = list;
            },

            removePage(index) {
                this.selected.splice(index, 1);
            },

            setPageType(e, index) {
                this.selected[index].type = e.type
            },

            isAddBtnVisible(index, type) {
                const page = this.selected[index];
                const nextPage = this.selected[index + 1];
                const { selected, isMaxPageCount } = this;

                if (isMaxPageCount || !page.type) return false

                switch (type) {
                    case 'top':
                        return index === 0

                    case 'bottom':
                        return index !== selected.length - 1
                            && !!nextPage
                            && !!nextPage.type

                    default:
                        return false
                }
            },

            async getPages() {
                return {
                    mainInfo: await (await fetch(`${this.$baseUrl}/constructor/pdf/mainInfo.pdf`))
                        .arrayBuffer(),
                    characteristic: await (await fetch(`${this.$baseUrl}/constructor/pdf/characteristic.pdf`))
                        .arrayBuffer(),
                    inventory: await (await fetch(`${this.$baseUrl}/constructor/pdf/inventory.pdf`))
                        .arrayBuffer(),
                    spellsOne: await (await fetch(`${this.$baseUrl}/constructor/pdf/spellsOne.pdf`))
                        .arrayBuffer(),
                    spellsTwo: await (await fetch(`${this.$baseUrl}/constructor/pdf/spellsTwo.pdf`))
                        .arrayBuffer(),
                    spellsThree: await (await fetch(`${this.$baseUrl}/constructor/pdf/spellsThree.pdf`))
                        .arrayBuffer(),
                    appearance: await (await fetch(`${this.$baseUrl}/constructor/pdf/appearance.pdf`))
                        .arrayBuffer(),
                    notes: await (await fetch(`${this.$baseUrl}/constructor/pdf/notes.pdf`))
                        .arrayBuffer(),
                };
            },

            async createPDF() {
                if (!Array.isArray(this.selected) || !this.selected.length) return;

                this.loading = true;

                const pages = await this.getPages();
                const pdf = await PDFDocument.create();

                for (const page of this.readyPDF) {
                    const { index } = page;
                    const loadedPage = await PDFDocument.load(pages[page.type]);
                    const [readyPage] = await pdf.copyPages(loadedPage, [0]);

                    if (index === 0) {
                        pdf.addPage(readyPage);
                    } else {
                        pdf.insertPage(index, readyPage);
                    }
                }

                this.downloadPDF(await pdf.save());
            },

            downloadPDF(pdf) {
                const url = document.createElement('a');
                const blob = new Blob([pdf], {
                    type: 'application/octet-stream',
                });

                url.download = 'CharacterJournal.pdf';
                url.href = URL.createObjectURL(blob);

                url.click();

                URL.revokeObjectURL(url.href);

                this.loading = false;
            },
        },
    }
</script>

<style lang="scss" scoped>
    .constructor {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        user-select: none;

        * {
            user-select: none;
        }

        &__builder {
            max-width: 512px;
            width: 100%;
            padding: 48px 16px 48px 48px;

            &_page {
                width: 100%;

                &_add {
                    display: flex;
                    align-items: center;
                    position: relative;
                    height: 2px;
                    width: calc(100% + 50px);
                    margin-left: -34px;
                    background-color: transparentize($gray, .7);

                    &_btn {
                        @include css_anim();

                        display: flex;
                        justify-content: center;
                        align-items: center;
                        background-color: $green;
                        border-radius: 50%;
                        width: 20px;
                        height: 20px;
                        cursor: pointer;

                        &:hover {
                            @include css_anim();

                            background-color: darken($green, 7%);
                        }

                        &:before, &:after {
                            content: '';
                            display: block;
                            width: 10px;
                            height: 2px;
                            background-color: $white;
                            position: absolute;
                        }

                        &:after {
                            transform: rotate(90deg);
                        }
                    }
                }

                &_value {
                    display: flex;
                    align-items: center;
                    padding: 12px 0;

                    .multiselect {
                        width: calc(100% - 64px - 8px);
                    }

                    &_text {
                        width: 100%;
                    }

                    &_count {
                        flex-shrink: 0;
                        margin-left: 8px;
                        overflow: hidden;
                        width: 64px;

                        input {
                            border: 1px solid $gray;
                            border-radius: 4px;
                            width: 100%;
                            height: 100%;
                            appearance: none;
                            padding: 6px 12px;
                            font-size: 16px;
                            line-height: 22px;
                            min-height: 36px;
                            user-select: initial;
                        }
                    }
                }

                &_rm {
                    @include css_anim();

                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-color: $red;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    cursor: pointer;
                    flex-shrink: 0;
                    margin-left: 8px;

                    &:hover {
                        @include css_anim();

                        background-color: darken($red, 7%);
                    }

                    &:before, &:after {
                        content: '';
                        display: block;
                        width: 10px;
                        height: 2px;
                        background-color: $white;
                        position: absolute;
                    }

                    &:before {
                        transform: rotate(45deg);
                    }

                    &:after {
                        transform: rotate(-45deg);
                    }
                }
            }

            &_add, &_preview, &_download {
                @include css_anim();

                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                border-radius: 4px;
                text-align: center;
                padding: 12px 16px;
                cursor: pointer;
                border: {
                    width: 1px;
                    style: solid;
                };

                span {
                    color: currentColor;
                    font-size: 16px;
                    line-height: 22px;
                }

                .svg-icon {
                    width: 22px;
                    height: 22px;
                    color: currentColor;

                    & + span {
                        margin-left: 8px;
                    }
                }

                &:hover, &.is-loading {
                    @include css_anim();

                    color: $white;
                }
            }

            &_add {
                color: $green;
                border-color: $green;
                background-color: transparentize($green, .85);

                &:hover {
                    background-color: $green;
                }
            }

            &_preview {
                margin-top: 16px;
                color: $black;
                border-color: $black;
                background-color: $white;

                &:hover {
                    background-color: $black;
                }
            }

            &_download {
                margin-top: 16px;
                color: $black;
                border-color: $black;
                background-color: transparentize($black, .85);

                &:hover, &.is-loading {
                    background-color: $black;
                }
            }
        }
    }
</style>
