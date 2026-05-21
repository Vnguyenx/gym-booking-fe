// src/hooks/useAdminClasses.ts
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store'; // Đảm bảo bạn đã export AppDispatch, RootState từ store của bạn
import {
    fetchAdminClasses,
    fetchAdminClassDetail,
    clearSelectedClass,
    clearError
} from '../store/admin/adminClassSlice';
import * as adminService from '../services/adminService';
import { ClassItem } from '../types/models';

export const useAdminClasses = () => {
    const dispatch = useDispatch<AppDispatch>();

    // Lấy state từ Redux
    const { classes, selectedClass, isLoading, error } = useSelector(
        (state: RootState) => state.adminClass
    );

    /**
     * 1. Lấy danh sách lớp (có hỗ trợ filter)
     */
    const loadClasses = useCallback((filters?: { status?: string; ptId?: string; customerId?: string }) => {
        dispatch(fetchAdminClasses(filters));
    }, [dispatch]);

    /**
     * 2. Xem chi tiết 1 lớp (sẽ tự động lưu vào selectedClass trong Redux)
     */
    const loadClassDetail = useCallback((classId: string) => {
        dispatch(fetchAdminClassDetail(classId));
    }, [dispatch]);

    /**
     * 3. Xóa data chi tiết khi người dùng đóng Modal/Drawer
     */
    const closeClassDetail = useCallback(() => {
        dispatch(clearSelectedClass());
    }, [dispatch]);

    /**
     * 4. Tạo lớp học mới (Gọi API trực tiếp, sau đó load lại danh sách)
     */
    const createNewClass = async (data: Partial<Omit<ClassItem, 'id' | 'attendance'>>) => {
        try {
            await adminService.createClass(data);
            // Sau khi tạo thành công, load lại danh sách lớp mới nhất
            loadClasses();
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    };

    /**
     * 5. Cập nhật thông tin lớp
     */
    const updateClassInfo = async (
        classId: string,
        data: Partial<Pick<ClassItem, 'status' | 'ptId' | 'endDate' | 'totalSessions' | 'usedSessions'>>
    ) => {
        try {
            await adminService.updateClass(classId, data);
            loadClasses(); // Load lại danh sách sau khi update

            // Nếu đang mở Modal chi tiết của lớp này, load lại luôn data chi tiết
            if (selectedClass?.id === classId) {
                loadClassDetail(classId);
            }
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    };

    /**
     * 6. Reset lỗi hiển thị
     */
    const resetError = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    return {
        // Data
        classes,
        selectedClass,
        isLoading,
        error,
        // Actions (Logic functions)
        loadClasses,
        loadClassDetail,
        closeClassDetail,
        createNewClass,
        updateClassInfo,
        resetError,
    };
};