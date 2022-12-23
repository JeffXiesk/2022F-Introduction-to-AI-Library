import { useNavigate } from 'react-router-dom';
import { Directions, useTouch } from '../hooks/useTouch';
import { useBoolean, useRequest } from 'ahooks';
import { useSpring, animated, useChain, useSpringRef } from 'react-spring';

import formFetch, { failURL } from '../modules/request';
import { enterAnime, fadeAnime, spinAnime } from '../modules/animations';

import '../less/home.less';
import BGImg from '../images/home/background.png';
import LibLogo from '../images/home/lib.png';
import Title from '../images/home/title.png';
import Next from '../images/next.png';
import SoundIcon from '../images/sound.png';
import SoundDisabledIcon from '../images/soundDisabled.png';

const HomePage = () => {
    const navigate = useNavigate();
    const audio = document.getElementById('bgm');
    const [, trigger] = useBoolean(false);

    useTouch(Directions.UP, ev => navigate('/overview'));
    useRequest(formFetch('/userinfo'), { onError: e => window.location.href = failURL });

    const fadeStyle = useSpring(fadeAnime);
    const spinStyle = useSpring(spinAnime);
    const enterRef1 = useSpringRef();
    const enterStyle1 = useSpring({ ...enterAnime(false), ref: enterRef1 });
    const enterRef2 = useSpringRef();
    const enterStyle2 = useSpring({ ...enterAnime(true), ref: enterRef2 });

    useChain([enterRef1, enterRef2]);

    return (
        <div className='container'>
            <img
                alt='background'
                className='background home'
                src={BGImg}
            />
            {audio?.muted || audio?.paused ? (
                <div className='music-player home'>
                    <img
                        alt='sound icon'
                        src={SoundDisabledIcon}
                        onClick={() => {
                            audio?.play();
                            trigger.toggle();
                        }}
                    />
                </div>
            ) : (
                <animated.div
                    className='music-player home'
                    style={spinStyle}
                >
                    <img
                        alt='sound icon'
                        src={SoundIcon}
                        onClick={() => {
                            audio?.pause();
                            trigger.toggle();
                        }}
                    />
                </animated.div>
            )}
            <animated.div
                className='lib-logo home'
                style={enterStyle1}
            >
                <img
                    alt='lib logo'
                    src={LibLogo}
                />
            </animated.div>
            <animated.div
                className='title home'
                style={enterStyle2}
            >
                <img
                    alt='title'
                    src={Title}
                />
            </animated.div>
            <animated.div
                className='next home'
                style={fadeStyle}
            >
                <img
                    alt='next'
                    src={Next}
                />
            </animated.div>
        </div>
    );
};

export default HomePage;