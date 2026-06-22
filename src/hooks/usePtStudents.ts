// src/hooks/pt/usePtStudents.ts
//
// Hook cho tab Học viên.
// Xử lý:
//   1. Filter chips (all / 1on1 / group / expired)
//   2. Lấy danh sách class đã filter từ Redux store (qua selector)
//   3. Expand/collapse từng student card hoặc group card
//   4. Xác nhận điểm danh ngay trong card (giống tab Thông báo)
//
// Component không tự truy cập store hay tính toán gì thêm.

import { useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
    selectFilteredClasses,
    selectGroupedClasses,
    selectConfirmingIds,
    selectConfirmError,
} from '../store/selectors/ptSelectors';
import { confirmAttendance, clearConfirmError } from '../store/ptDashBoardSlice';
import { StudentFilter } from '../types/models';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PtStudentsData {
    // Filter
    activeFilter:   StudentFilter;
    onFilterChange: (f: StudentFilter) => void;

    // Danh sách class đã filter (cho tab all / 1on1 / expired)
    filteredClasses: ReturnType<typeof selectFilteredClasses>;

    // Danh sách nhóm (cho tab group)
    groupedClasses: ReturnType<typeof selectGroupedClasses>;

    // Expand/collapse card theo id
    expandedIds:    Set<string>;
    toggleExpand:   (id: string) => void;

    // Xác nhận điểm danh
    /** attendanceId đang gọi API confirm — để disable nút tương ứng */
    confirmingIds:  string[];
    /** Lỗi xác nhận gần nhất (null nếu không có) */
    confirmError:   string | null;
    /** Bấm Xác nhận — dispatch thunk */
    onConfirm:      (attendanceId: string, classId: string) => void;
    /** Đóng toast lỗi */
    onClearError:   () => void;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function usePtStudents(): PtStudentsData {
    const dispatch = useAppDispatch();

    const [activeFilter, setActiveFilter] = useState<StudentFilter>('all');

    // Set chứa id của các card đang mở — dùng Set để O(1) lookup
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

    // Selector nhận tham số — truyền filter hiện tại
    const filteredClasses = useAppSelector((state) =>
        selectFilteredClasses(state, activeFilter),
    );

    const groupedClasses = useAppSelector(selectGroupedClasses);

    const confirmingIds = useAppSelector(selectConfirmingIds);
    const confirmError  = useAppSelector(selectConfirmError);

    // Toggle expand: nếu đang mở thì đóng, ngược lại mở
    const toggleExpand = (id: string) => {
        setExpandedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    // Khi đổi filter, đóng hết card đang mở để tránh nhìn lộn xộn
    const onFilterChange = (f: StudentFilter) => {
        setActiveFilter(f);
        setExpandedIds(new Set());
    };

    // useCallback tránh tạo lại function mỗi lần render
    const onConfirm = useCallback(
        (attendanceId: string, classId: string) => {
            dispatch(confirmAttendance({ attendanceId, classId }));
        },
        [dispatch],
    );

    const onClearError = useCallback(() => {
        dispatch(clearConfirmError());
    }, [dispatch]);

    return {
        activeFilter,
        onFilterChange,
        filteredClasses,
        groupedClasses,
        expandedIds,
        toggleExpand,
        confirmingIds,
        confirmError,
        onConfirm,
        onClearError,
    };
}