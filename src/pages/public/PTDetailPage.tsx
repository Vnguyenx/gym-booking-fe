import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { PT } from '../../types/models';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { ROUTES } from '../../constants/routes';
import '../../styles/home/pt-detail.css';

const PTDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const navigate = useNavigate();

    // Tận dụng data truyền từ PTCard sang (nếu có) để hiển thị ngay lập tức
    const [pt, setPt] = useState<PT | null>(
        (location.state as { pt?: PT })?.pt ?? null
    );
    const [loading, setLoading] = useState(!pt);

    useEffect(() => {
        // Nếu đã có data từ location.state thì không cần gọi Firebase nữa
        if (pt) return;
        if (!id) return;

        const fetchPT = async () => {
            setLoading(true);
            try {
                const snap = await getDoc(doc(db, 'pts', id));
                if (snap.exists()) {
                    setPt({ id: snap.id, ...snap.data() } as PT);
                }
            } catch (e) {
                console.error("Lỗi khi lấy thông tin PT:", e);
            } finally {
                setLoading(false);
            }
        };
        fetchPT();
    }, [id, pt]);

    if (loading) {
        return (
            <div className="pt-detail-page">
                <Navbar />
                <div className="pt-detail__loading-body">
                    <div className="pt-detail__spinner"></div>
                    <p>Đang tải hồ sơ huấn luyện viên...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (!pt) {
        return (
            <div className="pt-detail-page">
                <Navbar />
                <div className="pt-detail__not-found">
                    <h2>Không tìm thấy Huấn luyện viên</h2>
                    <button className="btn-ghost" onClick={() => navigate(ROUTES.PT_LIST)}>
                        Quay lại danh sách
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="pt-detail-page">
            <Navbar />

            <main className="container pt-detail__main">
                {/* ── Breadcrumb / Nút quay lại ── */}
                <div className="pt-detail__breadcrumb">
                    <button onClick={() => navigate(-1)} className="pt-detail__back-btn">
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Trở lại danh sách
                    </button>
                </div>

                <div className="pt-detail__layout">
                    {/* ── CỘT TRÁI: Ảnh Avatar ── */}
                    <div className="pt-detail__left">
                        <div className="pt-detail__avatar-wrap">
                            <img
                                src={pt.avatar}
                                alt={pt.fullName}
                                className="pt-detail__avatar"
                            />
                            <span className={`pt-detail__badge ${pt.isAvailable ? 'badge--online' : 'badge--busy'}`}>
                                {pt.isAvailable ? 'Sẵn sàng nhận học viên' : 'Đang kín lịch'}
                            </span>
                        </div>
                    </div>

                    {/* ── CỘT PHẢI: Thông tin chi tiết ── */}
                    <div className="pt-detail__right">
                        <div className="pt-detail__header">
                            <p className="pt-detail__gender">{pt.gender}</p>
                            <h1 className="pt-detail__name">{pt.fullName}</h1>
                        </div>

                        {/* Số năm kinh nghiệm */}
                        {pt.experience && (
                            <div className="pt-detail__meta">
                                <span className="meta-icon">🏅</span>
                                <span><strong>Kinh nghiệm:</strong> {pt.experience}</span>
                            </div>
                        )}

                        {/* Phân cách */}
                        <hr className="pt-detail__divider" />

                        {/* Chuyên môn (Specialties) */}
                        {pt.specialty && pt.specialty.length > 0 && (
                            <div className="pt-detail__block">
                                <h3 className="pt-detail__block-title">Chuyên môn</h3>
                                <div className="pt-detail__specialties">
                                    {pt.specialty.map((s, i) => (
                                        <span key={i} className="pt-detail__specialty-tag">{s}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tiểu sử / Giới thiệu */}
                        {pt.bio && (
                            <div className="pt-detail__block">
                                <h3 className="pt-detail__block-title">Giới thiệu</h3>
                                <p className="pt-detail__bio">{pt.bio}</p>
                            </div>
                        )}

                        {/* Nút hành động */}
                        <div className="pt-detail__action">
                            <button
                                className="btn-red pt-detail__cta"
                                disabled={!pt.isAvailable}
                                onClick={() => alert(`Tính năng đặt lịch với PT ${pt.fullName} đang được phát triển!`)}
                            >
                                {pt.isAvailable ? 'Đăng ký tập cùng PT' : 'Hiện đang kín lịch'}
                            </button>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default PTDetailPage;