// src/components/common/Pagination.tsx
// Component phân trang dùng chung — nhận props từ usePagination

import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    goTo: (page: number) => void;
    prev: () => void;
    next: () => void;
    hasPrev: boolean;
    hasNext: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
                                                   currentPage,
                                                   totalPages,
                                                   goTo,
                                                   prev,
                                                   next,
                                                   hasPrev,
                                                   hasNext,
                                               }) => {
    return (
        <div className="pagination">
            {/* Nút về trang trước */}
            <button
                className="pagination__btn"
                onClick={prev}
                disabled={!hasPrev}
                aria-label="Trang trước"
            >
                ←
            </button>

            {/* Số trang */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                    key={page}
                    className={`pagination__btn ${currentPage === page ? 'active' : ''}`}
                    onClick={() => goTo(page)}
                    aria-label={`Trang ${page}`}
                    aria-current={currentPage === page ? 'page' : undefined}
                >
                    {page}
                </button>
            ))}

            {/* Nút sang trang sau */}
            <button
                className="pagination__btn"
                onClick={next}
                disabled={!hasNext}
                aria-label="Trang sau"
            >
                →
            </button>
        </div>
    );
};

export default Pagination;