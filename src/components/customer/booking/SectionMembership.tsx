// src/components/customer/booking/SectionMembership.tsx
import React, { useEffect } from 'react';
import { Membership } from '../../../types/models';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { fetchMemberships } from '../../../store/membershipSlice';
import useBooking from '../../../hooks/useBooking';
import usePagination from '../../../hooks/useBookingsPagination';
import Pagination from '../../common/BookingsPagination';

interface SectionMembershipProps {
    booking: ReturnType<typeof useBooking>;
}

const SectionMembership: React.FC<SectionMembershipProps> = ({ booking }) => {
    const { selectedMembership, handleSelectMembership } = booking;
    const dispatch = useAppDispatch();
    const memberships = useAppSelector(state => state.memberships.list);
    const loading = useAppSelector(state => state.memberships.loading);
    const pagination = usePagination(memberships, 3);
    const { goToItem } = pagination;

    // Tự fetch nếu store trống
    useEffect(() => {
        if (memberships.length === 0) {
            dispatch(fetchMemberships());
        }
    }, [dispatch, memberships.length]);

    // Tự chuyển trang đến gói đã chọn sẵn (fromPricing)
    useEffect(() => {
        if (!selectedMembership || memberships.length === 0) return;
        const index = memberships.findIndex(m => m.id === selectedMembership.id);
        goToItem(index);
    }, [selectedMembership, memberships, goToItem]);

    if (loading) {
        return (
            <div className="booking-section">
                <h2 className="booking-section__title">
                    <span className="booking-section__num">1</span>
                    Chọn gói tập
                </h2>
                <p className="booking-loading">Đang tải...</p>
            </div>
        );
    }

    return (
        <div className="booking-section">
            <h2 className="booking-section__title">
                <span className="booking-section__num">1</span>
                Chọn gói tập
            </h2>

            <div className="booking-option-list">
                {pagination.currentItems.map((membership: Membership) => (
                    <div
                        key={membership.id}
                        className={`booking-option ${selectedMembership?.id === membership.id ? 'selected' : ''}`}
                        onClick={() => handleSelectMembership(membership)}
                    >
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

            {/* Phân trang dùng chung */}
            {pagination.showPagination && (
                <Pagination {...pagination} />
            )}
        </div>
    );
};

export default SectionMembership;