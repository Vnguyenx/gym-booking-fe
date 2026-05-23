// src/components/admin/FloorsManager.tsx
import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchFloors, createFloor, updateFloor, deleteFloor } from '../../../store/admin/adminFloorsSlice';
import { Floor } from '../../../types/models';
import { uploadImageToImgBB } from '../../../services/uploadService';

const FloorsManager: React.FC = () => {
    const dispatch = useAppDispatch();
    const { items, isLoading, error } = useAppSelector(state => state.adminFloors);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<Floor>>({});
    const [uploadingImg, setUploadingImg] = useState(false);

    useEffect(() => { dispatch(fetchFloors()); }, [dispatch]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingImg(true);
        const url = await uploadImageToImgBB(file);
        setUploadingImg(false);
        if (url) setFormData({ ...formData, img: url });
        else alert('Upload ảnh thất bại');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || formData.floorNumber === undefined || !formData.gymId) {
            alert('Vui lòng điền đủ name, floorNumber, gymId');
            return;
        }
        if (editingId) await dispatch(updateFloor({ id: editingId, data: formData }));
        else await dispatch(createFloor(formData as Omit<Floor, 'id'>));
        resetForm();
    };

    const resetForm = () => { setEditingId(null); setFormData({}); };
    const handleEdit = (floor: Floor) => { setEditingId(floor.id!); setFormData(floor); };
    const handleDelete = async (id: string) => { if (window.confirm('Xóa tầng này?')) await dispatch(deleteFloor(id)); };

    if (isLoading && items.length === 0) return <div className="loading">Đang tải...</div>;
    if (error) return <div className="error">Lỗi: {error}</div>;

    return (
        <div className="manager-section">
            <h3>Quản lý tầng</h3>
            <form onSubmit={handleSubmit} className="form-vertical">
                <div className="form-group"><label>Tên tầng</label><input value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} /></div>
                <div className="form-group"><label>Số thứ tự</label><input type="number" value={formData.floorNumber || ''} onChange={e => setFormData({ ...formData, floorNumber: parseInt(e.target.value) })} /></div>
                <div className="form-group"><label>gymId</label><input value={formData.gymId || ''} onChange={e => setFormData({ ...formData, gymId: e.target.value })} /></div>
                <div className="form-group"><label>Mô tả</label><input value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} /></div>
                <div className="form-group"><label>Diện tích (m²)</label><input type="number" value={formData.area || ''} onChange={e => setFormData({ ...formData, area: parseFloat(e.target.value) })} /></div>
                <div className="form-group"><label>Ảnh tầng</label><input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImg} />{uploadingImg && <span>Đang upload...</span>}{formData.img && <img src={formData.img} alt="floor" className="preview-img" />}</div>
                <div className="form-actions"><button type="submit">{editingId ? 'Cập nhật' : 'Thêm mới'}</button>{editingId && <button type="button" onClick={resetForm}>Hủy</button>}</div>
            </form>
            <div className="items-grid">
                {items.map(floor => (
                    <div key={floor.id} className="item-card">
                        {floor.img && <img src={floor.img} alt={floor.name} />}
                        <div className="info">
                            <strong>{floor.name}</strong>
                            <span>Tầng {floor.floorNumber}</span>
                            <span>Diện tích: {floor.area} m²</span>
                            <span className="meta">{floor.description}</span>
                        </div>
                        <div className="actions">
                            <button onClick={() => handleEdit(floor)}>Sửa</button>
                            <button onClick={() => handleDelete(floor.id!)}>Xóa</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FloorsManager;