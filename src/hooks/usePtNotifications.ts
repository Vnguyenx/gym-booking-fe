// src/hooks/pt/usePtNotifications.ts
//
// Hook cho tab Thông báo.
// Xử lý:
//   1. Lấy danh sách buổi chờ xác nhận từ Redux store
//   2. Dispatch action confirmAttendance khi PT bấm "Xác nhận"
//   3. Theo dõi trạng thái loading + error để hiện UI phản hồi
//
// Component không tự dispatch hay truy cập store.

import { useCallback }     from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { confirmAttendance, clearConfirmError } from '../store/ptDashBoardSlice';
import {
    selectPendingConfirms,
    selectConfirmingIds,
    selectConfirmError,
} from '../store/selectors/ptSelectors';

export interface PtNotificationsData {
    /** Danh sách buổi đang chờ PT xác nhận, mới nhất lên đầu */
    pendingItems:    ReturnType<typeof selectPendingConfirms>;
    /** Set các attendanceId đang gọi API — để disable nút tương ứng */
    confirmingIds:   string[];
    /** Lỗi xác nhận gần nhất (null nếu không có) */
    confirmError:    string | null;
    /** Bấm Xác nhận — dispatch thunk */
    onConfirm:       (attendanceId: string, classId: string) => void;
    /** Đóng toast lỗi */
    onClearError:    () => void;
}

export function usePtNotifications(): PtNotificationsData {
    const dispatch = useAppDispatch();

    const pendingItems  = useAppSelector(selectPendingConfirms);
    const confirmingIds = useAppSelector(selectConfirmingIds);
    const confirmError  = useAppSelector(selectConfirmError);

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
        pendingItems,
        confirmingIds,
        confirmError,
        onConfirm,
        onClearError,
    };
}