// src/components/customer/ClassCard.tsx
import React, { useState } from 'react';
import { ClassItem, ClassStatus, AttendanceRecord } from '../../types/models';
import usePTData from '../../hooks/usePTData';
import CheckinModal from './CheckinModal';
import AttendanceModal from './AttendanceModal';

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

const CLASS_STATUS_CONFIG: Record<ClassStatus, { label: string; className: string }> = {
    active:  { label: 'Đang hoạt động', className: 'badge badge--success' },
    expired: { label: 'Hết hạn',        className: 'badge badge--neutral' },
};

interface ClassCardProps {
    classItem: ClassItem;
}

const ClassCard: React.FC<ClassCardProps> = ({ classItem }) => {
    const { getPTName } = usePTData();

    const [showCheckin,    setShowCheckin]    = useState(false);
    const [showAttendance, setShowAttendance] = useState(false);

    const statusConfig    = CLASS_STATUS_CONFIG[classItem.status];
    const ptName          = getPTName(classItem.ptId) || 'Chưa có PT';
    const progressPercent = classItem.totalSessions > 0
        ? Math.round((classItem.usedSessions / classItem.totalSessions) * 100)
        : 0;
    const canCheckin      = classItem.status === 'active' && !hasCheckedInToday(classItem.attendance);
    const attendanceCount = classItem.attendance.length;

    // Ưu tiên dùng typeName (tên dịch vụ từ pt_services) nếu có, fallback sang type
    const displayType = classItem.typeName
        ? (classItem.typeName === 'none' ? 'Không có PT' : classItem.typeName)
        : (classItem.type === 'none' ? 'Không có PT' : classItem.type);
    return (
        <>
            <div className="class-card">
                <div className="class-card__header class-card__header--static">
                    <div className="class-card__info">
                        <div className="class-card__badges">
                            <span className="badge badge--neutral">{displayType}</span>
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
                </div>

                <div className="class-card__progress-bar">
                    <div
                        className="class-card__progress-fill"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>

                <div className="class-card__actions">
                    {classItem.status === 'active' && (
                        canCheckin ? (
                            <button
                                className="btn btn--primary btn--action"
                                onClick={() => setShowCheckin(true)}
                            >
                                ✓ Điểm danh hôm nay
                            </button>
                        ) : (
                            <span className="badge badge--success badge--action">✓ Đã điểm danh hôm nay</span>
                        )
                    )}

                    <button
                        className="btn btn--ghost btn--action"
                        onClick={() => setShowAttendance(true)}
                        aria-label={`Xem lịch sử điểm danh, ${attendanceCount} buổi`}
                    >
                        📋 Lịch sử
                        {attendanceCount > 0 && (
                            <span className="class-card__history-count">{attendanceCount}</span>
                        )}
                    </button>
                </div>
            </div>

            {showCheckin && (
                <CheckinModal
                    classId={classItem.id}
                    onClose={() => setShowCheckin(false)}
                />
            )}
            {showAttendance && (
                <AttendanceModal
                    classItem={classItem}
                    onClose={() => setShowAttendance(false)}
                />
            )}
        </>
    );
};

export default ClassCard;