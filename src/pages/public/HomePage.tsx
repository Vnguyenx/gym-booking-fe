import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import Navbar from '../../components/layout/Navbar';
import BannerSection from '../../components/home/Banner';
import PTSection from '../../components/home/PTSection';
import Footer from '../../components/layout/Footer';
import AboutSection from "../../components/home/AboutSection";


const HomePage: React.FC = () => {
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

    return (
        <div className="home-page">
            <Navbar />

            <main>
                {/* 1. HERO / BANNER SECTION */}
                <BannerSection />

                {/* 2. ABOUT SECTION */}
                <AboutSection />

                {/* 3. EQUIPMENT SECTION */}
                <section className="section equipment" id="equipment" style={{ background: 'var(--surface)' }}>
                    <div className="container">
                        <div className="section-header reveal" style={{ textAlign: 'center' }}>
                            <span className="section-subtitle">Trang thiết bị</span>
                            <h2 className="section-title">Máy móc <span>Hiện đại</span></h2>
                        </div>
                        <div className="equipment__grid stagger">
                            <div className="equipment__card">
                                <img src="/images/cardio.jpg" alt="Cardio Zone" />
                                <h3>Cardio Zone</h3>
                                <p>Hệ thống máy chạy bộ Matrix chuẩn quốc tế.</p>
                            </div>
                            <div className="equipment__card">
                                <img src="/images/strength.jpg" alt="Strength Zone" />
                                <h3>Strength Training</h3>
                                <p>Khu vực tạ tự do và máy khối chuyên sâu.</p>
                            </div>
                            <div className="equipment__card">
                                <img src="/images/crossfit.jpg" alt="Crossfit" />
                                <h3>Crossfit Arena</h3>
                                <p>Không gian rộng cho các bài tập cường độ cao.</p>
                            </div>
                        </div>
                        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                            <Link to={ROUTES.EQUIPMENT} className="btn btn--outline">Xem tất cả dụng cụ</Link>
                        </div>
                    </div>
                </section>

                {/* 4. PT SECTION (Component riêng bạn đã có) */}
                <PTSection />

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

            <Footer />
        </div>
    );
};

export default HomePage;