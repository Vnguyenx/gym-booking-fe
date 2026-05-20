// src/components/admin/layout/AdminSidebar.tsx

import React from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import '../../../styles/admin/AdminSidebar.css';


const MENU_ITEMS = [
    { label: 'Dashboard',    icon: '📊', path: ROUTES.ADMIN_DASHBOARD },
    { label: 'Người dùng',     icon: '👥', path: ROUTES.ADMIN_USERS },
    { label: 'PT & Đơn PT',  icon: '💪', path: ROUTES.ADMIN_PTS },
    { label: 'Lớp học',      icon: '📚', path: ROUTES.ADMIN_CLASSES },
    { label: 'Booking',      icon: '🎫', path: ROUTES.ADMIN_BOOKINGS },
    { label: 'Gói tập',      icon: '🎁', path: ROUTES.ADMIN_MEMBERSHIPS },
    { label: 'Máy móc',      icon: '⚙️', path: ROUTES.ADMIN_EQUIPMENT },
    { label: 'Nội dung',     icon: '🖼️', path: ROUTES.ADMIN_CONTENT },
    { label: 'Doanh thu',    icon: '💰', path: ROUTES.ADMIN_REVENUE },
    { label: 'Cài đặt',      icon: '🔧', path: ROUTES.ADMIN_SETTINGS },
] as const;

interface AdminSidebarProps {
    onNavigate?: () => void;
}

const AdminSidebar = ({ onNavigate }: AdminSidebarProps) => {
    return (
        <nav className="admin-sidebar">

            <div className="admin-sidebar-logo">
                <span className="admin-sidebar-logo-icon">🏋️</span>
                <span className="admin-sidebar-logo-text">GYM MANAGER</span>
            </div>

            <ul className="admin-sidebar-menu">
                {MENU_ITEMS.map((item) => (
                    <li key={item.path}>
                        <NavLink
                            to={item.path}
                            onClick={onNavigate}
                            className={({ isActive }) =>
                                `admin-sidebar-item${isActive ? ' active' : ''}`
                            }
                        >
                            <span className="admin-sidebar-icon">{item.icon}</span>
                            <span className="admin-sidebar-label">{item.label}</span>
                        </NavLink>
                    </li>
                ))}
            </ul>

        </nav>
    );
};

export default AdminSidebar;