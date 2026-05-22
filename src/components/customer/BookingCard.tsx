// src/components/customer/BookingCard.tsx
import React from 'react';
import { Booking, BookingStatus } from '../../types/models';
import usePTData from '../../hooks/usePTData';

const formatPrice = (price: number): string => {
    if (price === 0) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const formatDate = (createdAt: any): string => {
    if (!createdAt) return '—';
    const date = new Date(createdAt);
    return isNaN(date.getTime()) ? '—' : date.toLocaleDateString('vi-VN');
};

const BOOKING_STATUS_CONFIG: Record<BookingStatus, { label: string; className: string }> = {
    pending: { label: 'Chờ xác nhận', className: 'badge badge--warning' },
    confirmed: { label: 'Đã xác nhận', className: 'badge badge--info' },
    cancelled: { label: 'Đã huỷ', className: 'badge badge--error' },
};

const MEMBERSHIP_CONFIG: Record<string, string> = {
    'mem-1m': 'Gói 1 tháng', 'mem-3m': 'Gói 3 tháng',
    'mem-6m': 'Gói 6 tháng', 'mem-12m': 'Gói 1 năm',
    'mem-24m': 'Gói 2 năm', 'mem-60m': 'Gói 5 năm',
};

const PT_SERVICE_CONFIG: Record<string, string> = {
    'pt-none': 'Không có PT',
    'pt-1on1': 'PT kèm riêng 1:1',
    'pt-group': 'PT nhóm',
};

interface BookingCardProps {
    booking: Booking;
    onCancel: (id: string) => Promise<void>;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onCancel }) => {
    const statusConfig = BOOKING_STATUS_CONFIG[booking.status];
    const { getPTName } = usePTData();

    const handleCancel = async () => {
        if (window.confirm('Bạn có chắc muốn huỷ đăng ký này không?')) {
            await onCancel(booking.id);
        }
    };

    const membershipName = MEMBERSHIP_CONFIG[booking.membershipId] ?? booking.membershipId;
    const ptServiceName = PT_SERVICE_CONFIG[booking.ptServiceId] ?? booking.ptServiceId;
    const ptDisplay = booking.ptId ? (getPTName(booking.ptId) || 'PT đã được chọn') : 'Không có PT';

    return (
        <div className="booking-card">
            <div className="booking-card__top">
                <div>
                    <p className="booking-card__service">{membershipName}</p>
                    <p className="booking-card__meta">
                        PT: {ptDisplay} · {ptServiceName}
                    </p>
                    <p className="booking-card__meta">Ngày đăng ký: {formatDate(booking.createdAt)}</p>
                </div>
                <div className="booking-card__right">
                    <span className={statusConfig.className}>{statusConfig.label}</span>
                    <p className="booking-card__price">{formatPrice(booking.totalPrice)}</p>
                </div>
            </div>
            {booking.status === 'pending' && (
                <div className="booking-card__actions">
                    <button className="btn-danger" onClick={handleCancel}>Huỷ đăng ký</button>
                </div>
            )}
        </div>
    );
};

export default BookingCard;