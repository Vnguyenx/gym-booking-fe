// src/components/pt/PtTabDashboard.tsx
//
// Layout chính của tab Dashboard.
// Ghép 3 sub-component lại:
//   - Lưới 4 stat cards (2x2)
//   - Điều hướng tháng + bar chart
//   - Danh sách buổi tập gần nhất
//
// Không chứa logic — lấy tất cả từ usePtDashboard hook.

import React from 'react';
import { usePtDashboard }    from '../../hooks/usePtDashboard';
import StatCard              from './dashboard/StatCard';
import SessionBarChart       from './dashboard/SessionBarChart';
import RecentSessionList     from './dashboard/RecentSessionList';

const PtTabDashboard: React.FC = () => {
    const {
        monthLabel,
        onPrevMonth,
        onNextMonth,
        stats,
        barChartItems,
        recentSessionItems,
    } = usePtDashboard();

    return (
        <div className="pt-tab-dashboard">

            {/* ── Stat cards 2x2 ──────────────────────────────────────── */}
            <div className="pt-stats-grid">
                <StatCard
                    label="Lớp đang dạy"
                    value={stats.activeCount}
                    sub={`${stats.active1on1Count} cá nhân · ${stats.activeGroupCount} nhóm`}
                    accent
                />
                <StatCard
                    label="Chờ xác nhận"
                    value={stats.pendingConfirmCount}
                    sub="buổi"
                />
                <StatCard
                    label="Buổi tháng này"
                    value={stats.sessionsThisMonth}
                    sub="buổi tập thành công"
                />
                <StatCard
                    label="Đã hết hạn"
                    value={stats.expiredCount}
                    sub="học viên"
                />
            </div>

            {/* ── Điều hướng tháng ────────────────────────────────────── */}
            <div className="pt-month-bar">
                <button
                    className="pt-month-bar__nav"
                    onClick={onPrevMonth}
                    aria-label="Tháng trước"
                >
                    ‹
                </button>
                <span className="pt-month-bar__label">{monthLabel}</span>
                <button
                    className="pt-month-bar__nav"
                    onClick={onNextMonth}
                    aria-label="Tháng sau"
                >
                    ›
                </button>
            </div>

            {/* ── Bar chart buổi tập ──────────────────────────────────── */}
            <SessionBarChart items={barChartItems} />

            {/* ── Separator ───────────────────────────────────────────── */}
            <p className="pt-section-label">Học viên trong tháng</p>

            {/* ── Danh sách học viên ──────────────────────────────────── */}
            <RecentSessionList items={recentSessionItems} />

        </div>
    );
};

export default PtTabDashboard;