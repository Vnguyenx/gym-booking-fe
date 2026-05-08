// src/components/booking/SectionMembership.tsx
// Mục chọn gói tập — luôn hiển thị
// Highlight gói đang chọn bằng viền đỏ

import React from 'react';
import { Membership } from '../../../types/models';
import { useAppSelector } from '../../../store/hooks';
import useBooking from '../../../hooks/useBooking';

interface SectionMembershipProps {
    booking: ReturnType<typeof useBooking>;
}

const SectionMembership: React.FC<SectionMembershipProps> = ({ booking }) => {
    const { selectedMembership, handleSelectMembership } = booking;
    const memberships = useAppSelector(state => state.memberships.list);

    return (
        <div className="booking-section">
            <h2 className="booking-section__title">
                <span className="booking-section__num">1</span>
                Chọn gói tập
            </h2>

            <div className="booking-option-list">
                {memberships.map((membership: Membership) => (
                    <div
                        key={membership.id}
                        className={`booking-option ${selectedMembership?.id === membership.id ? 'selected' : ''}`}
                        onClick={() => handleSelectMembership(membership)}
                    >
                        {/* Radio indicator */}
                        <div className="booking-option__radio" />

                        <div className="booking-option__body">
                            <div className="booking-option__top">
                                {membership.isPopular && (
                                    <span className="booking-option__badge">Phổ biến</span>
                                )}
                                <span className="booking-option__name">{membership.name}</span>
                            </div>
                            <p className="booking-option__note">{membership.note}</p>
                        </div>

                        <div className="booking-option__price">
                            <span className="price-main">
                                {(membership.priceOnline / 1000).toFixed(0)}K
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SectionMembership;