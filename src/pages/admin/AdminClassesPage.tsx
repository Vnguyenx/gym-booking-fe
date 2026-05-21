// src/pages/admin/AdminClassPage.tsx
import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useAdminClasses } from '../../hooks/useAdminClasses';
import ClassList from '../../components/admin/classes/ClassList';
import ClassFilter from '../../components/admin/classes/ClassFilter';
import ClassFormModal from '../../components/admin/classes/ClassFormModal';
import ClassDetail from '../../components/admin/classes/ClassDetail';
import ClassEditModal from '../../components/admin/classes/ClassEditModal';
import '../../styles/admin/AdminClass.css';
import {ClassItem, UpdateClassData} from "../../types/models";

const AdminClassPage: React.FC = () => {
    const {
        classes,
        selectedClass,
        isLoading,
        error,
        loadClasses,
        loadClassDetail,
        closeClassDetail,
        createNewClass,
        updateClassInfo,
    } = useAdminClasses();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Filter state giữ ở page để dùng lại khi cần reload
    const [activeFilters, setActiveFilters] = useState<{ status: string; search: string }>({
        status: 'active',
        search: '',
    });
    const [editingClass, setEditingClass] = useState<ClassItem | null>(null);

    // Chỉ gọi API 1 lần lúc mount — dùng ref để tránh useEffect chạy lại
    // khi loadClasses reference thay đổi giữa các render
    const hasMounted = useRef(false);
    useEffect(() => {
        if (hasMounted.current) return;
        hasMounted.current = true;
        loadClasses({ status: activeFilters.status });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Nhấn nút Lọc → chỉ gọi API nếu status thay đổi,
    // còn search theo tên thì filter client-side (data đã join sẵn)
    const handleFilter = (filters: { status: string; search: string }) => {
        const statusChanged = filters.status !== activeFilters.status;
        setActiveFilters(filters);
        if (statusChanged) {
            loadClasses({ status: filters.status });
        }
    };

    const handleViewDetail = (classId: string) => {
        loadClassDetail(classId);
    };

    const handleCreateSubmit = async (formData: any) => {
        const result = await createNewClass(formData);
        if (result.success) {
            alert('Tạo lớp học thành công!');
            setIsCreateModalOpen(false);
            // Reload giữ nguyên filter hiện tại
            loadClasses({ status: activeFilters.status });
        } else {
            alert('Lỗi: ' + result.error);
        }
    };

    const handleOpenEdit = (item: ClassItem) => {
        setEditingClass(item);
        setIsEditModalOpen(true);
    };

    // Hàm xử lý khi nhấn "Lưu" trên Modal sửa
    const handleUpdateSubmit = async (data: UpdateClassData) => {
        if (editingClass) {
            await updateClassInfo(editingClass.id, data);
            setIsEditModalOpen(false);
            setEditingClass(null);
        }
    };

    // ── Phân trang ──
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    // Filter client-side theo tên — classes đã có customerName từ BE
    const filteredClasses = useMemo(() => {
        const keyword = activeFilters.search.trim().toLowerCase();
        if (!keyword) return classes;
        return classes.filter(c =>
            c.customerName?.toLowerCase().includes(keyword) ||
            c.ptName?.toLowerCase().includes(keyword)
        );
    }, [classes, activeFilters.search]);

    // Reset trang 1 khi kết quả filter thay đổi
    useEffect(() => {
        setCurrentPage(1);
    }, [filteredClasses.length]);

    const totalPages = Math.ceil(filteredClasses.length / pageSize);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredClasses.slice(start, start + pageSize);
    }, [filteredClasses, currentPage]);

    return (
        <div className="admin-class-container">
            <header className="admin-class-header">
                <h1 className="admin-class-title">Quản lý lớp học</h1>
                <button
                    className="btn-primary"
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    + Thêm lớp mới
                </button>
            </header>

            <ClassFilter onFilter={handleFilter} />

            {error && <div className="error-banner">{error}</div>}

            <ClassList
                data={paginatedData}
                isLoading={isLoading}
                onViewDetail={handleViewDetail}
                onEdit={handleOpenEdit}
            />

            <ClassEditModal
                isOpen={isEditModalOpen}
                initialData={editingClass}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setEditingClass(null);
                }}
                onSubmit={handleUpdateSubmit}
            />

            <ClassFormModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateSubmit}
            />

            <ClassDetail
                selectedClass={selectedClass}
                onClose={closeClassDetail}
            />

            {!isLoading && totalPages > 1 && (
                <div className="pagination-wrapper">
                    <button
                        className="btn-pagination"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => p - 1)}
                    >
                        Trước
                    </button>
                    <span className="page-info">
                        Trang <strong>{currentPage}</strong> / {totalPages}
                    </span>
                    <button
                        className="btn-pagination"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => p + 1)}
                    >
                        Sau
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminClassPage;