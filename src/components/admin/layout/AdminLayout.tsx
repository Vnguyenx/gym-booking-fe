// src/components/admin/layout/AdminLayout.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { ROUTES } from '../../../constants/routes';
import '../../../styles/admin/AdminLayout.css';


interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const openMenu  = () => setIsMobileMenuOpen(true);
    const closeMenu = () => setIsMobileMenuOpen(false);

    return (
        <div className="admin-layout-wrapper">

            {/* Sidebar desktop */}
            <aside className="admin-layout-sidebar">
                <AdminSidebar onNavigate={closeMenu} />
            </aside>

            {/* Overlay + Drawer mobile */}
            {isMobileMenuOpen && (
                <div className="admin-layout-overlay" onClick={closeMenu}>
                    <aside
                        className="admin-layout-drawer"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <AdminSidebar onNavigate={closeMenu} />
                    </aside>
                </div>
            )}

            {/* Vùng nội dung chính */}
            <div className="admin-layout-main">

                {/* Topbar mobile */}
                <header className="admin-layout-mobile-topbar">
                    <button
                        className="admin-layout-menu-btn"
                        onClick={openMenu}
                        aria-label="Mở menu"
                    >
                        ☰
                    </button>
                    <span className="admin-layout-mobile-title">GYM MANAGER</span>
                    {/* Nút back về trang chủ — bên phải topbar mobile */}
                    <button
                        className="admin-layout-back-btn"
                        onClick={() => navigate(ROUTES.HOME)}
                        aria-label="Về trang chủ"
                    >
                        ← Trang chủ
                    </button>
                </header>

                {/* Nội dung page */}
                <main className="admin-layout-content">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;