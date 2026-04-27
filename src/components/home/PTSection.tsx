import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const PTSection: React.FC = () => {
    const navigate = useNavigate();

    return (
        <section id="pt" className="container py-12">
            <div className="text-center mb-10">
                <span className="sec-tag">CHUYÊN GIA</span>
                <h2 className="sec-title">ĐỘI NGŨ PT</h2>
            </div>

            <div className="auth-card" style={{ maxWidth: '100%', textAlign: 'center', padding: '3rem' }}>
                <p className="sec-desc" style={{ margin: '0 auto 2rem' }}>
                    Sẵn sàng thay đổi vóc dáng cùng những huấn luyện viên hàng đầu.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button className="btn-ghost" onClick={() => navigate(ROUTES.PT_LIST)}>
                        Xem danh sách PT
                    </button>
                    <button className="btn-red" onClick={() => navigate(ROUTES.PT_REGISTER)}>
                        Đăng ký làm PT ngay
                    </button>
                </div>
            </div>
        </section>
    );
};

export default PTSection;