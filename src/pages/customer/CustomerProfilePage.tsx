import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useLogout from '../../hooks/useLogout';
import { ROUTES } from '../../constants/routes';

// ── Import các tab section ───────────────────────────────────────────────────
import TabNav, { TabId } from '../../components/customer/TabNav';
import ProfileInfo from '../../components/customer/ProfileInfo';
import ClassesSection from '../../components/customer/ClassesSection';
import BookingsSection from '../../components/customer/BookingsSection';

// ── Import styles ────────────────────────────────────────────────────────────
import '../../styles/customer/CustomerProfile.css';

// ─── Helper ──────────────────────────────────────────────────────────────────

/**
 * Lấy chữ cái đầu tiên của tên để hiển thị avatar.
 * VD: "Nguyễn Văn An" -> "N"
 */
const getInitial = (name?: string | null): string => {
    return name?.charAt(0)?.toUpperCase() ?? '?';
};

// ─── Component chính ─────────────────────────────────────────────────────────

/**
 * CustomerProfilePage
 * Trang hồ sơ khách hàng với 3 tab:
 *   - Cá nhân: xem & chỉnh sửa thông tin
 *   - Lớp học: xem lớp & điểm danh
 *   - Đặt lịch: xem lịch sử booking
 *
 * Cấu trúc file:
 *   hooks/
 *     useProfile.ts      - logic thông tin cá nhân
 *     useClasses.ts      - logic lớp học & điểm danh
 *     useBookings.ts     - logic lịch sử booking
 *     useLogout.ts       - logic đăng xuất
 *   components/
 *     TabNav.tsx         - thanh điều hướng tab
 *     ProfileInfo.tsx    - tab thông tin cá nhân
 *     ClassesSection.tsx - tab lớp học
 *     BookingsSection.tsx- tab đặt lịch
 *     AttendanceBadge.tsx- badge trạng thái điểm danh
 *   CustomerProfile.css  - styles toàn trang
 */
const CustomerProfilePage: React.FC = () => {
    const { user, isLoggedIn, loading } = useAuth();
    const { isLoggingOut, handleLogout } = useLogout();

    // Tab đang active, mặc định là 'profile'
    const [activeTab, setActiveTab] = useState<TabId>('profile');

    // Đang tải auth -> hiện loading
    if (loading) return <div>Đang tải...</div>;

    // Chưa đăng nhập -> redirect về trang chủ
    if (!loading && !isLoggedIn) {
        return <Navigate to={ROUTES.HOME} />;
    }

    return (
        <div className="customer-profile">
            {/* Header với tên và avatar */}
            <header className="customer-profile__header">
                <div>
                    <p className="customer-profile__greeting">
                        Xin chào, {user?.displayName ?? 'Khách'}!
                    </p>
                    <p className="customer-profile__subtitle">Hồ sơ khách hàng</p>
                </div>
                <div
                    className="customer-profile__avatar"
                    aria-hidden="true"
                >
                    {getInitial(user?.displayName)}
                </div>
            </header>

            {/* Tab điều hướng (sticky bottom mobile / top desktop) */}
            <TabNav activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Nội dung tab */}
            <main className="customer-profile__content">
                {activeTab === 'profile'  && <ProfileInfo />}
                {activeTab === 'classes'  && <ClassesSection />}
                {activeTab === 'bookings' && <BookingsSection />}
            </main>

            {/* Nút đăng xuất luôn hiển thị ở dưới */}
            <div className="logout-wrapper">
                <button
                    className="btn-logout"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                >
                    {isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}
                </button>
            </div>
        </div>
    );
};

export default CustomerProfilePage;