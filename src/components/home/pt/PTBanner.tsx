import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

const PTBanner: React.FC = () => {
    return (
        <section className="pt-banner">
            <div className="container">
                <Link to={ROUTES.HOME} className="back-home">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Quay lại trang chủ
                </Link>
                <br />
                <p className="pt-banner__tag">CHUYÊN GIA</p>
                <h1 className="pt-banner__title">ĐỘI NGŨ HUẤN LUYỆN VIÊN</h1>
                <p className="pt-banner__desc">Đồng hành cùng bạn trên con đường chinh phục vóc dáng với giáo án chuẩn y khoa và thực đơn cá nhân hóa.</p>
            </div>
        </section>
    );
};

export default PTBanner;