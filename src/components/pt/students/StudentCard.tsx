// src/components/pt/students/StudentCard.tsx
//
// Sub-component: accordion card cho 1 học viên (1:1 hoặc expired).
// Click vào header → mở/đóng chi tiết attendance.
//
// Props:
//   cls           — ClassItem từ Redux store
//   isExpanded    — trạng thái mở/đóng (quản lý ở hook)
//   onToggle      — callback toggle
//   confirmingIds — danh sách attendanceId đang gọi API confirm
//   onConfirm     — callback xác nhận điểm danh

import React from 'react';
import { ClassItem } from '../../../types/models';
import AttendanceBadge from './AttendanceBadge';

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Màu avatar xoay vòng theo index — lấy từ HTML gốc
const AVATAR_COLORS = [
    { bg: '#E1F5EE', color: '#085041' },
    { bg: '#E6F1FB', color: '#0C447C' },
    { bg: '#EEEDFE', color: '#3C3489' },
    { bg: '#EAF3DE', color: '#27500A' },
    { bg: '#FBEAF0', color: '#72243E' },
    { bg: '#FAEEDA', color: '#633806' },
];

function getInitials(name: string): string {
    const words = name.trim().split(/\s+/);
    if (words.length === 1) return name.slice(0, 2).toUpperCase();
    return words.slice(0, 2).map((w) => w[0].toUpperCase()).join('');
}

// Tính số buổi đã học / tổng buổi
function getProgress(cls: ClassItem): { done: number; total: number; pct: number } {
    const total = cls.attendance.length || 1;
    const done  = cls.attendance.filter((a) => a.isSuccess).length;
    return { done, total, pct: Math.round((done / total) * 100) };
}

// Format ngày hết hạn
function formatDate(iso: string): string {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
    });
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface StudentCardProps {
    cls:           ClassItem;
    colorIndex:    number;   // để xoay màu avatar
    isExpanded:    boolean;
    onToggle:      () => void;
    confirmingIds: string[];
    onConfirm:     (attendanceId: string, classId: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

const StudentCard: React.FC<StudentCardProps> = ({
                                                     cls,
                                                     colorIndex,
                                                     isExpanded,
                                                     onToggle,
                                                     confirmingIds,
                                                     onConfirm,
                                                 }) => {
    const { bg, color } = AVATAR_COLORS[colorIndex % AVATAR_COLORS.length];
    const initials       = getInitials(cls.customerId);
    const { done, total, pct } = getProgress(cls);
    const typeLabel = cls.ptServiceName || cls.type;
    const displayName          = (cls as any).customerName || cls.customerId;
    const avatarUrl            = (cls as any).customerAvatar as string | undefined;

    return (
        <div className="student-card">

            {/* ── Header — bấm để toggle ── */}
            <div
                className="student-card__head"
                onClick={onToggle}
                role="button"
                aria-expanded={isExpanded}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onToggle()}
            >
                {/* Avatar */}
                <div
                    className="student-card__avatar"
                    style={avatarUrl ? undefined : {background: bg, color}}
                    aria-hidden="true"
                >
                    {avatarUrl ? (
                        <img
                            src={avatarUrl}
                            alt={displayName}
                            className="student-card__avatar-img"
                        />
                    ) : (
                        initials
                    )}
                </div>

                {/* Tên + loại lớp */}
                <div className="student-card__info">
                    <div className="student-card__name">{displayName}</div>
                    <div className="student-card__sub">
                        {typeLabel} · Hết hạn {formatDate(cls.endDate)}
                    </div>
                </div>

                {/* Progress bên phải */}
                <div className="student-card__progress">
                    <span className="student-card__prog-txt">{done}/{total} buổi</span>
                    <div className="student-card__prog-bar">
                        <div
                            className="student-card__prog-fill"
                            style={{width: `${pct}%`}}
                        />
                    </div>
                </div>

                {/* Mũi tên toggle */}
                <i
                    className={`ti ti-chevron-down student-card__chevron ${isExpanded ? 'student-card__chevron--open' : ''}`}
                    aria-hidden="true"
                />
            </div>

            {/* ── Chi tiết attendance — chỉ render khi expanded ── */}
            {isExpanded && (
                <div className="student-card__detail">
                    {cls.attendance.length === 0 ? (
                        <p className="student-card__empty">Chưa có buổi nào</p>
                    ) : (
                        // Sắp xếp mới nhất lên đầu
                        [...cls.attendance]
                            .sort((a, b) =>
                                new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime(),
                            )
                            .map((att) => (
                                <AttendanceBadge
                                    key={att.id}
                                    record={att}
                                    classId={cls.id}
                                    isConfirming={confirmingIds.includes(att.id)}
                                    onConfirm={onConfirm}
                                />
                            ))
                    )}
                </div>
            )}
        </div>
    );
};

export default StudentCard;