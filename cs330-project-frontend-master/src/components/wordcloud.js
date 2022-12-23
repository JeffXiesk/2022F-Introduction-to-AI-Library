import { useRef } from "react";
import ReactDOM from 'react-dom';
import * as echarts from "echarts/lib/echarts";
import { useMount, useSafeState, useUpdateEffect } from "ahooks";

import 'echarts-wordcloud';

const randomColor = () => Math.round(Math.random() * 160);

const WordCloud = ({ keywords = [], ...props }) => {
    const ref = useRef();
    const [graph, setGraph] = useSafeState(null);

    useMount(() => setGraph(echarts.init(ReactDOM.findDOMNode(ref.current))));

    useUpdateEffect(() => graph?.setOption({
        series: [{
            type: 'wordCloud',
            sizeRange: [12, 36],
            rotationRange: [0, 0],
            rotationStep: 45,
            gridSize: 8,
            shape: 'diamond',
            width: '80%',
            height: '80%',
            textStyle: {
                color: () => `rgb(${randomColor()},${randomColor()},${randomColor()})`
            },
            data: keywords
        }]
    }), [keywords, graph]);

    return <div ref={ref} {...props} />;
};

export default WordCloud;