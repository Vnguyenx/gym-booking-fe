import React, { useEffect } from 'react';
import { ROUTES } from '../../constants/routes';
import Navbar from '../../components/layout/Navbar';
import BannerSection from '../../components/home/Banner';
import PTSection from '../../components/home/PTSection';
import Footer from '../../components/layout/Footer';
import AboutSection from "../../components/home/AboutSection";
import EquipmentSection from "../../components/home/EquipmentSection";
import useEquipmentData from "../../hooks/useEquipmentData";
import { useGymData } from "../../hooks/useGymData";
import { useBannerData } from "../../hooks/useBannerData";
import {Banner, Equipment} from "../../types/models";


const HomePage: React.FC = () => {
    const { equipment, loading: equipmentLoading, error } = useEquipmentData();
    const { gymInfo, loading: gymLoading } = useGymData();
    const { data: allBanners, loading: bannerLoading } = useBannerData<Banner>('banners', true);

    // Lọc isActive + sắp xếp theo order
    const banners = allBanners
        .filter(b => b.isActive)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    // Logic để kích hoạt hiệu ứng Reveal on Scroll giống như file gốc
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.reveal, .stagger').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const RedDivider = () => (
        <div style={{
            height: '1px',
            width: '100%',
            background: 'linear-gradient(90deg, transparent 0%, #ef4444 50%, transparent 100%)',
            margin: '0 auto',
            opacity: 0.6
        }} />
    );

    if (equipmentLoading || gymLoading || bannerLoading) return <div>Đang tải...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="home-page">
            <Navbar />

            <main>
                {/* 1. HERO / BANNER SECTION */}
                <BannerSection banners={banners} loading={bannerLoading} />

                <RedDivider />
                {/* 2. ABOUT SECTION */}
                <AboutSection gymInfo={gymInfo} loading={gymLoading} />

                <RedDivider />
                {/* 3. EQUIPMENT SECTION */}
                <EquipmentSection equipment={equipment} />

                <RedDivider />
                {/* 4. PT SECTION (Component riêng bạn đã có) */}
                <PTSection />

                <RedDivider />
                {/* 5. PRICING SECTION */}
                <section className="section pricing" id="pricing">
                    <div className="container">
                        <div className="section-header reveal" style={{ textAlign: 'center' }}>
                            <span className="section-subtitle">Gói tập</span>
                            <h2 className="section-title">Bảng giá <span>Dịch vụ</span></h2>
                        </div>
                        <div className="pricing__grid stagger">
                            <div className="pricing__item">
                                <h3>Basic</h3>
                                <div className="price">500k<span>/tháng</span></div>
                                <ul className="pricing__features">
                                    <li>Tập luyện không giới hạn</li>
                                    <li>Tủ đồ cá nhân</li>
                                    <li>Phòng tắm nước nóng</li>
                                </ul>
                                <button className="btn btn--outline" style={{ width: '100%' }}>Chọn gói này</button>
                            </div>
                            <div className="pricing__item featured">
                                <div className="badge">Phổ biến</div>
                                <h3>Premium</h3>
                                <div className="price">1.2tr<span>/tháng</span></div>
                                <ul className="pricing__features">
                                    <li>Bao gồm gói Basic</li>
                                    <li>4 buổi tập với PT</li>
                                    <li>Đo Inbody hàng tuần</li>
                                    <li>Nước uống miễn phí</li>
                                </ul>
                                <button className="btn btn--primary" style={{ width: '100%' }}>Đăng ký ngay</button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <RedDivider />

            <Footer />
        </div>
    );
};

export default HomePage;