// src/pages/admin/AdminDashboard/hooks/useDashboardData.ts
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchAdminUsers } from '../store/admin/adminUserSlice';
import { fetchAdminPTs } from '../store/admin/adminPTSlice';
import { fetchPTApplications } from '../store/admin/adminPTApplicationSlice';
import { fetchAdminBookings } from '../store/admin/adminBookingSlice';
import { fetchAdminClasses } from '../store/admin/adminClassSlice';
import { fetchEquipment } from '../store/admin/adminEquipmentSlice';
import { fetchDailyConfig, fetchPaymentConfig } from '../store/admin/adminSettingsSlice';
import { fetchRevenueByMonth } from '../store/admin/adminRevenueSlice';
import { fetchMemberships } from '../store/admin/adminCatalogSlice';
import { fetchFloors } from '../store/admin/adminFloorsSlice';
import { fetchZones } from '../store/admin/adminZonesSlice';

/**
 * Hook quản lý tất cả dữ liệu cần thiết cho Dashboard
 * Gọi các thunk fetch dữ liệu khi component mount
 * Trả về các state loading và error tổng hợp (có thể mở rộng)
 */
const useDashboardData = () => {
    const dispatch = useAppDispatch();

    // Lấy tháng/năm hiện tại cho doanh thu
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    useEffect(() => {
        // Users & PTs
        dispatch(fetchAdminUsers('all'));      // Lấy tất cả user để tính số lượng customer và pt
        dispatch(fetchAdminPTs());             // Lấy danh sách PT (hồ sơ chuyên môn)
        dispatch(fetchPTApplications('pending')); // Lấy đơn đăng ký PT đang chờ

        // Booking & Classes
        dispatch(fetchAdminBookings('all')); // Lấy tất cả booking (để lọc pending và confirmed)
        dispatch(fetchAdminClasses({}));         // Lấy tất cả lớp học

        // Equipment
        dispatch(fetchEquipment({}));            // Lấy tất cả thiết bị

        // Settings
        dispatch(fetchDailyConfig());
        dispatch(fetchPaymentConfig());

        // Revenue
        dispatch(fetchRevenueByMonth({ month: currentMonth, year: currentYear }));

        // Catalog & Content (cho các card nhanh)
        dispatch(fetchMemberships());
        dispatch(fetchFloors());
        dispatch(fetchZones());
    }, [dispatch, currentMonth, currentYear]);

    // Có thể trả về loading/error tổng hợp nếu cần
    // Ở đây tạm thời không dùng để tránh phức tạp
};

export default useDashboardData;