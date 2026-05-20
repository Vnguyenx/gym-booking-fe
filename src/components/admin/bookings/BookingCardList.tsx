// src/components/admin/bookings/BookingCardList.tsx

import React from 'react';
import '../../../styles/admin/AdminBookings.css';
import StatusBadge from './StatusBadge';
import ActionButtons from './ActionButtons';
import { formatPrice, formatDate } from '../../../utils/bookingUtils';
import { BookingTableProps } from './BookingTable';

const BookingCardList: React.FC<BookingTableProps> = ({ bookings, updating, onAction }) => (
    <div className="ab-card-list">
        {bookings.map(booking => (
            <div key={booking.id} className="ab-card">
                <div className="ab-card-header">
                    <span className="ab-mono">#{booking.id.slice(0, 8)}</span>
                    <StatusBadge status={booking.status} />
                </div>

                <div className="ab-card-body">
                    <div className="ab-card-row">
                        <span className="ab-card-label">Khách hàng</span>
                        <span>{booking.customerName}</span>
                    </div>
                    <div className="ab-card-row">
                        <span className="ab-card-label">Gói tập</span>
                        <span>{booking.membershipName}</span>
                    </div>
                    <div className="ab-card-row">
                        <span className="ab-card-label">Dịch vụ PT</span>
                        <span>{booking.ptServiceName}</span>
                    </div>
                    <div className="ab-card-row">
                        <span className="ab-card-label">PT</span>
                        <span>{booking.ptName}</span>
                    </div>
                    <div className="ab-card-row">
                        <span className="ab-card-label">Tổng tiền</span>
                        <span className="ab-card-price">{formatPrice(booking.totalPrice)}</span>
                    </div>
                    <div className="ab-card-row">
                        <span className="ab-card-label">Ngày tạo</span>
                        <span>{formatDate(booking.createdAt)}</span>
                    </div>
                    <div className="ab-card-row">
                        <span className="ab-card-label">Thanh toán</span>
                        <span>{formatDate(booking.paidAt)}</span>
                    </div>
                    {booking.vnpay_TransactionNo && (
                        <div className="ab-card-row">
                            <span className="ab-card-label">Mã GD VNPay</span>
                            <span className="ab-mono">{booking.vnpay_TransactionNo}</span>
                        </div>
                    )}
                </div>

                <div className="ab-card-footer">
                    <ActionButtons
                        booking={booking}
                        updating={updating}
                        onAction={onAction}
                    />
                </div>
            </div>
        ))}
    </div>
);

export default BookingCardList;