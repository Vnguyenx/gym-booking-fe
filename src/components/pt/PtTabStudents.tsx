import React, { useState, useEffect } from 'react';
import { usePtStudents } from '../../hooks/usePtStudents';
import FilterChips from './students/FilterChips';
import StudentCard from './students/StudentCard';
import GroupCard from './students/GroupCard';
import ErrorToast from './notifications/ErrorToast';

const ITEMS_PER_PAGE = 3;

const PtTabStudents: React.FC = () => {
    const {
        activeFilter,
        onFilterChange,
        filteredClasses,
        groupedClasses,
        expandedIds,
        toggleExpand,
        confirmingIds,
        confirmError,
        onConfirm,
        onClearError,
    } = usePtStudents();

    const [currentPage, setCurrentPage] = useState(1);
    const isGroupView = activeFilter === 'group';

    useEffect(() => {
        setCurrentPage(1);
    }, [activeFilter]);

    const rawData = isGroupView ? groupedClasses : filteredClasses;
    const totalPages = Math.ceil(rawData.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedData = rawData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <div className="pt-tab-students">
            <FilterChips activeFilter={activeFilter} onFilterChange={onFilterChange} />

            {/* ── Toast lỗi — xuất hiện khi confirm thất bại ── */}
            {confirmError && (
                <ErrorToast
                    message={confirmError}
                    onClose={onClearError}
                />
            )}

            <div className="students-list">
                {paginatedData.length === 0 ? (
                    <div className="students-empty">
                        <i className="ti ti-user-off students-empty__icon" />
                        <p>Không có dữ liệu</p>
                    </div>
                ) : (
                    paginatedData.map((item, idx) => (
                        isGroupView ? (
                            <GroupCard
                                key={(item as any).groupId}
                                group={item as any}
                                isExpanded={expandedIds.has((item as any).groupId)}
                                onToggle={() => toggleExpand((item as any).groupId)}
                            />
                        ) : (
                            <StudentCard
                                key={(item as any).id}
                                cls={item as any}
                                colorIndex={idx}
                                isExpanded={expandedIds.has((item as any).id)}
                                onToggle={() => toggleExpand((item as any).id)}
                                confirmingIds={confirmingIds}
                                onConfirm={onConfirm}
                            />
                        )
                    ))
                )}
            </div>

            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        className="pagination__btn"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => p - 1)}
                    >
                        <i className="ti ti-chevron-left" />
                    </button>
                    <span className="pagination__info">Trang {currentPage} / {totalPages}</span>
                    <button
                        className="pagination__btn"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => p + 1)}
                    >
                        <i className="ti ti-chevron-right" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default PtTabStudents;