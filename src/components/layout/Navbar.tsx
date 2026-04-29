import React, {useEffect, useState} from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import useNavbar from '../../hooks/useNavbar';
import '../../styles/layout/navbar.css';
import { useGymData } from '../../hooks/useGymData';

// ─────────────────────────────────────────────
// Danh sách link menu — chỉnh ở đây nếu muốn thêm/bớt mục
// ─────────────────────────────────────────────
const NAV_LINKS = [
    { href: '#about',     spy: 'about',     label: 'Giới thiệu' },
    { href: '#equipment', spy: 'equipment',  label: 'Dụng cụ'    },
    { href: '#pt',        spy: 'pt',         label: 'PT'          },
    { href: '#pricing',   spy: 'pricing',    label: 'Bảng giá'   },
];

    const Navbar: React.FC = () => {
        const { isDrawerOpen, isLoggedIn, firstName, toggleDrawer, closeDrawer } = useNavbar();
        const { gymInfo } = useGymData();
        const location = useLocation();
        const isHome = location.pathname === ROUTES.HOME || location.pathname === '/';

        // State để lưu section đang active nhằm render lại UI mượt mà
        const [activeSection, setActiveSection] = useState<string | null>(null);

        // ── Intersection Observer Logic (Thay thế Scroll cũ) ────────────────
        useEffect(() => {
            if (!isHome) return;

            // Cấu hình: Trigger khi section chiếm 40% màn hình
            const observerOptions = {
                root: null,
                rootMargin: '-20% 0px -40% 0px', // Thu hẹp vùng quét để chính xác hơn
                threshold: 0,
            };

            const observerCallback = (entries: IntersectionObserverEntry[]) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            };

            const observer = new IntersectionObserver(observerCallback, observerOptions);

            // Theo dõi các section dựa trên spy ID trong NAV_LINKS
            NAV_LINKS.forEach((link) => {
                const section = document.getElementById(link.spy);
                if (section) observer.observe(section);
            });

            return () => observer.disconnect();
        }, [isHome]);

        // ── Xử lý click link nav (Mượt hơn) ─────────────────────────────────
        const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: typeof NAV_LINKS[0]) => {
            e.preventDefault();

            if (isHome) {
                const target = document.getElementById(link.spy);
                if (target) {
                    // Tính toán offset nếu navbar của bạn là sticky (ví dụ cao 70px)
                    const offset = 60;
                    const bodyRect = document.body.getBoundingClientRect().top;
                    const elementRect = target.getBoundingClientRect().top;
                    const elementPosition = elementRect - bodyRect;
                    const offsetPosition = elementPosition - offset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            } else {
                // Nếu không ở Home, điều hướng về home kèm hash
                window.location.href = `/${link.href}`;
            }
            closeDrawer();
        };

    return (
        <>
            {/* ════════════════════════════════════════
                HEADER — Thanh nav sticky trên cùng
            ════════════════════════════════════════ */}
            <header className="navbar" id="navbar" role="banner">
                <div className="navbar__inner">

                    {/* Logo */}
                    <Link to={ROUTES.HOME} className="navbar__logo" aria-label="GymXYZ trang chủ">
                        <span>{gymInfo?.name}</span>
                    </Link>

                    {/* Menu ngang — ẩn trên mobile, hiện từ tablet */}
                    <nav className="navbar__links" aria-label="Menu chính">
                        {NAV_LINKS.map(link => (
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

                    {/* Nhóm action bên phải */}
                    <div className="navbar__actions">
                        {isLoggedIn ? (
                            <Link to={ROUTES.MY_PROFILE} className="btn btn-ghost btn-sm">
                                Chào, {firstName}
                            </Link>
                        ) : (
                            <>
                                <Link to={ROUTES.LOGIN} className="btn btn-ghost btn-sm">
                                    Đăng nhập
                                </Link>
                                <Link to={ROUTES.REGISTER} className="btn btn-red btn-sm">
                                    Đăng ký
                                </Link>
                            </>
                        )}

                        {/* Hamburger — chỉ hiện trên mobile */}
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

            {/* ════════════════════════════════════════
                DRAWER — Mobile only
            ════════════════════════════════════════ */}
            <nav
                className={`navbar__drawer${isDrawerOpen ? ' open' : ''}`}
                aria-label="Menu di động"
                aria-hidden={!isDrawerOpen}
            >
                {NAV_LINKS.map(link => (
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
                        <Link to={ROUTES.MY_PROFILE} className="btn btn-ghost btn-full" onClick={closeDrawer}>
                            Trang cá nhân
                        </Link>
                    ) : (
                        <>
                            <Link to={ROUTES.LOGIN} className="btn btn-ghost btn-full" onClick={closeDrawer}>
                                Đăng nhập
                            </Link>
                            <Link to={ROUTES.REGISTER} className="btn btn-red btn-full" onClick={closeDrawer}>
                                Đăng ký ngay
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </>
    );
};

export default Navbar;