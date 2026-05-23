import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

const ContentCards: React.FC = () => {
    const items = [
        { icon: '📍', title: 'Gym Info', desc: 'Địa chỉ, giờ mở cửa', path: ROUTES.ADMIN_CONTENT },
        { icon: '🖼️', title: 'Banners', desc: 'Quản lý banner', path: ROUTES.ADMIN_CONTENT },
        { icon: '🧱', title: 'Zones & Floors', desc: 'Cấu hình khu vực', path: ROUTES.ADMIN_CONTENT },
        { icon: '🎁', title: 'Membership', desc: 'Gói tập', path: ROUTES.ADMIN_MEMBERSHIPS },
    ];

    return (
        <div className="db-grid-4">
            {items.map((item) => (
                <Link
                    key={item.title}
                    to={item.path}
                    className="db-card db-card-hover"
                    style={{ textAlign: 'center', textDecoration: 'none' }}
                >
                    <div style={{ fontSize: '1.875rem', marginBottom: '0.5rem' }}>{item.icon}</div>
                    <p className="db-text-primary" style={{ fontWeight: 500 }}>{item.title}</p>
                    <p className="db-text-dim" style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>{item.desc}</p>
                </Link>
            ))}
        </div>
    );
};

export default ContentCards;