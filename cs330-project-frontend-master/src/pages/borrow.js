import { useNavigate } from 'react-router-dom';
import { Directions, useTouch } from '../hooks/useTouch';
import { useRequest, useSafeState } from 'ahooks';
import { useSpring, animated, useSpringRef, useChain } from 'react-spring';
import CountUp from 'react-countup';

import formFetch, { failURL } from '../modules/request';
import { enterAnime, fadeAnime } from '../modules/animations';
import WordCloud from '../components/wordcloud';

import '../less/borrow.less';
import BGImg from '../images/borrow/background.png';
import Next from '../images/next.png';

const BorrowPage = () => {
    const navigate = useNavigate();
    const [wordsList, setWordsList] = useSafeState([]);
    const borrowInfo = useRequest(formFetch('/static-info/book'), {
        manual: true,
        onError: e => window.location.href = failURL
    });
    const wordsInfo = useRequest(formFetch('/words'), {
        manual: true,
        onSuccess: t => setWordsList(t?.list?.map(t => ({ name: t, value: Math.round(Math.random() * 1000) })) || []),
        onError: e => window.location.href = failURL
    });
    const firstBookInfo = useRequest(formFetch('/loan-info'), {
        onSuccess: () => {
            borrowInfo.run();
            wordsInfo.run();
        },
        onError: e => window.location.href = failURL
    });

    useTouch(Directions.DOWN, ev => navigate('/chatroom'));
    useTouch(Directions.UP, ev => navigate('/catagory'));

    const fadeStyle = useSpring(fadeAnime);
    const enterRef1 = useSpringRef();
    const enterStyle1 = useSpring({ ...enterAnime(true), ref: enterRef1 });
    const enterRef2 = useSpringRef();
    const enterStyle2 = useSpring({ ...enterAnime(true), ref: enterRef2 });
    const enterRef3 = useSpringRef();
    const enterStyle3 = useSpring({ ...enterAnime(true), ref: enterRef3 });

    useChain([enterRef1, enterRef2, enterRef3]);

    return (
        <div className='container'>
            <img
                alt='background'
                className='background borrow'
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
                className='first borrow'
                style={enterStyle1}
            >
                {firstBookInfo.data?.name ? (
                    <>
                        <span className='focus'>
                            {firstBookInfo.data?.time}
                        </span>
                        ????????????????????????????????????
                        <span className='focus'>
                            {firstBookInfo.data?.name}
                        </span>
                        ?????????????????????
                        <CountUp
                            className='number'
                            duration={1}
                            end={firstBookInfo.data?.count}
                        />
                        ????????????????????????
                    </>
                ) : '?????????????????????????????????'}
            </animated.div>
            <animated.div
                className='count borrow'
                style={enterStyle2}
            >
                {borrowInfo.data?.count ? (
                    <>
                        ???????????????????????????
                        <CountUp
                            className='number'
                            delay={1}
                            duration={1}
                            end={borrowInfo.data?.count}
                        />
                        ??????????????????
                        <CountUp
                            className='number'
                            delay={1}
                            duration={2}
                            decimals={2}
                            end={borrowInfo.data?.percentage}
                        />
                        %????????????
                    </>
                ) : '??????????????????????????????'}
            </animated.div>
            <animated.div
                className='wordcloud borrow'
                style={enterStyle3}
            >
                <WordCloud keywords={wordsList} />
            </animated.div>
        </div>
    );
};

export default BorrowPage;