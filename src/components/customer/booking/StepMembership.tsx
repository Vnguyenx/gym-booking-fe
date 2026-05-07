// src/components/booking/StepMembership.tsx
// Bước chọn gói tập (membership)
// Hiển thị danh sách gói từ Redux store

import React from 'react';
import { useAppSelector } from '../../../store/hooks';
import useBooking from '../../../hooks/useBooking';
import {Membership} from "../../../types/models";

interface StepMembershipProps {
    booking: ReturnType<typeof useBooking>;
}

const StepMembership: React.FC<StepMembershipProps> = ({ booking }) => {
    const { handleSelectMembership } = booking;

    // Lấy danh sách gói tập từ Redux (đã fetch sẵn ở PricingPage)
    const memberships = useAppSelector(state => state.memberships.list);

    return (
        <div className="booking-step">
            <h2 className="booking-step__title">Chọn gói tập</h2>
            <p className="booking-step__sub">Chọn thời hạn phù hợp với bạn</p>

            <div className="booking-step__list">
                {memberships.map((membership: Membership) => (
                    <div
                        key={membership.id}
                        className="booking-card"
                        onClick={() => handleSelectMembership(membership)}
                    >
                        <div className="booking-card__header">
                            {membership.isPopular && (
                                <span className="booking-card__badge">Phổ biến</span>
                            )}
                            <h3 className="booking-card__name">{membership.name}</h3>
                        </div>

                        <div className="booking-card__price">
                            <span className="price-main">
                                {(membership.priceOnline / 1000).toFixed(0)}K
                            </span>
                            <span className="price-note"> · {membership.note}</span>
                        </div>

                        <button className="booking-card__btn">Chọn</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StepMembership;