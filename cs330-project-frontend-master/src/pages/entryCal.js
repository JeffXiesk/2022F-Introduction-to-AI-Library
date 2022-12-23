import { useBoolean, useRequest, useSafeState, useUpdateEffect } from 'ahooks';
import { useSpring, animated, useSpringRef, useChain } from 'react-spring';
import { Space, DatePicker, Button, Picker } from 'antd-mobile';

import formFetch, {failURL} from '../modules/request';
import { enterAnime, fadeAnime } from '../modules/animations';
import Calendar from '../components/calendar';

import '../less/entryCal.less';
import BGImg from '../images/calendar/background.png';
import LHint from '../images/calendar/leftHint.png';
import RHint from '../images/calendar/rightHint.png';
import Next from '../images/next.png';
import TouchZone from '../components/touchZone';

const libraries = ['琳恩', '一丹', '涵泳'];
const beginYear = 2018;

const getYearDate = (year = beginYear) => {
    const res = new Date();

    res.setFullYear(year);

    return res;
};

const EntryCalPage = ({
    title = '测试',
    url = '/userinfo',
    prev = '/home',
    next = '/home',
    tooltip = '测试'
}) => {
    const [year, setYear] = useSafeState(new Date().getFullYear());
    const [library, setLibrary] = useSafeState(0); // 0: Linen, 1: Yidan, 2: Hanyong
    const [visibleYear, visibleYearOps] = useBoolean(false);
    const [visibleLib, visibleLibOps] = useBoolean(false);
    const { data, run } = useRequest(formFetch(url, {
        year: year,
        library: libraries[library]
    }), { onError: () => {/**/ } });

    useUpdateEffect(() => run(), [year, library]);

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
                className='background entry-cal'
                src={BGImg}
            />
            <TouchZone
                prev={prev}
                next={next}
                className='upper entry-cal'
            />
            <TouchZone
                prev={prev}
                next={next}
                className='lower entry-cal'
            />
            <animated.div
                className='next entry-cal'
                style={fadeStyle}
            >
                <img
                    alt='next'
                    src={Next}
                />
            </animated.div>
            <animated.div
                className='title entry-cal'
                style={enterStyle1}
            >
                {`我的${title}日历`}
            </animated.div>
            <animated.div
                className='calendar entry-cal'
                style={enterStyle3}
            >
                <Calendar
                    year={year}
                    data={data}
                    tooltip={tooltip}
                />
            </animated.div>
            <DatePicker
                visible={visibleYear}
                onClose={() => visibleYearOps.setFalse()}
                precision='year'
                title='选择年份'
                onConfirm={value => setYear(value.getFullYear())}
                min={getYearDate(beginYear)}
                max={new Date()}
            />
            <Picker
                visible={visibleLib}
                onClose={() => visibleLibOps.setFalse()}
                onConfirm={value => setLibrary(value[0])}
                title='选择图书馆'
                columns={[libraries.map((lib, i) => ({ label: lib, value: i }))]}
                value={[library]}
            />
            <animated.div
                className='selector entry-cal'
                style={enterStyle2}
            >
                <Space wrap>
                    <animated.div
                        className='left-hint entry-cal'
                        style={fadeStyle}
                    >
                        <img
                            alt='left hint'
                            src={LHint}
                        />
                    </animated.div>
                    <Button
                        onClick={() => visibleYearOps.setTrue()}
                        fill='none'
                    >
                        <strong>
                            {year}
                        </strong>
                        {` 年`}
                    </Button>
                    <Button
                        onClick={() => visibleLibOps.setTrue()}
                        fill='none'
                    >
                        <strong>
                            {libraries[library]}
                        </strong>
                        {` 图书馆`}
                    </Button>
                    <animated.div
                        className='right-hint entry-cal'
                        style={fadeStyle}
                    >
                        <img
                            alt='right hint'
                            src={RHint}
                        />
                    </animated.div>
                </Space>
            </animated.div>
        </div>
    );
};

export default EntryCalPage;