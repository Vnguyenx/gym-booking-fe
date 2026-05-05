import React from 'react';
import { Link } from 'react-router-dom';
import {ROUTES} from "../../../constants/routes";

const EquipmentBanner: React.FC = () => {
    return (
        <section className="eq-banner">
            <div className="container">
                <Link to={ROUTES.HOME} className="back-home">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Quay lại trang chủ
                </Link>
                <br />
                <p className="eq-banner__tag">Cơ sở vật chất</p>
                <h1 className="eq-banner__title">DỤNG CỤ & MÁY MÓC</h1>
                <p className="eq-banner__desc">60+ thiết bị hiện đại, bảo dưỡng định kỳ — phục vụ mọi mục tiêu tập luyện.</p>
            </div>
        </section>
    );
};

export default EquipmentBanner;