// src/components/pt/PtHeader.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { usePtHeader } from '../../hooks/usePtHeader';

interface PtHeaderProps {
    onNotifClick: () => void;
}

    const PtHeader: React.FC<PtHeaderProps> = ({ onNotifClick }) => {
        const { displayName, avatarInitials, avatarUrl, pendingCount } = usePtHeader();
        const hasPending = pendingCount > 0;

        return (
            <header className="pt-hdr">
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css"
                />
                <Link to={ROUTES.HOME} className="pt-hdr__home" aria-label="Về trang chủ">
                    <i className="ti ti-home" aria-hidden="true"/>
                </Link>

                {/* Cập nhật logic: Nếu có URL thì không dùng class avatar mặc định có nền màu */}
                <div className={`pt-hdr__avatar ${avatarUrl ? 'pt-hdr__avatar--img' : ''}`} aria-hidden="true">
                    {avatarUrl ? (
                        <img
                            src={avatarUrl}
                            alt={displayName}
                            className="pt-hdr__avatar-img"
                        />
                    ) : (
                        avatarInitials
                    )}
                </div>

                <div className="pt-hdr__info">
                    <h2 className="pt-hdr__name">{displayName}</h2>
                    <p className="pt-hdr__role">Huấn luyện viên</p>
                </div>

                <button className="pt-hdr__notif-btn" onClick={onNotifClick}>
                    <i className="ti ti-bell" aria-hidden="true"/>
                    {hasPending && <span className="pt-hdr__notif-dot" aria-hidden="true"/>}
                </button>
            </header>
        );
    };

export default PtHeader;