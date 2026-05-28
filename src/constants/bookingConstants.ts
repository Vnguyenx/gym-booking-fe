import {BookingStatus} from "../types/models";
import {BookingStatusFilter} from "../store/admin/adminBookingSlice";

export const STATUS_LABEL: Record<BookingStatus, string> = {
    pending:        'Chờ xác nhận',
    pending_manual: 'Chờ duyệt',
    confirmed:      'Đã xác nhận',
    cancelled:      'Đã huỷ',
};

export const STATUS_COLOR: Record<BookingStatus, string> = {
    pending:        '#f59e0b',   // vàng
    pending_manual: '#f97316',   // cam
    confirmed:      '#22c55e',   // xanh lá
    cancelled:      '#ef4444',   // đỏ
};

export const FILTER_TABS: { label: string; value: BookingStatusFilter }[] = [
    { label: 'Tất cả',              value: 'all' },
    { label: 'Chờ xác nhận',        value: 'pending' },
    { label: 'Chờ duyệt',           value: 'pending_manual' },
    { label: 'Đã xác nhận',         value: 'confirmed' },
    { label: 'Đã huỷ',              value: 'cancelled' },
];