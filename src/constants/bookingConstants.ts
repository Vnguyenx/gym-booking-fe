// src/constants/bookingConstants.ts

import { BookingStatus } from '../types/models';
import { BookingStatusFilter } from '../store/admin/adminBookingSlice';

/** Label hiển thị cho từng status — khớp với BookingStatus trong models.ts */
export const STATUS_LABEL: Record<BookingStatus, string> = {
    pending:   'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    cancelled: 'Đã huỷ',
};

/** Màu badge cho từng status */
export const STATUS_COLOR: Record<BookingStatus, string> = {
    pending:   '#f59e0b',   // vàng
    confirmed: '#22c55e',   // xanh lá
    cancelled: '#ef4444',   // đỏ
};

/** Các tab lọc — 'all' không có trong BookingStatus nên để riêng */
export const FILTER_TABS: { label: string; value: BookingStatusFilter }[] = [
    { label: 'Tất cả',        value: 'all' },
    { label: 'Chờ xác nhận',  value: 'pending' },
    { label: 'Đã xác nhận',   value: 'confirmed' },
    { label: 'Đã huỷ',        value: 'cancelled' },
];