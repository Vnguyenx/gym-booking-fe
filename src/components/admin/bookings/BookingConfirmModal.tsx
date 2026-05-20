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
}

const BookingConfirmModal: React.FC<BookingConfirmModalProps> = ({
                                                                     booking, action, onConfirm, onClose, isUpdating,
                                                                 }) => {
    if (!booking || !action) return null;

    const isConfirm = action === 'confirmed';

    return (
        <div className="ab-modal-overlay" onClick={onClose}>
            <div className="ab-modal-box" onClick={e => e.stopPropagation()}>
                <div className="ab-modal-icon">{isConfirm ? '✓' : '✕'}</div>
                <h3 className="ab-modal-title">
                    {isConfirm ? 'Xác nhận duyệt đơn?' : 'Xác nhận huỷ đơn?'}
                </h3>
                <p className="ab-modal-desc">
                    Đơn hàng <strong>#{booking.id.slice(0, 8)}</strong>
                    {' '}trị giá <strong>{formatPrice(booking.totalPrice)}</strong>
                    {' '}sẽ được {isConfirm ? 'xác nhận và tạo lớp học' : 'huỷ bỏ'}.
                </p>
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