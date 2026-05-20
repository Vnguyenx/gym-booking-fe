// src/hooks/useAdminBookings.ts
//
// Hook tách riêng toàn bộ UI logic của trang AdminBookingsPage.
// Component chỉ cần gọi hook này và render — không chứa logic.

import { useEffect, useState, useMemo }   from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
    fetchAdminBookings,
    changeBookingStatus,
    setFilterStatus,
    BookingStatusFilter,
} from '../store/admin/adminBookingSlice';
import { Booking } from '../types/models';

const useAdminBookings = () => {
    const dispatch = useAppDispatch();

    // Lấy state từ Redux store
    const { bookings, loading, error, filterStatus, updating } =
        useAppSelector(state => state.adminBooking);

    // State cho modal xác nhận hành động (confirm/cancel)
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [pendingAction, setPendingAction]     = useState<'confirmed' | 'cancelled' | null>(null);

    // ── Fetch lần đầu ─────────────────────────────────────────────────────────
    // Chỉ fetch khi store trống — tránh gọi API mỗi lần re-render
    useEffect(() => {
        if (bookings.length === 0) {
            dispatch(fetchAdminBookings('all'));
        }
    }, [dispatch, bookings.length]);

    // ── Lọc phía FE theo filterStatus ─────────────────────────────────────────
    // useMemo tránh tính lại mỗi lần render không cần thiết
    const filteredBookings = useMemo(() => {
        if (filterStatus === 'all') return bookings;
        return bookings.filter(b => b.status === filterStatus);
    }, [bookings, filterStatus]);

    // ── Handlers ──────────────────────────────────────────────────────────────

    /** Đổi bộ lọc status */
    const handleFilterChange = (status: BookingStatusFilter) => {
        dispatch(setFilterStatus(status));
    };

    /** Mở modal xác nhận trước khi thực hiện hành động */
    const handleActionClick = (booking: Booking, action: 'confirmed' | 'cancelled') => {
        setSelectedBooking(booking);
        setPendingAction(action);
    };

    /** Đóng modal, huỷ hành động */
    const handleCloseModal = () => {
        setSelectedBooking(null);
        setPendingAction(null);
    };

    /** Xác nhận hành động sau khi user bấm "Đồng ý" trong modal */
    const handleConfirmAction = async () => {
        if (!selectedBooking || !pendingAction) return;
        await dispatch(changeBookingStatus({
            bookingId: selectedBooking.id!,
            status:    pendingAction,
        }));
        handleCloseModal();
    };

    // ── Refresh thủ công ──────────────────────────────────────────────────────
    const handleRefresh = () => {
        dispatch(fetchAdminBookings('all'));
    };

    return {
        // Data
        filteredBookings,
        loading,
        error,
        filterStatus,
        updating,           // bookingId đang được xử lý

        // Modal state
        selectedBooking,
        pendingAction,

        // Actions
        handleFilterChange,
        handleActionClick,
        handleCloseModal,
        handleConfirmAction,
        handleRefresh,
    };
};

export default useAdminBookings;