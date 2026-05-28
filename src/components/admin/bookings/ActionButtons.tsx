// src/components/admin/bookings/ActionButtons.tsx

import React from 'react';
import { Booking } from '../../../types/models';
import '../../../styles/admin/AdminBookings.css';

export interface ActionButtonsProps {
    booking:  Booking;
    updating: string | null;
    onAction: (booking: Booking, action: 'confirmed' | 'cancelled') => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ booking, updating, onAction }) => {
    // Cả 'pending' (VNPay) lẫn 'pending_manual' (QR) đều cần nút duyệt/huỷ
    const canAct = booking.status === 'pending' || booking.status === 'pending_manual';

    if (!canAct) {
        return <span className="ab-td--muted">—</span>;
    }

    const isUpdating = updating === booking.id;

    return (
        <div style={{ display: 'flex', gap: 8 }}>
            <button
                onClick={() => onAction(booking, 'confirmed')}
                disabled={isUpdating}
                className="ab-action-btn ab-action-btn--confirm"
            >
                {isUpdating ? '...' : '✓ Duyệt'}
            </button>
            <button
                onClick={() => onAction(booking, 'cancelled')}
                disabled={isUpdating}
                className="ab-action-btn ab-action-btn--cancel"
            >
                {isUpdating ? '...' : '✕ Huỷ'}
            </button>
        </div>
    );
};

export default ActionButtons;