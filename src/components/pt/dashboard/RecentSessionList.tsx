// src/components/pt/dashboard/RecentSessionList.tsx
//
// Sub-component: danh sách học viên có buổi tập trong tháng.
// Hiển thị: avatar chữ tắt | tên + loại lớp | số buổi
//
// Nhận data đã xử lý từ hook — không tự tính.

import React from 'react';
import { RecentSessionItem } from '../../../hooks/usePtDashboard';

interface RecentSessionListProps {
    items: RecentSessionItem[];
}

const RecentSessionList: React.FC<RecentSessionListProps> = ({ items }) => {
    if (items.length === 0) return null;

    return (
        <div className="recent-list">
            {items.map((item) => (
                <div key={item.name} className="recent-list__item">
                    {/* Avatar màu */}
                    <div
                        className="recent-list__avatar"
                        style={{ background: item.avatarBg, color: item.avatarColor }}
                        aria-hidden="true"
                    >
                        {item.initials}
                    </div>

                    {/* Tên + loại lớp */}
                    <div className="recent-list__info">
                        <div className="recent-list__name">{item.name}</div>
                        <div className="recent-list__type">{item.type}</div>
                    </div>

                    {/* Số buổi */}
                    <div className="recent-list__count">
                        <span className="recent-list__count-num">{item.sessions}</span>
                        <span className="recent-list__count-unit">buổi</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RecentSessionList;