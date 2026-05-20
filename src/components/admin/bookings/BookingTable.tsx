// src/components/admin/bookings/BookingTable.tsx

import React from 'react';
import { Booking } from '../../../types/models';
import '../../../styles/admin/AdminBookings.css';
import StatusBadge from './StatusBadge';
import ActionButtons from './ActionButtons';
import { formatPrice, formatDate } from '../../../utils/bookingUtils';

export interface BookingTableProps {
    bookings: Booking[];
    updating: string | null;
    onAction: (booking: Booking, action: 'confirmed' | 'cancelled') => void;
}

const BookingTable: React.FC<BookingTableProps> = ({ bookings, updating, onAction }) => (
    <div className="ab-table-wrapper">
        <table className="ab-table">
            <thead>
            <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Gói tập</th>
                <th>Dịch vụ PT</th>
                <th>Tổng tiền</th>
                <th>Ngày tạo</th>
                <th>Ngày thanh toán</th>
                <th>Mã GD VNPay</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
            </tr>
            </thead>
            <tbody>
            {bookings.map(booking => (
                <tr key={booking.id}>
                    <td><span className="ab-mono">{booking.id.slice(0, 8)}...</span></td>
                    <td><span className="ab-mono">{booking.customerId.slice(0, 10)}...</span></td>
                    <td>{booking.membershipId}</td>
                    <td>{booking.ptServiceId}</td>
                    <td className="ab-td--price">{formatPrice(booking.totalPrice)}</td>
                    <td>{formatDate(booking.createdAt)}</td>
                    <td>{formatDate(booking.paidAt)}</td>
                    <td>
                        {booking.vnpay_TransactionNo
                            ? <span className="ab-mono">{booking.vnpay_TransactionNo}</span>
                            : <span className="ab-td--muted">—</span>
                        }
                    </td>
                    <td><StatusBadge status={booking.status} /></td>
                    <td>
                        <ActionButtons
                            booking={booking}
                            updating={updating}
                            onAction={onAction}
                        />
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    </div>
);

export default BookingTable;