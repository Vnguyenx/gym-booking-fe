// src/components/customer/booking/SectionSelectPT.tsx
import React from 'react';
import { PT } from '../../../types/models';
import useBooking from '../../../hooks/useBooking';
import usePagination from '../../../hooks/useBookingsPagination';
import Pagination from '../../common/BookingsPagination';

interface SectionSelectPTProps {
    booking: ReturnType<typeof useBooking>;
}

const SectionSelectPT: React.FC<SectionSelectPTProps> = ({ booking }) => {
    const { selectedPT, handleSelectPT, availablePTs, loadingPTs } = booking;

    const pagination = usePagination(availablePTs, 4);

    if (loadingPTs) {
        return (
            <div className="booking-section">
                <h2 className="booking-section__title">
                    <span className="booking-section__num">3</span>
                    Chọn huấn luyện viên
                </h2>
                <p className="booking-loading">Đang tải danh sách PT...</p>
            </div>
        );
    }

    return (
        <div className="booking-section">
            <h2 className="booking-section__title">
                <span className="booking-section__num">3</span>
                Chọn huấn luyện viên
            </h2>
            <p className="booking-section__sub">Bấm lại để bỏ chọn</p>

            <div className="booking-pt-list">
                {pagination.currentItems.map((pt: PT) => {
                    const isSelected = selectedPT?.id === pt.id;
                    return (
                        <div
                            key={pt.id}
                            className={`booking-pt-card ${isSelected ? 'selected' : ''}`}
                            onClick={() => handleSelectPT(pt)}
                        >
                            <img
                                src={pt.avatar}
                                alt={pt.fullName}
                                className="booking-pt-card__avatar"
                            />
                            <div className="booking-pt-card__info">
                                <span className="booking-pt-card__name">{pt.fullName}</span>
                                <span className="booking-pt-card__exp">🏅 {pt.experience}</span>
                                <div className="booking-pt-card__tags">
                                    {pt.specialty.slice(0, 2).map((s, i) => (
                                        <span key={i} className="booking-pt-card__tag">{s}</span>
                                    ))}
                                </div>
                            </div>
                            {isSelected && (
                                <div className="booking-pt-card__check">✓</div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Phân trang dùng chung */}
            {pagination.showPagination && (
                <Pagination {...pagination} />
            )}
        </div>
    );
};

export default SectionSelectPT;