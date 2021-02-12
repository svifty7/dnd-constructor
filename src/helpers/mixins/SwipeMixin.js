export default {
    methods: {
        /**
         * Функция определения события swipe на элементе.
         * @param {Object} el - элемент DOM.
         * @param {Object} options - объект с предварительными настройками.
         */
        swipe(el, options) {
            let events;

            // настройки по умолчанию
            const settings = {
                minDist: 60, // минимальная дистанция, которую должен пройти указатель, чтобы жест
                // считался как свайп (px)
                maxDist: 120, // максимальная дистанция, не превышая которую может пройти
                // указатель, чтобы жест считался как свайп (px)
                maxTime: 700, // максимальное время, за которое должен быть совершен свайп (ms)
                minTime: 50, // минимальное время, за которое должен быть совершен свайп (ms)
                ...options
            };

            // коррекция времени при ошибочных значениях
            if (settings.maxTime < settings.minTime) settings.maxTime = settings.minTime + 500;

            if (settings.maxTime < 100 || settings.minTime < 50) {
                settings.maxTime = 700;
                settings.minTime = 50;
            }

            let dir; // направление свайпа (horizontal, vertical)
            let swipeType; // тип свайпа (up, down, left, right)
            let dist; // дистанция, пройденная указателем
            let isMouse = false; // поддержка мыши (не используется для тач-событий)
            let isMouseDown = false; // указание на активное нажатие мыши (не используется для
            // тач-событий)
            let startX = 0; // начало координат по оси X (pageX)
            let distX = 0; // дистанция, пройденная указателем по оси X
            let startY = 0; // начало координат по оси Y (pageY)
            let distY = 0; // дистанция, пройденная указателем по оси Y
            let startTime = 0; // время начала касания

            const support = { // поддерживаемые браузером типы событий
                pointer: !!('PointerEvent' in window || ('msPointerEnabled' in window.navigator)),
                touch: !!(
                    typeof window.orientation !== 'undefined'
                    || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
                    || 'ontouchstart' in window
                    || navigator.msMaxTouchPoints
                    || 'maxTouchPoints' in window.navigator > 1
                    || 'msMaxTouchPoints' in window.navigator > 1
                ),
            };

            /**
             * Опредление доступных в браузере событий: pointer, touch и mouse.
             * @returns {Object} - возвращает объект с доступными событиями.
             */
            const getSupportedEvents = () => {
                switch (true) {
                    case support.pointer:
                        events = {
                            type: 'pointer',
                            start: 'PointerDown',
                            move: 'PointerMove',
                            end: 'PointerUp',
                            cancel: 'PointerCancel',
                            leave: 'PointerLeave',
                        };

                        // добавление префиксов для IE10
                        // eslint-disable-next-line no-case-declarations
                        const ie10 = (
                            window.navigator.msPointerEnabled
                            // eslint-disable-next-line no-new-func
                            && Function('/*@cc_on return document.documentMode===10@*/')()
                        );

                        // eslint-disable-next-line no-restricted-syntax
                        for (const value in events) {
                            // eslint-disable-next-line no-continue
                            if (value === 'type') continue;

                            events[value] = (ie10) ? `MS${events[value]}` : events[value].toLowerCase();
                        }

                        break;
                    case support.touch:
                        events = {
                            type: 'touch',
                            start: 'touchstart',
                            move: 'touchmove',
                            end: 'touchend',
                            cancel: 'touchcancel',
                        };

                        break;
                    default:
                        events = {
                            type: 'mouse',
                            start: 'mousedown',
                            move: 'mousemove',
                            end: 'mouseup',
                            leave: 'mouseleave',
                        };

                        break;
                }

                return events;
            };

            /**
             * Объединение событий mouse/pointer и touch.
             * @param e {Event} - принимает в качестве аргумента событие.
             * @returns {TouchList|Event} - возвращает либо TouchList, либо оставляет событие без
             *     изменения.
             */
            const eventsUnify = e => (e.changedTouches ? e.changedTouches[0] : e);

            /**
             * Обрабочик начала касания указателем.
             * @param e {Event} - получает событие.
             */
            const checkStart = e => {
                const event = eventsUnify(e);

                // игнорирование касания несколькими пальцами
                if (support.touch && typeof e.touches !== 'undefined' && e.touches.length !== 1) {
                    return;
                }

                dir = 'none';
                swipeType = 'none';
                dist = 0;
                startX = event.pageX;
                startY = event.pageY;
                startTime = new Date().getTime();

                if (isMouse) isMouseDown = true; // поддержка мыши
            };

            /**
             * Обработчик движения указателя.
             * @param e {Event} - получает событие.
             */
            const checkMove = e => {
                // выход из функции, если мышь перестала быть активна во время движения
                if (isMouse && !isMouseDown) return;

                const event = eventsUnify(e);

                distX = event.pageX - startX;
                distY = event.pageY - startY;

                if (Math.abs(distX) > Math.abs(distY)) {
                    dir = (distX < 0) ? 'left' : 'right';
                } else {
                    dir = (distY < 0) ? 'up' : 'down';
                }
            };

            /**
             * Обработчик окончания касания указателем.
             * @param e {Event} - получает событие.
             */
            const checkEnd = e => {
                if (isMouse && !isMouseDown) { // выход из функции и сброс проверки нажатия мыши
                    isMouseDown = false;

                    return;
                }

                const endTime = new Date().getTime();
                const time = endTime - startTime;

                if (time >= settings.minTime && time <= settings.maxTime) { // проверка времени жеста
                    if (Math.abs(distX) >= settings.minDist && Math.abs(distY) <= settings.maxDist) {
                        swipeType = dir; // опредление типа свайпа как "left" или "right"
                    } else if (Math.abs(distY) >= settings.minDist && Math.abs(distX) <= settings.maxDist) {
                        swipeType = dir; // опредление типа свайпа как "top" или "down"
                    }
                }
                dist = (dir === 'left' || dir === 'right') ? Math.abs(distX) : Math.abs(distY); // опредление
                // пройденной
                // указателем
                // дистанции

                // генерация кастомного события swipe
                if (swipeType !== 'none' && dist >= settings.minDist) {
                    const swipeEvent = new CustomEvent('swipe', {
                        bubbles: true,
                        cancelable: true,
                        detail: {
                            full: e, // полное событие Event
                            dir: swipeType, // направление свайпа
                            dist, // дистанция свайпа
                            time, // время, потраченное на свайп
                        },
                    });

                    el.dispatchEvent(swipeEvent);
                }
            };

            // добавление поддерживаемых событий
            events = getSupportedEvents();

            // проверка наличия мыши
            if ((support.pointer && !support.touch) || events.type === 'mouse') isMouse = true;

            // добавление обработчиков на элемент
            el.addEventListener(events.start, checkStart);
            el.addEventListener(events.move, checkMove);
            el.addEventListener(events.end, checkEnd);

            if (support.pointer && support.touch) {
                el.addEventListener('lostpointercapture', checkEnd);
            }
        },
    },
};
