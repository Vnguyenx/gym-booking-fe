import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';

import TabNav, { TabId } from '../../components/customer/TabNav';
import ProfileInfo from '../../components/customer/ProfileInfo';
import ClassesSection from '../../components/customer/ClassesSection';
import BookingsSection from '../../components/customer/BookingsSection';

import '../../styles/customer/CustomerProfile.css';

const getInitial = (name?: string | null): string =>
    name?.charAt(0)?.toUpperCase() ?? '?';

/**
 * CustomerProfilePage
 *
 * Layout:
 *   Mobile  : header → tab-nav (sticky bottom) → content
 *   Tablet  : header → tab-nav (top bar)       → content
 *   Desktop : header (full-width)
 *             └── body: sidebar nav | content area
 *
 * Nút Đăng xuất đã được chuyển vào tab "Cá nhân" (ProfileInfo).
 */
const CustomerProfilePage: React.FC = () => {
    const { user, isLoggedIn, loading } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<TabId>('profile');

    if (loading) return <div>Đang tải...</div>;
    if (!loading && !isLoggedIn) return <Navigate to={ROUTES.HOME} />;

    return (
        <div className="customer-profile">

            {/* ── Header full-width ── */}
            <header className="customer-profile__header">
                <button
                    className="btn-back"
                    onClick={() => navigate(ROUTES.HOME)}
                    aria-label="Về trang chủ"
                >
                    ← Trang chủ
                </button>

                <div className="customer-profile__header-center">
                    <p className="customer-profile__greeting">
                        {user?.displayName ?? 'Khách'}
                    </p>
                    <p className="customer-profile__subtitle">Hồ sơ khách hàng</p>
                </div>

                <div className="customer-profile__avatar" aria-hidden="true">
                    {getInitial(user?.displayName)}
                </div>
            </header>

            {/*
             * ── Body: trên desktop render dạng flex row
             *    TabNav  → sidebar trái (sticky)
             *    content → cột phải cuộn tự do
             */}
            <div className="customer-profile__body">

                {/* Tab nav — mobile: sticky bottom | desktop: sidebar */}
                <TabNav activeTab={activeTab} onTabChange={setActiveTab} />

                {/* Content */}
                <main className="customer-profile__content">
                    {activeTab === 'profile'  && <ProfileInfo />}
                    {activeTab === 'classes'  && <ClassesSection />}
                    {activeTab === 'bookings' && <BookingsSection />}
                </main>

            </div>
        </div>
    );
};

export default CustomerProfilePage;