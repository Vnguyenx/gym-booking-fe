// src/components/customer/ClassCard.tsx
// Hiển thị thông tin một gói tập / PT coaching của customer.
// Click vào header để mở rộng xem lịch sử điểm danh.
// Nếu gói đang active → hiện nút "Điểm danh" để mở CheckinModal.

import React, { useState } from 'react';
import { ClassItem, ClassType, ClassStatus, AttendanceRecord } from '../../types/models';
import usePTData from '../../hooks/usePTData';
import CheckinModal from './CheckinModal';

// ─── Config hiển thị ──────────────────────────────────────────────────────────

const CLASS_TYPE_LABEL: Record<ClassType, string> = {
    'pt-none':  'Gói tập',
    'pt-1on1':  'PT 1:1',
    'pt-group': 'PT Nhóm',
};

// Map status → badge CSS
const CLASS_STATUS_CONFIG: Record<ClassStatus, { label: string; className: string }> = {
    active:  { label: 'Đang hoạt động', className: 'badge badge--success' },
    expired: { label: 'Hết hạn',        className: 'badge badge--neutral' },
};

/**
 * Trả về badge config cho trạng thái điểm danh.
 * isSuccess === true  → có mặt
 * isSuccess === null  → vắng (record tự động tạo lúc 23:59)
 * isSuccess === false → không dùng nhưng handle để an toàn
 */
