// src/components/customer/ClassesSection.tsx
import React, { useState } from 'react';
import useClasses from '../../hooks/useClasses';
import ClassCard from './ClassCard';

const PAGE_SIZE = 4;

const ClassesSection: React.FC = () => {
    const { classes, isLoading, error, selectedClassId, selectClass, clearSelection } = useClasses();
    const [page, setPage] = useState(1);

    const totalPages  = Math.ceil(classes.length / PAGE_SIZE);
    const paged       = classes.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleSelect = (id: string) => {
        if (selectedClassId === id) clearSelection();
        else selectClass(id);
    };

    return (
        <section className="profile-section">
            <div className="section-header">
                <h2 className="section-title">Lớp học & Điểm danh</h2>
            </div>

            {isLoading ? (
                <p className="loading-text">Đang tải...</p>
            ) : error ? (
                <p className="alert alert--error">{error}</p>
            ) : classes.length === 0 ? (
                <p className="empty-text">Bạn chưa tham gia lớp học nào.</p>
            ) : (
                <>
                    <div className="class-list">
                        {paged.map((classItem) => (
                            <ClassCard
                                key={classItem.id}
                                classItem={classItem}
                                isSelected={selectedClassId === classItem.id}
                                onSelect={() => handleSelect(classItem.id)}
                            />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                className="pagination__btn"
                                onClick={() => setPage((p) => p - 1)}
                                disabled={page === 1}
                            >
                                ‹
                            </button>
                            <span className="pagination__info">{page} / {totalPages}</span>
                            <button
                                className="pagination__btn"
                                onClick={() => setPage((p) => p + 1)}
                                disabled={page === totalPages}
                            >
                                ›
                            </button>
                        </div>
                    )}
                </>
            )}
        </section>
    );
};

export default ClassesSection;