export default {
    directives: {
        scrollLock: {
            updated(el, binding) {
                const body = document.querySelector('body');

                if (binding.value) {
                    const scrollPosition = window.scrollY;

                    body.style.overflow = 'hidden';
                    body.style.position = 'fixed';
                    body.style.top = `-${ scrollPosition }px`;
                    body.style.width = '100%';
                } else {
                    const scrollPosition = parseInt(
                        body.style.getPropertyValue('top').replace('-', ''),
                        10
                    );

                    body.style.removeProperty('overflow');
                    body.style.removeProperty('position');
                    body.style.removeProperty('top');
                    body.style.removeProperty('width');

                    window.scroll({
                        top: scrollPosition,
                        behavior: 'auto'
                    });
                }
            },
        }
    },
}
