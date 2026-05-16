// src/components/pt/PtTabStudents.tsx
//
// Layout chính của tab Học viên.
// Ghép 3 sub-component:
//   - FilterChips  — chip lọc all / 1on1 / group / expired
//   - StudentCard  — accordion cho lớp 1:1 và expired
//   - GroupCard    — accordion cho nhóm
//
// Logic lọc + expand/collapse nằm trong usePtStudents hook.

import React from 'react';
import { usePtStudents } from '../../hooks/usePtStudents';
import FilterChips       from './students/FilterChips';
import StudentCard       from './students/StudentCard';
import GroupCard         from './students/GroupCard';

// ─── Empty state ──────────────────────────────────────────────────────────────

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
    <div className="students-empty">
        <i className="ti ti-user-off students-empty__icon" aria-hidden="true" />
        <p>{message}</p>
    </div>
);

// ─── Component ────────────────────────────────────────────────────────────────

const PtTabStudents: React.FC = () => {
    const {
        activeFilter,
        onFilterChange,
        filteredClasses,
        groupedClasses,
        expandedIds,
        toggleExpand,
    } = usePtStudents();

    // Tab "group" render GroupCard, còn lại render StudentCard
    const isGroupView = activeFilter === 'group';

    return (
        <div className="pt-tab-students">

            {/* ── Filter chips ── */}
            <FilterChips
                activeFilter={activeFilter}
                onFilterChange={onFilterChange}
            />

            {/* ── Danh sách ── */}
            {isGroupView ? (
                // ── Tab Nhóm → GroupCard ──
                groupedClasses.length === 0 ? (
                    <EmptyState message="Không có nhóm nào đang hoạt động" />
                ) : (
                    groupedClasses.map((group) => (
                        <GroupCard
                            key={group.groupId}
                            group={group}
                            isExpanded={expandedIds.has(group.groupId)}
                            onToggle={() => toggleExpand(group.groupId)}
                        />
                    ))
                )
            ) : (
                // ── Tab All / 1on1 / Expired → StudentCard ──
                filteredClasses.length === 0 ? (
                    <EmptyState
                        message={
                            activeFilter === 'expired'
                                ? 'Chưa có học viên hết hạn'
                                : 'Không có học viên nào'
                        }
                    />
                ) : (
                    filteredClasses.map((cls, idx) => (
                        <StudentCard
                            key={cls.id}
                            cls={cls}
                            colorIndex={idx}
                            isExpanded={expandedIds.has(cls.id)}
                            onToggle={() => toggleExpand(cls.id)}
                        />
                    ))
                )
            )}
        </div>
    );
};

export default PtTabStudents;