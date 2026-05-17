// src/pages/pt/PtDashboard.tsx
// Trang dashboard chính của PT.
// Quản lý tab active, fetch data 1 lần khi mount.

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchPTStudents } from '../../store/ptDashBoardSlice';

import PtHeader           from '../../components/pt/PtHeader';
import PtTabBar           from '../../components/pt/PtTabBar';
import PtTabDashboard     from '../../components/pt/PtTabDashboard';
import PtTabStudents      from '../../components/pt/PtTabStudents';
import PtTabNotifications from '../../components/pt/PtTabNotifications';
import PtTabProfile       from '../../components/pt/PtTabProfile';

import '../../styles/pt/pt-dashboard.css';
import '../../styles/pt/pt-layout.css';
import '../../styles/pt/pt-students.css';
import '../../styles/pt/pt-notifications.css';
import '../../styles/pt/pt-profile.css';



export type PtTab = 'dash' | 'students' | 'notif' | 'profile';

const PtDashboard: React.FC = () => {
    const dispatch = useAppDispatch();
    const [activeTab, setActiveTab] = useState<PtTab>('dash');

    const { studentsLoaded } = useAppSelector((s) => s.ptDashboard);

    // Fetch 1 lần duy nhất khi vào dashboard
    useEffect(() => {
        if (!studentsLoaded) {
            dispatch(fetchPTStudents());
        }
    }, [studentsLoaded, dispatch]);

    return (
        <div className="pt-page">
            <PtHeader onNotifClick={() => setActiveTab('notif')} />
            <PtTabBar activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="pt-content">
                {activeTab === 'dash'     && <PtTabDashboard />}
                {activeTab === 'students' && <PtTabStudents />}
                {activeTab === 'notif'    && <PtTabNotifications />}
                {activeTab === 'profile'  && <PtTabProfile />}
            </div>
        </div>
    );
};

export default PtDashboard;