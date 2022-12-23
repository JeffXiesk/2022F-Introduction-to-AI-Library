import { useRequest } from 'ahooks';
import { useSpring, animated, useSpringRef, useChain } from 'react-spring';
import { Button } from 'antd-mobile';
import { utils, writeFile } from 'xlsx';

import formFetch, { failURL } from '../modules/request';
import { enterAnime, fadeAnime } from '../modules/animations';

import '../less/booklist.less';
import BGImg from '../images/booklist/background.png';
import Next from '../images/next.png';
import TouchZone from '../components/touchZone';

const downloadXlsx = (id, name) => {
    const fileContent = document.getElementById(id).cloneNode(true);
    const binary = utils.table_to_book(fileContent, { sheet: 'sheet1' });

    writeFile(binary, name);
};

const BooklistPage = () => {
    const { data } = useRequest(formFetch('/loan-list'), { onError: e => window.location.href = failURL });

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
                className='background booklist'
                src={BGImg}
            />
            <TouchZone
                prev='/catagory'
                next='/final'
                className='upper booklist'
            />
            {data?.list?.length > 0 ? (
                <TouchZone
                    prev='/catagory'
                    next='/final'
                    className='lower-normal booklist'
                />
            ) : (
                <TouchZone
                prev='/catagory'
                next='/final'
                className='lower-empty booklist'
            />
            )}
            <animated.div
                className='next home'
                style={fadeStyle}
            >
                <img
                    alt='next'
                    src={Next}
                />
            </animated.div>
            {data?.list?.length > 0 ? (
                <>
                    <animated.div
                        className='title booklist'
                        style={enterStyle1}
                    >
                        我的借阅书单
                    </animated.div>
                    <animated.div
                        className='list-container booklist'
                        style={enterStyle2}
                    >
                        <table id='booklist-table'>
                            <tr>
                                <th>序号</th>
                                <th>题名</th>
                                <th>借阅日期</th>
                            </tr>
                            {data?.list?.map((t, i) => (
                                <tr key={`${i}`}>
                                    <td>{t?.id}</td>
                                    <td>{t?.name}</td>
                                    <td>{t?.date}</td>
                                </tr>
                            ))}
                        </table>
                    </animated.div>
                    <animated.div
                        className='download booklist'
                        style={enterStyle3}
                    >
                        <Button
                            color='primary'
                            fill='none'
                            onClick={() => downloadXlsx('booklist-table', '我的书单.xlsx')}
                        >
                            下载我的书单
                        </Button>
                    </animated.div>
                </>
            ) : (
                <>
                    <animated.div
                        className='header booklist'
                        style={enterStyle1}
                    >
                        图书馆没有你的借阅记录
                    </animated.div>
                    <animated.div
                        className='text booklist'
                        style={enterStyle2}
                    >
                        快来挖掘知识的宝藏吧
                    </animated.div>
                </>
            )}
        </div>
    );
};

export default BooklistPage;