// ============================================================
// Component: PricingSection
// src/components/home/PricingSection.tsx
//
// Section "Bảng giá" trên trang chủ.
// Dùng utility classes từ base.css: .sec-label, .sec-title, .sec-desc
// ============================================================

import React from 'react';
import { Membership } from '../../types/models';
import PricingCard from '../common/PricingCard';
import '../../styles/home/PricingSection.css';

interface PricingSectionProps {
    memberships: Membership[];
    /** Callback khi user bấm "Chi tiết đầy đủ" */
    onViewAll?: () => void;
    /** Callback khi user bấm "Đăng ký ngay" trên một gói */
    onRegister?: (membership: Membership) => void;
}

const PricingSection: React.FC<PricingSectionProps> = ({
                                                           memberships,
                                                           onViewAll,
                                                           onRegister,
                                                       }) => {
    // Chỉ lấy 3 gói giữa để hiển thị trên trang chủ
    // index 1=3tháng, 2=6tháng, 3=12tháng
    const displayedMemberships = memberships.slice(1, 4);

    return (
        <section className="pricing-section" id="pricing" aria-label="Bảng giá gói tập">
            <div className="pricing-section__container">

                {/* Header */}
                <div className="pricing-section__header">
                    <div className="pricing-section__header-left">
                        {/* sec-label, sec-title, sec-desc — chuẩn từ base.css */}
                        <span className="sec-label">BẢNG GIÁ</span>
                        <h2 className="sec-title">
                            CHỌN GÓI<br />PHÙ HỢP
                        </h2>
                        <p className="sec-desc">
                            Tất cả gói bao gồm toàn bộ thiết bị và thư viện bài tập.
                        </p>
                    </div>

                    {/* Nút dẫn sang trang pricing riêng */}
                    <button
                        className="pricing-section__view-all-btn"
                        onClick={onViewAll}
                        aria-label="Xem chi tiết tất cả gói tập"
                    >
                        Chi tiết đầy đủ <span aria-hidden="true">›</span>
                    </button>
                </div>

                {/* Lưới cards */}
                <div className="pricing-section__grid">
                    {displayedMemberships.map((membership) => (
                        <PricingCard
                            key={membership.id ?? membership.durationMonths}
                            membership={membership}
                            onRegister={onRegister}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
};

export default PricingSection;