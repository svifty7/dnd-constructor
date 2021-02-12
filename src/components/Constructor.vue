<template>
    <div class="constructor">
        <div class="constructor__previews">
            <div v-for="(page, index) in pages"
                 :key="index"
                 class="constructor__preview"
                 @click="createPDF"
            >
                <div class="constructor__preview_img"
                     :style="{ backgroundImage: `url(/constructor/png/${page.name}.png)` }"
                />

                <div class="constructor__preview_name">
                    {{ page.transl }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { PDFDocument } from 'pdf-lib'

    export default {
        name: 'Constructor',
        data() {
            return {
                pages: [{
                    name: 'mainInfo',
                    transl: 'Титульный лист',
                }, {
                    name: 'characteristic',
                    transl: 'Характеристики',
                }, {
                    name: 'inventory',
                    transl: 'Инвентарь',
                }, {
                    name: 'spellsOne',
                    transl: 'Заклинания (1 - 3 круг)',
                }, {
                    name: 'spellsTwo',
                    transl: 'Заклинания (4 - 7 круг)',
                }, {
                    name: 'spellsThree',
                    transl: 'Заклинания (8 - 9 круг)',
                }, {
                    name: 'appearance',
                    transl: 'Внешний вид',
                }, {
                    name: 'notes',
                    transl: 'Заметки',
                }],
                selected: []
            }
        },
        methods: {
            async getPages() {
                return {
                    mainInfo: await (await fetch('/constructor/pdf/mainInfo.pdf')).arrayBuffer(),
                    characteristic: await (await fetch('/constructor/pdf/characteristic.pdf')).arrayBuffer(),
                    inventory: await (await fetch('/constructor/pdf/inventory.pdf')).arrayBuffer(),
                    spellsOne: await (await fetch('/constructor/pdf/spellsOne.pdf')).arrayBuffer(),
                    spellsTwo: await (await fetch('/constructor/pdf/spellsTwo.pdf')).arrayBuffer(),
                    spellsThree: await (await fetch('/constructor/pdf/spellsThree.pdf')).arrayBuffer(),
                    appearance: await (await fetch('/constructor/pdf/appearance.pdf')).arrayBuffer(),
                    notes: await (await fetch('/constructor/pdf/notes.pdf')).arrayBuffer(),
                };
            },

            async createPDF() {
                if (!Array.isArray(this.selected) || !this.selected.length) return;

                const pages = await this.getPages();
                const pdf = await PDFDocument.create();

                for (const page of this.selected) {
                    const index = this.selected.indexOf(page);
                    const loadedPage = await PDFDocument.load(pages[page]);
                    const [readyPage] = await pdf.copyPages(loadedPage, [0]);

                    if (index === 0) {
                        pdf.addPage(readyPage);
                    } else {
                        pdf.insertPage(index, readyPage)
                    }
                }

                this.downloadPDF(await pdf.save());
            },

            downloadPDF(pdf) {
                const url = document.createElement('a');
                const blob = new Blob([pdf], {
                    type: 'application/octet-stream'
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
    .constructor {
        width: 100%;

        &__previews {
            display: flex;
            flex-wrap: wrap;
            width: 100%;
        }

        &__preview {
            width: 25%;

            &:nth-child(n+4) {
                margin-top: 16px;
            }

            &_img {
                @include back-img(contain);

                content: '';
                display: block;
                width: 100%;

                &:after {
                    content: '';
                    display: block;
                    width: 100%;
                    padding-bottom: 595 / 420 * 100%;
                }
            }

            &_name {
                margin-top: 8px;
                font-size: 18px;
                line-height: 24px;
                color: $black;
                text-align: center;
            }
        }
    }
</style>
