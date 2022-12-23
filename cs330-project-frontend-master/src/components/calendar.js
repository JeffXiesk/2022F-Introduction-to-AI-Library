import { useRef } from "react";
import ReactDOM from 'react-dom';
import * as echarts from "echarts/lib/echarts";
import { useMount, useSafeState, useUpdateEffect } from "ahooks";
import _ from "lodash";

const dataFormatter = (year = '2021', data = {}) => {
    const date = +echarts.number.parseDate(year + '-01-01');
    const end = +echarts.number.parseDate(+year + 1 + '-01-01');
    const dayTime = 3600 * 24 * 1000;
    const res = [];

    for (let time = date; time < end; time += dayTime) {
        const index = echarts.format.formatTime('yyyy-MM-dd', time);

        res.push([index, data[index] || 0]);
    }

    return res;
}

const Calendar = ({ year = 2021, data = {}, tooltip, ...props }) => {
    const ref = useRef();
    const [graph, setGraph] = useSafeState(null);

    useMount(() => setGraph(echarts.init(ReactDOM.findDOMNode(ref.current))));

    useUpdateEffect(() => graph?.setOption({
        tooltip: {
            position: 'top',
            formatter: p => {
                const format = echarts.format.formatTime('yyyy-MM-dd', p.data[0]);
                return `${format}: ${p.data[1]}次${tooltip}`;
            }
        },
        visualMap: [
            {
                min: 0,
                max: _.max(_.values(data)) || 5,
                calculable: true,
                orient: 'vertical',
                right: '15%',
                top: '20%',
                show: false
            },
            {
                min: 0,
                max: _.max(_.values(data)) || 5,
                calculable: true,
                orient: 'vertical',
                right: '15%',
                bottom: '20%',
                show: false
            }
        ],
        calendar: [{
            orient: 'vertical',
            range: year,
            yearLabel: { show: false },
            dayLabel: { nameMap: 'ZH' },
            monthLabel: { nameMap: 'ZH' }
        }],
        series: [{
            type: 'heatmap',
            coordinateSystem: 'calendar',
            calendarIndex: 0,
            data: dataFormatter(`${year}`, data)
        }]
    }), [data, graph]);

    return <div ref={ref} {...props} />;
};

export default Calendar;