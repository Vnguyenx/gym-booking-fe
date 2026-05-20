// src/utils/bookingUtils.ts

/** Format tiền VND */
export const formatPrice = (amount: number): string =>
    amount?.toLocaleString('vi-VN') + 'đ';

/** Format ngày từ ISO string — trả về '—' nếu null */
export const formatDate = (dateStr: string | null | undefined): string => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('vi-VN');
};