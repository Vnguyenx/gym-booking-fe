// ============================================================
// Component: PricingBanner
// src/components/pricing/PricingBanner.tsx
// ============================================================

import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

const PricingBanner: React.FC = () => {
    return (
        <section className="pricing-banner">
            <div className="container">
                <Link to={ROUTES.HOME} className="back-home">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Quay lại trang chủ
                </Link>

                <p className="pricing-banner__tag">BẢNG GIÁ</p>
                <h1 className="pricing-banner__title">TẤT CẢ GÓI TẬP</h1>
                <p className="pricing-banner__desc">
                    Tất cả gói bao gồm toàn bộ thiết bị, check-in không giới hạn và thư viện bài tập.
                </p>
            </div>
        </section>
    );
};

export default PricingBanner;