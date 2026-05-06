// ============================================================
// Page: HomePage
// src/pages/public/HomePage.tsx
// ============================================================

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

// Layout
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

// Home sections
import BannerSection from '../../components/home/Banner';
import AboutSection from '../../components/home/AboutSection';
import EquipmentSection from '../../components/home/EquipmentSection';
import PTSection from '../../components/home/PTSection';
import PricingSection from '../../components/home/PricingSection';

// Custom hooks fetch dữ liệu
import useEquipmentData from '../../hooks/useEquipmentData';
import { useGymData } from '../../hooks/useGymData';
import { useBannerData } from '../../hooks/useBannerData';
import usePTInfoData from "../../hooks/usePTInfoData"
import useMembershipData from '../../hooks/useMembershipData';

// Types
import { Membership } from '../../types/models';

const RedDivider: React.FC = () => (
    <div
        style={{
            height: '1px',
            width: '100%',
            background: 'linear-gradient(90deg, transparent 0%, #ef4444 50%, transparent 100%)',
            margin: '0 auto',
            opacity: 0.6,
        }}
    />
);

const HomePage: React.FC = () => {
    const navigate = useNavigate();

    const { loading: equipmentLoading, error: equipmentError } = useEquipmentData();
    const { gymInfo, loading: gymLoading } = useGymData();
    const { loading: bannerLoading } = useBannerData('banners', true);
    const { loading: ptLoading, error: ptError } = usePTInfoData(); // khởi động fetch, PTSection tự đọc store
    const { memberships, loading: membershipLoading, error: membershipError } = useMembershipData();

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) entry.target.classList.add('visible');
                });
            },
            { threshold: 0.1 }
        );
        document.querySelectorAll('.reveal, .stagger').forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const isLoading = equipmentLoading || gymLoading || bannerLoading || ptLoading || membershipLoading;
    if (isLoading) return <div>Đang tải...</div>;
    if (equipmentError || ptError || membershipError) {
        return <div>{equipmentError || ptError || membershipError}</div>;
    }

    const handleViewAllPricing = () => navigate(ROUTES.PRICING);
    const handleRegister = (membership: Membership) => {
        console.log('Đăng ký gói:', membership.name);
    };

    return (
        <div className="home-page">
            <Navbar />
            <main>
                <BannerSection />
                <RedDivider />
                <AboutSection />
                <RedDivider />
                <EquipmentSection />
                <RedDivider />
                <PTSection />
                <RedDivider />
                <PricingSection
                    memberships={memberships}
                    onViewAll={handleViewAllPricing}
                    onRegister={handleRegister}
                />
            </main>
            <RedDivider />
            <Footer />
        </div>
    );
};

export default HomePage;