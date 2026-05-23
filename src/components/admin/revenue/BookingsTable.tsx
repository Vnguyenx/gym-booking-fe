// src/components/admin/BookingsTable.tsx
import React, { useState, useMemo } from 'react';
import { Booking } from '../../../types/models';

interface BookingsTableProps {
    bookings: Booking[];
    title: string;
    formatCurrency: (value: number) => string;
}

const BookingsTable: React.FC<BookingsTableProps> = ({ bookings, title, formatCurrency }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 4;

    const totalPages = Math.ceil(bookings.length / rowsPerPage);
    const currentBookings = useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage;
        return bookings.slice(start, start + rowsPerPage);
    }, [bookings, currentPage]);

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    if (bookings.length === 0) return null;

    return (
        <div className="bookings-table">
            <h3>{title}</h3>
            <div className="table-wrapper">
                <table>
                    <thead>
                    <tr>
                        <th>Mã đơn</th>
                        <th>Khách hàng</th>
                        <th>Gói tập</th>
                        <th>Dịch vụ - PT</th>
                        <th>Số tiền</th>
                        <th>Ngày thanh toán</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentBookings.map(booking => (
                        <tr key={booking.id}>
                            <td data-label="Mã đơn">{booking.id}</td>
                            <td data-label="Khách hàng">{booking.customerName || booking.customerId}</td>
                            <td data-label="Gói tập">{booking.membershipName || booking.membershipId}</td>
                            <td data-label="Dịch vụ - PT">
                                {booking.ptServiceName || 'Tự tập (Không PT)'}
                                {booking.ptName && <><br />PT: {booking.ptName}</>}
                            </td>
                            <td data-label="Số tiền">{formatCurrency(booking.totalPrice)}</td>
                            <td data-label="Ngày thanh toán">{booking.paidAt ? new Date(booking.paidAt).toLocaleDateString('vi-VN') : 'N/A'}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            {totalPages > 1 && (
                <div className="pagination">
                    <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>‹ Trước</button>
                    <span>Trang {currentPage} / {totalPages}</span>
                    <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>Sau ›</button>
                </div>
            )}
        </div>
    );
};

export default BookingsTable;