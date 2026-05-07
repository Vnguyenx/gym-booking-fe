// src/components/booking/StepPTService.tsx
// Bước chọn gói dịch vụ PT
// Gọi BE lấy danh sách pt_services

import React, { useEffect, useState } from 'react';
import { PTService } from '../../../types/models';
import { bookingService } from '../../../services/bookingService';
import useBooking from '../../../hooks/useBooking';

interface StepPTServiceProps {
    booking: ReturnType<typeof useBooking>;
}

const StepPTService: React.FC<StepPTServiceProps> = ({ booking }) => {
    const { handleSelectPTService, prevStep } = booking;

    const [ptServices, setPTServices] = useState<PTService[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Lấy danh sách gói dịch vụ PT từ BE
        bookingService.getPTServices()
            .then(data => setPTServices(data.ptServices))
            .catch(err => console.error('Lỗi lấy PT services:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="booking-loading">Đang tải...</div>;

    return (
        <div className="booking-step">
            <h2 className="booking-step__title">Bạn có muốn tập cùng PT không?</h2>
            <p className="booking-step__sub">Chọn gói dịch vụ phù hợp</p>

            <div className="booking-step__list">
                {ptServices.map(service => (
                    <div
                        key={service.id}
                        className="booking-card"
                        onClick={() => handleSelectPTService(service)}
                    >
                        <h3 className="booking-card__name">{service.name}</h3>
                        <div className="booking-card__price">
                            {service.pricePerMonth === 0 ? (
                                <span className="price-main">Miễn phí</span>
                            ) : (
                                <span className="price-main">
                                    {(service.pricePerMonth / 1000).toFixed(0)}K
                                    <span className="price-note"> / tháng</span>
                                </span>
                            )}
                        </div>
                        <button className="booking-card__btn">Chọn</button>
                    </div>
                ))}
            </div>

            {/* Nút quay lại */}
            <button className="booking-back-btn" onClick={prevStep}>
                ← Quay lại
            </button>
        </div>
    );
};

export default StepPTService;