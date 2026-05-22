import React from 'react';
import useAdminEquipment from '../../hooks/useAdminEquipment';
import EquipmentCard from '../../components/admin/equipment/EquipmentCard';
import EquipmentFormModal from '../../components/admin/equipment/EquipmentFormModal';
import Pagination from '../../components/common/Pagination';
import '../../styles/admin/AdminEquipment.css';

const Toolbar: React.FC<{
    searchText: string; setSearchText: (v: string) => void;
    filterCategory: string; setFilterCategory: (v: string) => void;
    filterActive: '' | 'true' | 'false'; setFilterActive: (v: '' | 'true' | 'false') => void;
    categoryOptions: string[];
}> = ({ searchText, setSearchText, filterCategory, setFilterCategory, filterActive, setFilterActive, categoryOptions }) => (
    <div className="eq-toolbar">
        <input className="eq-toolbar__search" type="text" placeholder="🔍 Tìm theo tên..." value={searchText} onChange={(e) => setSearchText(e.target.value)} />
        <select className="eq-toolbar__select" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="">Tất cả danh mục</option>
            {categoryOptions.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <select className="eq-toolbar__select" value={filterActive} onChange={(e) => setFilterActive(e.target.value as any)}>
            <option value="">Tất cả trạng thái</option>
            <option value="true">Đang hoạt động</option>
            <option value="false">Ngừng sử dụng</option>
        </select>
    </div>
);

const AdminEquipmentPage: React.FC = () => {
    const {
        filteredItems, isLoading, error, successMsg,
        searchText, setSearchText,
        filterCategory, setFilterCategory,
        filterActive, setFilterActive,
        categoryOptions,
        currentPage, totalPages, goToPage,
        modalMode, formData, openCreate, openEdit, closeModal,
        handleFormChange, handleSubmit,
        deletingId, setDeletingId, handleConfirmDelete,
        floors, zones, subCategoryOptions,
        uploadingImages, handleUploadImages, removeImage,
    } = useAdminEquipment();

    return (
        <div className="eq-page">
            <div className="eq-page__header">
                <div>
                    <h1 className="eq-page__title">🏋️ Quản lý thiết bị</h1>
                    <p className="eq-page__subtitle">{filteredItems.length} thiết bị</p>
                </div>
                <button className="eq-btn eq-btn--primary" onClick={openCreate}>+ Thêm thiết bị</button>
            </div>

            <Toolbar {...{ searchText, setSearchText, filterCategory, setFilterCategory, filterActive, setFilterActive, categoryOptions }} />

            {successMsg && <p className="eq-alert eq-alert--success">✅ {successMsg}</p>}
            {error && modalMode === 'closed' && <p className="eq-alert eq-alert--error">⚠️ {error}</p>}

            {isLoading && filteredItems.length === 0 ? (
                <p className="eq-empty">Đang tải...</p>
            ) : filteredItems.length === 0 ? (
                <p className="eq-empty">Không tìm thấy thiết bị.</p>
            ) : (
                <>
                    <div className="eq-grid">
                        {filteredItems.map(item => (
                            <EquipmentCard key={item.id} item={item} onEdit={openEdit} onDelete={setDeletingId} />
                        ))}
                    </div>
                    {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />}
                </>
            )}

            {(modalMode === 'create' || modalMode === 'edit') && (
                <EquipmentFormModal
                    mode={modalMode}
                    formData={formData}
                    isLoading={isLoading}
                    error={error}
                    onChange={handleFormChange}
                    onSubmit={handleSubmit}
                    onClose={closeModal}
                    floors={floors}
                    zones={zones}
                    categoryOptions={categoryOptions}
                    subCategoryOptions={subCategoryOptions}
                    uploadingImages={uploadingImages}
                    onUploadImages={handleUploadImages}
                    onRemoveImage={removeImage}
                />
            )}

            {deletingId && (
                <div className="eq-modal-overlay" onClick={() => setDeletingId(null)}>
                    <div className="eq-modal-box eq-modal-box--sm" onClick={(e) => e.stopPropagation()}>
                        <h2 className="eq-modal-title">Xoá thiết bị?</h2>
                        <p className="eq-modal-subtitle">Hành động này không thể hoàn tác.</p>
                        <div className="eq-modal-footer">
                            <button className="eq-btn eq-btn--ghost" onClick={() => setDeletingId(null)} disabled={isLoading}>Huỷ</button>
                            <button className="eq-btn eq-btn--danger" onClick={handleConfirmDelete} disabled={isLoading}>
                                {isLoading ? 'Đang xoá...' : 'Xác nhận xoá'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminEquipmentPage;