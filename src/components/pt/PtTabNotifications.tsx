// src/components/pt/PtTabNotifications.tsx
//
// Layout chính tab Thông báo.
// Hiển thị danh sách buổi chờ PT xác nhận.
// PT bấm "Xác nhận" → dispatch confirmAttendance thunk → card biến mất.
//
// Sub-components:
//   NotifCard  — 1 card buổi chờ xác nhận
//   ErrorToast — toast lỗi nếu API thất bại

import React from 'react';
import { usePtNotifications } from '../../hooks/usePtNotifications';
import NotifCard              from './notifications/NotifCard';
import ErrorToast             from './notifications/ErrorToast';

// ─── Empty state ──────────────────────────────────────────────────────────────

const EmptyState: React.FC = () => (
    <div className="notif-empty">
        <i className="ti ti-bell-off notif-empty__icon" aria-hidden="true" />
        <p className="notif-empty__title">Không có thông báo</p>
        <p className="notif-empty__sub">Khi học viên check-in, buổi tập sẽ hiện ở đây</p>
    </div>
);

// ─── Component ────────────────────────────────────────────────────────────────

const PtTabNotifications: React.FC = () => {
    const {
        pendingItems,
        confirmingIds,
        confirmError,
        onConfirm,
        onClearError,
    } = usePtNotifications();

    return (
        <div className="pt-tab-notif">

            {/* ── Tiêu đề + đếm số lượng ── */}
            <div className="pt-tab-notif__header">
                <h3 className="pt-tab-notif__title">Chờ xác nhận</h3>
                {pendingItems.length > 0 && (
                    <span className="pt-tab-notif__count">
                        {pendingItems.length}
                    </span>
                )}
            </div>

            {/* ── Toast lỗi — xuất hiện khi confirm thất bại ── */}
            {confirmError && (
                <ErrorToast
                    message={confirmError}
                    onClose={onClearError}
                />
            )}

            {/* ── Danh sách hoặc empty state ── */}
            {pendingItems.length === 0 ? (
                <EmptyState />
            ) : (
                <div className="notif-list">
                    {pendingItems.map((item) => (
                        <NotifCard
                            key={item.attendanceId}
                            item={item}
                            // Chỉ disable nút của đúng card đang gọi API
                            isConfirming={confirmingIds.includes(item.attendanceId)}
                            onConfirm={onConfirm}
                        />
                    ))}
                </div>
            )}

        </div>
    );
};

export default PtTabNotifications;