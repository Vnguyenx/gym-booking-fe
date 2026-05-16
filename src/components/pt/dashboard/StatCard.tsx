// src/components/pt/dashboard/StatCard.tsx
//
// Sub-component: 1 ô thống kê trong lưới 2 cột trên tab Dashboard.
// Ví dụ: "Lớp đang dạy | 8"
//
// Prop `accent`: nền vàng nổi bật (dùng cho ô quan trọng nhất).

import React from 'react';

interface StatCardProps {
    label:    string;          // dòng nhỏ phía trên — ví dụ "Lớp đang dạy"
    value:    number | string; // số lớn ở giữa
    sub?:     string;          // dòng nhỏ phía dưới (tuỳ chọn)
    accent?:  boolean;         // true → nền vàng #E9A84C
}

const StatCard: React.FC<StatCardProps> = ({ label, value, sub, accent }) => {
    return (
        <div className={`stat-card ${accent ? 'stat-card--accent' : ''}`}>
            <div className="stat-card__label">{label}</div>
            <div className="stat-card__value">{value}</div>
            {sub && <div className="stat-card__sub">{sub}</div>}
        </div>
    );
};

export default StatCard;