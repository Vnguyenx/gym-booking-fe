// src/components/pt/dashboard/SessionBarChart.tsx
//
// Sub-component: biểu đồ cột ngang thể hiện số buổi tập của mỗi học viên.
// Thanh = % (sessions / total * 100), màu accent.
//
// Nhận data đã xử lý từ hook — không tự tính.

import React from 'react';
import { BarChartItem } from '../../../hooks/usePtDashboard';

interface SessionBarChartProps {
    items: BarChartItem[];
}

const SessionBarChart: React.FC<SessionBarChartProps> = ({ items }) => {
    // Không có data → không render
    if (items.length === 0) {
        return (
            <div className="bar-chart__empty">
                Chưa có buổi tập nào trong tháng này
            </div>
        );
    }

    return (
        <div className="bar-chart">
            <p className="bar-chart__title">Buổi tập theo học viên</p>
            {items.map((item) => {
                const pct = Math.min(Math.round((item.sessions / item.total) * 100), 100);
                return (
                    <div key={item.id} className="bar-chart__row">
                        {/* Tên học viên */}
                        <span className="bar-chart__name" title={item.name}>
                            {item.name}
                        </span>

                        {/* Thanh ngang */}
                        <div className="bar-chart__track" aria-label={`${pct}%`}>
                            <div
                                className="bar-chart__fill"
                                style={{ width: `${pct}%` }}
                            />
                        </div>

                        {/* Số buổi */}
                        <span className="bar-chart__count">{item.sessions}</span>
                    </div>
                );
            })}
        </div>
    );
};

export default SessionBarChart;