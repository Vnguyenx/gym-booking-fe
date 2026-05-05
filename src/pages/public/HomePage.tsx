// ============================================================
// Page: HomePage
// src/pages/HomePage.tsx
//
// Trang chủ — nơi duy nhất fetch dữ liệu rồi truyền xuống
// các section con qua props (pattern "lift state up").
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
import PricingSection from '../../components/home/PricingSection'; // 👈 mới thêm

// Custom hooks fetch dữ liệu
import useEquipmentData from '../../hooks/useEquipmentData';
import { useGymData } from '../../hooks/useGymData';
import { useBannerData } from '../../hooks/useBannerData';
import { usePTInfoData } from '../../hooks/usePTInfoData';
import useMembershipData from '../../hooks/useMembershipData'; // 👈 mới thêm

// Types
import { Banner, Membership } from '../../types/models';

// ---- Sub-component: đường kẻ đỏ mờ giữa các section ----
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

// ============================================================
const HomePage: React.FC = () => {
    const navigate = useNavigate();

    // ---- Fetch dữ liệu ----
    const { equipment, loading: equipmentLoading, error: equipmentError } = useEquipmentData();
    const { gymInfo, loading: gymLoading } = useGymData();
    const { data: allBanners, loading: bannerLoading } = useBannerData<Banner>('banners', true);
    const { ptInfo, loading: ptLoading, error: ptError } = usePTInfoData();
    const { memberships, loading: membershipLoading, error: membershipError } = useMembershipData(); // 👈

    // Lọc banner đang active và sắp xếp theo order
    const banners = allBanners
        .filter((b) => b.isActive)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    // ---- Hiệu ứng Reveal on Scroll ----
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            { threshold: 0.1 }
        );

        document.querySelectorAll('.reveal, .stagger').forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    // ---- Loading / Error states ----
    const isLoading =
        equipmentLoading || gymLoading || bannerLoading || ptLoading || membershipLoading;

    if (isLoading) return <div>Đang tải...</div>;
    if (equipmentError || ptError || membershipError) {
        return <div>{equipmentError || ptError || membershipError}</div>;
    }

    // ---- Handlers ----
    const handleViewAllPricing = () => {
        navigate(ROUTES.PRICING); // điều hướng sang trang bảng giá chi tiết
    };

    const handleRegister = (membership: Membership) => {
        // TODO: mở modal đăng ký hoặc điều hướng sang trang đăng ký
        console.log('Đăng ký gói:', membership.name);
    };

    // ---- Render ----
    return (
        <div className="home-page">
            <Navbar />

            <main>
                {/* 1. HERO / BANNER */}
                <BannerSection banners={banners} loading={bannerLoading} />

                <RedDivider />

                {/* 2. ABOUT */}
                <AboutSection gymInfo={gymInfo} loading={gymLoading} />

                <RedDivider />

                {/* 3. EQUIPMENT */}
                <EquipmentSection equipment={equipment} />

                <RedDivider />

                {/* 4. PERSONAL TRAINER */}
                <PTSection ptInfo={ptInfo} />

                <RedDivider />

                {/* 5. PRICING — nhận memberships từ Redux qua hook */}
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