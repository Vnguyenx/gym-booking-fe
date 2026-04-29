import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

// Dùng chung cấu hình link với Navbar
const NAV_LINKS = [
    { href: '#about',     spy: 'about',     label: 'Giới thiệu' },
    { href: '#equipment', spy: 'equipment',  label: 'Dụng cụ'    },
    { href: '#pt',        spy: 'pt',         label: 'PT'          },
    { href: '#pricing',   spy: 'pricing',    label: 'Bảng giá'   },
];

const Footer = () => {
    const location = useLocation();
    const isHome = location.pathname === ROUTES.HOME || location.pathname === '/';

    // ── Xử lý click link hash (giống Navbar) ────────────────────────
    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, spyId: string) => {
        e.preventDefault();

        if (isHome) {
            // Đang ở Home → smooth scroll tới section
            const target = document.getElementById(spyId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } else {
            // Đang ở trang chi tiết → reload lại trang hiện tại
            window.location.reload();
        }
    };

    return (
        <footer className="footer" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '4rem 0 2rem' }}>
            <div className="container">
                <div className="footer__grid">
                    {/* Brand Section */}
                    <div className="footer__brand">
                        <Link to={ROUTES.HOME} className="footer__logo">
                            GYM<span>XYZ</span>
                        </Link>
                        <p className="footer__tagline">
                            Hệ thống phòng tập hiện đại bậc nhất TPHCM. <br/>
                            Nâng tầm sức khỏe, khẳng định bản thân.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="footer__col">
                        <h4 className="footer__col-title">Khám phá</h4>
                        <div className="footer__links">
                            {NAV_LINKS.map(link => (
                                <a
                                    key={link.spy}
                                    href={link.href}
                                    onClick={(e) => handleNavClick(e, link.spy)}
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Support Links */}
                    <div className="footer__col">
                        <h4 className="footer__col-title">Hỗ trợ</h4>
                        <div className="footer__links">
                            <Link to={ROUTES.LOGIN}>Đăng nhập</Link>
                            <Link to={ROUTES.REGISTER}>Tạo tài khoản</Link>
                            <a href="#">Điều khoản</a>
                            <a href="#">Chính sách bảo mật</a>
                        </div>
                    </div>

                    <div className="footer__col">
                        <h4 className="footer__col-title">Liên hệ</h4>
                        <div className="footer__links">
                            <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Hotline: 090 123 4567</span>
                            <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Email: contact@gymxyz.vn</span>
                            <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                                Địa chỉ: Quận 1, TP. Hồ Chí Minh
                            </span>
                        </div>
                    </div>
                </div>

                <hr className="divider" style={{ opacity: 0.5, margin: '2rem 0 1.5rem' }} />

                <div className="footer__bottom" style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
                        © 2026 GymXYZ.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;