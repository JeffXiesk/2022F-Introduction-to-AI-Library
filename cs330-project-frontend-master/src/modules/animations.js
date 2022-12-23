import { config } from "react-spring";

export const fadeAnime = {
    loop: true,
    to: [{ opacity: 1 }, { opacity: 0 }],
    from: { opacity: 0 },
    config: { duration: 1000 },
    ...config.slow
};

export const enterAnime = (center = false, duration = 1000) => ({
    loop: false,
    to: { y: 0, opacity: 1, x: center ? '-50%' : 0 },
    from: { y: 20, opacity: 0, x: center ? '-50%' : 0 },
    config: { duration: duration },
    ...config.slow
});

export const spinAnime = {
    loop: true,
    to: { rotateZ: 360 },
    from: { rotateZ: 0 },
    config: { duration: 5000 },
    ...config.slow
};