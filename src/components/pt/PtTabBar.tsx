// src/components/pt/PtTabBar.tsx
//
// Thanh tab bar 4 nút ở dưới header:
//   Dashboard | Học viên | Thông báo | Cá nhân
//
// - Tab active: màu accent + border-bottom
// - Tab Thông báo: có dot đỏ khi pendingCount > 0
// - Sticky dưới header, luôn hiển thị

import React from 'react';
import { PtTab } from '../../pages/pt/PtDashboard';
import { usePtTabBar } from '../../hooks/usePtTabBar';

// ─── Định nghĩa 4 tab ─────────────────────────────────────────────────────────

interface TabConfig {
    key: PtTab;
    label: string;
    icon: string;   // Tabler Icons class
}

const TABS: TabConfig[] = [
    { key: 'dash',     label: 'Dashboard',   icon: 'ti-layout-dashboard' },
    { key: 'students', label: 'Học viên',    icon: 'ti-users'            },
    { key: 'notif',    label: 'Thông báo',   icon: 'ti-bell'             },
    { key: 'profile',  label: 'Cá nhân',     icon: 'ti-user-circle'      },
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface PtTabBarProps {
    activeTab: PtTab;
    onTabChange: (tab: PtTab) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

const PtTabBar: React.FC<PtTabBarProps> = ({ activeTab, onTabChange }) => {
    const { pendingCount } = usePtTabBar();

    return (
        <nav className="pt-tab-bar" aria-label="Điều hướng dashboard">
            {TABS.map((tab) => {
                const isActive  = activeTab === tab.key;
                // Chỉ tab Thông báo mới có dot
                const showDot   = tab.key === 'notif' && pendingCount > 0;

                return (
                    <button
                        key={tab.key}
                        className={`pt-tab-bar__btn ${isActive ? 'pt-tab-bar__btn--active' : ''}`}
                        onClick={() => onTabChange(tab.key)}
                        aria-current={isActive ? 'page' : undefined}
                        aria-label={
                            showDot
                                ? `${tab.label} — ${pendingCount} chờ xác nhận`
                                : tab.label
                        }
                    >
                        {/* Icon + dot container */}
                        <span className="pt-tab-bar__icon-wrap">
                            <i className={`ti ${tab.icon}`} aria-hidden="true" />
                            {showDot && (
                                <span className="pt-tab-bar__dot" aria-hidden="true" />
                            )}
                        </span>

                        {/* Label */}
                        <span className="pt-tab-bar__label">{tab.label}</span>
                    </button>
                );
            })}
        </nav>
    );
};

export default PtTabBar;