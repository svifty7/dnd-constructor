import { defineStore } from 'pinia/dist/pinia';
import _ from 'lodash';

const usePagesStore = defineStore('pagesStore', {
    state: () => ({
        pages: {
            Info: {
                name: 'Info',
                label: 'Основная информация',
            },
            CharBase: {
                name: 'CharBase',
                label: 'Характеристики',
            },
            CharResource: {
                name: 'CharResource',
                label: 'Характеристики с дополнительным ресурсом',
            },
            CharResourceDouble: {
                name: 'CharResourceDouble',
                label: 'Характеристики с двумя дополнительными ресурсами',
            },
            Inventory: {
                name: 'Inventory',
                label: 'Инвентарь',
            },
            SpellsOne: {
                name: 'SpellsOne',
                label: 'Заклинания (круг 1-3)',
            },
            SpellsTwo: {
                name: 'SpellsTwo',
                label: 'Заклинания (круг 4-7)',
            },
            SpellsThree: {
                name: 'SpellsThree',
                label: 'Заклинания (круг 8-9)',
            },
            Appearance: {
                name: 'Appearance',
                label: 'Внешний вид',
            },
            Notes: {
                name: 'Notes',
                label: 'Заметки',
            },
        },
        sortedPages: []
    }),

    getters: {
        getDefaultPages: state => state.pages,
        getSortedPages: state => state.sortedPages
    },

    actions: {
        setSortedPages(pages) {
            this.sortedPages = _.cloneDeep(pages.map((page, index) => ({
                index,
                ...page
            })));
        },

        addSortedPages(index, pages) {
            const correctedIndex = index + 1;
            const editedSortedPages = this.sortedPages.map(page => page.name);

            for (let i = 0; i < pages.length; i++) {
                editedSortedPages.splice(correctedIndex + i, 0, pages[i]);
            }

            this.sortedPages = editedSortedPages.map((page, i) => ({
                index: i,
                ...this.pages[page]
            }))
        }
    }
});

export default usePagesStore;
