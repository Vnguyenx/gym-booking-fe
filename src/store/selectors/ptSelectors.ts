// src/store/selectors/ptSelectors.ts
// Tất cả selector liên quan đến PT state.
//
// Tại sao dùng selector riêng thay vì tính trong component?
//   - Tính toán ở 1 chỗ, không lặp code
//   - Component chỉ nhận data đã sẵn sàng
//   - Dễ test độc lập
//
// Dùng: const stats = useAppSelector(selectDashboardStats)

import { RootState } from '../index';
import { ClassItem, AttendanceRecord } from '../../types/models';
import {
    PTDashboardStats,
    PendingConfirmItem,
    GroupedClass,
    StudentFilter,
} from '../../types/models';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Kiểm tra một attendance record có đang chờ PT xác nhận không */
const isPending = (a: AttendanceRecord): boolean =>
    a.isSuccess === true && a.ptStatus === 'none';

/** Lấy tháng/năm từ ISO string */
const sameMonth = (isoDate: string, month: number, year: number): boolean => {
    const d = new Date(isoDate);
    return d.getMonth() + 1 === month && d.getFullYear() === year;
};

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

/**
 * Tính toán số liệu tổng hợp cho dashboard PT.
 * Nhận month/year để filter buổi tập trong tháng.
 */
export const selectDashboardStats = (
    state: RootState,
    month: number,
    year: number,
): PTDashboardStats => {
    const { activeClasses, expiredClasses } = state.ptDashboard;

    // Số lớp active
    const activeCount = activeClasses.length;

    // Đếm 1:1
    const active1on1Count = activeClasses.filter((c) => c.type === 'pt-1on1').length;

    // Đếm nhóm unique (theo classGroupId)
    const groupIds = new Set(
        activeClasses
            .filter((c) => c.type === 'pt-group' && c.classGroupId)
            .map((c) => c.classGroupId as string),
    );
    const activeGroupCount = groupIds.size;

    // Tổng buổi thành công trong tháng
    let sessionsThisMonth = 0;
    for (const cls of activeClasses) {
        for (const att of cls.attendance) {
            if (att.isSuccess && att.date && sameMonth(att.date, month, year)) {
                sessionsThisMonth++;
            }
        }
    }

    // Buổi chờ xác nhận (chỉ từ active classes)
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
 * Lấy danh sách buổi chờ PT xác nhận — hiển thị ở tab Thông báo.
 * Flatten từ activeClasses, sắp xếp mới nhất lên đầu.
 */
export const selectPendingConfirms = (state: RootState): PendingConfirmItem[] => {
    const items: PendingConfirmItem[] = [];

    for (const cls of state.ptDashboard.activeClasses) {
        for (const att of cls.attendance) {
            if (!isPending(att)) continue;

            items.push({
                attendanceId: att.id,
                classId:      cls.id,
                // customerName cần được lưu vào classItem hoặc fetch riêng.
                // Tạm để customerId — component sẽ map sang tên nếu có user store.
                customerName: cls.customerId,
                groupName:    cls.classGroupId ?? null,
                classType:    cls.type,
                checkinTime:  att.date ?? '',
            });
        }
    }

    // Mới nhất lên đầu
    return items.sort(
        (a, b) => new Date(b.checkinTime).getTime() - new Date(a.checkinTime).getTime(),
    );
};

// ─── Students grouped ─────────────────────────────────────────────────────────

/**
 * Trả về danh sách nhóm (pt-group) từ activeClasses.
 * FE group theo classGroupId.
 */
export const selectGroupedClasses = (state: RootState): GroupedClass[] => {
    const groupMap = new Map<string, ClassItem[]>();

    for (const cls of state.ptDashboard.activeClasses) {
        if (cls.type !== 'pt-group' || !cls.classGroupId) continue;
        const existing = groupMap.get(cls.classGroupId) ?? [];
        groupMap.set(cls.classGroupId, [...existing, cls]);
    }

    return Array.from(groupMap.entries()).map(([groupId, members]) => {
        // endDate của nhóm = ngày hết hạn xa nhất trong nhóm
        const endDate = members
            .map((m) => m.endDate)
            .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0] ?? '';

        return {
            groupId,
            groupName: `Nhóm ${groupId}`,   // component có thể override nếu có field name
            members,
            endDate,
        };
    });
};

/**
 * Lấy danh sách class theo filter của tab Học viên.
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