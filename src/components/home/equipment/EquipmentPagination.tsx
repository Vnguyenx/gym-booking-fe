import React from 'react';

interface EquipmentPaginationProps {
    currentPage: number;
    totalPages: number;
    setCurrentPage: (page: number) => void;
}

const EquipmentPagination: React.FC<EquipmentPaginationProps> = ({
                                                                     currentPage, totalPages, setCurrentPage
                                                                 }) => {
    if (totalPages <= 1) return null;

    return (
        <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                <button
                    key={num}
                    className={`page-node ${currentPage === num ? 'active' : ''}`}
                    onClick={() => {
                        setCurrentPage(num);
                        window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                >
                    {num}
                </button>
            ))}
        </div>
    );
};

export default EquipmentPagination;