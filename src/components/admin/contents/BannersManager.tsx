// src/components/admin/BannersManager.tsx
import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchBanners, createBanner, updateBanner, deleteBanner } from '../../../store/admin/adminBannersSlice';
import { Banner } from '../../../types/models';
import { uploadImageToImgBB } from '../../../services/uploadService';
import ToggleSwitch from '../../common/ToggleSwitch';

const BannersManager: React.FC = () => {
    const dispatch = useAppDispatch();
    const { items, isLoading, error } = useAppSelector(state => state.adminBanners);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<Banner>>({ title: '', subtitle: '', imageUrl: '', link: '', order: 0, isActive: true });
    const [uploading, setUploading] = useState(false);

    useEffect(() => { dispatch(fetchBanners()); }, [dispatch]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        const url = await uploadImageToImgBB(file);
        setUploading(false);
        if (url) setFormData({ ...formData, imageUrl: url });
        else alert('Upload ảnh thất bại');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.imageUrl) return alert('Vui lòng chọn ảnh banner');
        if (editingId) await dispatch(updateBanner({ id: editingId, data: formData }));
        else await dispatch(createBanner(formData as Omit<Banner, 'id'>));
        resetForm();
    };

    const resetForm = () => { setEditingId(null); setFormData({ title: '', subtitle: '', imageUrl: '', link: '', order: 0, isActive: true }); };
    const handleEdit = (banner: Banner) => { setEditingId(banner.id!); setFormData(banner); };
    const handleDelete = async (id: string) => { if (window.confirm('Xóa banner này?')) await dispatch(deleteBanner(id)); };

    if (isLoading && items.length === 0) return <div className="loading">Đang tải banner...</div>;
    if (error) return <div className="error">Lỗi: {error}</div>;

    return (
        <div className="manager-section">
            <h3>Quản lý Banner</h3>
            <form onSubmit={handleSubmit} className="form-vertical">
                <div className="form-group"><label>Tiêu đề</label><input value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} /></div>
                <div className="form-group"><label>Phụ đề</label><input value={formData.subtitle || ''} onChange={e => setFormData({ ...formData, subtitle: e.target.value })} /></div>
                <div className="form-group"><label>Ảnh banner</label><input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />{uploading && <span>Đang upload...</span>}{formData.imageUrl && <img src={formData.imageUrl} alt="preview" className="preview-img" />}</div>
                <div className="form-group"><label>Đường dẫn (link)</label><input value={formData.link || ''} onChange={e => setFormData({ ...formData, link: e.target.value })} /></div>
                <div className="form-group"><label>Thứ tự</label><input type="number" value={formData.order || 0} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })} /></div>
                <div className="form-group row"><ToggleSwitch checked={formData.isActive || false} onChange={(checked) => setFormData({ ...formData, isActive: checked })} label="Kích hoạt" /></div>
                <div className="form-actions"><button type="submit" disabled={uploading}>{editingId ? 'Cập nhật' : 'Thêm mới'}</button>{editingId && <button type="button" onClick={resetForm}>Hủy</button>}</div>
            </form>
            <div className="items-grid">
                {items.map(banner => (
                    <div key={banner.id} className="item-card">
                        <img src={banner.imageUrl} alt={banner.title} />
                        <div className="info">
                            <strong>{banner.title}</strong>
                            <span>{banner.subtitle}</span>
                            <small>Thứ tự: {banner.order}</small>
                            <span className={banner.isActive ? 'active' : 'inactive'}>{banner.isActive ? 'Hiển thị' : 'Ẩn'}</span>
                        </div>
                        <div className="actions"><button onClick={() => handleEdit(banner)}>Sửa</button><button onClick={() => handleDelete(banner.id!)}>Xóa</button></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BannersManager;