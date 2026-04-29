import { useState, useMemo } from 'react';
import { Equipment } from '../types/models';

export const useEquipmentFilter = (initialData: Equipment[]) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Tất cả');
    const [selectedSubCategory, setSelectedSubCategory] = useState('Tất cả');
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 12;

    // ── Categories động từ DB ──
    const categories = useMemo(() => {
        const unique = Array.from(new Set(initialData.map(i => i.category))).sort();
        return ['Tất cả', ...unique];
    }, [initialData]);

    // ── SubCategories lọc theo category đang chọn ──
    const subCategories = useMemo(() => {
        const source = selectedCategory === 'Tất cả'
            ? initialData
            : initialData.filter(i => i.category === selectedCategory);
        const unique = Array.from(
            new Set(source.map(i => i.subCategory).filter(Boolean))
        ).sort();
        return unique.length > 0 ? ['Tất cả', ...unique] : [];
    }, [initialData, selectedCategory]);

    // ── Filter & Search ──
    const filteredData = useMemo(() => {
        return initialData.filter(item => {
            const q = searchTerm.toLowerCase();
            const matchesSearch =
                item.nameVi.toLowerCase().includes(q) ||
                item.name.toLowerCase().includes(q) ||
                item.category.toLowerCase().includes(q) ||
                (item.subCategory?.toLowerCase().includes(q) ?? false);
            const matchesCategory =
                selectedCategory === 'Tất cả' || item.category === selectedCategory;
            const matchesSubCategory =
                selectedSubCategory === 'Tất cả' || item.subCategory === selectedSubCategory;
            return matchesSearch && matchesCategory && matchesSubCategory;
        });
    }, [initialData, searchTerm, selectedCategory, selectedSubCategory]);

    // ── Phân trang ──
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const currentData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(start, start + itemsPerPage);
    }, [filteredData, currentPage]);

    // ── Handlers ──
    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        setSelectedSubCategory('Tất cả'); // reset sub khi đổi category
        setCurrentPage(1);
    };

    const handleSubCategoryChange = (sub: string) => {
        setSelectedSubCategory(sub);
        setCurrentPage(1);
    };

    const handleSearchChange = (term: string) => {
        setSearchTerm(term);
        setCurrentPage(1);
    };

    return {
        searchTerm,
        setSearchTerm: handleSearchChange,

        categories,
        selectedCategory,
        setSelectedCategory: handleCategoryChange,

        subCategories,
        selectedSubCategory,
        setSelectedSubCategory: handleSubCategoryChange,

        currentPage,
        setCurrentPage,
        totalPages,
        currentData,
        totalResults: filteredData.length,
    };
};