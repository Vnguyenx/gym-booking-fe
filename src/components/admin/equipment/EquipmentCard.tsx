// src/components/admin/equipment/EquipmentCard.tsx
//
// Hiển thị thông tin tóm tắt của một thiết bị dưới dạng card.
// Dùng ở cả mobile (stack dọc) và desktop (grid).
//
// Props:
//   item     — dữ liệu thiết bị
//   onEdit   — callback khi bấm nút Sửa
//   onDelete — callback khi bấm nút Xoá (truyền id lên cha để confirm)

import React from 'react';
import { Equipment } from '../../../types/models';

interface EquipmentCardProps {
    item: Equipment;
    onEdit:   (item: Equipment) => void;
    onDelete: (id: string) => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Trả về ảnh đầu tiên trong imageUrls, hoặc placeholder nếu không có */
const getThumb = (imageUrls: string[]): string | null =>
    imageUrls.length > 0 ? imageUrls[0] : null;

const EquipmentCard: React.FC<EquipmentCardProps> = ({ item, onEdit, onDelete }) => {
    const thumb = getThumb(item.imageUrls);

    return (
        <div className={`eq-card ${!item.isActive ? 'eq-card--inactive' : ''}`}>

            {/* ── Ảnh thumbnail ── */}
            <div className="eq-card__thumb">
                {thumb ? (
                    <img src={thumb} alt={item.nameVi} />
                ) : (
                    // Placeholder khi không có ảnh
                    <div className="eq-card__no-img">🏋️</div>
                )}

                {/* Badge trạng thái active/inactive phủ lên ảnh */}
                <span className={`eq-card__status-badge ${item.isActive ? 'badge--success' : 'badge--neutral'}`}>
                    {item.isActive ? 'Hoạt động' : 'Ngừng dùng'}
                </span>
            </div>

            {/* ── Nội dung chính ── */}
            <div className="eq-card__body">

                {/* Tên thiết bị */}
                <p className="eq-card__name-vi">{item.nameVi}</p>
                <p className="eq-card__name-en">{item.name}</p>

                {/* Thông tin phụ: category, số lượng, zone */}
                <div className="eq-card__meta-row">
                    <span className="eq-card__tag">{item.category}</span>
                    {item.subCategory && (
                        <span className="eq-card__tag eq-card__tag--sub">{item.subCategory}</span>
                    )}
                </div>

                <div className="eq-card__meta-row">
                    <span className="eq-card__meta-item">
                        📦 Số lượng: <strong>{item.quantity}</strong>
                    </span>
                    {item.zoneId && (
                        <span className="eq-card__meta-item">
                            📍 Zone: <strong>{item.zoneId}</strong>
                        </span>
                    )}
                </div>

                {/* Nhóm cơ nếu có */}
                {item.muscleGroups.length > 0 && (
                    <div className="eq-card__muscles">
                        {item.muscleGroups.map((m) => (
                            <span key={m} className="eq-card__muscle-chip">{m}</span>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Nút hành động ── */}
            <div className="eq-card__actions">
                <button
                    className="eq-btn eq-btn--outline"
                    onClick={() => onEdit(item)}
                    aria-label={`Sửa ${item.nameVi}`}
                >
                    ✏️ Sửa
                </button>
                <button
                    className="eq-btn eq-btn--danger"
                    onClick={() => item.id && onDelete(item.id)}
                    aria-label={`Xoá ${item.nameVi}`}
                >
                    🗑️ Xoá
                </button>
            </div>
        </div>
    );
};

export default EquipmentCard;