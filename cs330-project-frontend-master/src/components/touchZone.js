import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Directions, useTouch } from '../hooks/useTouch';

const TouchZone = ({ prev, next, className = '', ...props }) => {
    const navigate = useNavigate();
    const ref = useRef();

    useTouch(Directions.DOWN, ev => navigate(prev), ref);
    useTouch(Directions.UP, ev => navigate(next), ref);

    return <div ref={ref} className={`touch-zone ${className}`} {...props} />;
};

export default TouchZone;