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
                        你在图书馆借了第一本书《
                        <span className='focus'>
                            {firstBookInfo.data?.name}
                        </span>
                        》，南科大共有
                        <CountUp
                            className='number'
                            duration={1}
                            end={firstBookInfo.data?.count}
                        />
                        人也曾读过这本书
                    </>
                ) : '图书馆没有你的借阅记录'}
            </animated.div>
            <animated.div
                className='count borrow'
                style={enterStyle2}
            >
                {borrowInfo.data?.count ? (
                    <>
                        从那之后你一共借了
                        <CountUp
                            className='number'
                            delay={1}
                            duration={1}
                            end={borrowInfo.data?.count}
                        />
                        本书，超过了
                        <CountUp
                            className='number'
                            delay={1}
                            duration={2}
                            decimals={2}
                            end={borrowInfo.data?.percentage}
                        />
                        %的南科人
                    </>
                ) : '快来挖掘知识的宝藏吧'}
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