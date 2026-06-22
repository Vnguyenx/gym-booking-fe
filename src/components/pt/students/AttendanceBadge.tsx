// src/components/pt/students/AttendanceBadge.tsx
//
// Sub-component: badge nhỏ hiển thị trạng thái 1 buổi điểm danh.
// Dùng trong StudentCard khi mở rộng chi tiết.
//
// Trạng thái:
//   isSuccess + ptStatus=confirmed → "Đã xác nhận" (xanh), không có nút
//   isSuccess + ptStatus=none      → "Chờ xác nhận" (vàng) + nút Xác nhận
//   !isSuccess                     → "Vắng"         (đỏ), không có nút

import React from 'react';
import { AttendanceRecord } from '../../../types/models';

interface AttendanceBadgeProps {
    record:       AttendanceRecord;
    /** classId của lớp chứa attendance này — cần để dispatch confirm */
    classId:      string;
    /** true khi đang gọi API confirm cho đúng attendanceId này */
    isConfirming: boolean;
    /** callback bấm nút Xác nhận */
    onConfirm:    (attendanceId: string, classId: string) => void;
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

// Chỉ buổi đã điểm danh thành công và chưa được PT xác nhận mới cần nút
function needsConfirm(record: AttendanceRecord): boolean {
    return record.isSuccess === true && record.ptStatus === 'none';
}

const AttendanceBadge: React.FC<AttendanceBadgeProps> = ({
                                                             record,
                                                             classId,
                                                             isConfirming,
                                                             onConfirm,
                                                         }) => {
    const { className, label } = getBadgeConfig(record);
    const showConfirmBtn = needsConfirm(record);

    return (
        <div className={`att-row ${showConfirmBtn ? 'att-row--pending' : ''}`}>
            <span className="att-row__date">{formatDate(record.date ?? '')}</span>
            <span className={className}>{label}</span>

            {showConfirmBtn && (
                <button
                    className="att-row__confirm-btn"
                    onClick={() => onConfirm(record.id, classId)}
                    disabled={isConfirming}
                    aria-label="Xác nhận buổi tập"
                >
                    {isConfirming ? (
                        <>
                            <span className="att-row__spinner" aria-hidden="true" />
                            Đang xác nhận...
                        </>
                    ) : (
                        <>
                            <i className="ti ti-check" aria-hidden="true" />
                            Xác nhận
                        </>
                    )}
                </button>
            )}
        </div>
    );
};

export default AttendanceBadge;