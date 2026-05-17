// src/components/pt/notifications/NotifCard.tsx
//
// Sub-component: 1 card thông báo — hiện thông tin buổi chờ xác nhận.
// Bao gồm: tên học viên, loại lớp, thời gian check-in, nút Xác nhận.
//
// Nút bị disable khi đang gọi API (isConfirming = true).
// Sau khi xác nhận thành công, card tự biến mất khỏi danh sách
// vì selector selectPendingConfirms chỉ trả về ptStatus === 'none'.

import React from 'react';
import { PendingConfirmItem } from '../../../types/models';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Format ISO → "15/05/2025 · 09:30" */
function formatDateTime(iso: string): string {
    if (!iso) return '—';
    const d = new Date(iso);
    const date = d.toLocaleDateString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
    });
    const time = d.toLocaleTimeString('vi-VN', {
        hour: '2-digit', minute: '2-digit',
    });
    return `${date} · ${time}`;
}

/** Label loại lớp */
function getTypeLabel(classType: string, groupName: string | null): string {
    if (classType === 'pt-group' && groupName) return `Nhóm ${groupName}`;
    return 'Lớp 1:1';
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface NotifCardProps {
    item:         PendingConfirmItem;
    isConfirming: boolean;   // đang gọi API → disable nút
    onConfirm:    (attendanceId: string, classId: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

const NotifCard: React.FC<NotifCardProps> = ({ item, isConfirming, onConfirm }) => {
    const typeLabel = getTypeLabel(item.classType, item.groupName);

    return (
        <div className={`notif-card ${isConfirming ? 'notif-card--loading' : ''}`}>

            {/* ── Dấu chấm màu vàng bên trái ── */}
            <div className="notif-card__dot" aria-hidden="true" />

            {/* ── Nội dung ── */}
            <div className="notif-card__body">
                {/* Tiêu đề */}
                <p className="notif-card__title">
                    <span className="notif-card__name">{item.customerName}</span>
                    {' '}đã check-in
                </p>

                {/* Meta: loại lớp + thời gian */}
                <p className="notif-card__meta">
                    {typeLabel}
                    <span className="notif-card__sep" aria-hidden="true">·</span>
                    {formatDateTime(item.checkinTime)}
                </p>

                {/* Nút xác nhận */}
                <button
                    className="notif-card__btn"
                    onClick={() => onConfirm(item.attendanceId, item.classId)}
                    disabled={isConfirming}
                    aria-label={`Xác nhận buổi tập của ${item.customerName}`}
                >
                    {isConfirming ? (
                        <>
                            <span className="notif-card__spinner" aria-hidden="true" />
                            Đang xác nhận...
                        </>
                    ) : (
                        <>
                            <i className="ti ti-check" aria-hidden="true" />
                            Xác nhận
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default NotifCard;