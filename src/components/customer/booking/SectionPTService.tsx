// src/components/booking/SectionPTService.tsx
// Mục chọn dịch vụ PT — luôn hiển thị
// fromPT: highlight 1:1 và nhóm (không highlight 'none')

import React from 'react';
import { PTService } from '../../../types/models';
import useBooking from '../../../hooks/useBooking';

interface SectionPTServiceProps {
    booking: ReturnType<typeof useBooking>;
}

const SectionPTService: React.FC<SectionPTServiceProps> = ({ booking }) => {
    const {
        selectedPTService,
        handleSelectPTService,
        ptServices,
        loadingPTServices,
        entryPoint,
    } = booking;

    if (loadingPTServices) {
        return (
            <div className="booking-section">
                <h2 className="booking-section__title">
                    <span className="booking-section__num">2</span>
                    Dịch vụ PT
                </h2>
                <p className="booking-loading">Đang tải...</p>
            </div>
        );
    }

    return (
        <div className="booking-section">
            <h2 className="booking-section__title">
                <span className="booking-section__num">2</span>
                Bạn có muốn tập cùng PT không?
            </h2>

            <div className="booking-option-list">
                {ptServices.map((service: PTService) => {
                    const isSelected = selectedPTService?.id === service.id;

                    // fromPT: "Không PT" bị mờ đi vì đã chọn PT rồi
                    const isDimmed = entryPoint === 'fromPT' && service.type === 'none';

                    return (
                        <div
                            key={service.id}
                            className={`booking-option 
                                ${isSelected ? 'selected' : ''} 
                                ${isDimmed ? 'dimmed' : ''}
                            `}
                            onClick={() => handleSelectPTService(service)}
                        >
                            <div className="booking-option__radio" />

                            <div className="booking-option__body">
                                <span className="booking-option__name">{service.name}</span>
                                {service.type !== 'none' && (
                                    <p className="booking-option__note">
                                        {(service.pricePerMonth / 1000).toFixed(0)}K / tháng
                                    </p>
                                )}
                            </div>

                            {service.pricePerMonth === 0 ? (
                                <span className="booking-option__free">Miễn phí</span>
                            ) : (
                                <div className="booking-option__price">
                                    <span className="price-main">
                                        {(service.pricePerMonth / 1000).toFixed(0)}K
                                    </span>
                                    <span className="price-note">/tháng</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SectionPTService;