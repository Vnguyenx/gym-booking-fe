// src/components/pt/PtHeader.tsx
//
// UI thuần của thanh header trên cùng dashboard PT.
// Hiển thị: avatar chữ tắt | tên PT + role | nút chuông thông báo
//
// ⚠️  Không chứa logic — mọi data lấy từ hook usePtHeader.
// Props duy nhất: onNotifClick — callback khi bấm chuông.

import React from 'react';
import { usePtHeader } from '../../hooks/usePtHeader';

// ─── Props ────────────────────────────────────────────────────────────────────

interface PtHeaderProps {
    /** Gọi khi PT bấm chuông → PtDashboard chuyển sang tab 'notif' */
    onNotifClick: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

const PtHeader: React.FC<PtHeaderProps> = ({ onNotifClick }) => {
    const { displayName, avatarInitials, pendingCount } = usePtHeader();

    const hasPending = pendingCount > 0;

    return (
        <header className="pt-hdr">

            {/* Avatar chữ tắt */}
            <div className="pt-hdr__avatar" aria-hidden="true">
                {avatarInitials}
            </div>

            {/* Tên + role */}
            <div className="pt-hdr__info">
                <h2 className="pt-hdr__name">{displayName}</h2>
                <p className="pt-hdr__role">Huấn luyện viên</p>
            </div>

            {/* Nút chuông — aria-label động cho screen reader */}
            <button
                className="pt-hdr__notif-btn"
                onClick={onNotifClick}
                aria-label={
                    hasPending
                        ? `${pendingCount} thông báo chờ xác nhận`
                        : 'Thông báo'
                }
            >
                <i className="ti ti-bell" aria-hidden="true" />

                {/* Badge đỏ — chỉ render khi có buổi chờ */}
                {hasPending && (
                    <span className="pt-hdr__notif-dot" aria-hidden="true" />
                )}
            </button>

        </header>
    );
};

export default PtHeader;