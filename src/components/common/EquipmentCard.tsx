import React from 'react';
import '../../styles/home/equipment-card.css';
import { Equipment } from '../../types/models';

interface EquipmentCardProps {
    item: Equipment;
}

const EquipmentCard: React.FC<EquipmentCardProps> = ({ item }) => {
    const isActive = item.isActive;

    return (
        <div className="eq-card">

            {/* Ảnh */}
            <div className="eq-card__img-wrap">
                <img
                    src={item.imageUrls[0]}
                    alt={item.nameVi}
                    className="eq-card__img"
                    loading="lazy"
                />
                {/* Badge trạng thái */}
                <span className={`eq-card__badge ${isActive ? 'eq-card__badge--active' : 'eq-card__badge--maintenance'}`}>
                    {isActive ? 'Sẵn sàng' : 'Bảo trì'}
                </span>
            </div>

            {/* Nội dung */}
            <div className="eq-card__body">
                <p className="eq-card__meta">
                    {item.category} &bull; {item.quantity} máy
                </p>
                <h3 className="eq-card__name">{item.nameVi}</h3>

                {/* Nhóm cơ */}
                <div className="eq-card__muscles">
                    {item.muscleGroups.map((muscle, index) => (
                        <span key={index} className="eq-card__muscle-tag">
                            {muscle}
                        </span>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default EquipmentCard;