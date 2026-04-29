import React, { useRef, useState, useEffect } from 'react';

interface EquipmentFilterBarProps {
    searchTerm: string;
    setSearchTerm: (val: string) => void;
    categories: string[];
    selectedCategory: string;
    setSelectedCategory: (cat: string) => void;
    subCategories: string[];
    selectedSubCategory: string;
    setSelectedSubCategory: (sub: string) => void;
}

const SCROLL_AMOUNT = 200;

const EquipmentFilterBar: React.FC<EquipmentFilterBarProps> = ({
                                                                   searchTerm, setSearchTerm, categories, selectedCategory, setSelectedCategory,
                                                                   subCategories, selectedSubCategory, setSelectedSubCategory
                                                               }) => {
    const pillsRef = useRef<HTMLDivElement>(null);
    const [showArrows, setShowArrows] = useState(false);

    useEffect(() => {
        const el = pillsRef.current;
        if (!el) return;
        const check = () => setShowArrows(el.scrollWidth > el.clientWidth);
        check();
        const ro = new ResizeObserver(check);
        ro.observe(el);
        return () => ro.disconnect();
    }, [categories]);

    const scrollPills = (dir: 'left' | 'right') => {
        pillsRef.current?.scrollBy({ left: dir === 'right' ? SCROLL_AMOUNT : -SCROLL_AMOUNT, behavior: 'smooth' });
    };

    return (
        <div className="eq-sticky-bar">
            <div className="container">
                {/* Dòng 1: Search */}
                <div className="eq-bar-search">
                    <div className="search-box">
                        <svg className="search-icon" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Tìm kiếm thiết bị..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Dòng 2: Pills + SubCategory */}
                <div className="eq-bar-filters">
                    {showArrows && (
                        <button className="pill-arrow" onClick={() => scrollPills('left')} aria-label="Cuộn trái">
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}

                    <div className="pills-track" ref={pillsRef}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat}
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

                    {subCategories.length > 0 && (
                        <>
                            <div className="bar-divider" />
                            <select
                                className="sub-select"
                                value={selectedSubCategory}
                                onChange={(e) => setSelectedSubCategory(e.target.value)}
                            >
                                {subCategories.map(sub => (
                                    <option key={sub} value={sub}>{sub}</option>
                                ))}
                            </select>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EquipmentFilterBar;