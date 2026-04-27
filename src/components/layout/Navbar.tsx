import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import useNavbar from '../../hooks/useNavbar';
import '../../styles/navbar.css';
import { useGymData } from '../../hooks/useGymData';

// ─────────────────────────────────────────────
// Danh sách link menu — chỉnh ở đây nếu muốn thêm/bớt mục
// ─────────────────────────────────────────────
const NAV_LINKS = [
    { href: '#about',     spy: 'about',     label: 'Giới thiệu' },
    { href: '#equipment', spy: 'equipment',  label: 'Dụng cụ'    },
    { href: '#pricing',   spy: 'pricing',    label: 'Bảng giá'   },
    { href: '#pt',        spy: 'pt',         label: 'PT'          },
];

const Navbar: React.FC = () => {
    const {
        isDrawerOpen,
        isLoggedIn,
        firstName,
        toggleDrawer,
        closeDrawer,
    } = useNavbar();

    const { gymInfo } = useGymData();

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

                    {/* Menu ngang — ẩn trên mobile, hiện từ tablet (xem navbar.css) */}
                    <nav className="navbar__links" aria-label="Menu chính">
                        {NAV_LINKS.map(link => (
                            <a key={link.spy} href={link.href} data-spy={link.spy}>
                                {link.label}
                            </a>
                        ))}
                    </nav>

                    {/* Nhóm action bên phải */}
                    <div className="navbar__actions">

                        {/* Nút đăng nhập / thông tin user */}
                        {isLoggedIn ? (
                            // Đã đăng nhập → hiện tên, click vào trang cá nhân
                            <Link to={ROUTES.MY_PROFILE} className="btn btn-ghost btn-sm">
                                Chào, {firstName}
                            </Link>
                        ) : (
                            // Chưa đăng nhập → hiện 2 nút
                            <>
                                <Link to={ROUTES.LOGIN} className="btn btn-ghost btn-sm">
                                    Đăng nhập
                                </Link>
                                <Link to={ROUTES.REGISTER} className="btn btn-red btn-sm">
                                    Đăng ký
                                </Link>
                            </>
                        )}

                        {/* Nút hamburger — chỉ hiện trên mobile */}
                        <button
                            className={`navbar__burger${isDrawerOpen ? ' open' : ''}`}
                            aria-label={isDrawerOpen ? 'Đóng menu' : 'Mở menu'}
                            aria-expanded={isDrawerOpen}
                            onClick={toggleDrawer}
                        >
                            {/* 3 thanh gạch — CSS animate thành dấu X khi class "open" */}
                            <span /><span /><span />
                        </button>

                    </div>
                </div>
            </header>


            {/* ════════════════════════════════════════
                DRAWER — Menu trượt từ trái (mobile only)
                Nằm ngoài <header> để không bị z-index cắt
            ════════════════════════════════════════ */}
            <nav
                className={`navbar__drawer${isDrawerOpen ? ' open' : ''}`}
                aria-label="Menu di động"
                aria-hidden={!isDrawerOpen}
            >
                {/* Các link menu — click sẽ đóng drawer */}
                {NAV_LINKS.map(link => (
                    <a key={link.spy} href={link.href} onClick={closeDrawer}>
                        {link.label}
                    </a>
                ))}

                {/* Nút hành động ở cuối drawer */}
                <div className="navbar__drawer-actions">
                    {isLoggedIn ? (
                        <Link
                            to={ROUTES.MY_PROFILE}
                            className="btn btn-ghost btn-full"
                            onClick={closeDrawer}
                        >
                            Trang cá nhân
                        </Link>
                    ) : (
                        <>
                            <Link
                                to={ROUTES.LOGIN}
                                className="btn btn-ghost btn-full"
                                onClick={closeDrawer}
                            >
                                Đăng nhập
                            </Link>
                            <Link
                                to={ROUTES.REGISTER}
                                className="btn btn-red btn-full"
                                onClick={closeDrawer}
                            >
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