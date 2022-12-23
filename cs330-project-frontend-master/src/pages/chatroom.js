import { useNavigate } from 'react-router-dom';
import { Directions, useTouch } from '../hooks/useTouch';
import { useRequest } from 'ahooks';
import { useSpring, animated, useSpringRef, useChain } from 'react-spring';

import formFetch, { failURL } from '../modules/request';
import { enterAnime, fadeAnime } from '../modules/animations';

import '../less/chatroom.less';
import BGImg from '../images/chatroom/background.png';
import Next from '../images/next.png';

const ChatroomPage = () => {
    const navigate = useNavigate();
    const { data } = useRequest(formFetch('/discussionroom-info'), { onError: e => window.location.href = failURL });

    useTouch(Directions.DOWN, ev => navigate('/entryCal'));
    useTouch(Directions.UP, ev => navigate('/borrow'));

    const fadeStyle = useSpring(fadeAnime);
    const enterRefTitle = useSpringRef();
    const enterStyleTitle = useSpring({ ...enterAnime(true), ref: enterRefTitle });
    const enterRefFrequent = useSpringRef();
    const enterStyleFrequent = useSpring({ ...enterAnime(true), ref: enterRefFrequent });

    useChain([enterRefTitle, enterRefFrequent]);

    return (
        <div className='container'>
            <img
                alt='background'
                className='background chatroom'
                src={BGImg}
            />
            <animated.div
                className='next chatroom'
                style={fadeStyle}
            >
                <img
                    alt='next'
                    src={Next}
                />
            </animated.div>
            <animated.div
                className='first-time chatroom'
                style={enterStyleTitle}
            >
                {data?.first_time ? (
                    <>
                        <span className='focus'>
                            {data?.first_time}
                        </span>
                        ，你第一次预约到
                        <span className='focus'>
                            {data?.first_name}
                        </span>
                        讨论间，和同学们一起讨论也是一种很棒的学习方式
                    </>
                ) : '图书馆没有你的讨论间预约记录'}
            </animated.div>
            <animated.div
                className='frequent chatroom'
                style={enterStyleFrequent}
            >
                {data?.first_time ? (
                    <>
                        你最喜欢
                        <span className='focus'>
                            {data?.library}
                        </span>
                        图书馆的
                        <span className='focus'>
                            {data?.room}
                        </span>
                        讨论间，讨论间的一桌一椅都见证了你们的头脑风暴
                    </>
                ) : '快来和你的伙伴们来一场头脑风暴吧'}
            </animated.div>
        </div>
    );
};

export default ChatroomPage;