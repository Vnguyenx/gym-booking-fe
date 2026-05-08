import React from 'react';
import { AttendanceStatus } from '../../hooks/useClasses';

// ─── Types ───────────────────────────────────────────────────────────────────

interface AttendanceBadgeProps {
    status: AttendanceStatus;
}

// Map trạng thái -> nhãn tiếng Việt và CSS class
const STATUS_CONFIG: Record<AttendanceStatus, { label: string; className: string }> = {
    present: { label: 'Có mặt', className: 'badge badge--success' },
    absent:  { label: 'Vắng',   className: 'badge badge--error' },
    late:    { label: 'Đi trễ', className: 'badge badge--warning' },
};

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * AttendanceBadge
 * Hiển thị trạng thái điểm danh dưới dạng badge màu sắc.
 * Tách ra thành component riêng để dễ tái sử dụng ở nhiều nơi.
 */
const AttendanceBadge: React.FC<AttendanceBadgeProps> = ({ status }) => {
    const config = STATUS_CONFIG[status];
    return <span className={config.className}>{config.label}</span>;
};

export default AttendanceBadge;