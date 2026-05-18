// src/store/selectors/ptSelectors.ts

import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { ClassItem, AttendanceRecord } from '../../types/models';
import {
    PTDashboardStats,
    PendingConfirmItem,
    GroupedClass,
    StudentFilter,
} from '../../types/models';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const isPending = (a: AttendanceRecord): boolean =>
    a.isSuccess === true && a.ptStatus === 'none';

const sameMonth = (isoDate: string, month: number, year: number): boolean => {
    const d = new Date(isoDate);
    return d.getMonth() + 1 === month && d.getFullYear() === year;
};

// ─── Base selectors (primitive / stable reference) ───────────────────────────

const selectActiveClasses  = (state: RootState) => state.ptDashboard.activeClasses;
const selectExpiredClasses = (state: RootState) => state.ptDashboard.expiredClasses;

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

/**
 * Có tham số động (month, year) → dùng factory pattern:
 * mỗi cặp (month, year) tạo 1 selector được memoize riêng.
 */
export const selectDashboardStats = (
    state: RootState,
    month: number,
    year: number,
): PTDashboardStats => {
    const activeClasses  = selectActiveClasses(state);
    const expiredClasses = selectExpiredClasses(state);

    const activeCount     = activeClasses.length;
    const active1on1Count = activeClasses.filter((c) => c.type === 'pt-1on1').length;

    const groupIds = new Set(
        activeClasses
            .filter((c) => c.type === 'pt-group' && c.classGroupId)
            .map((c) => c.classGroupId as string),
    );
    const activeGroupCount = groupIds.size;

    let sessionsThisMonth = 0;
    for (const cls of activeClasses) {
        for (const att of cls.attendance) {
            if (att.isSuccess && att.date && sameMonth(att.date, month, year)) {
                sessionsThisMonth++;
            }
        }
    }

    let pendingConfirmCount = 0;
    for (const cls of activeClasses) {
        pendingConfirmCount += cls.attendance.filter(isPending).length;
    }

    return {
        activeCount,
        active1on1Count,
        activeGroupCount,
        sessionsThisMonth,
        pendingConfirmCount,
        expiredCount: expiredClasses.length,
    };
};

// ─── Pending Confirmations ────────────────────────────────────────────────────

/**
 * Memoized: chỉ tính lại khi activeClasses thay đổi reference.
 */
export const selectPendingConfirms = createSelector(
    selectActiveClasses,
    (activeClasses): PendingConfirmItem[] => {
        const items: PendingConfirmItem[] = [];

        for (const cls of activeClasses) {
            for (const att of cls.attendance) {
                if (!isPending(att)) continue;

                items.push({
                    attendanceId: att.id,
                    classId:      cls.id,
                    customerName: (cls as any).customerName ?? cls.customerId,
                    groupName:    cls.classGroupId ?? null,
                    classType:    cls.type,
                    checkinTime:  att.date ?? '',
                });
            }
        }

        return items.sort(
            (a, b) => new Date(b.checkinTime).getTime() - new Date(a.checkinTime).getTime(),
        );
    },
);

// ─── Grouped Classes ──────────────────────────────────────────────────────────

/**
 * Memoized: chỉ tính lại khi activeClasses thay đổi reference.
 */
export const selectGroupedClasses = createSelector(
    selectActiveClasses,
    (activeClasses): GroupedClass[] => {
        const groupMap = new Map<string, ClassItem[]>();

        for (const cls of activeClasses) {
            if (cls.type !== 'pt-group' || !cls.classGroupId) continue;
            const existing = groupMap.get(cls.classGroupId) ?? [];
            groupMap.set(cls.classGroupId, [...existing, cls]);
        }

        return Array.from(groupMap.entries()).map(([groupId, members]) => {
            const endDate = members
                .map((m) => m.endDate)
                .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0] ?? '';

            return {
                groupId,
                groupName: `Nhóm ${groupId}`,
                members,
                endDate,
            };
        });
    },
);

// ─── Filtered Classes ─────────────────────────────────────────────────────────

/**
 * Có tham số động (filter) → dùng plain function thay vì createSelector.
 * Redux sẽ không warn vì component dùng kết quả này qua useAppSelector
 * và filter thay đổi thì reference cũng đổi là đúng.
 */
export const selectFilteredClasses = (
    state: RootState,
    filter: StudentFilter,
) => {
    const { activeClasses, expiredClasses } = state.ptDashboard;

    switch (filter) {
        case '1on1':    return activeClasses.filter((c) => c.type === 'pt-1on1');
        case 'group':   return activeClasses.filter((c) => c.type === 'pt-group');
        case 'expired': return expiredClasses;
        case 'all':
        default:        return activeClasses;
    }
};

// ─── Loading / Error ──────────────────────────────────────────────────────────

export const selectStudentsLoading = (state: RootState) => state.ptDashboard.studentsLoading;
export const selectStudentsError   = (state: RootState) => state.ptDashboard.studentsError;
export const selectStudentsLoaded  = (state: RootState) => state.ptDashboard.studentsLoaded;

export const selectConfirmingIds   = (state: RootState) => state.ptDashboard.confirmingIds;
export const selectConfirmError    = (state: RootState) => state.ptDashboard.confirmError;

export const selectProfileSaving   = (state: RootState) => state.ptDashboard.profileSaving;
export const selectProfileError    = (state: RootState) => state.ptDashboard.profileError;
export const selectProfileSuccess  = (state: RootState) => state.ptDashboard.profileSuccess;