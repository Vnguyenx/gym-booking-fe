import React from 'react';
import { useFirestore } from '../../hooks/useFirestore';
import { useSlideshow } from '../../hooks/useSlideshow';
import { Banner } from '../../types/models';
import '../../styles/hero.css';


const BannerSection: React.FC = () => {
    const { data: allBanners, loading } = useFirestore<Banner>('banners', true);

    // Lọc isActive + sắp xếp theo order
    const banners = allBanners
        .filter(b => b.isActive)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    // Toàn bộ logic slideshow nằm trong hook
    const { currentIndex, goToSlide, handlers } = useSlideshow({
        total:   banners.length,
        enabled: !loading,
    });

    if (loading) return <div style={{ height: '100svh', background: '#111' }} />;
    if (banners.length === 0) return null;

    return (
        <section
            className="hero"
            id="hero"
            aria-label="Sự kiện và thông báo"
            {...handlers}
        >
            <div className="hero__slides">
                {banners.map((banner, index) => (
                    <div
                        key={banner.id || index}
                        className={`hero__slide${index === currentIndex ? ' active' : ''}`}
                        role="group"
                        aria-label={`Slide ${index + 1}/${banners.length}`}
                    >
                        {/* Ảnh nền */}
                        <div
                            className="hero__slide-bg"
                            style={{ backgroundImage: `url('${banner.imageUrl}')` }}
                        />

                        <div className="hero__slide-content">
                            {/* Tag — cố định vì DB chưa có trường này */}
                            <span className="hero__event-tag hot">
                                <span className="hero__event-tag-dot" />
                                Tin mới nhất
                            </span>

                            <h1
                                className="hero__title"
                                dangerouslySetInnerHTML={{ __html: banner.title }}
                            />
                            <p
                                className="hero__desc"
                                dangerouslySetInnerHTML={{ __html: banner.subtitle }}
                            />

                            <div className="hero__cta">
                                {banner.link && (
                                    <a href={banner.link} className="btn btn-red btn-lg">
                                        Khám phá ngay
                                    </a>
                                )}
                                <a href="#pricing" className="btn btn-ghost btn-lg">
                                    Xem bảng giá
                                </a>
                            </div>

                            <p className="hero__expires">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Đang diễn ra
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Prev */}
            <button
                className="hero__arrow hero__arrow-prev"
                onClick={() => goToSlide(currentIndex - 1)}
                aria-label="Slide trước"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            {/* Next */}
            <button
                className="hero__arrow hero__arrow-next"
                onClick={() => goToSlide(currentIndex + 1)}
                aria-label="Slide tiếp"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Dots */}
            <div className="hero__dots" role="tablist">
                {banners.map((_, index) => (
                    <button
                        key={index}
                        className={`hero__dot${index === currentIndex ? ' active' : ''}`}
                        onClick={() => goToSlide(index)}
                        aria-label={`Slide ${index + 1}`}
                        role="tab"
                        aria-selected={index === currentIndex}
                    />
                ))}
            </div>
        </section>
    );
};

export default BannerSection;