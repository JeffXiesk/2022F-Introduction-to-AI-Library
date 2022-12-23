import { useNavigate } from 'react-router-dom';
import { Directions, useTouch } from '../hooks/useTouch';
import { useRequest } from 'ahooks';
import { useSpring, animated, useSpringRef, useChain } from 'react-spring';

import formFetch, { failURL } from '../modules/request';
import { enterAnime, fadeAnime } from '../modules/animations';

import '../less/overview.less';
import BGImg from '../images/overview/background.png';
import Next from '../images/next.png';

const message = [
    '春去秋来',
    '岁月流金',
    '听',
    '你的每一次入馆',
    '每一本借阅',
    '每一场讨论',
    '每一帧埋头学习的身影……',
    '那是图书馆的心跳',
    '看',
    '这里有你与图书馆共同的美好回忆'
];

const OverviewPage = () => {
    const navigate = useNavigate();
    const { data } = useRequest(formFetch('/userinfo'), { onError: e => window.location.href = failURL });

    useTouch(Directions.DOWN, ev => navigate('/home'));
    useTouch(Directions.UP, ev => navigate('/portrait'));

    const fadeStyle = useSpring(fadeAnime);
    /* eslint-disable react-hooks/rules-of-hooks */
    const enterRefs = [''].concat(message).map(() => useSpringRef());
    const enterStyle = enterRefs.map(ref => useSpring({ ...enterAnime(true), ref: ref }));

    useChain(enterRefs);

    return (
        <div className='container'>
            <img
                alt='background'
                className='background overview'
                src={BGImg}
            />
            <animated.div
                className='next overview'
                style={fadeStyle}
            >
                <img
                    alt='next'
                    src={Next}
                />
            </animated.div>
            <animated.div
                className='user-call overview'
                style={enterStyle[0]}
            >
                致
                <strong>
                {data?.user_name || '无名氏'}
                </strong>
                ：
            </animated.div>
            {message.map((msg, i) => (
                <animated.div
                    className='message overview'
                    style={{ ...enterStyle[i + 1], top: `calc(${i * 2}rem + 20%)` }}
                >
                    {msg}
                </animated.div>
            ))}
        </div>
    );
};

export default OverviewPage;