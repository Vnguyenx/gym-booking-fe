import React from 'react';
import { useGymData } from '../../hooks/useGymData';
import '../../styles/about-detail.css';
import {ROUTES} from "../../constants/routes";
import {Link} from "react-router-dom";

const AboutDetailPage: React.FC = () => {
    const { gymInfo, floors, zones, loading } = useGymData();

    if (loading) return <div className="page-loading">Đang tải không gian Gym...</div>;

    const am = gymInfo?.amenities;

    return (
        <main className="about-detail-page">
            {/* 1. Hero Banner */}
            <div className="detail-banner" style={{ backgroundImage: `url(${gymInfo?.coverImageUrl})` }}>
                <Link to={ROUTES.HOME} className="back-home-btn">
                    <span>&#8592;</span> Trang chủ
                </Link>
                <div className="container">
                    <span className="banner-tag">Thông tin chi tiết</span>
                    <h1>{gymInfo?.name}</h1>
                    <div className="banner-meta">
                        <span>📍 {gymInfo?.address}</span> <br/>
                        <span>📞 {gymInfo?.phone}</span> <br/>
                        <span>⏰ {gymInfo?.openTime}</span> <br/>
                    </div>
                </div>
            </div>

            <div className="container">
                {/* 2. Section Tiện ích (Amenities) - Xử lý boolean */}
                <section className="detail-section">
                    <h2 className="sub-title">Tiện ích & Dịch vụ</h2>
                    <div className="amenities-detail-grid">
                        {am?.wifi && (
                            <div className="am-card">
                                <span className="am-icon">📶</span>
                                <div>
                                    <h4>Wi-Fi Miễn Phí</h4>
                                    <p>{am.wifiNote || "Kết nối tốc độ cao tại mọi khu vực"}</p>
                                </div>
                            </div>
                        )}
                        {am?.parking && (
                            <div className="am-card">
                                <span className="am-icon">🅿️</span>
                                <div>
                                    <h4>Chỗ để xe</h4>
                                    <p>{am.parkingNote || "An toàn, có người trông giữ"}</p>
                                </div>
                            </div>
                        )}
                        {am?.shower && (
                            <div className="am-card">
                                <span className="am-icon">🚿</span>
                                <div>
                                    <h4>Phòng tắm</h4>
                                    <p>Nước nóng lạnh, sạch sẽ</p>
                                </div>
                            </div>
                        )}
                        {am?.locker && (
                            <div className="am-card">
                                <span className="am-icon">🔒</span>
                                <div>
                                    <h4>Tủ đồ cá nhân</h4>
                                    <p>Sử dụng khóa từ an toàn</p>
                                </div>
                            </div>
                        )}
                        {am?.toilet && (
                            <div className="am-card">
                                <span className="am-icon">🚻</span>
                                <div>
                                    <h4>Vệ sinh</h4>
                                    <p>{am.toiletNote || "Tiêu chuẩn"}</p>
                                </div>
                            </div>
                        )}
                        {(am?.waterFilter && am.waterFilter > 0) && (
                            <div className="am-card">
                                <span className="am-icon">💧</span>
                                <div>
                                    <h4>Máy lọc nước</h4>
                                    <p>{am.waterFilterNote || `Có ${am.waterFilter} máy lọc tại các tầng`}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* 3. Sơ đồ mặt bằng */}
                <section className="detail-section">
                    <h2 className="sub-title">Cấu trúc phòng tập</h2>
                    <p className="section-intro">Tổng số tầng: {gymInfo?.totalFloors}. Được thiết kế hiện đại, tối ưu cho từng bộ môn tập luyện.</p>
                    <div className="floor-container">
                        {floors.map(floor => (
                            <div key={floor.id} className="floor-block reveal visible">
                                <div className="floor-header">
                                    <div className="floor-title">
                                        <span className="tag">Tầng {floor.floor_number}</span>
                                        <h3>{floor.name}</h3>
                                    </div>
                                    <span className="floor-area">{floor.area} m²</span>
                                </div>
                                <p className="floor-desc">{floor.description}</p>
                                <div className="zone-list">
                                    {zones.filter(z => z.floorId === floor.id).map(zone => (
                                        <div key={zone.id} className="zone-card">
                                            <h4>{zone.name}</h4>
                                            <p>{zone.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 4. Vị trí & Chỉ đường (Thêm Lat/Lng) */}
                <section className="detail-section">
                    <h2 className="sub-title">Vị trí & Chỉ đường</h2>
                    <div className="location-wrapper">
                        <div className="map-frame">
                            {gymInfo?.location.mapUrl && (
                                <iframe
                                    title="gym-map"
                                    src={gymInfo.location.mapUrl}
                                    width="100%" height="400" style={{ border: 0 }}
                                    allowFullScreen loading="lazy"
                                ></iframe>
                            )}
                        </div>
                        <div className="location-info">
                            <p><strong>Tọa độ:</strong> {gymInfo?.location.latitude}, {gymInfo?.location.longitude}</p>
                            <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${gymInfo?.location.latitude},${gymInfo?.location.longitude}`}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn--primary"
                            >
                                🚗 Chỉ đường qua Google Maps
                            </a>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default AboutDetailPage;