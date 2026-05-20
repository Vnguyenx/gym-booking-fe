// src/components/admin/bookings/StatusBadge.tsx

import React from 'react';
import { BookingStatus } from '../../../types/models';
import { STATUS_COLOR, STATUS_LABEL } from '../../../constants/bookingConstants';
import '../../../styles/admin/AdminBookings.css';

const StatusBadge: React.FC<{ status: BookingStatus }> = ({ status }) => (
    <span
        className="ab-status-badge"
        style={{
            color:      STATUS_COLOR[status] ?? '#888',
            border:     `1px solid ${STATUS_COLOR[status] ?? '#888'}`,
            background: (STATUS_COLOR[status] ?? '#888') + '18',
        }}
    >
        {STATUS_LABEL[status] ?? status}
    </span>
);

export default StatusBadge;