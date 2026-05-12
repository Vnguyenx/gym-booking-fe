// src/hooks/useClasses.ts
import { useState, useEffect } from 'react';
import { customerService } from '../services/customerService';
import { ClassItem, AttendanceStatus, AttendanceRecord, UseClassesReturn } from '../types/models';
/**
 * useClasses
 * Quản lý danh sách lớp học và điểm danh của customer.
 * Hỗ trợ cả trường hợp có và không có đăng ký khoá học.
 */
const useClasses = (): UseClassesReturn => {
    const [classes, setClasses] = useState<ClassItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

    useEffect(() => {
        const fetchClasses = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const data = await customerService.getMyClasses();
                setClasses(data);
            } catch (err: any) {
                console.error('Lỗi tải danh sách lớp học:', err);
                setError(err.message ?? 'Không thể tải danh sách lớp học. Vui lòng thử lại.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchClasses();
    }, []);

    const selectedClass = classes.find((c) => c.id === selectedClassId);

    const selectClass = (id: string) => setSelectedClassId(id);
    const clearSelection = () => setSelectedClassId(null);

    return {
        classes,
        isLoading,
        error,
        selectedClassId,
        selectedClass,
        selectClass,
        clearSelection,
    };
};

export default useClasses;