import React, { useMemo } from 'react';
import EquipmentCard from '../common/EquipmentCard';
import { Equipment } from '../../types/models';
import '../../styles/home/equipment-section.css';
import {ROUTES} from "../../constants/routes";
import {Link} from "react-router-dom";

interface EquipmentSectionProps {
    equipment: Equipment[];
}

const EquipmentSection: React.FC<EquipmentSectionProps> = ({ equipment }) => {

    // Lấy ngẫu nhiên 3 thiết bị, useMemo tránh re-shuffle mỗi lần render
    const randomEquipments = useMemo(() => {
        return [...equipment].sort(() => 0.5 - Math.random()).slice(0, 3);
    }, [equipment]);

    return (
        <section className="equipment-section" id="equipment">
            <div className="container">

                {/* Header */}
                <div className="equipment-header">
                    <div className="equipment-header__text">
                        <p className="equipment-header__tag">Cơ sở vật chất</p>
                        <h2 className="equipment-header__title">
                            DỤNG CỤ & <br /> MÁY MÓC
                        </h2>
                        <p className="equipment-header__desc">
                            Thiết bị hiện đại, bảo dưỡng định kỳ — đủ cho mọi mục tiêu.
                        </p>
                    </div>

                    {/* Nút "Xem tất cả" — ẩn trên mobile, hiện từ tablet */}
                    <Link to={ROUTES.EQUIPMENT} className="equipment-header__link">
                        Xem tất cả
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>

                {/* Grid thiết bị */}
                <div className="equipment-grid">
                    {randomEquipments.map((item, index) => (
                        <EquipmentCard key={index} item={item} />
                    ))}
                </div>

                {/* CTA cuối — hiện trên mọi màn hình */}
                <div className="equipment-footer">
                    <a href="/equipment" className="equipment-cta">
                        Xem toàn bộ {equipment.length}+ thiết bị
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </a>
                </div>

            </div>
        </section>
    );
};

export default EquipmentSection;