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
                <th>Dịch vụ - PT</th>
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
                    {/* HIỂN THỊ TÊN KHÁCH HÀNG */}
                    <td>
                        <strong>{booking.customerName || 'N/A'}</strong>
                        <div style={{fontSize: '0.8em', color: '#666'}}>{booking.customerPhone}</div>
                    </td>
                    {/* HIỂN THỊ TÊN GÓI TẬP */}
                    <td>{booking.membershipName || booking.membershipId}</td>
                    <td>
                        <div>{booking.ptServiceName}</div>
                        {booking.ptName && (
                            <small style={{color: '#666'}}>PT: {booking.ptName}</small>
                        )}
                    </td>
                    <td className="ab-td--price">{formatPrice(booking.totalPrice)}</td>
                    <td>{formatDate(booking.createdAt)}</td>
                    <td>{formatDate(booking.paidAt)}</td>
                    <td>
                        {booking.vnpay_TransactionNo
                            ? <span className="ab-mono">{booking.vnpay_TransactionNo}</span>
                            : <span className="ab-td--muted">—</span>
                        }
                    </td>
                    <td><StatusBadge status={booking.status}/></td>
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