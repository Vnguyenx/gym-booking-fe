// src/components/admin/bookings/BookingConfirmModal.tsx

import React from 'react';
import { Booking } from '../../../types/models';
import '../../../styles/admin/AdminBookings.css';
import { formatPrice } from '../../../utils/bookingUtils';

interface BookingConfirmModalProps {
    booking:    Booking | null;
    action:     'confirmed' | 'cancelled' | null;
    onConfirm:  () => void;
    onClose:    () => void;
    isUpdating: boolean;
    selectedDetail: Booking | null;
}

const BookingConfirmModal:
    React.FC<BookingConfirmModalProps> = ({booking,
                                              action,
                                              onConfirm,
                                              onClose,
                                              isUpdating,
                                              selectedDetail,  }) => {
    if (!booking || !action) return null;

    const isConfirm = action === 'confirmed';
    const displayData = selectedDetail || booking;

    return (
        <div className="ab-modal-overlay" onClick={onClose}>
            <div className="ab-modal-box" onClick={e => e.stopPropagation()}>
                <div className="ab-modal-icon">{isConfirm ? '✓' : '✕'}</div>
                <h3 className="ab-modal-title">
                    {isConfirm ? 'Xác nhận duyệt đơn?' : 'Xác nhận huỷ đơn?'}
                </h3>
                <span className="ab-modal-desc">
                    Mã đơn: <span className="ab-mono">#{displayData.id.slice(0, 8)}</span>
                    <br/>
                    Khách hàng: <strong>{displayData.customerName || 'Đang tải...'}</strong>
                    <br/>
                    Gói tập: <strong>{displayData.membershipName || '...'}</strong>
                    <br/>
                    Dịch vụ: <strong>{displayData.ptServiceName}</strong>
                    <br/>
                    {displayData.ptName && (
                        <span>Huấn luyện viên: <strong>{displayData.ptName}</strong></span>
                    )}
                    <br/>
                    Trị giá: <strong>{formatPrice(displayData.totalPrice)}</strong>
                </span>
                <div className="ab-modal-actions">
                <button onClick={onClose} className="ab-modal-btn-cancel">
                        Không
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isUpdating}
                        className={`ab-modal-btn-confirm ${isConfirm ? 'ab-modal-btn-confirm--approve' : 'ab-modal-btn-confirm--cancel'}`}
                    >
                        {isUpdating ? 'Đang xử lý...' : 'Đồng ý'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingConfirmModal;