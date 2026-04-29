import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Equipment } from '../../types/models';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import '../../styles/home/equipment-detail.css';

const EquipmentDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const navigate = useNavigate();

    const [item, setItem] = useState<Equipment | null>(
        (location.state as { equipment?: Equipment })?.equipment ?? null
    );
    const [loading, setLoading] = useState(!item);
    const [activeImg, setActiveImg] = useState(0);

    useEffect(() => {
        if (item) return;
        if (!id) return;

        const fetch = async () => {
            setLoading(true);
            try {
                const snap = await getDoc(doc(db, 'equipment', id));
                if (snap.exists()) {
                    setItem({ id: snap.id, ...snap.data() } as Equipment);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [id, item]);

    if (loading) return (
        <div className="eq-detail__loading">
            <Navbar />
            <div className="eq-detail__loading-body">
                <div className="eq-detail__spinner" />
                <p>Đang tải thiết bị...</p>
            </div>
            <Footer />
        </div>
    );

    if (!item) return (
        <div>
            <Navbar />
            <div className="eq-detail__not-found">
                <p>Không tìm thấy thiết bị.</p>
                <button onClick={() => navigate(-1)} className="eq-detail__back-btn">← Quay lại</button>
            </div>
            <Footer />
        </div>
    );

    const isActive = item.isActive;
    const images = item.imageUrls?.length ? item.imageUrls : ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800'];

    const handlePrev = () => setActiveImg(i => (i - 1 + images.length) % images.length);
    const handleNext = () => setActiveImg(i => (i + 1) % images.length);

    return (
        <div className="eq-detail-page">
            <Navbar />

            <main className="eq-detail__main">


                <div className="eq-detail__breadcrumb container">

                </div>

                <div className="container eq-detail__layout">

                    {/* ── CỘT TRÁI: Gallery ── */}
                    <div className="eq-detail__gallery">
                        {/* Ảnh chính */}
                        <div className="eq-detail__main-img-wrap">
                            <img
                                src={images[activeImg]}
                                alt={item.nameVi}
                                className="eq-detail__main-img"
                            />
                            <span className={`eq-detail__status-badge ${isActive ? 'active' : 'maintenance'}`}>
                                {isActive ? '● Sẵn sàng' : '● Bảo trì'}
                            </span>

                            {/* Nút prev/next — chỉ hiện nếu có > 1 ảnh */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        className="eq-detail__nav-btn eq-detail__nav-btn--prev"
                                        onClick={handlePrev}
                                        aria-label="Ảnh trước"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <button
                                        className="eq-detail__nav-btn eq-detail__nav-btn--next"
                                        onClick={handleNext}
                                        aria-label="Ảnh tiếp"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>

                                    {/* Dot indicators */}
                                    <div className="eq-detail__dots">
                                        {images.map((_, i) => (
                                            <button
                                                key={i}
                                                className={`eq-detail__dot ${i === activeImg ? 'active' : ''}`}
                                                onClick={() => setActiveImg(i)}
                                                aria-label={`Ảnh ${i + 1}`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Thumbnails — chỉ hiện nếu có > 1 ảnh */}
                        {images.length > 1 && (
                            <div className="eq-detail__thumbnails">
                                {images.map((url, i) => (
                                    <button
                                        key={i}
                                        className={`eq-detail__thumb ${i === activeImg ? 'active' : ''}`}
                                        onClick={() => setActiveImg(i)}
                                    >
                                        <img src={url} alt={`${item.nameVi} ${i + 1}`} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── CỘT PHẢI: Info ── */}
                    <div className="eq-detail__info">


                        {/* Category + SubCategory */}
                        <div className="eq-detail__cats">

                            <button onClick={() => navigate(-1)} className="eq-detail__back-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
                                </svg>
                                Quay lại
                            </button>

                            <span className="eq-detail__cat-tag">{item.category}</span>
                            {item.subCategory && (
                                <span className="eq-detail__subcat-tag">{item.subCategory}</span>
                            )}
                        </div>

                        {/* Tên */}
                        <h1 className="eq-detail__name">{item.nameVi}</h1>
                        {item.name !== item.nameVi && (
                            <p className="eq-detail__name-en">{item.name}</p>
                        )}

                        {/* Stats nhanh */}
                        <div className="eq-detail__stats">
                            <div className="eq-detail__stat">
                                <span className="eq-detail__stat-value">{item.quantity}</span>
                                <span className="eq-detail__stat-label">Số lượng</span>
                            </div>
                            <div className="eq-detail__stat-divider" />
                            <div className="eq-detail__stat">
                                <span className="eq-detail__stat-value">{item.muscleGroups.length}</span>
                                <span className="eq-detail__stat-label">Nhóm cơ</span>
                            </div>
                            <div className="eq-detail__stat-divider" />
                            <div className="eq-detail__stat">
                                <span className={`eq-detail__stat-value ${isActive ? 'text-green' : 'text-red'}`}>
                                    {isActive ? 'OK' : '!'}
                                </span>
                                <span className="eq-detail__stat-label">Trạng thái</span>
                            </div>
                        </div>

                        {/* Mô tả */}
                        {item.description && (
                            <div className="eq-detail__block">
                                <h3 className="eq-detail__block-title">Mô tả</h3>
                                <p className="eq-detail__desc">{item.description}</p>
                            </div>
                        )}

                        {/* Nhóm cơ */}
                        {item.muscleGroups.length > 0 && (
                            <div className="eq-detail__block">
                                <h3 className="eq-detail__block-title">Nhóm cơ tác động</h3>
                                <div className="eq-detail__muscle-tags">
                                    {item.muscleGroups.map((m, i) => (
                                        <span key={i} className="eq-detail__muscle-tag">{m}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tips */}
                        {item.tips && (
                            <div className="eq-detail__tips">
                                <span className="eq-detail__tips-icon">💡</span>
                                <div>
                                    <h4 className="eq-detail__tips-title">Lưu ý khi sử dụng</h4>
                                    <p className="eq-detail__tips-text">{item.tips}</p>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default EquipmentDetailPage;