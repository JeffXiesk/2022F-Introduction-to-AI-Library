import { useNavigate } from 'react-router-dom';
import { Directions, useTouch } from '../hooks/useTouch';
import { useBoolean } from 'ahooks';
import { useSpring, animated, useChain, useSpringRef } from 'react-spring';

import { enterAnime, spinAnime } from '../modules/animations';

import '../less/final.less';
import BGImg from '../images/home/background.png';
import LibLogo from '../images/home/lib.png';
import TitleUp from '../images/final/titleUp.png';
import TitleDown from '../images/final/titleDown.png';
import SoundIcon from '../images/sound.png';
import SoundDisabledIcon from '../images/soundDisabled.png';

const FinalPage = () => {
    const navigate = useNavigate();
    const audio = document.getElementById('bgm');
    const [, trigger] = useBoolean(false);

    useTouch(Directions.DOWN, ev => navigate('/booklist'));

    const spinStyle = useSpring(spinAnime);
    const enterRef1 = useSpringRef();
    const enterStyle1 = useSpring({ ...enterAnime(false), ref: enterRef1 });
    const enterRef2 = useSpringRef();
    const enterStyle2 = useSpring({ ...enterAnime(false), ref: enterRef2 });
    const enterRef3 = useSpringRef();
    const enterStyle3 = useSpring({ ...enterAnime(false), ref: enterRef3 });

    useChain([enterRef1, enterRef2, enterRef3]);

    return (
        <div className='container'>
            <img
                alt='background'
                className='background final'
                src={BGImg}
            />
            {audio?.muted || audio?.paused ? (
                <div className='music-player final'>
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
                    className='music-player final'
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
                className='lib-logo final'
                style={enterStyle1}
            >
                <img
                    alt='lib logo'
                    src={LibLogo}
                />
            </animated.div>
            <animated.div
                className='title-up final'
                style={enterStyle2}
            >
                <img
                    alt='title up'
                    src={TitleUp}
                />
            </animated.div>
            <animated.div
                className='title-down final'
                style={enterStyle3}
            >
                <img
                    alt='title down'
                    src={TitleDown}
                />
            </animated.div>
        </div>
    );
};

export default FinalPage;