// src/components/customer/ClassesSection.tsx
import React, { useState } from 'react';
import useClasses from '../../hooks/useClasses';
import ClassCard from './ClassCard';

const PAGE_SIZE = 4;

const ClassesSection: React.FC = () => {
    const { classes, isLoading, error } = useClasses();
    const [page, setPage] = useState(1);

    const totalPages  = Math.ceil(classes.length / PAGE_SIZE);
    const pagedClasses = classes.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    if (isLoading) return <p className="loading-text">Đang tải...</p>;
    if (error)     return <p className="alert alert--error">{error}</p>;
    if (classes.length === 0) return <p className="empty-text">Bạn chưa tham gia lớp học nào.</p>;

    return (
        <section className="profile-section">
            <div className="section-header">
                <h2 className="section-title">Lớp học & Điểm danh</h2>
            </div>

            <div className="class-list">
                {pagedClasses.map(classItem => (
                    <ClassCard key={classItem.id} classItem={classItem} />
                ))}
            </div>

            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        className="pagination__btn"
                        onClick={() => setPage(p => p - 1)}
                        disabled={page === 1}
                        aria-label="Trang trước"
                    >
                        ‹
                    </button>
                    <span className="pagination__info">{page} / {totalPages}</span>
                    <button
                        className="pagination__btn"
                        onClick={() => setPage(p => p + 1)}
                        disabled={page === totalPages}
                        aria-label="Trang sau"
                    >
                        ›
                    </button>
                </div>
            )}
        </section>
    );
};

export default ClassesSection;