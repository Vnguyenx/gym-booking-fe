// src/components/customer/AttendanceModal.tsx
// Modal hiển thị toàn bộ lịch sử điểm danh của một lớp học.
// Mở khi customer bấm "Xem lịch sử" trên ClassCard.

import React, { useEffect, useRef } from 'react';
import { ClassItem, AttendanceRecord } from '../../types/models';
import usePTData from '../../hooks/usePTData';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatDate = (dateInput: any): string => {
    if (!dateInput) return '—';
    if (typeof dateInput.toDate === 'function') return dateInput.toDate().toLocaleDateString('vi-VN');
    const date = new Date(dateInput);
    return isNaN(date.getTime()) ? '—' : date.toLocaleDateString('vi-VN');
};

const getAttendanceBadge = (isSuccess: boolean | null) => {
    if (isSuccess === true)  return { label: 'Có mặt', className: 'badge badge--success' };
    if (isSuccess === null)  return { label: 'Vắng',   className: 'badge badge--error' };
    return { label: '—', className: 'badge badge--neutral' };
};

// ─── Sub: AttendanceRow ───────────────────────────────────────────────────────

const AttendanceRow: React.FC<{ record: AttendanceRecord; index: number }> = ({ record, index }) => {
    const badge = getAttendanceBadge(record.isSuccess);
    return (
        <li
            className="att-modal__row"
            style={{ animationDelay: `${Math.min(index * 0.04, 0.3)}s` }}
        >
            <span className="att-modal__row-num">{index + 1}</span>
            <span className="att-modal__row-date">{formatDate(record.date)}</span>
            <div className="att-modal__row-badges">
                <span className={badge.className}>{badge.label}</span>
                {record.type === 'pt_session' && record.isSuccess && (
                    <span className={record.ptStatus === 'confirmed' ? 'badge badge--info' : 'badge badge--warning'}>
                        {record.ptStatus === 'confirmed' ? 'PT đã xác nhận' : 'Chờ PT'}
                    </span>
                )}
            </div>
        </li>
    );
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface AttendanceModalProps {
    classItem: ClassItem;
    onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

const AttendanceModal: React.FC<AttendanceModalProps> = ({ classItem, onClose }) => {
    const { getPTName } = usePTData();
    const modalRef = useRef<HTMLDivElement>(null);

    const ptName         = getPTName(classItem.ptId) || 'Chưa có PT';
    const progressPercent = classItem.totalSessions > 0
        ? Math.round((classItem.usedSessions / classItem.totalSessions) * 100)
        : 0;

    const attended = classItem.attendance.filter(r => r.isSuccess === true).length;
    const absent   = classItem.attendance.filter(r => r.isSuccess === null).length;

    // Close on Escape
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKey);
        // Prevent body scroll while modal is open
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleKey);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    // Focus trap: focus modal on mount
    useEffect(() => {
        modalRef.current?.focus();
    }, []);

    return (
        <div
            className="modal-overlay"
            onClick={onClose}
            role="presentation"
        >
            <div
                ref={modalRef}
                className="modal-box att-modal"
                onClick={e => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label="Lịch sử điểm danh"
                tabIndex={-1}
            >
                {/* ── Header ── */}
                <div className="att-modal__header">
                    <div className="att-modal__header-info">
                        <p className="att-modal__label">Lịch sử điểm danh</p>
                        <h2 className="att-modal__title">{ptName}</h2>
                        <p className="att-modal__subtitle">
                            {formatDate(classItem.startDate)} — {formatDate(classItem.endDate)}
                        </p>
                    </div>
                    <button
                        className="att-modal__close"
                        onClick={onClose}
                        aria-label="Đóng"
                    >
                        ✕
                    </button>
                </div>

                {/* ── Stats row ── */}
                <div className="att-modal__stats">
                    <div className="att-modal__stat">
                        <span className="att-modal__stat-value att-modal__stat-value--accent">
                            {classItem.usedSessions}/{classItem.totalSessions}
                        </span>
                        <span className="att-modal__stat-label">Tổng buổi</span>
                    </div>
                    <div className="att-modal__stat">
                        <span className="att-modal__stat-value att-modal__stat-value--ok">{attended}</span>
                        <span className="att-modal__stat-label">Có mặt</span>
                    </div>
                    <div className="att-modal__stat">
                        <span className="att-modal__stat-value att-modal__stat-value--err">{absent}</span>
                        <span className="att-modal__stat-label">Vắng</span>
                    </div>
                    <div className="att-modal__stat">
                        <span className="att-modal__stat-value">{progressPercent}%</span>
                        <span className="att-modal__stat-label">Tiến độ</span>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="att-modal__progress-track">
                    <div
                        className="att-modal__progress-fill"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>

                {/* ── List ── */}
                <div className="att-modal__list-wrap">
                    {classItem.attendance.length === 0 ? (
                        <p className="empty-text">Chưa có buổi học nào được ghi nhận.</p>
                    ) : (
                        <>
                            <div className="att-modal__list-header">
                                <span>#</span>
                                <span>Ngày</span>
                                <span style={{ textAlign: 'right' }}>Trạng thái</span>
                            </div>
                            <ul className="att-modal__list">
                                {classItem.attendance.map((record, i) => (
                                    <AttendanceRow key={record.id} record={record} index={i} />
                                ))}
                            </ul>
                        </>
                    )}
                </div>

                {/* ── Footer ── */}
                <div className="att-modal__footer">
                    <button className="btn btn--secondary" onClick={onClose}>
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AttendanceModal;