import { useState, useEffect, useCallback } from 'react';

const usePagination = <T>(items: T[], itemsPerPage: number) => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(items.length / itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [items.length]);

    const currentItems = items.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const goTo = useCallback((page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    }, [totalPages]);

    const goToItem = useCallback((index: number) => {
        if (index === -1) return;
        setCurrentPage(Math.ceil((index + 1) / itemsPerPage));
    }, [itemsPerPage]);

    return {
        currentItems,
        currentPage,
        totalPages,
        goTo,
        goToItem,
        prev: () => goTo(currentPage - 1),
        next: () => goTo(currentPage + 1),
        hasPrev: currentPage > 1,
        hasNext: currentPage < totalPages,
        showPagination: totalPages > 1,
    };
};

export default usePagination;