// src/components/layout/Navbar.tsx
//
// Thay đổi so với bản cũ:
//   - Dùng getRoleHomePath() để lấy đường dẫn dashboard đúng theo role
//   - PT → /pt/dashboard, Admin → /admin/dashboard, Customer → /profile
//   - Label cũng thay đổi theo role cho thân thiện hơn

import React, { useEffect, useState } from 'react';
import { Link, useLocation }          from 'react-router-dom';
import { ROUTES }                     from '../../constants/routes';
import useNavbar                      from '../../hooks/useNavbar';
import { getRoleHomePath }            from '../../hooks/useRoleRedirect';
import '../../styles/layout/navbar.css';
import { useGymData } from '../../hooks/useGymData';

// ─── Danh sách link menu ──────────────────────────────────────────────────────

const NAV_LINKS = [
    { href: '#equipment', spy: 'equipment',  label: 'Dụng cụ'    },
    { href: '#pt',        spy: 'pt',         label: 'PT'          },
    { href: '#pricing',   spy: 'pricing',    label: 'Bảng giá'   },
    { href: '#about',     spy: 'about',     label: 'Giới thiệu' },
];

// ─── Label hiển thị theo role ─────────────────────────────────────────────────

function getRoleLabel(role: string | undefined, firstName: string): string {
    switch (role) {
        case 'pt':    return `Dashboard`;       // PT có trang riêng
        case 'admin': return `Quản lý`;
        default:      return `Chào, ${firstName}`;  // customer
    }
}

// ─── Component ────────────────────────────────────────────────────────────────

const Navbar: React.FC = () => {
    const { isDrawerOpen, isLoggedIn, firstName, toggleDrawer, closeDrawer, user } = useNavbar();
    const { gymInfo }  = useGymData();
    const location     = useLocation();
    const isHome       = location.pathname === ROUTES.HOME || location.pathname === '/';

    const [activeSection, setActiveSection] = useState<string | null>(null);

    // Đường dẫn + label theo role — tính 1 lần, dùng ở cả header và drawer
    const profilePath  = getRoleHomePath(user?.role);
    const profileLabel = getRoleLabel(user?.role, firstName);

    // ── Intersection Observer ────────────────────────────────────────────────
    useEffect(() => {
        if (!isHome) return;

        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -40% 0px',
            threshold: 0,
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) setActiveSection(entry.target.id);
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        NAV_LINKS.forEach((link) => {
            const section = document.getElementById(link.spy);
            if (section) observer.observe(section);
        });

        return () => observer.disconnect();
    }, [isHome]);

    // ── Smooth scroll ────────────────────────────────────────────────────────
    const handleNavClick = (
        e: React.MouseEvent<HTMLAnchorElement>,
        link: (typeof NAV_LINKS)[0],
    ) => {
        e.preventDefault();

        if (isHome) {
            const target = document.getElementById(link.spy);
            if (target) {
                const offset         = 60;
                const bodyRect       = document.body.getBoundingClientRect().top;
                const elementRect    = target.getBoundingClientRect().top;
                const offsetPosition = elementRect - bodyRect - offset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        } else {
            window.location.href = `${process.env.PUBLIC_URL}/${link.href}`;  // ← sửa chỗ này
        }
        closeDrawer();
    };

    return (
        <>
            {/* ── Header ── */}
            <header className="navbar" id="navbar" role="banner">
                <div className="navbar__inner">

                    {/* Logo */}
                    <Link to={ROUTES.HOME} className="navbar__logo" aria-label="GymXYZ trang chủ">
                        <span>{gymInfo?.name}</span>
                    </Link>

                    {/* Menu ngang */}
                    <nav className="navbar__links" aria-label="Menu chính">
                        {NAV_LINKS.map((link) => (
                            <a
                                key={link.spy}
                                href={link.href}
                                data-spy={link.spy}
                                className={activeSection === link.spy ? 'nav-active' : ''}
                                onClick={(e) => handleNavClick(e, link)}
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>

                    {/* Actions bên phải */}
                    <div className="navbar__actions">
                        {isLoggedIn ? (
                            /*
                             * Đã đăng nhập:
                             *   customer → /profile
                             *   pt       → /pt/dashboard
                             *   admin    → /admin/dashboard
                             */
                            <Link to={profilePath} className="btn btn-ghost btn-sm">
                                {profileLabel}
                            </Link>
                        ) : (
                            <>
                                <Link to={ROUTES.LOGIN}    className="btn btn-ghost btn-sm">Đăng nhập</Link>
                                <Link to={ROUTES.REGISTER} className="btn btn-red btn-sm">Đăng ký</Link>
                            </>
                        )}

                        {/* Hamburger */}
                        <button
                            className={`navbar__burger${isDrawerOpen ? ' open' : ''}`}
                            aria-label={isDrawerOpen ? 'Đóng menu' : 'Mở menu'}
                            aria-expanded={isDrawerOpen}
                            onClick={toggleDrawer}
                        >
                            <span /><span /><span />
                        </button>
                    </div>
                </div>
            </header>

            {/* ── Drawer mobile ── */}
            <nav
                className={`navbar__drawer${isDrawerOpen ? ' open' : ''}`}
                aria-label="Menu di động"
                aria-hidden={!isDrawerOpen}
            >
                {NAV_LINKS.map((link) => (
                    <a
                        key={link.spy}
                        href={link.href}
                        data-spy={link.spy}
                        onClick={(e) => handleNavClick(e, link)}
                    >
                        {link.label}
                    </a>
                ))}

                <div className="navbar__drawer-actions">
                    {isLoggedIn ? (
                        <Link
                            to={profilePath}
                            className="btn btn-ghost btn-full"
                            onClick={closeDrawer}
                        >
                            {profileLabel}
                        </Link>
                    ) : (
                        <>
                            <Link to={ROUTES.LOGIN}    className="btn btn-ghost btn-full" onClick={closeDrawer}>Đăng nhập</Link>
                            <Link to={ROUTES.REGISTER} className="btn btn-red btn-full"   onClick={closeDrawer}>Đăng ký ngay</Link>
                        </>
                    )}
                </div>
            </nav>
        </>
    );
};

export default Navbar;