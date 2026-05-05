// ============================================================
// Component: PricingCard
// src/components/common/PricingCard.tsx
//
// Thẻ hiển thị thông tin một gói tập.
// Nhận toàn bộ dữ liệu qua props, không tự fetch.
// ============================================================

import React from 'react';
import { Membership } from '../../types/models';
import '../../styles/home/PricingCard.css';

interface PricingCardProps {
    membership: Membership;
    /** Callback khi bấm "Đăng ký ngay" */
    onRegister?: (membership: Membership) => void;
}

/**
 * Định dạng số tiền: 350000 → "350K" | 1690000 → "1.69M"
 */
const formatPrice = (amount: number): string => {
    if (amount >= 1_000_000) {
        // Làm tròn đến 2 chữ số thập phân và bỏ số 0 thừa
        const millions = (amount / 1_000_000).toFixed(2).replace(/\.?0+$/, '');
        return `${millions}M`;
    }
    return `${Math.round(amount / 1000)}K`;
};

/**
 * Tính % tiết kiệm giữa giá gốc và giá online
 */
const calcSavingPercent = (price: number, priceOnline: number): number => {
    return Math.round(((price - priceOnline) / price) * 100);
};

const PricingCard: React.FC<PricingCardProps> = ({ membership, onRegister }) => {
    const {
        name,
        durationMonths,
        price,
        priceOnline,
        note,
        isPopular,
        promotions,
    } = membership;

    const savingPercent = calcSavingPercent(price, priceOnline);

    // Label thời hạn ngắn gọn: 1 → "1 THÁNG", 12 → "12 THÁNG", 60 → "5 NĂM"
    const durationLabel =
        durationMonths >= 12 && durationMonths % 12 === 0
            ? `${durationMonths / 12} NĂM`
            : `${durationMonths} THÁNG`;

    return (
        <div className={`pricing-card ${isPopular ? 'pricing-card--popular' : ''}`}>
            {/* Badge "Phổ biến nhất" chỉ xuất hiện nếu isPopular = true */}
            {isPopular && (
                <div className="pricing-card__badge">PHỔ BIẾN NHẤT</div>
            )}

            {/* Tiêu đề thời hạn */}
            <p className="pricing-card__duration">{durationLabel}</p>

            {/* Giá */}
            <div className="pricing-card__price-row">
                <span className="pricing-card__price">{formatPrice(price)}</span>
                <span className="pricing-card__price-online">
          › {formatPrice(priceOnline)} online
        </span>
            </div>

            {/* Ghi chú ngắn + % tiết kiệm */}
            <p className="pricing-card__note">
                {note}
                {savingPercent > 0 && (
                    <span className="pricing-card__saving"> · Tiết kiệm {savingPercent}%</span>
                )}
            </p>

            {/* Divider */}
            <hr className="pricing-card__divider" />

            {/* Danh sách quyền lợi */}
            <ul className="pricing-card__promotions">
                {promotions.map((item, index) => (
                    <li key={index} className="pricing-card__promotion-item">
                        <span className="pricing-card__check" aria-hidden="true">✓</span>
                        {item}
                    </li>
                ))}
            </ul>

            {/* Nút đăng ký */}
            <button
                className={`pricing-card__btn ${isPopular ? 'pricing-card__btn--primary' : 'pricing-card__btn--outline'}`}
                onClick={() => onRegister?.(membership)}
                aria-label={`Đăng ký ${name}`}
            >
                Đăng ký ngay
            </button>
        </div>
    );
};

export default PricingCard;