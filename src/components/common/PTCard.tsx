import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PT } from '../../types/models';
import '../../styles/home/pt-card.css';

interface PTCardProps {
    item: PT;
}

const PTCard: React.FC<PTCardProps> = ({ item }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/pt-detail/${item.id}`, { state: { equipment: item } });
    };

    return (
        <div className="pts-card" onClick={handleClick} style={{ cursor: 'pointer' }} >
            <div className="pts-card__img-wrap">
                <img src={item.avatar} alt={item.fullName} className="pts-card__img" loading="lazy" />
                {/* Badge trạng thái: Sẵn sàng hoặc Kín lịch */}
                <span className={`pts-card__badge ${item.isAvailable ? 'status--online' : 'status--busy'}`}>
                    {item.isAvailable ? 'Sẵn sàng' : 'Kín lịch'}
                </span>
            </div>

            <div className="pts-card__body">
                <p className="pts-card__gender">{item.gender}</p>
                <h3 className="pts-card__name">{item.fullName}</h3>

                <div className="pts-card__specialties">
                    {item.specialty.slice(0, 2).map((s, idx) => (
                        <span key={idx} className="pt-card__tag">{s}</span>
                    ))}
                    {item.specialty.length > 2 && <span className="pts-card__tag">+{item.specialty.length - 2}</span>}
                </div>
            </div>
        </div>
    );
};

export default PTCard;