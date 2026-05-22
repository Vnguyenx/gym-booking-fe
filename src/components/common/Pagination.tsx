import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    maxVisible?: number;
}

const Pagination: React.FC<PaginationProps> = ({
                                                   currentPage,
                                                   totalPages,
                                                   onPageChange,
                                                   maxVisible = 1,
                                               }) => {
    if (totalPages <= 1) return null;

    // Hàm tạo mảng số trang cần hiển thị (có xử lý dấu ...)
    const getPageNumbers = (): (number | '...')[] => {
        const pages: (number | '...')[] = [];
        const half = Math.floor(maxVisible / 2);
        let start = Math.max(1, currentPage - half);
        let end = Math.min(totalPages, currentPage + half);

        if (end - start + 1 < maxVisible) {
            if (start === 1) end = Math.min(totalPages, start + maxVisible - 1);
            else if (end === totalPages) start = Math.max(1, end - maxVisible + 1);
        }

        if (start > 1) {
            pages.push(1);
            if (start > 2) pages.push('...');
        }

        for (let i = start; i <= end; i++) pages.push(i);

        if (end < totalPages) {
            if (end < totalPages - 1) pages.push('...');
            pages.push(totalPages);
        }

        return pages;
    };

    const pages = getPageNumbers();

    return (
        <div className="pagination">
            <button
                className="pagination__arrow"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Trang trước"
            >
                ‹
            </button>

            {pages.map((page, idx) =>
                    page === '...' ? (
                        <span key={`dots-${idx}`} className="pagination__dots">
            ...
          </span>
                    ) : (
                        <button
                            key={page}
                            className={`pagination__number ${currentPage === page ? 'active' : ''}`}
                            onClick={() => onPageChange(page as number)}
                        >
                            {page}
                        </button>
                    )
            )}

            <button
                className="pagination__arrow"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Trang sau"
            >
                ›
            </button>
        </div>
    );
};

export default Pagination;