// src/components/admin/catalog/MembershipCard.tsx
import React from 'react';
import { Membership } from '../../../types/models';
import { formatVND } from './CatalogShared';

interface MembershipCardProps {
    item: Membership;
    onEdit: (item: Membership) => void;
    onDelete: (id: string) => void;
}

const MembershipCard: React.FC<MembershipCardProps> = ({ item, onEdit, onDelete }) => (
    <div className="catalog-card">
        {item.isPopular && <span className="catalog-card__badge catalog-card__badge--popular">🔥 Phổ biến</span>}
        <div>
            <h3 className="catalog-card__title">{item.name}</h3>
            <p className="catalog-card__duration">{item.durationMonths} tháng</p>
        </div>
        <div className="catalog-card__pricing">
            <span className="catalog-card__price">{formatVND(item.price)}</span>
            {item.priceOnline && item.priceOnline !== item.price && (
                <span className="catalog-card__price-online">Online: {formatVND(item.priceOnline)}</span>
            )}
        </div>
        {item.note && <p className="catalog-card__note">{item.note}</p>}
        {item.promotions && item.promotions.length > 0 && (
            <div className="catalog-card__promos">
                {item.promotions.slice(0, 3).map((promo, idx) => (
                    <span key={idx} className="catalog-card__promo-tag">{promo}</span>
                ))}
                {item.promotions.length > 3 && (
                    <span className="catalog-card__promo-more">+{item.promotions.length - 3}</span>
                )}
            </div>
        )}
        <div className="catalog-card__actions">
            <button className="catalog-btn catalog-btn--edit" onClick={() => onEdit(item)}>
                Sửa
            </button>
            <button className="catalog-btn catalog-btn--delete" onClick={() => onDelete(item.id!)}>
                Xoá
            </button>
        </div>
    </div>
);

export default MembershipCard;