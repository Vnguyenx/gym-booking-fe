// src/components/admin/catalog/PTServiceCard.tsx
import React from 'react';
import { PTService } from '../../../types/models';
import { formatVND } from './CatalogShared';

const TYPE_CLASS: Record<string, string> = {
    basic: 'catalog-badge--basic',
    standard: 'catalog-badge--standard',
    premium: 'catalog-badge--premium',
};

const TYPE_LABEL: Record<string, string> = {
    basic: 'Cơ bản',
    standard: 'Tiêu chuẩn',
    premium: 'Cao cấp',
};

const getBadgeClass = (type?: string): string => {
    if (type && TYPE_CLASS[type]) return TYPE_CLASS[type];
    return 'catalog-badge--default';
};

const getBadgeLabel = (type?: string): string => {
    if (type && TYPE_LABEL[type]) return TYPE_LABEL[type];
    return type || 'Chung';
};

interface PTServiceCardProps {
    item: PTService;
    onEdit: (item: PTService) => void;
    onDelete: (id: string) => void;
}

const PTServiceCard: React.FC<PTServiceCardProps> = ({ item, onEdit, onDelete }) => (
    <div className="catalog-card">
        <div className="catalog-card__header">
            <h3 className="catalog-card__title">{item.name}</h3>
            <span className={`catalog-card__badge ${getBadgeClass(item.type)}`}>{getBadgeLabel(item.type)}</span>
        </div>
        <div className="catalog-card__pricing">
            <span className="catalog-card__price">{formatVND(item.pricePerMonth)}</span>
            <span className="catalog-card__per-month">/ tháng</span>
        </div>
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

export default PTServiceCard;