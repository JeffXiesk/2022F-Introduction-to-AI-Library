import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { useLocation, Routes } from 'react-router-dom';

import './AnimatedRoutes.less';

const DefaultTimeout = 700; // ms

const AnimatedRoutes = ({
    type = 'fade',
    timeout = DefaultTimeout,
    ...props
}) => {
    const location = useLocation();

    return (
        <TransitionGroup>
            <CSSTransition
                key={location.key}
                classNames={type}
                timeout={timeout}
            >
                <Routes location={location}>
                    {props?.children}
                </Routes>
            </CSSTransition>
        </TransitionGroup>
    );
};

export default AnimatedRoutes;