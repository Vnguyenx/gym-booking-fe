import React from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

export type TabId = 'profile' | 'classes' | 'bookings';

interface Tab {
    id: TabId;
    label: string;
    icon: string; // emoji đơn giản, dễ đổi thành icon library sau
}

interface TabNavProps {
    activeTab: TabId;
    onTabChange: (tab: TabId) => void;
}

// ─── Cấu hình tabs ───────────────────────────────────────────────────────────

const TABS: Tab[] = [
    { id: 'profile',  label: 'Cá nhân',  icon: '👤' },
    { id: 'classes',  label: 'Lớp học',  icon: '🧘' },
    { id: 'bookings', label: 'Lịch sử đặt lịch', icon: '📅' },
];

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * TabNav
 * Thanh điều hướng tab cố định ở dưới (mobile) hoặc ngang (desktop).
 * Thiết kế mobile-first: sticky bottom trên mobile, sidebar/topbar trên web.
 */
const TabNav: React.FC<TabNavProps> = ({ activeTab, onTabChange }) => {
    return (
        <nav className="tab-nav" role="tablist" aria-label="Điều hướng trang">
            {TABS.map((tab) => (
                <button
                    key={tab.id}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    className={`tab-nav__item ${
                        activeTab === tab.id ? 'tab-nav__item--active' : ''
                    }`}
                    onClick={() => onTabChange(tab.id)}
                >
          <span className="tab-nav__icon" aria-hidden="true">
            {tab.icon}
          </span>
                    <span className="tab-nav__label">{tab.label}</span>
                </button>
            ))}
        </nav>
    );
};

export default TabNav;