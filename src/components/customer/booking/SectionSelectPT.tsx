// src/components/booking/SectionSelectPT.tsx
// Mục chọn PT cụ thể — chỉ hiện khi chọn gói có PT
// fromPT: PT ban đầu được highlight sẵn, bấm lại để bỏ chọn

import React from 'react';
import { PT } from '../../../types/models';
import useBooking from '../../../hooks/useBooking';

interface SectionSelectPTProps {
    booking: ReturnType<typeof useBooking>;
}

const SectionSelectPT: React.FC<SectionSelectPTProps> = ({ booking }) => {
    const { selectedPT, handleSelectPT, availablePTs, loadingPTs } = booking;

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
            <p className="booking-section__sub">
                Bấm lại để bỏ chọn
            </p>

            <div className="booking-pt-list">
                {availablePTs.map((pt: PT) => {
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
                            {/* Dấu tick khi được chọn */}
                            {isSelected && (
                                <div className="booking-pt-card__check">✓</div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SectionSelectPT;