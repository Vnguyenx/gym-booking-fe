import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { PTInfo } from '../../types/models'; // Import interface
import '../../styles/home/pt-section.css'; // Import file CSS mới

// Khai báo kiểu dữ liệu cho Props truyền từ HomePage xuống
interface PTSectionProps {
    ptInfo: PTInfo | null;
}

const PTSection: React.FC<PTSectionProps> = ({ ptInfo }) => {
    const navigate = useNavigate();

    // Nếu không có dữ liệu thì không render gì cả (tránh lỗi crash app)
    if (!ptInfo) return null;

    // Hàm phụ trợ để render Icon tương ứng theo thứ tự (do database không lưu icon)
    const renderIcon = (index: number) => {
        const icons = [
            '💰', // 0: Thu nhập (Tiền)
            '📅', // 1: Lịch (Lịch dạy)
            '🏋️‍♂️', // 2: Tạ (Tập miễn phí)
            '📈'  // 3: Biểu đồ (Thương hiệu cá nhân)
        ];
        return <span className="pt-icon">{icons[index] || '🔥'}</span>;
    };

    return (
        <section id="pt" className="pt-section">
            <div className="container pt-container">

                {/* CỘT TRÁI: Nội dung chữ và các khối Benefits */}
                <div className="pt-content stagger">
                    <span className="pt-tag">ĐỘI NGŨ PT</span>

                    <h2 className="pt-title">
                        GIA NHẬP ĐỘI NGŨ <br/>
                        HUẤN LUYỆN VIÊN <span className="highlight-text">GYMXYZ</span>
                    </h2>

                    <p className="pt-desc">
                        {ptInfo.description}
                    </p>

                    {/* Danh sách 4 lợi ích (Grid 2x2 trên desktop) */}
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

                {/* CỘT PHẢI: Hình ảnh minh họa */}
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