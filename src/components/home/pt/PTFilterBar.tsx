import React, { useRef, useState, useEffect } from 'react';

interface PTFilterBarProps {
    searchTerm: string;
    setSearchTerm: (val: string) => void;
    genders: string[]; // Danh sách giới tính (Nam, Nữ, Tất cả...)
    selectedGender: string;
    setSelectedGender: (gender: string) => void;
}

const SCROLL_AMOUNT = 200;

const PTFilterBar: React.FC<PTFilterBarProps> = ({
                                                     searchTerm, setSearchTerm, genders, selectedGender, setSelectedGender
                                                 }) => {
    const pillsRef = useRef<HTMLDivElement>(null);
    const [showArrows, setShowArrows] = useState(false);

    // Xử lý hiện mũi tên nếu danh sách giới tính quá dài (trên mobile)
    useEffect(() => {
        const el = pillsRef.current;
        if (!el) return;
        const check = () => setShowArrows(el.scrollWidth > el.clientWidth);
        check();
        const ro = new ResizeObserver(check);
        ro.observe(el);
        return () => ro.disconnect();
    }, [genders]);

    const scrollPills = (dir: 'left' | 'right') => {
        pillsRef.current?.scrollBy({ left: dir === 'right' ? SCROLL_AMOUNT : -SCROLL_AMOUNT, behavior: 'smooth' });
    };

    return (
        <div className="filter-bar-wrapper">
            <div className="container filter-bar-inner">
                {/* Ô tìm kiếm */}
                <div className="search-box">
                    <svg className="search-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Tìm theo tên hoặc chuyên môn (VD: Giảm mỡ)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Các nút bấm chọn giới tính (Pills) */}
                <div className="pills-container">
                    {showArrows && (
                        <button className="pill-arrow" onClick={() => scrollPills('left')} aria-label="Cuộn trái">
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}

                    <div className="pills-scroll" ref={pillsRef}>
                        {genders.map((gender) => (
                            <button
                                key={gender}
                                className={`pill-btn ${selectedGender === gender ? 'active' : ''}`}
                                onClick={() => setSelectedGender(gender)}
                            >
                                {gender}
                            </button>
                        ))}
                    </div>

                    {showArrows && (
                        <button className="pill-arrow" onClick={() => scrollPills('right')} aria-label="Cuộn phải">
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PTFilterBar;