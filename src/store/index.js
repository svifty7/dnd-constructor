import { defineStore } from 'pinia/dist/pinia';
import _ from 'lodash';

const usePagesStore = defineStore('pagesStore', {
    state: () => ({
        pages: {
            Info: {
                name: 'Info',
                preview: 'info-page',
                label: 'Основная информация',
            },
            CharBase: {
                name: 'CharBase',
                preview: 'char-base-page',
                label: 'Характеристики',
            },
            CharResource: {
                name: 'CharResource',
                preview: 'char-resource-page',
                label: 'Характеристики с дополнительным ресурсом',
            },
            CharResourceDouble: {
                name: 'CharResourceDouble',
                preview: 'char-resource-double-page',
                label: 'Характеристики с двумя дополнительными ресурсами',
            },
            Inventory: {
                name: 'Inventory',
                preview: 'inventory-page',
                label: 'Инвентарь',
            },
            SpellsOne: {
                name: 'SpellsOne',
                preview: 'spells-one-page',
                label: 'Заклинания (круг 1-3)',
            },
            SpellsTwo: {
                name: 'SpellsTwo',
                preview: 'spells-two-page',
                label: 'Заклинания (круг 4-7)',
            },
            SpellsThree: {
                name: 'SpellsThree',
                preview: 'spells-three-page',
                label: 'Заклинания (круг 8-9)',
            },
            Appearance: {
                name: 'Appearance',
                preview: 'appearance-page',
                label: 'Внешний вид',
            },
            Notes: {
                name: 'Notes',
                preview: 'notes-page',
                label: 'Заметки',
            },
        },
        sortedPages: [],
        style: {
            color: {
                accent: '#1c1c1e',
                background: '#ffffff'
            },
            additional: {
                image: undefined,
                accent: '#aeaeb2',
                background: '#f2f2f7',
                backgroundOpacity: 1
            }
        }
    }),

    getters: {
        getDefaultPages: state => state.pages,
        getSortedPages: state => state.sortedPages,
        getPagesStyle: state => state.style
    },

    actions: {
        setSortedPages(pages) {
            this.sortedPages = _.cloneDeep(pages)
                .map((page, index) => ({
                    ...page,
                    index,
                    selected: page?.selected || false
                }));
        },

        addSortedPages(index, pages) {
            const correctedIndex = index + 1;
            const editedSortedPages = this.sortedPages.map(page => page.name);

            for (let i = 0; i < pages.length; i++) {
                editedSortedPages.splice(correctedIndex + i, 0, pages[i]);
            }

            this.sortedPages = editedSortedPages.map((page, i) => ({
                index: i,
                ...this.pages[page],
                selected: false
            }))
        },

        toggleSortedPageSelected(index) {
            this.sortedPages[index].selected = !this.sortedPages[index].selected;
        },

        deselectAllSortedPages() {
            for (let i = 0; i < this.sortedPages.length; i++) {
                this.sortedPages[i].selected = false;
            }
        }
    }
});

export default usePagesStore;
