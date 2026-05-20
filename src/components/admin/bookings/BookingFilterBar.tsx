// src/components/admin/bookings/BookingFilterBar.tsx

import React from 'react';
import { BookingStatusFilter } from '../../../store/admin/adminBookingSlice';
import { FILTER_TABS } from '../../../constants/bookingConstants';
import '../../../styles/admin/AdminBookings.css';

interface BookingFilterBarProps {
    current:   BookingStatusFilter;
    onChange:  (value: BookingStatusFilter) => void;
    onRefresh: () => void;
    total:     number;
}

const BookingFilterBar: React.FC<BookingFilterBarProps> = ({
                                                               current, onChange, onRefresh, total,
                                                           }) => (
    <div className="ab-filter-bar">
        <div className="ab-filter-tabs">
            {FILTER_TABS.map(tab => (
                <button
                    key={tab.value}
                    onClick={() => onChange(tab.value)}
                    className={`ab-filter-tab${current === tab.value ? ' ab-filter-tab--active' : ''}`}
                >
                    {tab.label}
                </button>
            ))}
        </div>

        <div className="ab-filter-right">
            <span className="ab-total-count">{total} đơn</span>
            <button onClick={onRefresh} className="ab-refresh-btn" title="Tải lại">
                ↻
            </button>
        </div>
    </div>
);

export default BookingFilterBar;