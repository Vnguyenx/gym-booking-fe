import React from 'react';
import useClasses, { ClassItem } from '../../hooks/useClasses';
import AttendanceBadge from './AttendanceBadge';

// ─── Helper ───────────────────────────────────────────────────────────────────

/** Chuyển "2025-05-01" -> "01/05/2025" để hiển thị thân thiện hơn */
const formatDate = (dateStr: string): string => {
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
};

// ─── Sub-component: Thẻ một lớp học ─────────────────────────────────────────

interface ClassCardProps {
    classItem: ClassItem;
    isSelected: boolean;
    onSelect: () => void;
}

/**
 * ClassCard
 * Thẻ tóm tắt một lớp học. Khi click sẽ mở ra chi tiết điểm danh.
 */
const ClassCard: React.FC<ClassCardProps> = ({ classItem, isSelected, onSelect }) => {
    const presentCount = classItem.attendance.filter(
        (a) => a.status === 'present'
    ).length;
    const totalCount = classItem.attendance.length;

    return (
        <div className={`class-card ${isSelected ? 'class-card--selected' : ''}`}>
            {/* Header thẻ - bấm để toggle điểm danh */}
            <button className="class-card__header" onClick={onSelect}>
                <div className="class-card__info">
                    <p className="class-card__name">{classItem.className}</p>
                    <p className="class-card__meta">
                        {classItem.instructor} · {classItem.schedule}
                    </p>
                    {/* Tag đăng ký khoá học */}
                    {classItem.isEnrolled ? (
                        <span className="badge badge--info">{classItem.courseName}</span>
                    ) : (
                        <span className="badge badge--neutral">Điểm danh lẻ</span>
                    )}
                </div>
                {/* Tỉ lệ có mặt */}
                <div className="class-card__attendance-summary">
                    <p className="class-card__attendance-count">
                        {presentCount}/{totalCount}
                    </p>
                    <p className="class-card__attendance-label">Có mặt</p>
                </div>
            </button>

            {/* Chi tiết điểm danh - chỉ hiện khi được chọn */}
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

// ─── Component chính ─────────────────────────────────────────────────────────

/**
 * ClassesSection
 * Danh sách tất cả lớp học của customer.
 * Mỗi lớp hiển thị dưới dạng ClassCard có thể mở rộng để xem điểm danh.
 */
const ClassesSection: React.FC = () => {
    const { classes, isLoading, selectedClassId, selectClass, clearSelection } =
        useClasses();

    const handleSelect = (id: string) => {
        // Toggle: nếu đang chọn thì đóng lại, ngược lại mở ra
        if (selectedClassId === id) {
            clearSelection();
        } else {
            selectClass(id);
        }
    };

    return (
        <section className="profile-section">
            <div className="section-header">
                <h2 className="section-title">Lớp học & Điểm danh</h2>
            </div>

            {isLoading ? (
                <p className="loading-text">Đang tải...</p>
            ) : classes.length === 0 ? (
                <p className="empty-text">Bạn chưa tham gia lớp học nào.</p>
            ) : (
                <div className="class-list">
                    {classes.map((classItem) => (
                        <ClassCard
                            key={classItem.id}
                            classItem={classItem}
                            isSelected={selectedClassId === classItem.id}
                            onSelect={() => handleSelect(classItem.id)}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default ClassesSection;