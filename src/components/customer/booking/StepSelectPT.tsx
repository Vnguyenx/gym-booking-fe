// src/components/booking/StepSelectPT.tsx
// Bước chọn PT cụ thể từ danh sách đang available
// Gọi BE lấy danh sách PT isAvailable = true

import React, { useEffect, useState } from 'react';
import { PT } from '../../../types/models';
import { bookingService } from '../../../services/bookingService';
import useBooking from '../../../hooks/useBooking';

interface StepSelectPTProps {
    booking: ReturnType<typeof useBooking>;
}

const StepSelectPT: React.FC<StepSelectPTProps> = ({ booking }) => {
    const { handleSelectPT, prevStep, selectedPT } = booking;

    const [pts, setPTs] = useState<PT[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        bookingService.getAvailablePTs()
            .then(data => setPTs(data.pts))
            .catch(err => console.error('Lỗi lấy danh sách PT:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="booking-loading">Đang tải...</div>;

    return (
        <div className="booking-step">
            <h2 className="booking-step__title">Chọn huấn luyện viên</h2>
            <p className="booking-step__sub">Các PT đang sẵn sàng nhận học viên</p>

            <div className="booking-step__list">
                {pts.map(pt => (
                    <div
                        key={pt.id}
                        className={`booking-card booking-card--pt ${selectedPT?.id === pt.id ? 'selected' : ''}`}
                        onClick={() => handleSelectPT(pt)}
                    >
                        <img
                            src={pt.avatar}
                            alt={pt.fullName}
                            className="booking-card__avatar"
                        />
                        <div className="booking-card__info">
                            <h3 className="booking-card__name">{pt.fullName}</h3>
                            <p className="booking-card__exp">
                                🏅 {pt.experience}
                            </p>
                            <div className="booking-card__tags">
                                {pt.specialty.slice(0, 2).map((s, i) => (
                                    <span key={i} className="booking-card__tag">{s}</span>
                                ))}
                            </div>
                        </div>
                        <button className="booking-card__btn">Chọn</button>
                    </div>
                ))}
            </div>

            <button className="booking-back-btn" onClick={prevStep}>
                ← Quay lại
            </button>
        </div>
    );
};

export default StepSelectPT;