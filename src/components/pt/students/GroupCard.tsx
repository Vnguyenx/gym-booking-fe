// src/components/pt/students/GroupCard.tsx
//
// Sub-component: accordion card cho 1 nhóm học viên (pt-group).
// Header hiện tên nhóm + số thành viên.
// Mở ra: danh sách member kèm progress từng người.

import React from 'react';
import { GroupedClass } from '../../../types/models';

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

function formatDate(iso: string): string {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
    });
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface GroupCardProps {
    group:      GroupedClass;
    isExpanded: boolean;
    onToggle:   () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

const GroupCard: React.FC<GroupCardProps> = ({ group, isExpanded, onToggle }) => {
    const memberCount = group.members.length;

    return (
        <div className="group-card">

            {/* ── Header ── */}
            <div
                className="group-card__head"
                onClick={onToggle}
                role="button"
                aria-expanded={isExpanded}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onToggle()}
            >
                {/* Icon nhóm — nền tím brand */}
                <div className="group-card__icon" aria-hidden="true">
                    <i className="ti ti-users" />
                </div>

                {/* Tên nhóm + meta */}
                <div className="group-card__info">
                    <div className="group-card__name">{group.groupName}</div>
                    <div className="group-card__sub">
                        {memberCount} học viên · Hết hạn {formatDate(group.endDate)}
                    </div>
                </div>

                {/* Mũi tên toggle */}
                <i
                    className={`ti ti-chevron-down group-card__chevron ${isExpanded ? 'group-card__chevron--open' : ''}`}
                    aria-hidden="true"
                />
            </div>

            {/* ── Danh sách member — chỉ render khi expanded ── */}
            {isExpanded && (
                <div className="group-card__body">
                    {group.members.map((cls, idx) => {
                        const { bg, color } = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                        const initials      = getInitials(cls.customerId);
                        const done          = cls.attendance.filter((a) => a.isSuccess).length;
                        const total         = cls.attendance.length || 1;

                        return (
                            <div key={cls.id} className="group-card__member">
                                {/* Avatar */}
                                <div
                                    className="group-card__member-avatar"
                                    style={{ background: bg, color }}
                                    aria-hidden="true"
                                >
                                    {initials}
                                </div>

                                {/* Tên */}
                                <div className="group-card__member-name">
                                    {cls.customerId}
                                </div>

                                {/* Số buổi */}
                                <div className="group-card__member-prog">
                                    {done}/{total}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default GroupCard;