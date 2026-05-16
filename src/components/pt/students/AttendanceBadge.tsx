// src/components/pt/students/AttendanceBadge.tsx
//
// Sub-component: badge nhỏ hiển thị trạng thái 1 buổi điểm danh.
// Dùng trong StudentCard khi mở rộng chi tiết.
//
// Trạng thái:
//   isSuccess + ptStatus=confirmed → "Đã xác nhận" (xanh)
//   isSuccess + ptStatus=none      → "Chờ xác nhận" (vàng)
//   !isSuccess                     → "Vắng"         (đỏ)

import React from 'react';
import { AttendanceRecord } from '../../../types/models';

interface AttendanceBadgeProps {
    record: AttendanceRecord;
}

// Tính class + text từ trạng thái record
function getBadgeConfig(record: AttendanceRecord): { className: string; label: string } {
    if (!record.isSuccess) {
        return { className: 'badge badge--err',  label: 'Vắng' };
    }
    if (record.ptStatus === 'confirmed') {
        return { className: 'badge badge--ok',   label: 'Đã xác nhận' };
    }
    return     { className: 'badge badge--warn', label: 'Chờ xác nhận' };
}

// Format ngày từ ISO string → "15/05/2025"
function formatDate(iso: string): string {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

const AttendanceBadge: React.FC<AttendanceBadgeProps> = ({ record }) => {
    const { className, label } = getBadgeConfig(record);

    return (
        <div className="att-row">
            <span className="att-row__date">{formatDate(record.date ?? '')}</span>
            <span className={className}>{label}</span>
        </div>
    );
};

export default AttendanceBadge;