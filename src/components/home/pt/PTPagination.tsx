import React from 'react';

interface PTPaginationProps {
    currentPage: number;
    totalPages: number;
    setCurrentPage: (page: number) => void;
}

const PTPagination: React.FC<PTPaginationProps> = ({ currentPage, totalPages, setCurrentPage }) => {
    if (totalPages <= 1) return null;

    return (
        <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                <button
                    key={num}
                    className={`page-node ${currentPage === num ? 'active' : ''}`}
                    onClick={() => {
                        setCurrentPage(num);
                        // Cuộn mượt mà lên đầu danh sách lưới khi chuyển trang
                        window.scrollTo({ top: 350, behavior: 'smooth' });
                    }}
                >
                    {num}
                </button>
            ))}
        </div>
    );
};

export default PTPagination;