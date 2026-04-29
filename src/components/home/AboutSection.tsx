import React from 'react';
import { Link } from 'react-router-dom';
import { GymInfo } from '../../types/models';
import { ROUTES } from "../../constants/routes";
import '../../styles/home/about-section.css';

interface AboutSectionProps {
    gymInfo: GymInfo | null;
    loading: boolean;
}

const AboutSection: React.FC<AboutSectionProps> = ({ gymInfo, loading }) => {
    if (loading) return <div className="about-skeleton">Đang tải giới thiệu...</div>;

    return (
        <section className="about section" id="about">
            <div className="container">
                <div className="about__layout">
                    {/* Cột trái: Text */}
                    <div className="about__content reveal">
                        <span className="section-subtitle">Về chúng tôi</span>
                        <h2 className="section-title">Hệ thống {gymInfo?.name}</h2>
                        <p className="about__desc">{gymInfo?.description}</p>

                        <div className="about__quick-info">
                            <p>📍 {gymInfo?.address}</p>
                            <p>⏰ {gymInfo?.openTime}</p>
                        </div>

                        <Link to={ROUTES.ABOUT_DETAIL} className="btn btn-red">
                            Xem chi tiết cơ sở
                        </Link>
                    </div>

                    {/* Cột phải: Amenities (Tiện ích) */}
                    <div className="about__amenities stagger">
                        <h3>Tiện ích tại phòng tập</h3>
                        <div className="amenity-grid">
                            {gymInfo?.amenities.wifi && <div className="amenity-item">📶 Wifi Miễn phí</div>}
                            {gymInfo?.amenities.parking && <div className="amenity-item">🅿️ Gửi xe {gymInfo.amenities.parkingNote}</div>}
                            {gymInfo?.amenities.shower && <div className="amenity-item">🚿 Phòng tắm nóng lạnh</div>}
                            {gymInfo?.amenities.locker && <div className="amenity-item">🔒 Tủ đồ an toàn</div>}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;