import { useNavigate } from 'react-router-dom';
import { Directions, useTouch } from '../hooks/useTouch';
import { useRequest, useSafeState } from 'ahooks';
import { useSpring, animated, useSpringRef, useChain } from 'react-spring';
import CountUp from 'react-countup';

import formFetch, { failURL } from '../modules/request';
import { enterAnime, fadeAnime } from '../modules/animations';

import '../less/entry.less';
import BGImg from '../images/entry/background.png';
import Next from '../images/next.png';

const EntryPage = () => {
    const navigate = useNavigate();
    const [bestLibrary, setbestLibrary] = useSafeState(null);
    const { data } = useRequest(
        formFetch('/library-info'),
        {
            onSuccess: t => {
                if (!t?.first_time) {
                    return;
                }

                const libs = [
                    { name: '琳恩', value: t?.琳恩 },
                    { name: '涵泳', value: t?.涵泳 },
                    { name: '一丹', value: t?.一丹 }
                ];

                libs.sort((x, y) => Number(y.value) - Number(x.value));
                setbestLibrary(libs[0].name);
            },
            onError: e => window.location.href = failURL
        }
    );

    useTouch(Directions.DOWN, ev => navigate('/portrait'));
    useTouch(Directions.UP, ev => navigate('/entryCal'));

    const fadeStyle = useSpring(fadeAnime);
    const enterRefTitle = useSpringRef();
    const enterStyleTitle = useSpring({ ...enterAnime(true), ref: enterRefTitle });
    const enterRefCount = useSpringRef();
    const enterStyleCount = useSpring({ ...enterAnime(true), ref: enterRefCount });

    useChain([enterRefTitle, enterRefCount]);

    return (
        <div className='container'>
            <img
                alt='background'
                className='background entry'
                src={BGImg}
            />
            <animated.div
                className='next portrait'
                style={fadeStyle}
            >
                <img
                    alt='next'
                    src={Next}
                />
            </animated.div>
            <animated.div
                className='title entry'
                style={enterStyleTitle}
            >
                {data?.first_time ? (
                    <>
                        你最常来的是
                        <span className='focus'>
                            {bestLibrary}
                        </span>
                        图书馆，那里有你最喜欢的座位……
                    </>
                ) : `你尚未前往探索图书馆中的奥秘`}
            </animated.div>
            <animated.div
                className='count entry'
                style={enterStyleCount}
            >
                {data?.first_time ? (
                    <>
                        {`一丹图书馆：`}
                        <CountUp
                            className='number'
                            delay={1}
                            duration={1}
                            end={data?.一丹}
                        />
                        {` 次`}
                        <br />
                        {`琳恩图书馆：`}
                        <CountUp
                            className='number'
                            delay={1}
                            duration={1}
                            end={data?.琳恩}
                        />
                        {` 次`}
                        <br />
                        {`涵泳图书馆：`}
                        <CountUp
                            className='number'
                            delay={1}
                            duration={1}
                            end={data?.涵泳}
                        />
                        {` 次`}
                    </>
                ) : '常来图书馆看看吧'}
            </animated.div>
        </div>
    );
};

export default EntryPage;