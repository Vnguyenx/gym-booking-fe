// ============================================================
// Page: PricingPage
// src/pages/PricingPage.tsx
//
// Trang bảng giá đầy đủ.
// Đọc dữ liệu từ Redux store (đã được fetch ở HomePage).
// Nếu user vào thẳng URL này, useMembershipData sẽ tự fetch.
// ============================================================

import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import PricingBanner from '../../components/home/pricing/PricingBanner';
import PricingGrid from '../../components/home/pricing/PricingGrid';
import useMembershipData from '../../hooks/useMembershipData';
import { Membership } from '../../types/models';
import '../../styles/pages/pricing-page.css';

const PricingPage: React.FC = () => {
    const { memberships, loading, error } = useMembershipData();

    const handleRegister = (membership: Membership) => {
        // TODO: mở modal đăng ký hoặc điều hướng
        console.log('Đăng ký:', membership.name);
    };

    if (loading) return <div className="loading">Đang tải gói tập...</div>;
    if (error)   return <div className="loading">{error}</div>;

    return (
        <div className="pricing-page">
            <Navbar />
            <PricingBanner />
            <main className="container py-10">
                <PricingGrid
                    memberships={memberships}
                    onRegister={handleRegister}
                />
            </main>
            <Footer />
        </div>
    );
};

export default PricingPage;