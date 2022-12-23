import { useNavigate } from 'react-router-dom';
import { Directions, useTouch } from '../hooks/useTouch';
import { useRequest, useSafeState } from 'ahooks';
import { useSpring, animated, useSpringRef, useChain } from 'react-spring';
import CountUp from 'react-countup';

import formFetch, { failURL } from '../modules/request';
import { enterAnime, fadeAnime } from '../modules/animations';

import '../less/catagory.less';
import BGImg from '../images/catagory/background.png';
import Next from '../images/next.png';

const CatagoryPage = () => {
    const navigate = useNavigate();
    const [list, setList] = useSafeState(null);
    const { data } = useRequest(formFetch('/loan-type'), {
        onSuccess: t => setList(t?.list?.sort((a, b) => b?.cnt - a?.cnt)),
        onError: e => window.location.href = failURL
    });

    useTouch(Directions.DOWN, ev => navigate('/borrow'));
    useTouch(Directions.UP, ev => navigate('/booklist'));

    const fadeStyle = useSpring(fadeAnime);
    const enterRefTitle = useSpringRef();
    const enterStyleTitle = useSpring({ ...enterAnime(true), ref: enterRefTitle });
    const enterRef1 = useSpringRef();
    const enterRef2 = useSpringRef();
    const enterRef3 = useSpringRef();
    const enterStyles = [
        useSpring({ ...enterAnime(true), ref: enterRef1 }),
        useSpring({ ...enterAnime(true), ref: enterRef2 }),
        useSpring({ ...enterAnime(true), ref: enterRef3 })
    ];

    useChain([enterRefTitle, enterRef1, enterRef2, enterRef3]);

    return (
        <div className='container'>
            <img
                alt='background'
                className='background catagory'
                src={BGImg}
            />
            <animated.div
                className='next catagory'
                style={fadeStyle}
            >
                <img
                    alt='next'
                    src={Next}
                />
            </animated.div>
            <animated.div
                className='title catagory'
                style={enterStyleTitle}
            >
                {data?.list?.length > 0 ? (
                    <>
                        {`你的借阅类别 `}
                        <strong>
                            Top 3
                        </strong>
                    </>
                ) : '图书馆没有你的借阅记录'}
            </animated.div>
            {data?.list?.length > 0 ? (
                list?.slice(0, 3)?.map((t, i) => (
                    <animated.div
                        className={`count-${i + 1} catagory`}
                        style={enterStyles[i]}
                    >
                        {`${t?.name}：`}
                        <CountUp
                            className='number'
                            delay={i + 1}
                            duration={1}
                            end={t?.cnt}
                        />
                        {` 本`}
                    </animated.div>
                ))
            ) : (
                <animated.div
                    className='text catagory'
                    style={enterStyles[0]}
                >
                    快来挖掘知识的宝藏吧
                </animated.div>
            )}
        </div>
    );
};

export default CatagoryPage;