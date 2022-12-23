import { useBoolean, useEventListener, useSafeState } from 'ahooks';

const Threshold = 30;

export const Directions = {
    RIGHT: 0,
    UP: 1,
    LEFT: 2,
    DOWN: 3
};

export const useTouch = (
    dir = Directions.LEFT,
    handler = ev => { },
    target = window,
    isPreventDefault = false
) => {
    const [startX, setStartX] = useSafeState(0);
    const [startY, setStartY] = useSafeState(0);
    const [isStartIn, isStartInOps] = useBoolean(false);

    useEventListener('touchstart', ev => {
        setStartX(ev.touches[0].pageX);
        setStartY(ev.touches[0].pageY);
        isStartInOps.setTrue();
    }, { target: target });

    useEventListener('touchmove', ev => {
        if (isPreventDefault === true) {
            ev.preventDefault();
        }
    }, { target: target });

    useEventListener('touchend', ev => {
        if (isStartIn !== true) {
            return;
        } else {
            isStartInOps.setFalse();
        }

        const [spanX, spanY] = [
            ev.changedTouches[0].pageX - startX,
            ev.changedTouches[0].pageY - startY
        ];

        if (Math.abs(spanX) > Math.abs(spanY)) { // Horizontal
            if (spanX > Threshold && dir === Directions.RIGHT) { // Right
                handler(ev);
            } else if (spanX < -Threshold && dir === Directions.LEFT) { // Left
                handler(ev);
            }
        } else { // Vertical
            if (spanY > Threshold && dir === Directions.DOWN) { // Down
                handler(ev);
            } else if (spanY < -Threshold && dir === Directions.UP) { // Up
                handler(ev);
            }
        }
    }, { target: target });
};