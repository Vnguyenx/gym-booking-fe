// src/hooks/usePTFilter.ts
import { useState, useMemo } from 'react';
import { PT } from '../types/models';

export const usePTFilter = (initialData: PT[]) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGender, setSelectedGender] = useState('Tất cả');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Lấy danh sách giới tính động (nếu có thêm giới tính khác ngoài Nam/Nữ)
    const genders = useMemo(() => {
        const unique = Array.from(new Set(initialData.map(i => i.gender)));
        return ['Tất cả', ...unique];
    }, [initialData]);

    // Xử lý lọc
    const filteredData = useMemo(() => {
        return initialData.filter(pt => {
            const matchesSearch = pt.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                pt.specialty.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesGender = selectedGender === 'Tất cả' || pt.gender === selectedGender;

            return matchesSearch && matchesGender;
        });
    }, [initialData, searchTerm, selectedGender]);

    // Phân trang
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return {
        searchTerm, setSearchTerm,
        genders, selectedGender, setSelectedGender,
        currentPage, setCurrentPage,
        totalPages, currentData, totalResults: filteredData.length
    };
};