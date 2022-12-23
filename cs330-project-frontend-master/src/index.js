import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Navigate } from 'react-router-dom';
import { VisualMapComponent, CalendarComponent, TooltipComponent } from 'echarts/components';
import { HeatmapChart } from 'echarts/charts';
import * as echarts from "echarts/lib/echarts";

import AnimatedRoutes from './modules/AnimatedRoutes';
import HomePage from './pages/home';
import OverviewPage from './pages/overview';
import PortraitPage from './pages/portrait';
import EntryPage from './pages/entry';
import EntryCalPage from './pages/entryCal';
import ChatroomPage from './pages/chatroom';
import BorrowPage from './pages/borrow';
import CatagoryPage from './pages/catagory';
import BooklistPage from './pages/booklist';
import FinalPage from './pages/final';

import './index.less';
import BGM from './sounds/BGM.mp3';

const root = ReactDOM.createRoot(document.getElementById('root'));

echarts.use([VisualMapComponent, CalendarComponent, HeatmapChart, TooltipComponent]);
root.render(
    <React.StrictMode>
        <audio src={BGM} loop={true} id='bgm' />
        <BrowserRouter>
            <AnimatedRoutes>
                <Route exact path='/home' element={<HomePage />} />
                <Route exact path='/overview' element={<OverviewPage />} />
                <Route exact path='/portrait' element={<PortraitPage />} />
                <Route exact path='/entry' element={<EntryPage />} />
                <Route exact path='/entryCal' element={(
                    <EntryCalPage
                        title='入馆'
                        url='/library-heatmap'
                        prev='/entry'
                        next='/chatroom'
                        tooltip='出入馆'
                    />
                )} />
                <Route exact path='/chatroom' element={<ChatroomPage />} />
                <Route exact path='/borrow' element={<BorrowPage />} />
                <Route exact path='/catagory' element={<CatagoryPage />} />
                <Route exact path='/booklist' element={<BooklistPage />} />
                <Route exact path='/final' element={<FinalPage />} />
                <Route exact path='/' element={<Navigate to='/home' replace={true} />} />
            </AnimatedRoutes>
        </BrowserRouter>
    </React.StrictMode>
);
