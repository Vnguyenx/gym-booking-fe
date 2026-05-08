import React from 'react';
import useBookings, { Booking, BookingStatus } from '../../hooks/useBookingHistory';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Chuyển "2025-05-12" -> "12/05/2025" */
const formatDate = (dateStr: string): string => {
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
};

/** Định dạng tiền VND */
const formatPrice = (price: number): string => {
    if (price === 0) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(price);
};

// Map trạng thái booking -> nhãn và badge
const BOOKING_STATUS_CONFIG: Record<
    BookingStatus,
    { label: string; className: string }
> = {
    confirmed:  { label: 'Đã xác nhận', className: 'badge badge--info' },
    completed:  { label: 'Hoàn thành',  className: 'badge badge--success' },
    cancelled:  { label: 'Đã huỷ',      className: 'badge badge--error' },
    pending:    { label: 'Chờ xác nhận',className: 'badge badge--warning' },
};

// ─── Sub-component: Một thẻ booking ─────────────────────────────────────────

interface BookingCardProps {
    booking: Booking;
}

/**
 * BookingCard
 * Hiển thị thông tin một lần booking trong lịch sử.
 */
const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
    const statusConfig = BOOKING_STATUS_CONFIG[booking.status];

    return (
        <div className="booking-card">
            <div className="booking-card__top">
                <div>
                    <p className="booking-card__service">{booking.serviceName}</p>
                    <p className="booking-card__meta">
                        {booking.instructor} · {formatDate(booking.date)} lúc {booking.time}
                    </p>
                    <p className="booking-card__meta">{booking.duration} phút</p>
                </div>
                <div className="booking-card__right">
                    <span className={statusConfig.className}>{statusConfig.label}</span>
                    <p className="booking-card__price">{formatPrice(booking.price)}</p>
                </div>
            </div>

            {/* Ghi chú nếu có */}
            {booking.note && (
                <p className="booking-card__note">📝 {booking.note}</p>
            )}
        </div>
    );
};

// ─── Component chính ─────────────────────────────────────────────────────────

/**
 * BookingsSection
 * Hiển thị lịch sử tất cả booking của customer, mới nhất lên đầu.
 */
const BookingsSection: React.FC = () => {
    const { bookings, isLoading } = useBookings();

    return (
        <section className="profile-section">
            <div className="section-header">
                <h2 className="section-title">Lịch sử đặt lịch</h2>
            </div>

            {isLoading ? (
                <p className="loading-text">Đang tải...</p>
            ) : bookings.length === 0 ? (
                <p className="empty-text">Bạn chưa có lịch sử đặt lịch nào.</p>
            ) : (
                <div className="booking-list">
                    {bookings.map((booking) => (
                        <BookingCard key={booking.id} booking={booking} />
                    ))}
                </div>
            )}
        </section>
    );
};

export default BookingsSection;