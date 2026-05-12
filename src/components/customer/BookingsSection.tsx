// src/components/customer/BookingsSection.tsx
import React, { useState } from 'react';
import useBookings from '../../hooks/useBookingHistory';
import BookingCard from './BookingCard';

const PAGE_SIZE = 4;

const BookingsSection: React.FC = () => {
    const { bookings, isLoading, error, handleCancel } = useBookings();
    const [page, setPage] = useState(1);

    const totalPages = Math.ceil(bookings.length / PAGE_SIZE);
    const paged      = bookings.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <section className="profile-section">
            <div className="section-header">
                <h2 className="section-title">Lịch sử đăng ký gói tập</h2>
            </div>

            {isLoading ? (
                <p className="loading-text">Đang tải...</p>
            ) : error ? (
                <p className="alert alert--error">{error}</p>
            ) : bookings.length === 0 ? (
                <p className="empty-text">Bạn chưa đăng ký gói tập nào.</p>
            ) : (
                <>
                    <div className="booking-list">
                        {paged.map((booking) => (
                            <BookingCard
                                key={booking.id}
                                booking={booking}
                                onCancel={handleCancel}
                            />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                className="pagination__btn"
                                onClick={() => setPage((p) => p - 1)}
                                disabled={page === 1}
                            >
                                ‹
                            </button>
                            <span className="pagination__info">{page} / {totalPages}</span>
                            <button
                                className="pagination__btn"
                                onClick={() => setPage((p) => p + 1)}
                                disabled={page === totalPages}
                            >
                                ›
                            </button>
                        </div>
                    )}
                </>
            )}
        </section>
    );
};

export default BookingsSection;