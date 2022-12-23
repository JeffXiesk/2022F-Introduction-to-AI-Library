import { useNavigate } from 'react-router-dom';
import { Directions, useTouch } from '../hooks/useTouch';
import { useRequest } from 'ahooks';
import { useSpring, animated, useSpringRef, useChain } from 'react-spring';

import formFetch, { failURL } from '../modules/request';
import { enterAnime, fadeAnime } from '../modules/animations';

import '../less/portrait.less';
import BGImg from '../images/portrait/background.png';
import Next from '../images/next.png';

import BolanF from '../images/portrait/bolanF.png';
import BolanM from '../images/portrait/bolanM.png';
import QinxueF from '../images/portrait/qinxueF.png';
import QinxueM from '../images/portrait/qinxueM.png';
import SibianF from '../images/portrait/sibianF.png';
import SibianM from '../images/portrait/sibianM.png';
import WuwenF from '../images/portrait/wuwenF.png';
import WuwenM from '../images/portrait/wuwenM.png';
import XuexiF from '../images/portrait/xuexiF.png';
import XuexiM from '../images/portrait/xuexiM.png';
import ZuanyanF from '../images/portrait/zuanyanF.png';
import ZuanyanM from '../images/portrait/zuanyanM.png';

const getAvatar = (gender, tag) => {
    switch (tag) {
        case '爱阅读的无名者':
            return gender ? BolanM : BolanF;
        case '爱阅读的图书馆常住人口':
            return gender ? QinxueM : QinxueF;
        case '爱思考的自习者':
            return gender ? SibianM : SibianF;
        case '爱思考的图书馆常住人口':
            return gender ? XuexiM : XuexiF;
        case '爱阅读的自习者':
            return gender ? ZuanyanM : ZuanyanF;
        case '爱思考的无名者': default:
            return gender ? WuwenM : WuwenF;
    }
};

const PortraitPage = () => {
    const navigate = useNavigate();
    const userInfo = useRequest(formFetch('/userinfo'), { onError: e => window.location.href = failURL });
    const { data } = useRequest(formFetch('/user-tag'), { onError: e => window.location.href = failURL });

    useTouch(Directions.DOWN, ev => navigate('/overview'));
    useTouch(Directions.UP, ev => navigate('/entry'));

    const fadeStyle = useSpring(fadeAnime);
    const enterRefTitle = useSpringRef();
    const enterStyleTitle = useSpring({ ...enterAnime(true), ref: enterRefTitle });
    const enterRefAvatar = useSpringRef();
    const enterStyleAvatar = useSpring({ ...enterAnime(true), ref: enterRefAvatar });
    const enterRefUserTagVice = useSpringRef();
    const enterStyleUserTagVice = useSpring({ ...enterAnime(true), ref: enterRefUserTagVice });
    const enterRefComment = useSpringRef();
    const enterStyleComment = useSpring({ ...enterAnime(true), ref: enterRefComment });
    const enterRefDate = useSpringRef();
    const enterStyleDate = useSpring({ ...enterAnime(true), ref: enterRefDate })

    useChain([enterRefTitle, enterRefAvatar, enterRefUserTagVice, enterRefComment, enterRefDate]);

    return (
        <div className='container'>
            <img
                alt='background'
                className='background portrait'
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
                className='title portrait'
                style={enterStyleTitle}
            >
                我的图书馆画像
            </animated.div>
            <animated.div
                className='avatar portrait'
                style={enterStyleAvatar}
            >
                <img
                    alt='avatar'
                    src={getAvatar(userInfo.data?.sex, data?.tag)}
                />
            </animated.div>
            <animated.div
                className='user-tag portrait'
                style={enterStyleAvatar}
            >
                {data?.tag || '无闻者'}
            </animated.div>
            <animated.div
                className='user-tag-vice portrait'
                style={enterStyleUserTagVice}
            >
                {data?.title || '花开别处，亦是芬芳'}
            </animated.div>
            <animated.div
                className='user-comment portrait'
                style={enterStyleComment}
            >
                {data?.comment || '图书馆等着你的到来！'}
            </animated.div>
            <animated.div
                className='date portrait'
                style={enterStyleDate}
            >
                图书借阅数据起始于 2018 年 1 月 1 日
                <br/>
                空间使用数据起始于 2021 年 1 月 1 日
            </animated.div>
        </div>
    );
};

export default PortraitPage;