// src/components/customer/ClassCard.tsx
import React from 'react';
import { ClassItem } from '../../types/models';
import AttendanceBadge from './AttendanceBadge';

// ─── Helper ───────────────────────────────────────────────────────────────────

const formatDate = (dateStr: string): string => {
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
};

// ─── Component ───────────────────────────────────────────────────────────────

interface ClassCardProps {
    classItem: ClassItem;
    isSelected: boolean;
    onSelect: () => void;
}

const ClassCard: React.FC<ClassCardProps> = ({ classItem, isSelected, onSelect }) => {
    const presentCount = classItem.attendance.filter((a) => a.status === 'present').length;
    const totalCount   = classItem.attendance.length;

    return (
        <div className={`class-card ${isSelected ? 'class-card--selected' : ''}`}>
            <button className="class-card__header" onClick={onSelect}>
                <div className="class-card__info">
                    <p className="class-card__name">{classItem.className}</p>
                    <p className="class-card__meta">
                        {classItem.instructor} · {classItem.schedule}
                    </p>
                    {classItem.isEnrolled ? (
                        <span className="badge badge--info">{classItem.courseName}</span>
                    ) : (
                        <span className="badge badge--neutral">Điểm danh lẻ</span>
                    )}
                </div>
                <div className="class-card__attendance-summary">
                    <p className="class-card__attendance-count">{presentCount}/{totalCount}</p>
                    <p className="class-card__attendance-label">Có mặt</p>
                </div>
            </button>

            {isSelected && (
                <div className="class-card__detail">
                    <p className="detail-title">Lịch sử điểm danh</p>
                    {classItem.attendance.length === 0 ? (
                        <p className="empty-text">Chưa có buổi học nào.</p>
                    ) : (
                        <ul className="attendance-list">
                            {classItem.attendance.map((record) => (
                                <li key={record.date} className="attendance-item">
                                    <span className="attendance-date">{formatDate(record.date)}</span>
                                    <div className="attendance-right">
                                        <AttendanceBadge status={record.status} />
                                        {record.note && (
                                            <span className="attendance-note">{record.note}</span>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default ClassCard;