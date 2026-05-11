// ============================================================
// Component: PTSection
// src/components/home/PTSection.tsx
//
// Dùng utility classes từ base.css: .sec-label, .sec-title, .sec-desc
// ============================================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import usePTInfoData from '../../hooks/usePTInfoData';
import '../../styles/home/pt-section.css';

const PTSection: React.FC = () => {
    const navigate = useNavigate();
    const { ptInfo } = usePTInfoData();

    if (!ptInfo) return null;

    // Render icon theo thứ tự vì database không lưu icon
    const renderIcon = (index: number) => {
        const icons = [
            '💰', // 0: Thu nhập
            '📅', // 1: Lịch dạy
            '🏋️‍♂️', // 2: Tập miễn phí
            '📈'  // 3: Thương hiệu cá nhân
        ];
        return <span className="pt-icon">{icons[index] || '🔥'}</span>;
    };

    return (
        <section id="pt" className="pt-section">
            <div className="container pt-container">

                {/* Cột trái: Text + Benefits */}
                <div className="pt-content stagger">
                    {/* sec-label, sec-title — chuẩn từ base.css */}
                    <span className="sec-label">ĐỘI NGŨ PT</span>
                    <h2 className="sec-title">
                        GIA NHẬP ĐỘI NGŨ <br />
                        HUẤN LUYỆN VIÊN <span className="highlight-text">GYMXYZ</span>
                    </h2>

                    {/* sec-desc không dùng vì cần max-width rộng hơn — dùng class riêng */}
                    <p className="pt-desc">{ptInfo.description}</p>

                    {/* Danh sách lợi ích — grid 2x2 trên tablet+ */}
                    <div className="pt-benefits-grid">
                        {ptInfo.Benefits?.map((benefit, index) => (
                            <div className="benefit-card" key={index}>
                                <div className="benefit-icon-wrapper">
                                    {renderIcon(index)}
                                </div>
                                <div className="benefit-info">
                                    <h4 className="benefit-title">{benefit.title}</h4>
                                    <p className="benefit-content">{benefit.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Cụm nút hành động */}
                    <div className="pt-actions">
                        <button className="btn-solid-red" onClick={() => navigate(ROUTES.PT_REGISTER)}>
                            Đăng ký làm PT
                        </button>
                        <button className="btn-outline-text" onClick={() => navigate(ROUTES.PT_LIST)}>
                            Xem đội ngũ &gt;
                        </button>
                    </div>
                </div>

                {/* Cột phải: Hình ảnh */}
                <div className="pt-image-wrapper reveal">
                    <img
                        src={ptInfo.img}
                        alt="Huấn luyện viên PT"
                        className="pt-hero-image"
                        loading="lazy"
                    />
                </div>

            </div>
        </section>
    );
};

export default PTSection;