const getAttendanceBadge = (isSuccess: boolean | null) => {
    if (isSuccess === true)  return { label: 'Có mặt', className: 'badge badge--success' };
    if (isSuccess === null)  return { label: 'Vắng',   className: 'badge badge--error'   };
    return                          { label: '—',      className: 'badge badge--neutral'  };
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Chuyển ISO string → "dd/mm/yyyy", trả về "—" nếu null */
const formatDate = (dateInput: any): string => {
    if (!dateInput) return '—';

    // 1. Nếu là Firebase Timestamp (có hàm toDate)
    if (typeof dateInput.toDate === 'function') {
        return dateInput.toDate().toLocaleDateString('vi-VN');
    }

    // 2. Nếu là chuỗi ISO String hoặc đối tượng Date
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return '—'; // Tránh lỗi Invalid Date

    return date.toLocaleDateString('vi-VN');
};

/**
 * Kiểm tra xem hôm nay customer đã điểm danh thành công chưa.
 * Dùng để ẩn/hiện nút "Điểm danh hôm nay".
 */
const hasCheckedInToday = (attendance: AttendanceRecord[]): boolean => {
    const today = new Date().toDateString();
    return attendance.some(
        (r) => r.isSuccess === true && new Date(r.date).toDateString() === today
    );
};

// ─── Sub-component: Một dòng attendance ──────────────────────────────────────

interface AttendanceRowProps {
    record: AttendanceRecord;
}

/**
 * AttendanceRow
 * Hiển thị một dòng trong lịch sử điểm danh.
 * Tách riêng để ClassCard không bị quá dài.
 */
const AttendanceRow: React.FC<AttendanceRowProps> = ({ record }) => {
    const badge = getAttendanceBadge(record.isSuccess);

    return (
        <li className="attendance-item">
            {/* Ngày điểm danh */}
            <span className="attendance-date">{formatDate(record.date)}</span>

            <div className="attendance-right">
                {/* Trạng thái có mặt / vắng */}
                <span className={badge.className}>{badge.label}</span>

                {/*
                  * Badge trạng thái PT xác nhận.
                  * Chỉ hiện với buổi PT (type === "pt_session") và customer đã điểm danh.
                  * ptStatus: "none" = PT chưa xác nhận, "confirmed" = PT đã xác nhận
                  */}
                {record.type === 'pt_session' && record.isSuccess && (
                    <span className={
                        record.ptStatus === 'confirmed'
                            ? 'badge badge--info'
                            : 'badge badge--warning'
                    }>
                        {record.ptStatus === 'confirmed' ? 'PT đã xác nhận' : 'Chờ PT xác nhận'}
                    </span>
                )}
            </div>
        </li>
    );
};

// ─── Component chính ──────────────────────────────────────────────────────────

interface ClassCardProps {
    classItem: ClassItem;
    isSelected: boolean;
    onSelect: () => void;
}

/**
 * ClassCard
 * Thẻ tóm tắt một gói tập. Click header để toggle chi tiết điểm danh.
 *
 * Tính năng:
 * - Progress bar tiến độ buổi tập
 * - Lịch sử điểm danh (toggle ẩn/hiện)
 * - Nút "Điểm danh hôm nay" nếu gói active và chưa điểm danh hôm nay
 *
 * Layout: mobile-first (stack dọc), scale ra desktop (2 cột ở header)
 */
const ClassCard: React.FC<ClassCardProps> = ({ classItem, isSelected, onSelect }) => {
    const { getPTName } = usePTData();

    // State kiểm soát hiển thị modal nhập mã điểm danh
    const [showCheckinModal, setShowCheckinModal] = useState(false);

    const statusConfig = CLASS_STATUS_CONFIG[classItem.status];
    const typeLabel    = CLASS_TYPE_LABEL[classItem.type];

    // Tính % tiến độ buổi tập để hiển thị progress bar
    const progressPercent = classItem.totalSessions > 0
        ? Math.round((classItem.usedSessions / classItem.totalSessions) * 100)
        : 0;

    // Chỉ hiện nút điểm danh khi: gói active + chưa điểm danh hôm nay
    const canCheckin =
        classItem.status === 'active' &&
        !hasCheckedInToday(classItem.attendance);

    return (
        <div className={`class-card ${isSelected ? 'class-card--selected' : ''}`}>

            {/* ── Header: bấm để toggle chi tiết ── */}
            <button className="class-card__header" onClick={onSelect}>
                <div className="class-card__info">

                    {/* Dòng 1: loại gói + status */}
                    <div className="class-card__badges">
                        <span className="badge badge--neutral">{typeLabel}</span>
                        <span className={statusConfig.className}>{statusConfig.label}</span>
                    </div>

                    {/* Dòng 2: tên PT (chỉ hiện với pt_coaching) */}
                    {classItem.ptId && (
                        <p className="class-card__meta">
                            PT: {getPTName(classItem.ptId)}
                        </p>
                    )}

                    {/* Dòng 3: ngày hết hạn */}
                    <p className="class-card__meta">
                        Hết hạn: {formatDate(classItem.endDate)}
                    </p>
                </div>

                {/* Tóm tắt tiến độ buổi tập */}
                <div className="class-card__attendance-summary">
                    <p className="class-card__attendance-count">
                        {classItem.usedSessions}/{classItem.totalSessions}
                    </p>
                    <p className="class-card__attendance-label">Buổi</p>
                </div>
            </button>

            {/* Progress bar tiến độ buổi tập */}
            <div className="class-card__progress-bar">
                <div
                    className="class-card__progress-fill"
                    style={{ width: `${progressPercent}%` }}
                />
            </div>

            {/* ── Nút điểm danh — chỉ hiện khi đủ điều kiện ── */}
            {canCheckin && (
                <div className="class-card__checkin">
                    <button
                        className="btn btn--primary btn--full"
                        onClick={(e) => {
                            // Ngăn click lan lên header (tránh toggle chi tiết)
                            e.stopPropagation();
                            setShowCheckinModal(true);
                        }}
                    >
                        Điểm danh hôm nay
                    </button>
                </div>
            )}

            {/* Badge "Đã điểm danh" nếu hôm nay đã check-in (thay thế nút) */}
            {classItem.status === 'active' && !canCheckin && (
                <div className="class-card__checkin">
                    <span className="badge badge--success badge--full">
                        ✓ Đã điểm danh hôm nay
                    </span>
                </div>
            )}

            {/* ── Chi tiết điểm danh — chỉ hiện khi được chọn ── */}
            {isSelected && (
                <div className="class-card__detail">
                    <p className="detail-title">
                        Lịch sử điểm danh · {formatDate(classItem.startDate)} — {formatDate(classItem.endDate)}
                    </p>

                    {classItem.attendance.length === 0 ? (
                        <p className="empty-text">Chưa có buổi học nào.</p>
                    ) : (
                        <ul className="attendance-list">
                            {classItem.attendance.map((record) => (
                                <AttendanceRow key={record.id} record={record} />
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {/* ── Modal nhập mã điểm danh ── */}
            {showCheckinModal && (
                <CheckinModal
                    classId={classItem.id}
                    onClose={() => setShowCheckinModal(false)}
                />
            )}
        </div>
    );
};

export default ClassCard;