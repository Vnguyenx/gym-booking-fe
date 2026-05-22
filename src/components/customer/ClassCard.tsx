// src/components/customer/ClassCard.tsx
import React, { useState } from 'react';
import { ClassItem, ClassStatus, AttendanceRecord } from '../../types/models';
import usePTData from '../../hooks/usePTData';
import CheckinModal from './CheckinModal';

// ─── Helpers ─────────────────────────────────────────────────────────────────
const formatDate = (dateInput: any): string => {
    if (!dateInput) return '—';
    if (typeof dateInput.toDate === 'function') return dateInput.toDate().toLocaleDateString('vi-VN');
    const date = new Date(dateInput);
    return isNaN(date.getTime()) ? '—' : date.toLocaleDateString('vi-VN');
};

const hasCheckedInToday = (attendance: AttendanceRecord[]): boolean => {
    const today = new Date().toDateString();
    return attendance.some(r => r.isSuccess === true && new Date(r.date).toDateString() === today);
};

const getAttendanceBadge = (isSuccess: boolean | null) => {
    if (isSuccess === true) return { label: 'Có mặt', className: 'badge badge--success' };
    if (isSuccess === null) return { label: 'Vắng', className: 'badge badge--error' };
    return { label: '—', className: 'badge badge--neutral' };
};


const CLASS_STATUS_CONFIG: Record<ClassStatus, { label: string; className: string }> = {
    active: { label: 'Đang hoạt động', className: 'badge badge--success' },
    expired: { label: 'Hết hạn', className: 'badge badge--neutral' },
};

// ─── Sub-component: AttendanceRow ────────────────────────────────────────────
const AttendanceRow: React.FC<{ record: AttendanceRecord }> = ({ record }) => {
    const badge = getAttendanceBadge(record.isSuccess);
    return (
        <li className="attendance-item">
            <span className="attendance-date">{formatDate(record.date)}</span>
            <div className="attendance-right">
                <span className={badge.className}>{badge.label}</span>
                {record.type === 'pt_session' && record.isSuccess && (
                    <span className={record.ptStatus === 'confirmed' ? 'badge badge--info' : 'badge badge--warning'}>
                        {record.ptStatus === 'confirmed' ? 'PT đã xác nhận' : 'Chờ PT xác nhận'}
                    </span>
                )}
            </div>
        </li>
    );
};

// ─── Component chính ─────────────────────────────────────────────────────────
interface ClassCardProps {
    classItem: ClassItem;
    isSelected: boolean;
    onSelect: () => void;
}

const ClassCard: React.FC<ClassCardProps> = ({ classItem, isSelected, onSelect }) => {
    const { getPTName } = usePTData();
    const [showCheckinModal, setShowCheckinModal] = useState(false);

    const statusConfig = CLASS_STATUS_CONFIG[classItem.status];
    const typeLabel = classItem.type;
    const ptName = getPTName(classItem.ptId) || 'Chưa có PT';
    const progressPercent = classItem.totalSessions > 0
        ? Math.round((classItem.usedSessions / classItem.totalSessions) * 100)
        : 0;
    const canCheckin = classItem.status === 'active' && !hasCheckedInToday(classItem.attendance);

    return (
        <div className={`class-card ${isSelected ? 'class-card--selected' : ''}`}>
            {/* Header (click để mở rộng) */}
            <button className="class-card__header" onClick={onSelect}>
                <div className="class-card__info">
                    <div className="class-card__badges">
                        <span className="badge badge--neutral">{typeLabel}</span>
                        <span className={statusConfig.className}>{statusConfig.label}</span>
                    </div>
                    <h3 className="class-card__name">{ptName}</h3>
                    <p className="class-card__meta">Hết hạn: {formatDate(classItem.endDate)}</p>
                </div>
                <div className="class-card__attendance-summary">
                    <div className="class-card__attendance-count">
                        {classItem.usedSessions}/{classItem.totalSessions}
                    </div>
                    <div className="class-card__attendance-label">buổi</div>
                </div>
            </button>

            {/* Progress bar */}
            <div className="class-card__progress-bar">
                <div className="class-card__progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>

            {/* Checkin button or already checked-in badge */}
            <div className="class-card__checkin">
                {canCheckin ? (
                    <button
                        className="btn btn--primary btn--full"
                        onClick={(e) => { e.stopPropagation(); setShowCheckinModal(true); }}
                    >
                        Điểm danh hôm nay
                    </button>
                ) : classItem.status === 'active' ? (
                    <span className="badge badge--success badge--full">✓ Đã điểm danh hôm nay</span>
                ) : null}
            </div>

            {/* Expandable detail (attendance history) */}
            {isSelected && (
                <div className="class-card__detail">
                    <p className="detail-title">
                        Lịch sử điểm danh · {formatDate(classItem.startDate)} — {formatDate(classItem.endDate)}
                    </p>
                    {classItem.attendance.length === 0 ? (
                        <p className="empty-text">Chưa có buổi học nào.</p>
                    ) : (
                        <ul className="attendance-list">
                            {classItem.attendance.map(record => (
                                <AttendanceRow key={record.id} record={record} />
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {/* Modal checkin */}
            {showCheckinModal && (
                <CheckinModal classId={classItem.id} onClose={() => setShowCheckinModal(false)} />
            )}
        </div>
    );
};

export default ClassCard;